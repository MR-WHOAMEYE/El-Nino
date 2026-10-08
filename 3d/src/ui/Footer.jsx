import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { Info, Keyboard, ShieldAlert, X } from 'lucide-react';

export default function Footer() {
  const showDataLimitationsModal = useSimStore((state) => state.showDataLimitationsModal);
  const setShowDataLimitationsModal = useSimStore((state) => state.setShowDataLimitationsModal);

  return (
    <>
      <footer className="bg-slate-950/90 border-t border-slate-900 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 select-none gap-2">
        <div className="flex items-center space-x-2">
          <span>Simplified educational model. Not an operational forecast tool. Teleconnection coefficients and district indicators are illustrative samples.</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Keyboard Shortcuts Hint */}
          <div className="hidden md:flex items-center space-x-1.5 text-slate-400">
            <Keyboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Space: Play/Pause</span>
            <span>•</span>
            <span>Keys 1-5: Cameras</span>
            <span>•</span>
            <span>R: Reset</span>
          </div>

          <button
            onClick={() => setShowDataLimitationsModal(true)}
            className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Data & Limitations</span>
          </button>
        </div>
      </footer>

      {/* Data & Limitations Modal */}
      {showDataLimitationsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 text-xs text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">Model Assumptions, Data Sources & Limitations</h3>
              </div>
              <button
                onClick={() => setShowDataLimitationsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed">
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">1. 2-DOF Recharge-Oscillator Simplification:</h4>
                <p className="text-slate-400">
                  The ocean-atmosphere physics in this simulator implements a 2-degree-of-freedom conceptual model based on Jin (1997) and Zebiak-Cane. It integrates the positive Bjerknes feedback with western Pacific subsurface heat discharge and seasonal phase-locking to reproduce realistic multi-year ENSO cycles. It is designed for interactive conceptual learning, not dynamical numerical weather prediction.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-200 mb-1">2. Illustrative Regional Teleconnections:</h4>
                <p className="text-slate-400">
                  The rainfall and temperature sensitivities for South and Southeast Asia represent stylized empirical teleconnection signals. Real regional monsoons are simultaneously influenced by the Indian Ocean Dipole (IOD), Madden-Julian Oscillation (MJO), Eurasian snow cover, and greenhouse warming. In real operations, decision-makers should consult the India Meteorological Department (IMD), BMKG (Indonesia), PAGASA (Philippines), and NOAA Climate Prediction Center.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-200 mb-1">3. Socioeconomic Equity Indicators:</h4>
                <p className="text-slate-400">
                  District socioeconomic metrics (poverty rate, irrigation coverage, crop dependence, and housing fragility) are representative sample indicators demonstrating how uniform physical climate anomalies translate into highly unequal human harms across diverse income groups.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDataLimitationsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors"
              >
                Close & Return to Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
