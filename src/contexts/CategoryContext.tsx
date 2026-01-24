'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CategoryType = 'kids' | 'men' | 'women' | null;

interface CategoryTheme {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    bgGradient: string;
}

const categoryThemes: Record<Exclude<CategoryType, null>, CategoryTheme> = {
    kids: {
        primary: '#FCD34D', // Yellow/Fun
        secondary: '#F59E0B',
        accent: '#FBBF24',
        gradient: 'from-yellow-400 via-orange-400 to-pink-400',
        bgGradient: 'from-yellow-50 via-orange-50 to-pink-50',
    },
    women: {
        primary: '#D8B4FE', // Lavender
        secondary: '#C084FC',
        accent: '#A855F7',
        gradient: 'from-purple-400 via-pink-400 to-rose-400',
        bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
    },
    men: {
        primary: '#0EA5E9', // Sky Blue
        secondary: '#0284C7',
        accent: '#0369A1',
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
    },
};

interface CategoryContextType {
    category: CategoryType;
    setCategory: (category: CategoryType) => void;
    theme: CategoryTheme | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [category, setCategory] = useState<CategoryType>(null);
    const [theme, setTheme] = useState<CategoryTheme | null>(null);

    useEffect(() => {
        if (category) {
            setTheme(categoryThemes[category]);
            // Apply theme to document root for global CSS variables
            const root = document.documentElement;
            const selectedTheme = categoryThemes[category];
            root.style.setProperty('--category-primary', selectedTheme.primary);
            root.style.setProperty('--category-secondary', selectedTheme.secondary);
            root.style.setProperty('--category-accent', selectedTheme.accent);
        } else {
            setTheme(null);
            // Reset to default
            const root = document.documentElement;
            root.style.removeProperty('--category-primary');
            root.style.removeProperty('--category-secondary');
            root.style.removeProperty('--category-accent');
        }
    }, [category]);

    return (
        <CategoryContext.Provider value={{ category, setCategory, theme }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategory() {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
}
