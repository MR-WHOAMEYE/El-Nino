/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CHANNEL_NAME = 'enso-sim-v1';
const STORAGE_EVENT_KEY = '__enso_sync_bridge__';

// Generate unique session ID for echo cancellation
export const SESSION_ID = 'sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

export function createSyncChannel() {
  const hasBroadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window;
  let broadcastChannel = null;

  if (hasBroadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      broadcastChannel = null;
    }
  }

  const subscribers = new Set();
  let ws = null;
  let isClosed = false;
  let reconnectTimer = null;

  const handleMessage = (data) => {
    if (!data || typeof data !== 'object') return;
    // Echo protection: ignore own messages
    if (data.sessionId === SESSION_ID) return;

    subscribers.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error('[SyncChannel] Handler error:', err);
      }
    });
  };

  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      handleMessage(event.data);
    };
  }

  // LocalStorage storage-event fallback for older browsers on same device
  const handleStorageEvent = (event) => {
    if (event.key === STORAGE_EVENT_KEY && event.newValue) {
      try {
        const payload = JSON.parse(event.newValue);
        handleMessage(payload);
      } catch (e) {
        // ignore parse errors
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageEvent);
  }

  // WebSocket connection for Remote Devices (Mobile, Tablet, LAN)
  function connectWebSocket() {
    if (isClosed || typeof window === 'undefined') return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/enso-relay`;

      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (err) {
          // ignore unparseable messages
        }
      };

      ws.onclose = () => {
        if (!isClosed) {
          reconnectTimer = setTimeout(connectWebSocket, 2000);
        }
      };

      ws.onerror = () => {
        // Handled in onclose
      };
    } catch (err) {
      if (!isClosed) {
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      }
    }
  }

  connectWebSocket();

  return {
    send: (message) => {
      const envelope = {
        ...message,
        sessionId: SESSION_ID,
        timestamp: Date.now()
      };

      // 1. BroadcastChannel (fastest same-machine cross-tab)
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage(envelope);
        } catch (e) {
          // fallback
        }
      }

      // 2. WebSocket Relay (remote devices / mobile phones over Wi-Fi)
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(envelope));
        } catch (e) {
          // fallback
        }
      }

      // 3. Storage event fallback for cross-tab notifications
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(STORAGE_EVENT_KEY, JSON.stringify(envelope));
          setTimeout(() => {
            if (localStorage.getItem(STORAGE_EVENT_KEY)) {
              localStorage.removeItem(STORAGE_EVENT_KEY);
            }
          }, 50);
        } catch (e) {
          // ignore quota or disabled errors
        }
      }
    },

    subscribe: (handler) => {
      subscribers.add(handler);
      return () => {
        subscribers.delete(handler);
      };
    },

    close: () => {
      isClosed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      subscribers.clear();
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      if (ws) {
        try {
          ws.close();
        } catch (e) {}
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageEvent);
      }
    }
  };
}

