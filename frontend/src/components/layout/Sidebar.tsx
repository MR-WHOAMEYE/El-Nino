import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Layers,
  ShieldAlert,
  ListOrdered,
  History,
  Activity,
  SlidersHorizontal,
  Coins,
  Users,
  AlertTriangle,
  User,
  Sprout,
  HeartPulse,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItemDef {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: UserRole[];
  badge?: number | string;
  badgeCritical?: boolean;
}

interface NavSectionDef {
  title: string;
  items: NavItemDef[];
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, userRole, activeAlertCount } = useAppStore();

  const sections: NavSectionDef[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Command Center', path: '/command-center', icon: LayoutDashboard, roles: ['Government', 'Admin'] },
        { label: 'Impact Map', path: '/impact-map', icon: Layers, roles: ['Government', 'Admin'] },
      ],
    },
    {
      title: 'UNDERSTAND',
      items: [
        { label: 'Community Vulnerability', path: '/vulnerability', icon: ShieldAlert, roles: ['Government', 'Admin'] },
        { label: 'Equity Priorities', path: '/equity-priorities', icon: ListOrdered, roles: ['Government', 'Healthcare', 'Admin'] },
        { label: 'Historical Climate', path: '/historical-climate', icon: History, roles: ['Government', 'Admin'] },
        { label: 'Resilience Index', path: '/resilience-index', icon: Activity, roles: ['Government', 'Admin'] },
      ],
    },
    {
      title: 'PLAN',
      items: [
        { label: 'Scenario Lab', path: '/scenario-lab', icon: SlidersHorizontal, roles: ['Government', 'Admin'] },
        { label: 'Resource Optimizer', path: '/resource-optimizer', icon: Coins, roles: ['Government', 'Admin'] },
      ],
    },
    {
      title: 'MONITOR',
      items: [
        { label: 'Community Intelligence', path: '/community-intelligence', icon: Users, roles: ['Government', 'Citizen', 'Farmer', 'Healthcare', 'Admin'] },
        {
          label: 'Climate SOS',
          path: '/climate-sos',
          icon: AlertTriangle,
          badge: activeAlertCount,
          badgeCritical: true,
          roles: ['Government', 'Citizen', 'Farmer', 'Healthcare', 'Admin'],
        },
      ],
    },
    {
      title: 'SECTOR VIEWS',
      items: [
        { label: 'Citizen', path: '/citizen', icon: User, roles: ['Citizen', 'Government', 'Admin'] },
        { label: 'Agriculture', path: '/agriculture', icon: Sprout, roles: ['Farmer', 'Government', 'Admin'] },
        { label: 'Healthcare', path: '/healthcare', icon: HeartPulse, roles: ['Healthcare', 'Government', 'Admin'] },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Methodology', path: '/methodology', icon: BookOpen, roles: ['Government', 'Citizen', 'Farmer', 'Healthcare', 'Admin'] },
        { label: 'Settings', path: '/settings', icon: Settings, roles: ['Government', 'Admin'] },
      ],
    },
  ];

  // Filter items based on active role guard
  const filteredSections = sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => !item.roles || item.roles.includes(userRole)),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-200 select-none shrink-0 ${
        sidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-3 space-y-5">
        {filteredSections.map((sec) => (
          <div key={sec.title} className="px-2">
            {!sidebarCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-semibold tracking-[0.06em] text-[var(--text-muted)] uppercase">
                {sec.title}
              </div>
            )}
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--brand-subtle)] text-[var(--brand)] font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[var(--brand)] rounded-r" />
                        )}
                        <Icon size={16} className="shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}
                        {!sidebarCollapsed && item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-numbers font-semibold ${
                              item.badgeCritical
                                ? 'bg-[var(--critical)] text-white'
                                : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {sidebarCollapsed && item.badge !== undefined && (
                          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[var(--critical)]" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse / Expand rail button */}
      <div className="p-2 border-t border-[var(--border)]">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-[4px] text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] cursor-pointer transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse to rail'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : (
            <div className="flex items-center gap-2">
              <ChevronLeft size={16} />
              <span className="text-[11px] uppercase tracking-wider font-mono-numbers">Collapse Rail</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
