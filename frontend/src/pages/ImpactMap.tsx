import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { DEMO_REGIONS } from '../data/demoData';
import { LeafletClimateMap } from '../components/map/LeafletClimateMap';
import { ScoreBadge, getRiskBand, getRiskColor } from '../components/common/ScoreBadge';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { Layers, MapPin, List, Map as MapIcon, SlidersHorizontal, Info } from 'lucide-react';

type MapLayerKey =
  | 'overall'
  | 'heat'
  | 'water'
  | 'flood'
  | 'health'
  | 'vulnerability'
  | 'resilience';

export const ImpactMap: React.FC = () => {
  const { selectedRegionId, setSelectedRegionId } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<MapLayerKey>('overall');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchFilter, setSearchFilter] = useState('');

  const currentRegion = DEMO_REGIONS[selectedRegionId] || DEMO_REGIONS['TN-CHN-NORTH'];

  const layers: { key: MapLayerKey; label: string; metricName: string }[] = [
    { key: 'overall', label: 'Composite Impact', metricName: 'Climate Impact' },
    { key: 'heat', label: 'Heat Exposure', metricName: 'Thermal Stress' },
    { key: 'water', label: 'Water Insecurity', metricName: 'Piped Water Stress' },
    { key: 'flood', label: 'Flood Sensitivity', metricName: 'Inundation Sensitivity' },
    { key: 'health', label: 'Health Strain', metricName: 'Wet-bulb Health Pressure' },
    { key: 'vulnerability', label: 'Vulnerability Index', metricName: 'Demographic Sensitivity' },
    { key: 'resilience', label: 'Resilience Index', metricName: 'Adaptive Capacity' },
  ];

  const getMetricForLayer = (reg: typeof currentRegion, layerKey: MapLayerKey) => {
    switch (layerKey) {
      case 'overall': return reg.overall_impact;
      case 'heat': return reg.heat_risk;
      case 'water': return reg.water_stress;
      case 'flood': return reg.flood_risk;
      case 'health': return reg.health_risk;
      case 'vulnerability': return reg.vulnerability;
      case 'resilience': return reg.resilience;
    }
  };

  const filteredRegions = Object.values(DEMO_REGIONS).filter((r) =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (r.parent_region && r.parent_region.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Top Banner Toolbar */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium text-[var(--text)]">
          <Layers size={15} className="text-[var(--brand)]" />
          <span className="font-bold">Full Geospatial Impact Explorer</span>
          <span className="text-[var(--border)] font-thin hidden sm:inline">|</span>
          <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">
            10-Layer Choropleth with Ward Polygon Overlay & Clustered Hotspots
          </span>
        </div>

        {/* View Mode Toggle: Interactive Map vs Accessible List View */}
        <div className="flex items-center border border-[var(--border)] rounded-[4px] bg-[var(--surface-raised)] p-0.5 font-mono-numbers">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-semibold cursor-pointer transition-colors ${
              viewMode === 'map'
                ? 'bg-[var(--brand)] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <MapIcon size={12} />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-semibold cursor-pointer transition-colors ${
              viewMode === 'list'
                ? 'bg-[var(--brand)] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <List size={12} />
            <span>List Table</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Layer Selection Sidebar (3 Cols) */}
        <div className="lg:col-span-3 border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-4 space-y-4">
          <div>
            <div className="text-xs font-semibold text-[var(--text)] mb-2">
              Select Choropleth Layer:
            </div>
            <div className="space-y-1">
              {layers.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setActiveLayer(l.key)}
                  className={`w-full text-left px-3 py-2 rounded-[4px] text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                    activeLayer === l.key
                      ? 'bg-[var(--brand)] text-white font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
                  }`}
                >
                  <span>{l.label}</span>
                  {activeLayer === l.key && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)]">
            <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">
              Filter Wards & Districts:
            </label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-2.5 py-1.5 text-xs rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none mb-2"
            />
          </div>
        </div>

        {/* Center Canvas / Table View (9 Cols) */}
        <div className="lg:col-span-9 space-y-4">
          {viewMode === 'map' ? (
            <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] overflow-hidden flex flex-col">
              <div className="p-3 border-b border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between text-xs font-mono-numbers">
                <span className="font-semibold text-[var(--text)]">
                  ACTIVE LAYER: {layers.find((l) => l.key === activeLayer)?.label.toUpperCase()}
                </span>
                <span className="text-[var(--text-muted)]">CARTO GL VECTOR TILE BASEMAP</span>
              </div>

              {/* Open-Source Leaflet Climate Map */}
              <LeafletClimateMap
                activeLayer={activeLayer}
                height="540px"
                onSelectWard={(id) => setSelectedRegionId(id)}
              />
            </div>
          ) : (
            /* Accessible Table View */
            <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] overflow-hidden">
              <div className="p-3.5 border-b border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between text-xs font-mono-numbers">
                <span className="font-semibold text-[var(--text)]">
                  TABULAR WARD COMPARISON ({filteredRegions.length} RECORDS)
                </span>
                <span className="text-[var(--text-muted)]">ACCESSIBLE LIST MODE</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-numbers">
                  <thead className="bg-[var(--surface-raised)] border-b border-[var(--border)] text-[var(--text-muted)]">
                    <tr>
                      <th className="p-3 pl-4">Location</th>
                      <th className="p-3">Population</th>
                      <th className="p-3">Active Metric Value</th>
                      <th className="p-3">Risk Band</th>
                      <th className="p-3">Vulnerability</th>
                      <th className="p-3 pr-4">Resilience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredRegions.map((reg) => {
                      const val = getMetricForLayer(reg, activeLayer);
                      const band = getRiskBand(val);
                      const color = getRiskColor(band);
                      const isSelected = reg.id === selectedRegionId;

                      return (
                        <tr
                          key={reg.id}
                          onClick={() => setSelectedRegionId(reg.id)}
                          className={`hover:bg-[var(--surface-raised)] cursor-pointer transition-colors ${
                            isSelected ? 'bg-[var(--brand-subtle)] font-semibold' : ''
                          }`}
                        >
                          <td className="p-3 pl-4 font-bold text-[var(--text)] font-sans">
                            {reg.name}
                          </td>
                          <td className="p-3 text-[var(--text-muted)]">{reg.population}</td>
                          <td className="p-3 text-base font-bold" style={{ color }}>{val} / 100</td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase" style={{ color, borderColor: color }}>
                              {band}
                            </span>
                          </td>
                          <td className="p-3 text-[var(--text)]">{reg.vulnerability}</td>
                          <td className="p-3 pr-4 text-[var(--resilience)]">{reg.resilience}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <DataMetadataFooter
        source="MapLibre Open Geospatial Consortium + Greater Chennai Corporation GeoJSON"
        model="Ward Polygon Choropleth v1.0"
        confidence="high"
      />
    </div>
  );
};
