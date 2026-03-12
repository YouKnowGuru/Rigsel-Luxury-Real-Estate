"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SiteSettings {
    siteName: string;
    phone: string;
    email: string;
    address: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
    heroImage?: string;
    heroImages?: string[];
}

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: "Phojaa95Real Estate",
    phone: "+975 16 111 999",
    email: "phojaa95realestate@gmail.com",
    address: "Norzin Lam, Thimphu, Bhutan",
    facebook: "https://www.facebook.com/share/1b2Fk7oC9q/ 2",
    instagram: "https://tiktok.com/@phojaa95realestate",
    whatsapp: "+975 16 111 999",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2674&auto=format&fit=crop",
    heroImages: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2674&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=2670&auto=format&fit=crop",
    ],
};

interface SettingsContextType {
    settings: SiteSettings;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`/api/settings?t=${Date.now()}`, {
                    cache: "no-store"
                });
                const data = await response.json();
                if (data.success) {
                    setSettings(data.data);
                }
            } catch (error) {
                console.error("Error fetching site settings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
