import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { SCENARIO_PRESETS } from '../simulation/scenarios.js';
import { Compass, BookOpen, Play, ChevronLeft, ChevronRight, Wind, Waves } from 'lucide-react';

const STORY_STEPS = [
  {
    title: '1. Climatological Baseline: The Pacific Engine',
    desc: 'Under neutral conditions, trade winds pile warm water into the Western Pacific Warm Pool while strong upwelling cools the eastern basin off Peru.',
    presetId: 'normal',
    camera: 'overview'
  },
  {
    title: '2. Phenomenon 1: Weakening Trade Winds',
    desc: 'The equatorial easterly trade winds relax. Westerly wind bursts pulse across the date line, triggering downwelling Kelvin waves that travel east.',
    presetId: 'weakening_winds',
    camera: 'walker'
  },
  {
    title: '3. Phenomenon 2: Warm Water Shift & Thermocline Tilt',
    desc: 'Deep warm water surges eastward. The thermocline slope collapses from steep tilt to nearly horizontal, choking nutrient-rich upwelling.',
    presetId: 'warm_water_shift',
    camera: 'crossSection'
  },
  {
    title: '4. Regional Impact: The Southwest Monsoon Deficit',
    desc: 'With atmospheric ascent shifted east, sinking air over the Indian subcontinent suppresses southwest monsoon rain clouds across Mumbai, Delhi, and Kolkata.',
    presetId: 'strong_el_nino',
    camera: 'indiaFocus'
  },
  {
    title: '5. Regional Impact: Southeast Asian Drought & Heat',
    desc: 'In Indonesia, the Philippines, and Thailand, rain belts vanish. Severe dry-season drought risks ignite forest fires and deplete reservoirs.',
    presetId: 'strong_el_nino',
    camera: 'southeastAsiaFocus'
  },
  {
    title: '6. Phenomenon 3: La Niña Rebound & Floods',
    desc: 'Upper-ocean heat exhausts. Intense cold upwelling establishes the Pacific Cold Tongue. Monsoons swing to devastating excess rainfall across SE Asia and Chennai.',
    presetId: 'strong_la_nina',
    camera: 'overview'
  }
];

export default function ScenarioBar() {
  const activeScenarioId = useSimStore((state) => state.activeScenarioId);
  const loadScenario = useSimStore((state) => state.loadScenario);
  const triggerWesterlyBurst = useSimStore((state) => state.triggerWesterlyBurst);
  const storyStep = useSimStore((state) => state.storyStep);
  const setStoryStep = useSimStore((state) => state.setStoryStep);
  const activeTab = useSimStore((state) => state.activeTab);
  const setActiveTab = useSimStore((state) => state.setActiveTab);

  const activeStory = STORY_STEPS[storyStep];

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Guided Story Mode Stepper */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Guided 6-Step Climate Tour</span>
          </span>
          <span className="text-[10px] text-sky-400 font-mono">Step {storyStep + 1} of 6</span>
        </div>

        <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1.5">
          <h4 className="font-bold text-slate-100 text-[11px] text-sky-300">{activeStory.title}</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">{activeStory.desc}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setStoryStep(Math.max(0, storyStep - 1))}
            disabled={storyStep === 0}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 border border-slate-800"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => setStoryStep(Math.min(5, storyStep + 1))}
            disabled={storyStep === 5}
            className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 shadow-sm font-semibold"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Manual Westerly Wind Burst Trigger */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Wind className="w-3.5 h-3.5 text-amber-400" />
            <span>Trigger Westerly Wind Burst</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Injects a localized westerly wind anomaly in the western Pacific to initiate an eastward-traveling downwelling Kelvin wave.
        </p>
        <button
          onClick={triggerWesterlyBurst}
          className="w-full py-1.5 px-3 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-300 font-semibold text-[11px] flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
        >
          <Waves className="w-3.5 h-3.5 text-amber-400" />
          <span>Launch Kelvin Wave Pulse</span>
        </button>
      </div>

      {/* Canonical Scenarios List */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-slate-200 font-semibold mb-1">
          <span className="flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canonical Climate Scenarios</span>
          </span>
        </div>

        <div className="space-y-1.5">
          {SCENARIO_PRESETS.map((p) => {
            const isSelected = activeScenarioId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadScenario(p.id)}
                className={`w-full text-left p-2 rounded transition-all border ${
                  isSelected
                    ? 'bg-sky-950/90 border-sky-600/80 ring-1 ring-sky-500/30'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="font-semibold text-[11px] text-slate-100 mb-0.5">{p.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{p.description}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
