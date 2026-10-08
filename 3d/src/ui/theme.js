/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared Design System Tokens for ENSO Simulation & Control View
export const theme = {
  colors: {
    bg: {
      base: '#020617', // slate-950
      surface: '#0f172a', // slate-900
      elevated: '#1e293b', // slate-800
      subtle: '#334155', // slate-700
      overlay: 'rgba(2, 6, 23, 0.85)'
    }, Q
    border: {
      subtle: '#1e293b',
      default: '#334155',
      focus: '#38bdf8', // sky-400
      highlight: '#0284c7'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
      inverse: '#020617'
    },
    phase: {
      elNino: {
        bg: 'rgba(136, 19, 55, 0.4)',
        border: '#be123c',
        text: '#fda4af',
        badge: 'bg-rose-950 text-rose-300 border-rose-700'
      },
      laNina: {
        bg: 'rgba(12, 74, 110, 0.4)',
        border: '#0369a1',
        text: '#7dd3fc',
        badge: 'bg-sky-950 text-sky-300 border-sky-700'
      },
      modoki: {
        bg: 'rgba(120, 53, 15, 0.4)',
        border: '#b45309',
        text: '#fcd34d',
        badge: 'bg-amber-950 text-amber-300 border-amber-700'
      },
      neutral: {
        bg: 'rgba(6, 78, 59, 0.4)',
        border: '#047857',
        text: '#6ee7b7',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-700'
      }
    },
    accent: {
      sky: '#38bdf8',
      amber: '#f59e0b',
      emerald: '#10b981',
      rose: '#f43f5e',
      indigo: '#6366f1'
    }
  },
  spacing: {
    touchTargetMin: '44px',
    cardPadding: '1rem',
    cardGap: '1rem'
  },
  radius: {
    card: '0.75rem',
    button: '0.5rem',
    pill: '9999px'
  }
};
