import { create } from 'zustand';
import { UserRole, RegionSummary } from '../types';
import { IDataProvider, demoProvider, realProvider } from '../services/dataProvider';
import { DEMO_REGIONS } from '../data/demoData';

export type ThemeMode = 'dark' | 'light' | 'system';

interface AppState {
  // Theme
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;

  // Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Command palette & Modals
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  dataPopoverOpen: boolean;
  setDataPopoverOpen: (open: boolean) => void;

  // Data Provider State
  isDemoMode: boolean;
  demoReason: string | null;
  lastHealthCheck: string | null;
  dataSourceLabel: string;
  modelVersion: string;
  setDemoMode: (isDemo: boolean, reason?: string) => void;
  resetDemoData: () => void;
  checkBackendHealth: () => Promise<boolean>;

  // Selected Location
  selectedRegionId: string;
  selectedRegion: RegionSummary;
  setSelectedRegionId: (id: string) => void;

  // Active alerts count (for badge)
  activeAlertCount: number;
  setActiveAlertCount: (count: number) => void;

  // Language localization (English / Tamil)
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;

  // Time Scrubber (0, 30, 60, 90 days)
  timeScrubberDay: number;
  setTimeScrubberDay: (day: number) => void;
  isPlayingScrubber: boolean;
  toggleScrubberPlay: () => void;

  // Data Provider Accessor
  getProvider: () => IDataProvider;
}

const getInitialTheme = (): { theme: ThemeMode; resolved: 'dark' | 'light' } => {
  const saved = localStorage.getItem('cs_theme') as ThemeMode | null;
  const initial = saved || 'dark'; // Dark is default for Command Center per spec
  let resolved: 'dark' | 'light' = 'dark';
  if (initial === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    resolved = initial;
  }
  return { theme: initial, resolved };
};

const initialThemeState = getInitialTheme();
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', initialThemeState.resolved);
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: initialThemeState.theme,
  resolvedTheme: initialThemeState.resolved,
  setTheme: (newTheme: ThemeMode) => {
    let resolved: 'dark' | 'light' = 'dark';
    if (newTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = newTheme;
    }
    localStorage.setItem('cs_theme', newTheme);
    document.documentElement.setAttribute('data-theme', resolved);
    set({ theme: newTheme, resolvedTheme: resolved });
  },

  userRole: 'Government',
  setUserRole: (userRole: UserRole) => set({ userRole }),

  sidebarCollapsed: localStorage.getItem('cs_sidebar_collapsed') === 'true',
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    localStorage.setItem('cs_sidebar_collapsed', String(next));
    set({ sidebarCollapsed: next });
  },
  setSidebarCollapsed: (sidebarCollapsed: boolean) => {
    localStorage.setItem('cs_sidebar_collapsed', String(sidebarCollapsed));
    set({ sidebarCollapsed });
  },

  commandPaletteOpen: false,
  setCommandPaletteOpen: (commandPaletteOpen: boolean) => set({ commandPaletteOpen }),

  dataPopoverOpen: false,
  setDataPopoverOpen: (dataPopoverOpen: boolean) => set({ dataPopoverOpen }),

  // Default to Demo provider active with explicit badge per spec
  isDemoMode: true,
  demoReason: 'Built-in deterministic climate dataset active for validation.',
  lastHealthCheck: '2026-10-08T06:00:00Z',
  dataSourceLabel: 'CS-DEMO-DATASET-2026',
  modelVersion: 'demo-v1.0 (XGBoost Analog)',

  setDemoMode: (isDemo: boolean, reason?: string) => {
    set({
      isDemoMode: isDemo,
      demoReason: reason || (isDemo ? 'Switched to deterministic demo provider' : null),
      dataSourceLabel: isDemo ? 'CS-DEMO-DATASET-2026' : 'FastAPI / PostGIS Live',
    });
  },

  resetDemoData: () => {
    set({
      selectedRegionId: 'TN-CHN',
      selectedRegion: DEMO_REGIONS['TN-CHN'],
      isDemoMode: true,
      demoReason: 'Demo data state restored to factory baseline.',
    });
  },

  checkBackendHealth: async () => {
    try {
      const res = await realProvider.getHealth();
      if (res && res.success) {
        set({
          isDemoMode: false,
          demoReason: null,
          lastHealthCheck: new Date().toISOString(),
          dataSourceLabel: 'FastAPI / PostGIS Live',
          modelVersion: res.metadata?.model_version || 'live-v1',
        });
        return true;
      }
    } catch {
      set({
        isDemoMode: true,
        demoReason: 'Backend API unreachable. Falling back safely to DemoDataProvider.',
      });
    }
    return false;
  },

  selectedRegionId: 'TN-CHN',
  selectedRegion: DEMO_REGIONS['TN-CHN'],
  setSelectedRegionId: (id: string) => {
    const region = DEMO_REGIONS[id] || DEMO_REGIONS['TN-CHN'];
    set({ selectedRegionId: id, selectedRegion: region });
  },

  activeAlertCount: 2,
  setActiveAlertCount: (activeAlertCount: number) => set({ activeAlertCount }),

  language: 'en',
  setLanguage: (language: 'en' | 'ta') => set({ language }),

  timeScrubberDay: 0,
  setTimeScrubberDay: (timeScrubberDay: number) => set({ timeScrubberDay }),
  isPlayingScrubber: false,
  toggleScrubberPlay: () => set((state) => ({ isPlayingScrubber: !state.isPlayingScrubber })),

  getProvider: () => {
    return get().isDemoMode ? demoProvider : realProvider;
  },
}));
