import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { Home, Map, AlertTriangle, MessageSquarePlus, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeAlertCount } = useAppStore();

  const navItems = [
    { label: 'Home', path: '/citizen', icon: Home },
    { label: 'Map', path: '/impact-map', icon: Map },
    { label: 'Alerts', path: '/climate-sos', icon: AlertTriangle, badge: activeAlertCount },
    { label: 'Report', path: '/community-intelligence', icon: MessageSquarePlus },
    { label: 'Profile', path: '/settings', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[var(--surface)] border-t border-[var(--border)] z-40 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-2 rounded-[4px] text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-[var(--brand)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={18} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[var(--critical)] text-white text-[9px] font-mono-numbers rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 w-4 h-[2px] bg-[var(--brand)] rounded" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
