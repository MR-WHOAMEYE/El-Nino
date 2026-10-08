/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { createSyncChannel } from './channel.js';
import { MESSAGE_TYPES, validateMessage, persistControlState, loadPersistedControlState } from './protocol.js';
import { useSimStore } from '../store/useSimStore.js';
import { useControlStore } from '../store/controlStore.js';

export function useSyncMain() {
  const channelRef = useRef(null);
  const pendingPatchRef = useRef({});
  const lastLiveStateRef = useRef(null);
  const lastPhaseRef = useRef('neutral');
  const processedActionsRef = useRef(new Set());


  useEffect(() => {
    const channel = createSyncChannel();
    channelRef.current = channel;

    // 1. Restore persisted control state on startup
    const persisted = loadPersistedControlState();
    if (persisted) {
      useSimStore.getState().applyControlState(persisted);
      useControlStore.getState().applyPatch(persisted, true);
    }

    // 2. Announce presence to any controller
    channel.send({
      type: MESSAGE_TYPES.HELLO,
      role: 'main'
    });

    // 3. Message dispatcher
    const unsubscribe = channel.subscribe((msg) => {
      if (!validateMessage(msg)) return;

      switch (msg.type) {
        case MESSAGE_TYPES.HELLO:
        case MESSAGE_TYPES.REQUEST_FULL: {
          // Reply with immediate live state snapshot
          const snapshot = useSimStore.getState().getLiveSnapshot();
          channel.send({
            type: MESSAGE_TYPES.LIVE_UPDATE,
            liveState: snapshot
          });
          break;
        }

        case MESSAGE_TYPES.PING: {
          channel.send({
            type: MESSAGE_TYPES.PONG,
            seq: msg.seq
          });
          break;
        }

        case MESSAGE_TYPES.CONTROL_PATCH:
        case MESSAGE_TYPES.CONTROL_FULL: {
          if (msg.patch || msg.controlState) {
            const patch = msg.patch || msg.controlState;
            // Coalesce patches and apply to sim engine
            useSimStore.getState().applyControlState(patch);
            useControlStore.getState().applyPatch(patch, true);
            persistControlState(useControlStore.getState());

            // Reply with updated live metrics immediately
            const liveSnapshot = useSimStore.getState().getLiveSnapshot();
            channel.send({
              type: MESSAGE_TYPES.LIVE_UPDATE,
              liveState: liveSnapshot
            });
          }
          break;
        }

        case MESSAGE_TYPES.ACTION: {
          const action = msg.action;
          const payload = msg.payload || {};
          const actionKey = `${msg.sessionId}_${msg.action}_${msg.timestamp || msg.seq || ''}`;

          // Idempotency check: ignore duplicate deliveries within 1.5 seconds
          if (processedActionsRef.current.has(actionKey)) {
            break;
          }
          processedActionsRef.current.add(actionKey);
          setTimeout(() => processedActionsRef.current.delete(actionKey), 3000);

          if (action === 'pulseKelvinWave') {
            useSimStore.getState().triggerWesterlyBurst();
          } else if (action === 'westerlyWindBurst') {
            useSimStore.getState().triggerWesterlyBurst();
          } else if (action === 'resetAll') {
            useSimStore.getState().resetSim();
            useControlStore.getState().applyPatch(useControlStore.getState(), true);
          } else if (action === 'recenterCamera') {
            const currentPreset = useSimStore.getState().cameraPreset;
            useSimStore.getState().setCameraPreset(currentPreset || 'overview');
          } else if (action === 'flyToRegion') {
            if (payload.regionId) {
              useSimStore.getState().setSelectedRegion(payload.regionId);
            }
          } else if (action === 'toggleFullscreen') {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen?.().catch(() => {});
            } else {
              document.exitFullscreen?.().catch(() => {});
            }
          }
          break;
        }

        default:
          break;
      }
    });

    // 4. Send live updates at 10 Hz (every 100ms)
    let lastSent = 0;
    const intervalId = setInterval(() => {
      const liveSnapshot = useSimStore.getState().getLiveSnapshot();
      const currentPhase = liveSnapshot.phase;
      const phaseChanged = currentPhase !== lastPhaseRef.current;
      lastPhaseRef.current = currentPhase;

      const now = performance.now();
      // Send at 10 Hz or immediately on phase change
      if (now - lastSent >= 95 || phaseChanged) {
        lastSent = now;
        channel.send({
          type: MESSAGE_TYPES.LIVE_UPDATE,
          liveState: liveSnapshot
        });
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      unsubscribe();
      channel.close();
    };
  }, []);
}
