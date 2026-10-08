import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import ScenarioBar from './ScenarioBar.jsx';
import EquityPanel from './EquityPanel.jsx';
import DistrictListTab from './DistrictListTab.jsx';
import FarReachPanel from './FarReachPanel.jsx';
import { Compass, Scale, MapPin, Globe, ChevronLeft, ChevronRight, Terminal } from 'lucide-react';

export default function Sidebar() {
  const isSidebarCollapsed = useSimStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useSimStore((state) => state.setSidebarCollapsed);
  const activeTab = useSimStore((state) => state.activeTab);
  const setActiveTab = useSimStore((state) => state.setActiveTab);

  const tabs = [
    { id: 'scenarios', label: 'Scenarios', icon: Compass },
    { id: 'far-reach', label: 'Far-Reach', icon: Globe },
    { id: 'equity', label: 'Equity & Policy', icon: Scale },
    { id: 'districts', label: 'Communities', icon: MapPin }
  ];

  if (isSidebarCollapsed) {
    return (
      <div className="absolute right-0 top-14 z-20 flex flex-col items-end space-y-2">
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 p-2 rounded-l-lg border-y border-l border-slate-800 shadow-xl transition-colors flex items-center space-x-1"
          title="Open Analysis Panel"
        >
          <ChevronLeft className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold pr-1">Panel</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-12 bottom-12 z-20 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 flex flex-col shadow-2xl transition-all">
      {/* Top Header & Collapse Button */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-950 text-sky-300 border border-sky-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSidebarCollapsed(true)}
          className="ml-2 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          title="Collapse Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {activeTab === 'scenarios' && <ScenarioBar />}
        {activeTab === 'far-reach' && <FarReachPanel />}
        {activeTab === 'equity' && <EquityPanel />}
        {activeTab === 'districts' && <DistrictListTab />}
      </div>
    </div>
  );
}
