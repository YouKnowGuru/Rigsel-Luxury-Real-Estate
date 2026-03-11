"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet with Next.js (if not using custom icon)
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

interface LeafletMapProps {
    locations: any[];
    onLocationSelect: (location: any) => void;
}

export default function LeafletMap({ locations, onLocationSelect }: LeafletMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !mapContainerRef.current) return;

        // Ensure we don't initialize twice
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Initialize map
        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
        }).setView([27.4712, 89.6339], 7);
        mapInstanceRef.current = map;

        // Add Premium Dark Tile Layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Add Zoom Control to bottom right
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        // Custom Luxury Pin Icon
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="relative w-12 h-12 -translate-x-1/2 -translate-y-full flex items-center justify-center">
                    <div class="absolute inset-0 bg-bhutan-gold/20 rounded-full animate-ping"></div>
                    <div class="relative w-10 h-10 bg-bhutan-dark rounded-full flex items-center justify-center border-2 border-bhutan-gold shadow-[0_0_15px_rgba(244,196,48,0.6)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4C430" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
        });

        // Add Markers
        locations.forEach((location) => {
            const marker = L.marker([location.lat, location.lng], {
                icon: customIcon,
            }).addTo(map);

            const popupContent = `
        <div class="p-4" style="background: #1A1A1A; border: 1px solid rgba(244, 196, 48, 0.3); border-radius: 1.5rem; color: #fff; min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <h4 style="font-family: serif; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: #F4C430;">${location.name}</h4>
          <p style="font-size: 0.75rem; opacity: 0.6; margin-bottom: 1rem;">${location.properties} properties available</p>
          <a href="/properties?district=${location.name}" 
             style="display: block; width: 100%; text-align: center; background: #9B1C1C; color: #fff; text-decoration: none; padding: 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; border: 1px solid rgba(244, 196, 48, 0.2);">
            View Properties
          </a>
        </div>
      `;

            marker.bindPopup(popupContent, {
                className: 'bhutan-popup',
                maxWidth: 250,
                closeButton: false
            });

            marker.on("click", () => {
                onLocationSelect(location);
                map.flyTo([location.lat, location.lng], 12, {
                    duration: 1.5,
                    easeLinearity: 0.25
                });
            });
        });

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [locations, onLocationSelect]);
    // Re-initialize if locations change (optional, but safer)

    return (
        <div
            ref={mapContainerRef}
            className="h-full w-full"
            style={{ minHeight: "500px", background: "#f3f4f6" }}
        />
    );
}
