import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import { AppShell } from './components/layout/AppShell';

// Pages
import { CommandCenter } from './pages/CommandCenter';
import { ImpactMap } from './pages/ImpactMap';
import { Vulnerability } from './pages/Vulnerability';
import { EquityPriorities } from './pages/EquityPriorities';
import { ScenarioLab } from './pages/ScenarioLab';
import { ResourceOptimizer } from './pages/ResourceOptimizer';
import { CommunityIntelligence } from './pages/CommunityIntelligence';
import { HistoricalClimate } from './pages/HistoricalClimate';
import { ResilienceIndex } from './pages/ResilienceIndex';
import { ClimateSOS } from './pages/ClimateSOS';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { HealthcareDashboard } from './pages/HealthcareDashboard';
import { Methodology } from './pages/Methodology';
import { Settings } from './pages/Settings';
import { ConsequenceGraphPage } from './pages/ConsequenceGraph';
import { InvisiblePopulationPage } from './pages/InvisiblePopulation';
import { ResilienceLedgerPage } from './pages/ResilienceLedger';
import MkLandingPage from './pages/MkLandingPage';

export const App: React.FC = () => {
  const { checkBackendHealth } = useAppStore();

  useEffect(() => {
    // Attempt non-blocking initial backend check on startup.
    // If backend is down or unreachable, it remains seamlessly on DemoDataProvider.
    checkBackendHealth();
  }, [checkBackendHealth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page & Role Entry */}
        <Route path="/" element={<MkLandingPage />} />
        <Route path="/login" element={<MkLandingPage />} />

        {/* Platform Core Layout */}
        <Route element={<AppShell />}>
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/impact-map" element={<ImpactMap />} />
          <Route path="/vulnerability" element={<Vulnerability />} />
          <Route path="/consequence-graph" element={<ConsequenceGraphPage />} />
          <Route path="/invisible-population" element={<InvisiblePopulationPage />} />
          <Route path="/equity-priorities" element={<EquityPriorities />} />
          <Route path="/scenario-lab" element={<ScenarioLab />} />
          <Route path="/resource-optimizer" element={<ResourceOptimizer />} />
          <Route path="/community-intelligence" element={<CommunityIntelligence />} />
          <Route path="/historical-climate" element={<HistoricalClimate />} />
          <Route path="/resilience-index" element={<ResilienceIndex />} />
          <Route path="/resilience-ledger" element={<ResilienceLedgerPage />} />
          <Route path="/climate-sos" element={<ClimateSOS />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/agriculture" element={<FarmerDashboard />} />
          <Route path="/healthcare" element={<HealthcareDashboard />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/command-center" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
