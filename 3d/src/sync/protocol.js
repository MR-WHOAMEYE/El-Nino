/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const MESSAGE_TYPES = {
  HELLO: 'hello',
  CONTROL_PATCH: 'control/patch',
  CONTROL_FULL: 'control/full',
  LIVE_UPDATE: 'live/update',
  ACTION: 'action',
  REQUEST_FULL: 'request/full',
  PING: 'ping',
  PONG: 'pong'
};

export const LOCAL_STORAGE_CONTROL_KEY = 'enso-control-v1';

export function validateMessage(msg) {
  if (!msg || typeof msg !== 'object') return false;
  if (!msg.type || typeof msg.type !== 'string') return false;
  return Object.values(MESSAGE_TYPES).includes(msg.type);
}

// Persist CONTROL STATE to localStorage
export function persistControlState(controlState) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const payload = {
      version: controlState.version || 1,
      scenarioId: controlState.scenarioId,
      drivers: controlState.drivers,
      playback: { ...controlState.playback, isPlaying: false }, // default paused on fresh reload
      layers: controlState.layers,
      camera: controlState.camera,
      display: controlState.display,
      selection: controlState.selection,
      equity: controlState.equity,
      story: controlState.story,
      actions: controlState.actions
    };
    localStorage.setItem(LOCAL_STORAGE_CONTROL_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore storage quota errors
  }
}

// Read persisted CONTROL STATE
export function loadPersistedControlState() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CONTROL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
