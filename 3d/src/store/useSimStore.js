/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { createInitialState, step, classifyPhase, clamp } from '../simulation/enso.js';
import { SCENARIO_PRESETS } from '../simulation/scenarios.js';
import { DEFAULT_EQUITY_WEIGHTS, evaluateAllDistricts, computeEquityMetrics, runRecommendationStabilityTest } from '../simulation/equity.js';
import { allocateBudgetOptimally } from '../simulation/counterfactual.js';
import districtsData from '../data/districts.json';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getSeasonLabel(month) {
  const m = Math.floor(month) % 12;
  if (m >= 5 && m <= 8) return 'Southwest Monsoon (JJAS)';
  if (m >= 9 && m <= 11) return 'Northeast Monsoon / Post-Monsoon (OND)';
  return 'Dry / Inter-monsoon (JFM)';
}

export function formatMonthLabel(elapsedMonths) {
  const m = Math.floor(elapsedMonths) % 12;
  const yr = Math.floor(elapsedMonths / 12) + 1;
  return `Year ${yr}, ${MONTH_NAMES[m]}`;
}

export const useSimStore = create((set, get) => {
  const initialSimState = createInitialState();
  const initialDistricts = evaluateAllDistricts(districtsData, initialSimState.nino34, initialSimState.month);
  const initialEquity = computeEquityMetrics(initialDistricts);

  return {
    // --- Physics Simulation State ---
    ...initialSimState,
    isPlaying: false,
    playbackSpeed: 1.0,
    history: [
      {
        month: 0,
        elapsedMonths: 0,
        nino34: 0.0,
        tradeWind: 0.6,
        heatContent: 0.05
      }
    ],

    // --- Visualization & Graphics Toggles ---
    projectionMode: 'flat', // 'flat' | 'globe'
    cameraPreset: 'overview', // 'overview' | 'walker' | 'crossSection' | 'indiaFocus' | 'southeastAsiaFocus'
    autoRotate: false,
    cloudXRay: false,
    showClouds: true,
    lowGraphicsMode: false,
    colorBlindMode: false,
    showWindField: true,
    showRainField: true,
    showThermocline: true,
    showDistricts: false,
    showLabels: false,
    showTeleconnections: true,
    showDistanceRings: true,
    showWalkerLoop: true,
    showCrossSectionOverlay: false,

    // --- UI Navigation & Story ---
    activeTab: 'scenarios',
    isSidebarCollapsed: false,
    selectedDistrictId: null,
    hoveredDistrictId: null,
    selectedRegionId: 'india-west',
    hoveredRegionId: null,
    compareRegionIds: [],
    storyActive: false,
    storyStep: 0,
    showDataLimitationsModal: false,

    // --- Equity & Counterfactual State ---
    equityWeights: { ...DEFAULT_EQUITY_WEIGHTS },
    selectedInterventionId: 'irrigation_drip',
    policyBudget: 500, // Millions INR
    beforeAfterMode: 'before', // 'before' | 'after'
    activeScenarioId: 'normal',

    // Evaluated data caches
    evaluatedDistricts: initialDistricts,
    equityMetrics: initialEquity,
    budgetAllocationResult: allocateBudgetOptimally(districtsData, initialSimState.nino34, initialSimState.month, 500, 'irrigation_drip'),
    stabilityReport: null,

    // --- Actions ---
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    
    setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    
    setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
    
    setActiveTab: (tab) => set({ activeTab: tab }),

    setCameraPreset: (preset) => set({ cameraPreset: preset }),

    setAutoRotate: (enabled) => set({ autoRotate: enabled }),

    toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),

    toggleCloudXRay: () => set((state) => ({ cloudXRay: !state.cloudXRay })),

    toggleShowClouds: () => set((state) => ({ showClouds: !state.showClouds })),

    setProjectionMode: (mode) => set({ projectionMode: mode }),

    setLowGraphicsMode: (enabled) => set({ lowGraphicsMode: enabled }),

    setColorBlindMode: (enabled) => set({ colorBlindMode: enabled }),

    toggleLayer: (layerKey) => set((state) => ({ [layerKey]: !state[layerKey] })),

    setSelectedDistrict: (id) => set({ selectedDistrictId: id }),

    setHoveredDistrict: (id) => set({ hoveredDistrictId: id }),

    setSelectedRegion: (id) => set({ selectedRegionId: id }),

    setHoveredRegion: (id) => set({ hoveredRegionId: id }),

    setShowDataLimitationsModal: (show) => set({ showDataLimitationsModal: show }),

    setBeforeAfterMode: (mode) => set({ beforeAfterMode: mode }),

    setTradeWind: (val) => {
      set({ tradeWind: clamp(val, 0.1, 1.0) });
      get().refreshEvaluations();
    },

    setWarmPoolX: (val) => {
      set({ warmPoolX: clamp(val, 0.05, 0.95) });
    },

    triggerWesterlyBurst: () => {
      set({
        westerlyBurstActive: true,
        kelvinWavePosition: 0.0,
        tradeWind: Math.max(0.15, get().tradeWind - 0.25)
      });
    },

    setEquityWeights: (newWeights) => {
      set((state) => ({
        equityWeights: { ...state.equityWeights, ...newWeights }
      }));
      get().refreshEvaluations();
    },

    setPolicyBudget: (budget) => {
      set({ policyBudget: budget });
      get().refreshEvaluations();
    },

    setSelectedIntervention: (id) => {
      set({ selectedInterventionId: id });
      get().refreshEvaluations();
    },

    runStabilityTest: () => {
      const state = get();
      const report = runRecommendationStabilityTest(districtsData, state.nino34, state.month, state.equityWeights, 200);
      set({ stabilityReport: report });
    },

    loadScenario: (presetId) => {
      const preset = SCENARIO_PRESETS.find(p => p.id === presetId);
      if (!preset) return;
      set((state) => ({
        ...state,
        ...preset.initialState,
        phase: classifyPhase(preset.initialState.nino34),
        activeScenarioId: presetId,
        cameraPreset: preset.cameraPreset || state.cameraPreset,
        playbackSpeed: preset.recommendedSpeed || state.playbackSpeed
      }));
      get().refreshEvaluations();
    },

    setStoryStep: (stepIndex) => {
      const storyPresets = [
        { id: 'normal', camera: 'overview' },
        { id: 'weakening_winds', camera: 'walker' },
        { id: 'warm_water_shift', camera: 'crossSection' },
        { id: 'strong_el_nino', camera: 'indiaFocus' },
        { id: 'strong_el_nino', camera: 'southeastAsiaFocus' },
        { id: 'la_nina_onset', camera: 'overview' }
      ];
      const target = storyPresets[clamp(stepIndex, 0, 5)];
      if (target) {
        get().loadScenario(target.id);
        set({ storyStep: stepIndex, cameraPreset: target.camera });
      }
    },

    resetSim: () => {
      const fresh = createInitialState();
      set({
        ...fresh,
        isPlaying: false,
        activeScenarioId: 'normal',
        history: [{ month: 0, elapsedMonths: 0, nino34: 0, tradeWind: 0.6, heatContent: 0.05 }],
        cameraPreset: 'overview',
        beforeAfterMode: 'before'
      });
      get().refreshEvaluations();
    },

    seekMonth: (monthValue) => {
      set({
        month: Math.floor(monthValue) % 12,
        elapsedMonths: monthValue
      });
      get().refreshEvaluations();
    },

    stepSim: (dtMonths = 0.1) => {
      const currentState = get();
      const nextSim = step(currentState, {}, dtMonths);

      let nextHistory = currentState.history;
      if (Math.abs(nextSim.elapsedMonths - (nextHistory[nextHistory.length - 1]?.elapsedMonths || 0)) >= 0.5) {
        nextHistory = [
          ...nextHistory.slice(-59),
          {
            month: nextSim.month,
            elapsedMonths: Number(nextSim.elapsedMonths.toFixed(1)),
            nino34: Number(nextSim.nino34.toFixed(2)),
            tradeWind: Number(nextSim.tradeWind.toFixed(2)),
            heatContent: Number(nextSim.heatContent.toFixed(2))
          }
        ];
      }

      set({
        ...nextSim,
        history: nextHistory
      });

      get().refreshEvaluations();
    },

    refreshEvaluations: () => {
      const state = get();
      const evaluated = evaluateAllDistricts(districtsData, state.nino34, state.month, state.equityWeights);
      const metrics = computeEquityMetrics(evaluated);
      const budgetResult = allocateBudgetOptimally(
        districtsData,
        state.nino34,
        state.month,
        state.policyBudget,
        state.selectedInterventionId
      );

      set({
        evaluatedDistricts: evaluated,
        equityMetrics: metrics,
        budgetAllocationResult: budgetResult
      });
    },

    // --- State Extractors for Sync Protocol ---
    getLiveSnapshot: (fps = 60) => {
      const state = get();
      const sortedByRisk = [...state.evaluatedDistricts].sort((a, b) => b.compositeVulnerability - a.compositeVulnerability);
      const top3 = sortedByRisk.slice(0, 3).map(d => d.name);

      const anomaliesMap = {};
      state.evaluatedDistricts.forEach(d => {
        anomaliesMap[d.id] = {
          name: d.name,
          country: d.country,
          rainAnomalyPct: d.rainAnomalyPct,
          tempAnomalyC: d.tempAnomalyC,
          hazardLevel: d.hazardLevel,
          compositeVulnerability: d.compositeVulnerability
        };
      });

      return {
        nino34: Number(state.nino34.toFixed(2)),
        phase: state.phase || classifyPhase(state.nino34),
        heatContent: Number(state.heatContent.toFixed(2)),
        warmPoolX: Number(state.warmPoolX.toFixed(2)),
        thermoclineSlope: Number((state.thermoclineSlope ?? 1.0).toFixed(2)),
        currentMonthLabel: formatMonthLabel(state.elapsedMonths || 0),
        seasonLabel: getSeasonLabel(state.month),
        regionAnomalies: anomaliesMap,
        topAtRisk: top3,
        recommendationStability: state.stabilityReport?.stabilityScore ?? 88,
        equityGapIndex: Number((state.equityMetrics?.unmetNeedsGap ?? 0.32).toFixed(2)),
        fps,
        particleCount: state.lowGraphicsMode ? 700 : 1420,
        drawCalls: 18,
        mainConnected: true,
        lastUpdateTimestamp: Date.now()
      };
    },

    // Apply incoming CONTROL STATE patch
    applyControlState: (controlState) => {
      const updates = {};
      
      if (controlState.scenarioId && controlState.scenarioId !== get().activeScenarioId) {
        get().loadScenario(controlState.scenarioId);
      }
      
      if (controlState.drivers) {
        if (controlState.drivers.tradeWind !== undefined) updates.tradeWind = controlState.drivers.tradeWind;
        if (controlState.drivers.warmPoolPosition !== undefined) updates.warmPoolX = controlState.drivers.warmPoolPosition;
        if (controlState.drivers.simulationSpeed !== undefined) updates.playbackSpeed = controlState.drivers.simulationSpeed;
      }

      if (controlState.playback) {
        if (controlState.playback.isPlaying !== undefined) updates.isPlaying = controlState.playback.isPlaying;
        if (controlState.playback.month !== undefined && Math.abs(controlState.playback.month - get().elapsedMonths) > 0.5) {
          updates.elapsedMonths = controlState.playback.month;
          updates.month = Math.floor(controlState.playback.month) % 12;
        }
      }

      if (controlState.layers) {
        if (controlState.layers.showWind !== undefined) updates.showWindField = controlState.layers.showWind;
        if (controlState.layers.showRain !== undefined) updates.showRainField = controlState.layers.showRain;
        if (controlState.layers.showClouds !== undefined) updates.showClouds = controlState.layers.showClouds;
        if (controlState.layers.cloudXray !== undefined) updates.cloudXRay = controlState.layers.cloudXray;
        if (controlState.layers.showThermocline !== undefined) updates.showThermocline = controlState.layers.showThermocline;
        if (controlState.layers.showDistricts !== undefined) updates.showDistricts = controlState.layers.showDistricts;
        if (controlState.layers.showLabels !== undefined) updates.showLabels = controlState.layers.showLabels;
        if (controlState.layers.showTeleconnections !== undefined) updates.showTeleconnections = controlState.layers.showTeleconnections;
        if (controlState.layers.showDistanceRings !== undefined) updates.showDistanceRings = controlState.layers.showDistanceRings;
      }

      if (controlState.camera) {
        if (controlState.camera.presetId !== undefined) updates.cameraPreset = controlState.camera.presetId;
        if (controlState.camera.autoRotate !== undefined) updates.autoRotate = controlState.camera.autoRotate;
      }

      if (controlState.display) {
        if (controlState.display.lowGraphics !== undefined) updates.lowGraphicsMode = controlState.display.lowGraphics;
        if (controlState.display.colorBlindPalette !== undefined) updates.colorBlindMode = controlState.display.colorBlindPalette;
      }

      if (controlState.selection) {
        if (controlState.selection.selectedRegionId !== undefined) updates.selectedRegionId = controlState.selection.selectedRegionId;
        if (controlState.selection.compareRegionIds !== undefined) updates.compareRegionIds = controlState.selection.compareRegionIds;
      }

      if (controlState.equity) {
        if (controlState.equity.vulnerabilityWeights) updates.equityWeights = { ...get().equityWeights, ...controlState.equity.vulnerabilityWeights };
        if (controlState.equity.interventionId) updates.selectedInterventionId = controlState.equity.interventionId;
        if (controlState.equity.budget !== undefined) updates.policyBudget = controlState.equity.budget;
        if (controlState.equity.beforeAfter !== undefined) updates.beforeAfterMode = controlState.equity.beforeAfter ? 'after' : 'before';
      }

      if (controlState.story) {
        if (controlState.story.storyActive !== undefined) updates.storyActive = controlState.story.storyActive;
        if (controlState.story.storyStep !== undefined && controlState.story.storyStep !== get().storyStep) {
          get().setStoryStep(controlState.story.storyStep);
        }
      }

      if (Object.keys(updates).length > 0) {
        set(updates);
        get().refreshEvaluations();
      }
    }
  };
});
