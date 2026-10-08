import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClimateProvider } from './context/ClimateContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ImpactIntelligence from './pages/ImpactIntelligence';
import ResilienceDNA from './pages/ResilienceDNA';
import ClimateSimulator from './pages/ClimateSimulator';
import InterventionLab from './pages/InterventionLab';
import EquityAllocation from './pages/EquityAllocation';
import FoodSecurity from './pages/FoodSecurity';
import CommunityPulse from './pages/CommunityPulse';
import ResilienceAI from './pages/ResilienceAI';
import ActionPlans from './pages/ActionPlans';

export function App() {
  return (
    <ClimateProvider>
      <Router>
        <Routes>
          {/* Public Landing & Login Views */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated / Command Center Platform Views */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/impact" element={<ImpactIntelligence />} />
            <Route path="/dna" element={<ResilienceDNA />} />
            <Route path="/simulator" element={<ClimateSimulator />} />
            <Route path="/interventions" element={<InterventionLab />} />
            <Route path="/equity" element={<EquityAllocation />} />
            <Route path="/food" element={<FoodSecurity />} />
            <Route path="/community" element={<CommunityPulse />} />
            <Route path="/ai" element={<ResilienceAI />} />
            <Route path="/action" element={<ActionPlans />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </ClimateProvider>
  );
}

export default App;
