/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { createSyncChannel } from './channel.js';
import { MESSAGE_TYPES, validateMessage, persistControlState, loadPersistedControlState } from './protocol.js';
import { useControlStore } from '../store/controlStore.js';
import { useLiveStore } from '../store/liveStore.js';

export function useSyncControl() {
  const channelRef = useRef(null);
  const missedPongsRef = useRef(0);
  const lastSentPatchRef = useRef(null);
  const pendingPatchTimeoutRef = useRef(null);

  useEffect(() => {
    const channel = createSyncChannel();
    channelRef.current = channel;

    // 1. Restore local persisted control state if available
    const persisted = loadPersistedControlState();
    if (persisted) {
      useControlStore.getState().applyPatch(persisted, true);
    }

    // 2. Greet and request full state from Main
    channel.send({
      type: MESSAGE_TYPES.HELLO,
      role: 'control'
    });

    channel.send({
      type: MESSAGE_TYPES.REQUEST_FULL
    });

    // Also send current control state in case Main is already running and waiting
    channel.send({
      type: MESSAGE_TYPES.CONTROL_FULL,
      controlState: useControlStore.getState()
    });

    // 3. Subscribe to messages from Main
    const unsubscribeChannel = channel.subscribe((msg) => {
      if (!validateMessage(msg)) return;

      switch (msg.type) {
        case MESSAGE_TYPES.HELLO: {
          // If Main announced itself, send full control state so it syncs immediately
          if (msg.role === 'main') {
            useLiveStore.getState().setMainConnected(true);
            missedPongsRef.current = 0;
            channel.send({
              type: MESSAGE_TYPES.CONTROL_FULL,
              controlState: useControlStore.getState()
            });
          }
          break;
        }

        case MESSAGE_TYPES.LIVE_UPDATE: {
          if (msg.liveState) {
            useLiveStore.getState().setLiveState(msg.liveState);
            useLiveStore.getState().setMainConnected(true);
            missedPongsRef.current = 0;
          }
          break;
        }

        case MESSAGE_TYPES.PONG: {
          useLiveStore.getState().setMainConnected(true);
          missedPongsRef.current = 0;
          break;
        }

        default:
          break;
      }
    });

    // 4. Subscribe to control store mutations and transmit patches
    const unsubscribeStore = useControlStore.subscribe((state) => {
      persistControlState(state);

      // Debounce high-frequency slider streams to ~30 Hz (33ms)
      if (pendingPatchTimeoutRef.current) {
        clearTimeout(pendingPatchTimeoutRef.current);
      }

      pendingPatchTimeoutRef.current = setTimeout(() => {
        channel.send({
          type: MESSAGE_TYPES.CONTROL_PATCH,
          patch: state,
          version: state.version
        });
      }, 30);
    });

    // 5. Heartbeat ping every 2 seconds
    const pingIntervalId = setInterval(() => {
      missedPongsRef.current += 1;
      if (missedPongsRef.current >= 3) {
        useLiveStore.getState().setMainConnected(false);
      }
      channel.send({
        type: MESSAGE_TYPES.PING,
        seq: Date.now()
      });
    }, 2000);

    return () => {
      clearInterval(pingIntervalId);
      if (pendingPatchTimeoutRef.current) clearTimeout(pendingPatchTimeoutRef.current);
      unsubscribeStore();
      unsubscribeChannel();
      channel.close();
    };
  }, []);

  // Dispatch named one-shot action
  const sendAction = (action, payload = {}) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: MESSAGE_TYPES.ACTION,
        action,
        payload
      });
    }
  };

  return { sendAction };
}
