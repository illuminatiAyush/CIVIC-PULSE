"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Issue } from '../types';
import { Loader2, MapPin } from 'lucide-react';

interface PublicMapProps {
  issues: Issue[];
  center?: [number, number];
  zoom?: number;
}

export default function PublicMap({ issues, center = [19.076, 72.8777], zoom = 12 }: PublicMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (leafletLoaded && mapContainerRef.current && !mapRef.current) {
      const L = (window as any).L;
      if (!L) return;

      // Initialize Map
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

      // Dark Mode Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      // Custom Icon
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-6 h-6 bg-accent border-2 border-white rounded-full flex items-center justify-center text-white shadow-lg animate-pulse"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add Markers
      issues.forEach(issue => {
        if (issue.latitude && issue.longitude) {
          const marker = L.marker([issue.latitude, issue.longitude], { icon: customIcon }).addTo(mapRef.current);
          
          const popupContent = `
            <div class="p-2 min-w-[150px] font-sans">
              <div class="text-[10px] font-black uppercase text-accent mb-1">${issue.status}</div>
              <div class="font-bold text-sm mb-1">${issue.issue_title || issue.issue_type}</div>
              <div class="text-[10px] text-gray-500 mb-2">${issue.locality || issue.ward || 'Location N/A'}</div>
              <a href="/track?id=${issue.id?.split('-')[0]}" class="text-[10px] font-black text-accent underline">VIEW DETAILS</a>
            </div>
          `;
          
          marker.bindPopup(popupContent, {
             className: 'leaflet-popup-dark'
          });
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, issues, center, zoom]);

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <Script 
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        onLoad={() => setLeafletLoaded(true)}
      />
      
      <div className="relative w-full h-full min-h-[400px]">
        {!leafletLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 z-10 space-y-3">
             <Loader2 className="w-8 h-8 text-accent animate-spin" />
             <span className="text-[10px] font-black text-white/40 uppercase">Loading City Canvas...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full z-0" />
        
        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-[400] glass p-3 border-white/10 rounded-xl space-y-2 pointer-events-none">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[8px] font-black text-white/60 uppercase">Active Reports</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black text-white/60 uppercase">Ward Boundaries</span>
           </div>
        </div>
        
        <style jsx global>{`
          .leaflet-container {
            background: #0f172a !important;
            border-radius: 2rem;
          }
          .custom-div-icon {
            background: none;
            border: none;
          }
          .leaflet-popup-content-wrapper {
            background: #1e293b !important;
            color: white !important;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem !important;
          }
          .leaflet-popup-tip {
            background: #1e293b !important;
          }
        `}</style>
      </div>
    </>
  );
}
