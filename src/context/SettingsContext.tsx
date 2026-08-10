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
    address: "Paro Bhutan, Below Revenue and Customs Office (RRCO), Taju",
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

/**
 * Module-level cache so the settings API is only fetched once every 5 minutes
 * across the entire browser session — regardless of how many times SettingsProvider
 * mounts/unmounts (e.g. on navigation). Previously every mount hit the API with a
 * Date.now() cache-buster, bypassing the browser's HTTP cache entirely.
 */
let cachedSettings: SiteSettings | null = null;
let cacheExpiresAt = 0;
const STALE_MS = 5 * 60 * 1000; // 5 minutes

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(cachedSettings ?? DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(!cachedSettings);

    useEffect(() => {
        // Skip fetch if the module-level cache is still fresh
        if (cachedSettings && Date.now() < cacheExpiresAt) {
            setSettings(cachedSettings);
            setIsLoading(false);
            return;
        }

        const fetchSettings = async () => {
            try {
                // No cache-buster — allow the browser HTTP cache to work normally
                const response = await fetch("/api/settings");
                const data = await response.json();
                if (data.success) {
                    cachedSettings = data.data;
                    cacheExpiresAt = Date.now() + STALE_MS;
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
