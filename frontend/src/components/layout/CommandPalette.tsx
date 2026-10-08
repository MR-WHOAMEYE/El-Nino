import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { Search, MapPin, Navigation, User, X } from 'lucide-react';
import { DEMO_REGIONS } from '../../data/demoData';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pages' | 'Regions' | 'Roles';
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setSelectedRegionId, setUserRole } = useAppStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const allItems: CommandItem[] = [
    // Navigation pages
    { id: 'p-cmd', title: 'Command Center', subtitle: 'Overview operations map & intelligence', category: 'Pages', action: () => navigate('/command-center') },
    { id: 'p-map', title: 'Impact Map', subtitle: 'Full-bleed geospatial layer analyzer', category: 'Pages', action: () => navigate('/impact-map') },
    { id: 'p-vuln', title: 'Community Vulnerability', subtitle: 'Demographic exposure & sensitivity assessment', category: 'Pages', action: () => navigate('/vulnerability') },
    { id: 'p-eq', title: 'Equity Priorities', subtitle: 'Priority ranking for climate justice allocation', category: 'Pages', action: () => navigate('/equity-priorities') },
    { id: 'p-scen', title: 'Scenario Lab', subtitle: 'Interactive intervention policy simulation', category: 'Pages', action: () => navigate('/scenario-lab') },
    { id: 'p-res', title: 'Resource Optimizer', subtitle: 'Budget allocation decision engine', category: 'Pages', action: () => navigate('/resource-optimizer') },
    { id: 'p-comm', title: 'Community Intelligence', subtitle: 'Citizen reports & hotspot detection cluster', category: 'Pages', action: () => navigate('/community-intelligence') },
    { id: 'p-sos', title: 'Climate SOS', subtitle: 'Emergency threshold monitor & alerts', category: 'Pages', action: () => navigate('/climate-sos') },
    { id: 'p-hist', title: 'Historical Climate', subtitle: 'Multi-year ENSO analog analysis', category: 'Pages', action: () => navigate('/historical-climate') },
    { id: 'p-ind', title: 'Resilience Index', subtitle: 'Multi-dimensional institutional readiness', category: 'Pages', action: () => navigate('/resilience-index') },
    { id: 'p-meth', title: 'Methodology', subtitle: 'Scientific documentation & model assumptions', category: 'Pages', action: () => navigate('/methodology') },

    // Regions
    ...Object.values(DEMO_REGIONS).map((reg) => ({
      id: `r-${reg.id}`,
      title: reg.name,
      subtitle: `${reg.parent_region || ''} • Risk: ${reg.overall_impact}/100`,
      category: 'Regions' as const,
      action: () => {
        setSelectedRegionId(reg.id);
        navigate('/command-center');
      },
    })),

    // Roles
    { id: 'role-gov', title: 'Role: Government Administrator', subtitle: 'Full operations command access', category: 'Roles', action: () => { setUserRole('Government'); navigate('/command-center'); } },
    { id: 'role-cit', title: 'Role: Citizen View', subtitle: 'Mobile-first localized advisory', category: 'Roles', action: () => { setUserRole('Citizen'); navigate('/citizen'); } },
    { id: 'role-farm', title: 'Role: Agricultural / Farmer', subtitle: 'Soil, moisture & irrigation brief', category: 'Roles', action: () => { setUserRole('Farmer'); navigate('/agriculture'); } },
    { id: 'role-hlth', title: 'Role: Healthcare Operations', subtitle: 'Hospital surge & wet-bulb alert monitor', category: 'Roles', action: () => { setUserRole('Healthcare'); navigate('/healthcare'); } },
  ];

  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 10)
    : allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-[6px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
          <Search size={16} className="text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search regions, operations pages, or switch roles... (Esc to exit)"
            className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-[4px]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--text-muted)]">
              No matching records found for "{query}".
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  setCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-[4px] hover:bg-[var(--surface-2)] text-left cursor-pointer transition-colors border border-transparent hover:border-[var(--border)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-[var(--text-muted)] shrink-0">
                    {item.category === 'Pages' && <Navigation size={15} />}
                    {item.category === 'Regions' && <MapPin size={15} />}
                    {item.category === 'Roles' && <User size={15} />}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-[var(--text)] truncate">{item.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">{item.subtitle}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono-numbers uppercase text-[var(--text-muted)] px-1.5 py-0.5 rounded-[3px] border border-[var(--border)] shrink-0 ml-2">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono-numbers">
          <span>Use &uarr; &darr; to navigate</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
