import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { DataModePopover } from './DataModePopover';
import { CommandPalette } from './CommandPalette';
import { Monitor } from 'lucide-react';

export const AppShell: React.FC = () => {
  const location = useLocation();

  const isGovOnlyPage =
    location.pathname.includes('/command-center') ||
    location.pathname.includes('/scenario-lab') ||
    location.pathname.includes('/resource-optimizer');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Top bar across desktop and mobile */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop / Tablet Sidebar */}
        <Sidebar />

        {/* Main Content Workspace */}
        <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0 relative">
          {/* Mobile warning notice for dense government operations pages */}
          {isGovOnlyPage && (
            <div className="md:hidden mx-3 mt-3 p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[11px] text-[var(--text-muted)] flex items-center gap-2">
              <Monitor size={15} className="text-[var(--brand)] shrink-0" />
              <span>
                Operations Command Center & Simulation Lab are optimized for desktop (≥1024px).
              </span>
            </div>
          )}

          <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (<768px) */}
      <MobileNav />

      {/* Floating Overlays */}
      <DataModePopover />
      <CommandPalette />
    </div>
  );
};
