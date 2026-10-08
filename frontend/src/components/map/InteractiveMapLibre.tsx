import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useAppStore } from '../../store/appStore';
import { CHENNAI_WARDS_GEOJSON, DEMO_REGIONS } from '../../data/demoData';
import { getRiskBand, getRiskColor } from '../common/ScoreBadge';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Flame } from 'lucide-react';

interface InteractiveMapLibreProps {
  activeLayer?: 'overall' | 'heat' | 'water' | 'health' | 'flood' | 'vulnerability' | 'resilience';
  height?: string;
  onSelectWard?: (id: string) => void;
  showHotspots?: boolean;
}

export const InteractiveMapLibre: React.FC<InteractiveMapLibreProps> = ({
  activeLayer = 'overall',
  height = '520px',
  onSelectWard,
  showHotspots = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [hoveredWard, setHoveredWard] = useState<any | null>(null);

  const {
    resolvedTheme,
    selectedRegionId,
    setSelectedRegionId,
    timeScrubberDay,
  } = useAppStore();

  // Calculate dynamic score with El Niño progression
  const getCalculatedScore = (baseScore: number) => {
    const progressionMultiplier = 1 + (timeScrubberDay / 90) * 0.18;
    return Math.min(100, Math.round(baseScore * progressionMultiplier));
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const basemapStyle = resolvedTheme === 'dark'
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    try {
      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: basemapStyle,
        center: [80.245, 13.085], // Center on Chennai
        zoom: 11,
        attributionControl: false,
      });

      mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      mapInstance.on('load', () => {
        // Add Ward Boundaries GeoJSON
        mapInstance.addSource('chennai-wards', {
          type: 'geojson',
          data: CHENNAI_WARDS_GEOJSON as any,
        });

        // Add Polygon Fill Layer
        mapInstance.addLayer({
          id: 'ward-fills',
          type: 'fill',
          source: 'chennai-wards',
          paint: {
            'fill-color': [
              'match',
              ['get', 'id'],
              'TN-CHN-NORTH', resolvedTheme === 'dark' ? '#FF5C6C' : '#8C1D2E',
              'TN-CHN-CENTRAL', resolvedTheme === 'dark' ? '#EA6347' : '#CC4A2F',
              'TN-CHN-WEST', resolvedTheme === 'dark' ? '#F09A52' : '#E8893F',
              resolvedTheme === 'dark' ? '#D9B35E' : '#F2C46D'
            ],
            'fill-opacity': 0.65,
          },
        });

        // Add Polygon Line Borders
        mapInstance.addLayer({
          id: 'ward-lines',
          type: 'line',
          source: 'chennai-wards',
          paint: {
            'line-color': resolvedTheme === 'dark' ? '#3FC1C9' : '#0B6E7F',
            'line-width': 2,
            'line-opacity': 0.85,
          },
        });

        // Click handler
        mapInstance.on('click', 'ward-fills', (e: any) => {
          if (e.features && e.features[0]) {
            const wardId = e.features[0].properties?.id;
            if (wardId) {
              setSelectedRegionId(wardId);
              if (onSelectWard) onSelectWard(wardId);
            }
          }
        });

        // Hover cursor
        mapInstance.on('mouseenter', 'ward-fills', (e: any) => {
          mapInstance.getCanvas().style.cursor = 'pointer';
          if (e.features && e.features[0]) {
            setHoveredWard(e.features[0].properties);
          }
        });

        mapInstance.on('mouseleave', 'ward-fills', () => {
          mapInstance.getCanvas().style.cursor = '';
          setHoveredWard(null);
        });
      });

      mapInstance.on('error', () => {
        // Fallback to embedded vector rendering if external tiles are restricted
        setMapError(true);
      });

      map.current = mapInstance;

      return () => {
        mapInstance.remove();
      };
    } catch {
      setMapError(true);
    }
  }, [resolvedTheme]);

  // Handle Ward selection click in SVG fallback
  const handleSelect = (id: string) => {
    setSelectedRegionId(id);
    if (onSelectWard) onSelectWard(id);
  };

  return (
    <div className="relative w-full rounded-[6px] overflow-hidden border border-[var(--border)] bg-[var(--surface)]" style={{ height }}>
      {/* MapLibre Canvas Container */}
      {!mapError ? (
        <div ref={mapContainer} className="w-full h-full" />
      ) : null}

      {/* High-Grade Interactive Vector Map Fallback (Always functional, offline-safe) */}
      {mapError && (
        <div className="w-full h-full p-4 relative bg-[var(--surface-raised)] flex flex-col justify-between overflow-hidden">
          {/* Spatial Grid Reticle */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#5A6B7A_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Top GIS Status Overlay */}
          <div className="relative z-10 flex items-center justify-between font-mono-numbers text-xs text-[var(--text-muted)] bg-[var(--surface)]/90 backdrop-blur-sm px-3 py-1.5 rounded-[4px] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--brand)]" />
              <span className="font-semibold text-[var(--text)]">CHENNAI METROPOLITAN WARD POLYGONS</span>
            </div>
            <span>80.27°E, 13.08°N • PROJECTION EPSG:4326</span>
          </div>

          {/* Interactive Scaled GeoJSON Polygons */}
          <div className="relative z-10 my-auto grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
            {CHENNAI_WARDS_GEOJSON.features.map((feature) => {
              const p = feature.properties;
              const isSelected = p.id === selectedRegionId;
              const dynamicScore = getCalculatedScore(p.risk);
              const band = getRiskBand(dynamicScore);
              const color = getRiskColor(band);

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  onMouseEnter={() => setHoveredWard(p)}
                  onMouseLeave={() => setHoveredWard(null)}
                  className={`p-3.5 rounded-[5px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--brand)] bg-[var(--surface)] shadow-lg ring-2 ring-[var(--brand)]/30'
                      : 'border-[var(--border)] bg-[var(--surface)]/90 hover:border-[var(--brand)]'
                  } ${band === 'CRITICAL' ? 'pattern-hatch-critical' : band === 'HIGH' ? 'pattern-hatch-high' : ''}`}
                >
                  <div className="flex items-start justify-between font-mono-numbers">
                    <div>
                      <div className="text-xs font-bold text-[var(--text)] font-sans">{p.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Population: {p.pop}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color }}>{dynamicScore}</div>
                      <div className="text-[10px] uppercase font-semibold" style={{ color }}>{band}</div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex justify-between items-center text-[11px] font-mono-numbers text-[var(--text-muted)]">
                    <span>Heat: <strong className="text-[var(--heat)]">{getCalculatedScore(p.heat)}</strong></span>
                    <span>Water: <strong className="text-[var(--water)]">{p.water}</strong></span>
                    <span>Vuln: <strong className="text-[var(--text)]">{p.vulnerability}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Footnote */}
          <div className="relative z-10 flex justify-between items-center text-[11px] font-mono-numbers text-[var(--text-muted)] bg-[var(--surface)]/90 backdrop-blur-sm px-3 py-1.5 rounded-[4px] border border-[var(--border)]">
            <span>OFFLINE-SAFE GEODATA BUNDLE ACTIVE</span>
            <span>+ {timeScrubberDay} DAYS PROJECTION RECOLORING</span>
          </div>
        </div>
      )}

      {/* Floating Active Hotspot Indicator (Vyasarpadi / Tondiarpet) */}
      {showHotspots && (
        <div
          onClick={() => handleSelect('TN-CHN-NORTH')}
          className="absolute top-4 left-4 z-20 flex items-center gap-2.5 p-2.5 rounded-[5px] bg-[var(--surface)]/95 backdrop-blur-sm border border-[var(--critical)] shadow-lg cursor-pointer hover:scale-105 transition-transform"
          title="Click to zoom to active community hotspot"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[var(--critical)] animate-hotspot" />
            <Flame size={12} className="text-white absolute" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[var(--critical)] uppercase tracking-wider">
              EMERGING HOTSPOT: NORTH CHENNAI
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono-numbers">
              47 reports in last 6 hours • Water & Heat Crisis
            </div>
          </div>
        </div>
      )}

      {/* Hover Tooltip Overlay */}
      {hoveredWard && (
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded-[5px] bg-[var(--surface)]/95 backdrop-blur-sm border border-[var(--border)] shadow-xl font-mono-numbers text-xs pointer-events-none">
          <div className="font-sans font-bold text-[var(--text)] text-sm">{hoveredWard.name}</div>
          <div className="text-[var(--text-muted)] mt-0.5">Pop: {hoveredWard.pop} • Status: {hoveredWard.risk_band}</div>
          <div className="mt-2 flex gap-3 text-[11px]">
            <span>Risk: <strong className="text-[var(--critical)]">{hoveredWard.risk}</strong></span>
            <span>Vuln: <strong className="text-[var(--text)]">{hoveredWard.vulnerability}</strong></span>
            <span>Resilience: <strong className="text-[var(--resilience)]">{hoveredWard.resilience}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
