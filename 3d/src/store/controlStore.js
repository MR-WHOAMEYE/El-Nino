/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export const INITIAL_CONTROL_STATE = {
  version: 1,
  scenarioId: 'normal',
  drivers: {
    tradeWind: 0.6,
    warmPoolPosition: 0.2,
    laNinaStrength: 0.0,
    simulationSpeed: 1.0
  },
  playback: {
    isPlaying: false,
    month: 0,
    loop: true
  },
  layers: {
    showWind: true,
    showRain: true,
    showClouds: true,
    cloudXray: false,
    showThermocline: true,
    showDistricts: false,
    showLabels: false,
    showTeleconnections: true,
    showDistanceRings: true,
    showEquityOverlay: false
  },
  camera: {
    presetId: 'overview',
    autoRotate: false
  },
  display: {
    lowGraphics: false,
    colorBlindPalette: false,
    labelTier: 'auto' // 'auto' | 'regions' | 'cities'
  },
  selection: {
    selectedRegionId: null,
    compareRegionIds: []
  },
  equity: {
    vulnerabilityWeights: {
      poverty: 0.35,
      cropDependence: 0.30,
      smallholderPct: 0.20,
      baselineDeficit: 0.15
    },
    interventionId: 'irrigation_drip',
    budget: 500,
    beforeAfter: false
  },
  story: {
    storyActive: false,
    storyStep: 0
  },
  actions: {
    pulseKelvinWave: 0,
    westerlyWindBurst: 0,
    resetAll: 0
  }
};

export const useControlStore = create((set, get) => ({
  ...INITIAL_CONTROL_STATE,

  // Apply a full or partial patch and bump the version
  applyPatch: (patch, fromSync = false) => {
    set((state) => {
      // If version is older than current version from sync, ignore it
      if (fromSync && patch.version && patch.version < state.version) {
        return state;
      }
      const nextVersion = fromSync && patch.version ? patch.version : state.version + 1;
      return {
        ...state,
        ...patch,
        drivers: patch.drivers ? { ...state.drivers, ...patch.drivers } : state.drivers,
        playback: patch.playback ? { ...state.playback, ...patch.playback } : state.playback,
        layers: patch.layers ? { ...state.layers, ...patch.layers } : state.layers,
        camera: patch.camera ? { ...state.camera, ...patch.camera } : state.camera,
        display: patch.display ? { ...state.display, ...patch.display } : state.display,
        selection: patch.selection ? { ...state.selection, ...patch.selection } : state.selection,
        equity: patch.equity ? {
          ...state.equity,
          ...patch.equity,
          vulnerabilityWeights: patch.equity.vulnerabilityWeights
            ? { ...state.equity.vulnerabilityWeights, ...patch.equity.vulnerabilityWeights }
            : state.equity.vulnerabilityWeights
        } : state.equity,
        story: patch.story ? { ...state.story, ...patch.story } : state.story,
        actions: patch.actions ? { ...state.actions, ...patch.actions } : state.actions,
        version: nextVersion
      };
    });
  },

  // Granular helper actions
  setScenarioId: (scenarioId) => get().applyPatch({ scenarioId }),

  setDrivers: (driverPatch) => get().applyPatch({ drivers: driverPatch }),

  setPlayback: (playbackPatch) => get().applyPatch({ playback: playbackPatch }),

  togglePlay: () => {
    const current = get().playback.isPlaying;
    get().applyPatch({ playback: { isPlaying: !current } });
  },

  setLayers: (layerPatch) => get().applyPatch({ layers: layerPatch }),

  toggleLayer: (layerKey) => {
    const current = get().layers[layerKey];
    get().applyPatch({ layers: { [layerKey]: !current } });
  },

  setCamera: (cameraPatch) => get().applyPatch({ camera: cameraPatch }),

  setDisplay: (displayPatch) => get().applyPatch({ display: displayPatch }),

  setSelection: (selectionPatch) => get().applyPatch({ selection: selectionPatch }),

  setEquity: (equityPatch) => get().applyPatch({ equity: equityPatch }),

  setStory: (storyPatch) => get().applyPatch({ story: storyPatch }),

  // One-shot action trigger increments
  triggerPulseKelvinWave: () => {
    set((state) => ({
      actions: { ...state.actions, pulseKelvinWave: state.actions.pulseKelvinWave + 1 },
      version: state.version + 1
    }));
  },

  triggerWesterlyWindBurst: () => {
    set((state) => ({
      actions: { ...state.actions, westerlyWindBurst: state.actions.westerlyWindBurst + 1 },
      version: state.version + 1
    }));
  },

  triggerResetAll: () => {
    set((state) => ({
      ...INITIAL_CONTROL_STATE,
      actions: { ...INITIAL_CONTROL_STATE.actions, resetAll: state.actions.resetAll + 1 },
      version: state.version + 1
    }));
  }
}));
