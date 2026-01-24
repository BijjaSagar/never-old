import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as any),
    providers: [
        // Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),

        // Apple Sign In
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID || "PLACEHOLDER",
            clientSecret: process.env.APPLE_CLIENT_SECRET || "PLACEHOLDER",
        }),

        // Email/Password Login
        CredentialsProvider({
            id: "credentials",
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return user as any;
            },
        }),

        // Phone/OTP Login
        CredentialsProvider({
            id: "phone",
            name: "Phone Number",
            credentials: {
                phone: { label: "Phone", type: "tel" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.otp) {
                    throw new Error("Phone and OTP required");
                }

                // TODO: Verify OTP with Twilio/MSG91
                // For now, accept any 6-digit code in development
                const isOtpValid = credentials.otp.length === 6 && /^\d+$/.test(credentials.otp);

                if (!isOtpValid) {
                    throw new Error("Invalid OTP");
                }

                // Find or create user
                let user = await prisma.user.findUnique({
                    where: { phone: credentials.phone },
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            phone: credentials.phone,
                            phoneVerified: true,
                            email: `${credentials.phone}@phone.neverold.com`,
                        },
                    });
                }

                return user as any;
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
