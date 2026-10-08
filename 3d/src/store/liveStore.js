/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export const INITIAL_LIVE_STATE = {
  nino34: 0.0,
  phase: 'neutral', // 'neutral' | 'el_nino' | 'la_nina' | 'modoki'
  heatContent: 0.05,
  warmPoolX: 0.2,
  thermoclineSlope: 1.0,
  currentMonthLabel: 'Year 1, Jan',
  seasonLabel: 'Dry / Inter-monsoon',
  regionAnomalies: {},
  topAtRisk: [],
  recommendationStability: 88,
  equityGapIndex: 0.32,
  fps: 60,
  particleCount: 1420,
  drawCalls: 18,
  mainConnected: false,
  lastUpdateTimestamp: Date.now()
};

export const useLiveStore = create((set, get) => ({
  ...INITIAL_LIVE_STATE,

  // Set batch live updates from simulation engine on MainView
  setLiveState: (livePatch) => {
    set((state) => ({
      ...state,
      ...livePatch,
      lastUpdateTimestamp: Date.now()
    }));
  },

  setMainConnected: (connected) => set({ mainConnected: connected })
}));
