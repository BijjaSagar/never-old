import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await prisma.siteSettings.findUnique({
            where: { id: 'global' },
        });

        if (!settings) {
            // Create default settings if not exists
            const defaultSettings = await prisma.siteSettings.create({
                data: { id: 'global' },
            });
            return NextResponse.json({ success: true, data: defaultSettings });
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'global' },
            update: body,
            create: { id: 'global', ...body },
        });

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
