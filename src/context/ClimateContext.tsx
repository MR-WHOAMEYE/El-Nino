import React, { createContext, useContext, useState, useEffect } from 'react';
import { Region, Intervention, CommunityReport, SimulationOutcome, EquityAllocationResult, UserProfile } from '../types';
import { MOCK_REGIONS, MOCK_INTERVENTIONS, MOCK_COMMUNITY_REPORTS } from '../data/mockData';

interface EquityWeights {
  exposure: number;
  poverty: number;
  infrastructureGap: number;
}

interface ClimateContextType {
  dataSourceMode: 'live' | 'empty';
  setDataSourceMode: (mode: 'live' | 'empty') => void;
  regions: Region[];
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  interventions: Intervention[];
  activeInterventions: Intervention[];
  toggleIntervention: (intervention: Intervention) => void;
  removeIntervention: (id: string) => void;
  clearInterventions: () => void;
  budget: number;
  setBudget: (budget: number) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  communityReports: CommunityReport[];
  addCommunityReport: (report: Omit<CommunityReport, 'id' | 'timestamp' | 'upvotes' | 'verified'>) => void;
  simulationIntensity: 'weak' | 'moderate' | 'strong' | 'extreme';
  setSimulationIntensity: (val: 'weak' | 'moderate' | 'strong' | 'extreme') => void;
  timeHorizon: '2024-2025' | '2025-2026' | '5-year-long-term';
  setTimeHorizon: (val: '2024-2025' | '2025-2026' | '5-year-long-term') => void;
  equityWeights: EquityWeights;
  setEquityWeights: (weights: EquityWeights) => void;
  getSimulationOutcome: () => SimulationOutcome;
  getEquityDistribution: () => EquityAllocationResult[];
  currentUser: UserProfile | null;
  loginUser: (profile: Omit<UserProfile, 'isLoggedIn'>) => void;
  logoutUser: () => void;
}

const ClimateContext = createContext<ClimateContextType | undefined>(undefined);

export const ClimateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We initialize in 'live' so the user immediately gets rich data, but can toggle to 'empty' to test pristine Awaiting Data states
  const [dataSourceMode, setDataSourceMode] = useState<'live' | 'empty'>('live');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Check saved session if any
    try {
      const saved = localStorage.getItem('elnexus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginUser = (profile: Omit<UserProfile, 'isLoggedIn'>) => {
    const user: UserProfile = { ...profile, isLoggedIn: true };
    setCurrentUser(user);
    try {
      localStorage.setItem('elnexus_user', JSON.stringify(user));
    } catch {}
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('elnexus_user');
    } catch {}
  };
  const [regions] = useState<Region[]>(MOCK_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<Region>(MOCK_REGIONS[0]);
  const [interventions] = useState<Intervention[]>(MOCK_INTERVENTIONS);
  const [activeInterventions, setActiveInterventions] = useState<Intervention[]>([
    MOCK_INTERVENTIONS[0],
    MOCK_INTERVENTIONS[1]
  ]);
  const [budget, setBudget] = useState<number>(25000000);
  const [currency, setCurrency] = useState<string>('USD');
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(MOCK_COMMUNITY_REPORTS);
  const [simulationIntensity, setSimulationIntensity] = useState<'weak' | 'moderate' | 'strong' | 'extreme'>('strong');
  const [timeHorizon, setTimeHorizon] = useState<'2024-2025' | '2025-2026' | '5-year-long-term'>('2024-2025');
  const [equityWeights, setEquityWeights] = useState<EquityWeights>({
    exposure: 35,
    poverty: 40,
    infrastructureGap: 25
  });

  const toggleIntervention = (intervention: Intervention) => {
    setActiveInterventions(prev => {
      const exists = prev.some(item => item.id === intervention.id);
      if (exists) {
        return prev.filter(item => item.id !== intervention.id);
      } else {
        return [...prev, intervention];
      }
    });
  };

  const removeIntervention = (id: string) => {
    setActiveInterventions(prev => prev.filter(item => item.id !== id));
  };

  const clearInterventions = () => {
    setActiveInterventions([]);
  };

  const addCommunityReport = (reportData: Omit<CommunityReport, 'id' | 'timestamp' | 'upvotes' | 'verified'>) => {
    const newReport: CommunityReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      timestamp: 'Just now',
      upvotes: 1,
      verified: true
    };
    setCommunityReports(prev => [newReport, ...prev]);
  };

  const getSimulationOutcome = (): SimulationOutcome => {
    // Multiplier based on intensity
    let intensityFactor = 1.0;
    if (simulationIntensity === 'weak') intensityFactor = 0.6;
    if (simulationIntensity === 'moderate') intensityFactor = 0.85;
    if (simulationIntensity === 'strong') intensityFactor = 1.25;
    if (simulationIntensity === 'extreme') intensityFactor = 1.6;

    const baseLoss = Math.min(95, Math.round(selectedRegion.cropYieldForecastLoss * intensityFactor));
    const baseWater = Math.min(98, Math.round(selectedRegion.soilMoistureDeficit * intensityFactor));
    const baseDisplaced = Math.round((selectedRegion.population * 0.045) * intensityFactor);
    const baseEconLoss = Math.round((selectedRegion.population * 0.00012) * intensityFactor * 10) / 10;

    // Sum intervention effectiveness
    const totalCropProtection = activeInterventions.reduce((sum, item) => sum + item.cropProtectionPercent, 0);
    const totalWaterGain = activeInterventions.reduce((sum, item) => sum + item.waterSecurityGainPercent, 0);
    const totalResilience = activeInterventions.reduce((sum, item) => sum + item.resilienceLiftPercent, 0);

    const mitigatedLoss = Math.max(8, Math.round(baseLoss * (1 - Math.min(0.75, totalCropProtection / 100))));
    const mitigatedWater = Math.max(12, Math.round(baseWater * (1 - Math.min(0.75, totalWaterGain / 100))));
    const protectedFamiliesRatio = Math.min(0.85, (totalCropProtection + totalWaterGain) / 160);
    const mitigatedDisplaced = Math.round(baseDisplaced * (1 - protectedFamiliesRatio));
    const mitigatedEcon = Math.round(baseEconLoss * (1 - protectedFamiliesRatio * 0.8) * 10) / 10;

    const impactAvoided = Math.round((baseEconLoss - mitigatedEcon) * 10) / 10;
    const resilienceGain = Math.min(92, Math.round(totalResilience * 0.85 + 15));
    const familiesProtected = Math.max(0, baseDisplaced - mitigatedDisplaced);

    return {
      baselineCropLoss: baseLoss,
      baselineWaterStress: baseWater,
      baselineDisplacedFamilies: baseDisplaced,
      baselineEconomicLossMillion: baseEconLoss,

      mitigatedCropLoss: mitigatedLoss,
      mitigatedWaterStress: mitigatedWater,
      mitigatedDisplacedFamilies: mitigatedDisplaced,
      mitigatedEconomicLossMillion: mitigatedEcon,

      impactAvoidedMillion: Math.max(0, impactAvoided),
      resilienceGainPercent: resilienceGain,
      familiesProtected
    };
  };

  const getEquityDistribution = (): EquityAllocationResult[] => {
    const totalPop = regions.reduce((acc, r) => acc + r.population, 0);

    // Calculate composite vulnerability weight for each region
    const rawScores = regions.map(r => {
      const expWeight = (r.historicalDroughtExposure / 100) * (equityWeights.exposure / 100);
      const povWeight = (r.povertyRate / 100) * (equityWeights.poverty / 100);
      const infraGap = ((100 - r.dnaScores.infrastructure) / 100) * (equityWeights.infrastructureGap / 100);
      const compositeWeight = (expWeight + povWeight + infraGap) * (r.population / 1000000);
      return {
        region: r,
        weight: compositeWeight
      };
    });

    const sumWeights = rawScores.reduce((acc, item) => acc + item.weight, 0);

    return rawScores.map(({ region, weight }) => {
      const share = weight / sumWeights;
      const equitableAllocation = Math.round(budget * share);
      const pureGdpShare = region.population / totalPop;
      const pureGdpAllocation = Math.round(budget * pureGdpShare);
      const delta = equitableAllocation - pureGdpAllocation;

      let keyJustification = 'High climate vulnerability index';
      if (region.povertyRate > 65) keyJustification = 'Severe poverty headcount + high water deficit';
      else if (region.dnaScores.infrastructure < 35) keyJustification = 'Critical infrastructure buffer deficit';
      else if (region.historicalDroughtExposure > 80) keyJustification = 'Recurring catastrophic drought trajectory';

      return {
        regionId: region.id,
        regionName: region.name,
        population: region.population,
        povertyRate: region.povertyRate,
        vulnerabilityScore: region.overallVulnerabilityScore,
        pureGdpAllocation,
        equitableAllocation,
        equityLiftDelta: delta,
        percentageShare: Math.round(share * 1000) / 10,
        keyJustification
      };
    });
  };

  return (
    <ClimateContext.Provider
      value={{
        dataSourceMode,
        setDataSourceMode,
        regions,
        selectedRegion,
        setSelectedRegion,
        interventions,
        activeInterventions,
        toggleIntervention,
        removeIntervention,
        clearInterventions,
        budget,
        setBudget,
        currency,
        setCurrency,
        communityReports,
        addCommunityReport,
        simulationIntensity,
        setSimulationIntensity,
        timeHorizon,
        setTimeHorizon,
        equityWeights,
        setEquityWeights,
        getSimulationOutcome,
        getEquityDistribution,
        currentUser,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </ClimateContext.Provider>
  );
};

export const useClimate = () => {
  const context = useContext(ClimateContext);
  if (!context) {
    throw new Error('useClimate must be used within a ClimateProvider');
  }
  return context;
};
