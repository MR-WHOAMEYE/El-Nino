import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Timeline() {
  const isPlaying = useSimStore((state) => state.isPlaying);
  const togglePlay = useSimStore((state) => state.togglePlay);
  const playbackSpeed = useSimStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useSimStore((state) => state.setPlaybackSpeed);
  const resetSim = useSimStore((state) => state.resetSim);
  const month = useSimStore((state) => state.month);
  const year = useSimStore((state) => state.year);
  const elapsedMonths = useSimStore((state) => state.elapsedMonths);
  const seekMonth = useSimStore((state) => state.seekMonth);
  const history = useSimStore((state) => state.history);

  const currentMonthName = MONTH_NAMES[month];

  // Monsoon season indicators
  let seasonTag = 'Dry / Inter-monsoon';
  if (month >= 5 && month <= 8) {
    seasonTag = 'Southwest Monsoon (JJAS)';
  } else if (month >= 9 && month <= 11) {
    seasonTag = 'Northeast Monsoon (OND)';
  } else if (month >= 2 && month <= 4) {
    seasonTag = 'Pre-Monsoon Summer';
  }

  // Pure SVG Sparkline points calculation
  const sparklinePoints = React.useMemo(() => {
    if (!history || history.length === 0) return '';
    const width = 180;
    const height = 32;
    const padding = 2;
    const minVal = -2.5;
    const maxVal = 2.5;
    const range = maxVal - minVal;

    return history.map((item, idx) => {
      const x = padding + (idx / Math.max(1, history.length - 1)) * (width - padding * 2);
      const val = Math.max(minVal, Math.min(maxVal, item.nino34 || 0));
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [history]);

  return (
    <div className="bg-slate-900/95 backdrop-blur border-t border-slate-800 p-3 select-none flex flex-col md:flex-row items-center gap-4 text-xs">
      {/* Playback Controls */}
      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-lg font-semibold flex items-center justify-center transition-colors shadow-sm ${
            isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
          title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <button
          onClick={resetSim}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset Simulation (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
          {[0.5, 1.0, 2.0].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-1 rounded transition-colors ${
                playbackSpeed === spd
                  ? 'bg-slate-800 text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Date & Season Indicator */}
      <div className="flex items-center space-x-2 shrink-0 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-mono font-bold text-slate-200">
          Year {year}, {currentMonthName}
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-[11px] text-sky-300 font-medium">{seasonTag}</span>
      </div>

      {/* 36-Month Scrubber Slider */}
      <div className="flex-1 w-full flex items-center space-x-3">
        <span className="text-[10px] font-mono text-slate-500">M0</span>
        <input
          type="range"
          min="0"
          max="36"
          step="0.2"
          value={elapsedMonths % 36}
          onChange={(e) => seekMonth(parseFloat(e.target.value))}
          className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <span className="text-[10px] font-mono text-slate-500">M36</span>
      </div>

      {/* Mini Pure SVG Sparkline Chart for Nino 3.4 */}
      <div className="hidden lg:flex flex-col justify-center w-48 h-10 shrink-0 bg-slate-950/80 rounded border border-slate-800/80 px-2 py-1">
        <svg viewBox="0 0 180 32" className="w-full h-full overflow-visible">
          {/* Zero line */}
          <line x1="0" y1="16" x2="180" y2="16" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
          {/* +0.5 threshold */}
          <line x1="0" y1="12.8" x2="180" y2="12.8" stroke="#f43f5e" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />
          {/* -0.5 threshold */}
          <line x1="0" y1="19.2" x2="180" y2="19.2" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />
          {/* Sparkline */}
          {sparklinePoints && (
            <polyline
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklinePoints}
            />
          )}
        </svg>
      </div>
    </div>
  );
}

