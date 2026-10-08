import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAppStore } from '../../store/appStore';
import { CHENNAI_WARDS_GEOJSON, DEMO_REGIONS } from '../../data/demoData';
import { Flame, Layers } from 'lucide-react';

interface LeafletClimateMapProps {
  height?: string;
  activeLayer?: 'overall' | 'heat' | 'water' | 'health' | 'flood' | 'vulnerability' | 'resilience';
  onSelectWard?: (id: string) => void;
  showHotspots?: boolean;
}

export const LeafletClimateMap: React.FC<LeafletClimateMapProps> = ({
  height = '500px',
  activeLayer = 'overall',
  onSelectWard,
  showHotspots = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);

  const {
    resolvedTheme,
    selectedRegionId,
    setSelectedRegionId,
    timeScrubberDay,
  } = useAppStore();

  // Function to calculate color based on exact palette & active layer
  const getWardColor = (wardId: string, featureProps?: any) => {
    let value = 70;
    if (featureProps) {
      switch (activeLayer) {
        case 'heat': value = featureProps.heat ?? 75; break;
        case 'water': value = featureProps.water ?? 70; break;
        case 'health': value = featureProps.health ?? 72; break;
        case 'flood': value = featureProps.flood ?? 55; break;
        case 'vulnerability': value = featureProps.vulnerability ?? 70; break;
        case 'resilience': value = featureProps.resilience ?? 50; break;
        case 'overall':
        default:
          value = featureProps.risk ?? 75;
          break;
      }
    } else if (DEMO_REGIONS[wardId]) {
      const reg = DEMO_REGIONS[wardId];
      switch (activeLayer) {
        case 'heat': value = reg.heat_risk; break;
        case 'water': value = reg.water_stress; break;
        case 'health': value = reg.health_risk; break;
        case 'flood': value = reg.flood_risk; break;
        case 'vulnerability': value = reg.vulnerability; break;
        case 'resilience': value = reg.resilience; break;
        case 'overall':
        default:
          value = reg.overall_impact;
          break;
      }
    }

    // Time scrubber progression (+30d, +60d, +90d adds gradual heat/stress)
    const timeDelta = timeScrubberDay > 0 ? Math.floor((timeScrubberDay / 90) * 8) : 0;
    if (activeLayer !== 'resilience') {
      value = Math.min(99, value + timeDelta);
    }

    if (activeLayer === 'resilience') {
      if (value >= 65) return '#4A8C80';
      if (value >= 50) return '#66A3BF';
      return '#3368A0';
    }

    if (value >= 85) return '#D15A42'; // Critical high alert
    if (value >= 70) return '#3368A0'; // Deep Ocean Blue
    if (value >= 55) return '#66A3BF'; // Cerulean
    return '#87BBA2'; // Soft sage/mint
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid duplicate initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2500],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    // Add custom zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Free open basemap tile provider (Esri Canvas Base - clean, dark, zero watermarks)
    const tileUrl = resolvedTheme === 'dark'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    L.tileLayer(tileUrl, {
      maxZoom: 16,
    }).addTo(map);

    // Add GeoJSON Ward Polygons
    const geoLayer = L.geoJSON(CHENNAI_WARDS_GEOJSON as any, {
      style: (feature) => {
        const id = feature?.properties?.id;
        const isSelected = id === selectedRegionId;
        const fillColor = getWardColor(id, feature?.properties);

        return {
          fillColor: fillColor,
          weight: isSelected ? 3 : 1.5,
          opacity: 0.95,
          color: isSelected ? '#FFFFFF' : (resolvedTheme === 'dark' ? '#66A3BF' : '#3368A0'),
          fillOpacity: isSelected ? 0.8 : 0.6,
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const layerVal = p[activeLayer === 'overall' ? 'risk' : activeLayer] ?? p.risk;

        // Hover Tooltip
        layer.bindTooltip(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; padding: 4px; line-height: 1.4;">
            <div style="font-weight: 700; color: #142436;">${p.name}</div>
            <div style="color: #3368A0; font-weight: 600; margin-top: 2px;">
              ${activeLayer.toUpperCase()}: <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${layerVal}/100</span>
            </div>
            <div style="color: #66A3BF; font-size: 11px;">Pop: ${p.pop}</div>
          </div>
        `, { sticky: true, opacity: 0.95 });

        // Click Handler
        layer.on('click', () => {
          setSelectedRegionId(p.id);
          if (onSelectWard) onSelectWard(p.id);
        });
      },
    }).addTo(map);

    geojsonLayerRef.current = geoLayer;

    // Add Hotspot Marker if enabled
    if (showHotspots) {
      const hotspotIcon = L.divIcon({
        className: 'custom-hotspot-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
            <div class="pulse-hotspot-pin" style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(209, 90, 66, 0.45);"></div>
            <div style="width: 14px; height: 14px; border-radius: 50%; background: #D15A42; border: 2px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const hotspotMarker = L.marker([13.1350, 80.2850], { icon: hotspotIcon }).addTo(map);
      hotspotMarker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; font-size: 12px;">
          <div style="font-weight: 700; color: #D15A42; text-transform: uppercase;">Active Hotspot Cluster</div>
          <div style="font-weight: 600; margin-top: 2px;">Vyasarpadi & Tondiarpet</div>
          <div style="color: #526A82; font-size: 11px; margin-top: 4px;">47 verified water & heat reports in last 6 hours</div>
        </div>
      `);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [resolvedTheme, selectedRegionId, timeScrubberDay]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--surface)]" style={{ height }}>
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Interactive Badge (North Chennai Active Cluster) */}
      {showHotspots && (
        <div
          onClick={() => setSelectedRegionId('TN-CHN-NORTH')}
          className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3 py-2 rounded-md bg-[var(--surface)]/95 backdrop-blur-sm border border-[var(--border)] shadow-md cursor-pointer hover:border-[var(--brand)] transition-all"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--heat)] animate-pulse" />
          <div>
            <div className="text-[11px] font-bold text-[var(--heat)] uppercase tracking-wide">
              North Chennai Emerging Cluster
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono-numbers">
              47 verified ground incident reports (Zone 4)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
