# 3D ENSO Climate Simulator & Equity Decision Engine

An interactive, scientifically-grounded 3D simulation and climate resilience decision engine demonstrating the physical chain of the El Niño-Southern Oscillation (ENSO) and its disparate socio-economic impacts on vulnerable communities across India and Southeast Asia.

---

## 1. Physical Phenomena Modeled

1. **Weakening Trade Winds**: Interactive atmospheric easterlies that relax, stall, and reverse in westerly wind bursts, modeled using instanced 3D velocity vectors and a vertical 3D Walker circulation cell.
2. **Warm Water Shift & Thermocline Tilt**: The eastward migration of the Indo-Pacific Warm Pool across the International Date Line, dynamic SST diverging color mapping, and the collapse of the 20°C equatorial subsurface isotherm tilt with eastward Kelvin wave pulses.
3. **La Niña Rebound & Teleconnections**: Delayed subsurface heat content recharge/discharge dynamics, equatorial cold tongue development, and regional rainfall swings (Southwest monsoon deficits in Central India vs. Northeast monsoon floods in Chennai; Maritime Continent drought vs. Pacific Peruvian cloudbursts).
4. **Equity & Counterfactual Decision Engine**: Multidimensional socioeconomic vulnerability weighting (poverty, crop dependence, irrigation deficit, housing fragility), Lorenz inequality curve, Gini metrics, and an optimal greedy resilience budget allocator.

---

## 2. Project Architecture

```
/
├── src/
│   ├── data/
│   │   ├── districts.json       # 13 communities with population and vulnerability stats
│   │   └── coastlines.json      # Simplified Pacific basin continental coastlines
│   ├── simulation/
│   │   ├── config.js            # Physical constants & ODE tuning coefficients
│   │   ├── enso.js              # Deterministic Recharge-Oscillator & Bjerknes model
│   │   ├── teleconnections.js   # Regional sensitivity coefficients & seasonal masks
│   │   ├── scenarios.js         # Canonical scenario presets (Normal, Super El Niño, La Niña)
│   │   ├── equity.js            # Vulnerability scoring, Lorenz curve, Monte Carlo test
│   │   ├── counterfactual.js    # Policy catalog (irrigation, drainage, insurance) & allocator
│   │   └── enso.test.js         # Comprehensive unit verification suite
│   ├── store/
│   │   └── useSimStore.js       # Central Zustand state store & reactive actions
│   ├── components/
│   │   ├── Scene.jsx            # Three.js / R3F Canvas and lighting assembly
│   │   ├── Ocean.jsx            # 128x64 displaced ocean mesh with custom SST shader
│   │   ├── Thermocline.jsx      # Subsurface 20°C isotherm tilt sheet & Kelvin waves
│   │   ├── WindField.jsx        # Instanced equatorial wind vectors & 3D Walker loop
│   │   ├── WarmPool.jsx         # Migrating thermal warm pool indicator
│   │   ├── RainField.jsx        # Convective cloud billows and falling rain shafts
│   │   ├── Coastlines.jsx       # Projected continental boundary lines
│   │   ├── DistrictColumns.jsx  # 3D interactive rainfall anomaly columns & HTML tags
│   │   └── CameraRig.jsx        # Smooth lerped perspective transitions (5 presets)
│   ├── ui/
│   │   ├── ENSOReadout.jsx      # Top live diagnostics and 5-step physical chain
│   │   ├── Timeline.jsx         # 36-month playback scrubber with Niño 3.4 sparkline
│   │   ├── Sidebar.jsx          # Collapsible multi-tab control & policy drawer
│   │   ├── ScenarioBar.jsx      # Scenario selector & 6-step guided climate tour
│   │   ├── ControlPanel.jsx     # Manual sliders, layer toggles, low-graphics switch
│   │   ├── EquityPanel.jsx      # Weights sliders, Lorenz curve, budget allocator, MC test
│   │   ├── DistrictPanel.jsx    # Selected community 12-month profile & teleconnection info
│   │   ├── DistrictListTab.jsx  # Regional communities overview list
│   │   ├── Legend.jsx           # Color legend & camera shortcut buttons
│   │   └── Footer.jsx           # Scientific disclaimers and data limitations modal
│   ├── App.tsx                  # Top-level viewport layout and keyboard bindings
│   └── main.tsx                 # React DOM mount point
```

---

## 3. How to Run and Test

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 4. Keyboard Shortcuts

- `Space`: Play / Pause 36-month simulation loop
- `1`: Camera Preset 1 — Pacific Overview
- `2`: Camera Preset 2 — Walker Circulation Side-View
- `3`: Camera Preset 3 — Thermocline Subsurface Tilt
- `4`: Camera Preset 4 — India Regional Focus
- `5`: Camera Preset 5 — Southeast Asia Regional Focus
- `R`: Reset simulation to climatological neutral

---

## 5. Where the Rules Live & How to Modify Them

- **Coupled Physical Equations**: In `src/simulation/enso.js`, the coupled ODE system:
  $$\frac{d(\text{Niño3.4})}{dt} = a \cdot \text{windForcing} + b \cdot \text{heatContent} + c \cdot \text{Niño3.4} - d \cdot (\text{Niño3.4})^3$$
  $$\frac{d(\text{heatContent})}{dt} = -e \cdot \text{Niño3.4} - f \cdot \text{heatContent}$$
- **Numerical Constants**: All parameter weights ($a, b, c, d, e, f$, lag times, and baseline values) live in `src/simulation/config.js` with documentation comments.
- **Adding a Community**: Add an entry into `src/data/districts.json` and provide corresponding teleconnection response rules in `src/simulation/teleconnections.js`.
- **Swapping with Real Observational Data**:
  - Replace the synthetic `step()` state with NOAA Oceanic Niño Index (ONI) monthly records.
  - In `teleconnections.js`, replace stylized coefficients with gridded precipitation anomalies from CHIRPS or IMD High-Resolution Gridded Daily Rainfall datasets.

---

## 6. 3-Minute Demo Script

1. **0:00 - 0:45 (The Physical Chain)**:
   - Start in Neutral mode. Show steady westward trade winds and deep warm pool in the West Pacific.
   - Switch to **Weakening Trade Winds** scenario or press "Trigger Westerly Wind Burst".
   - Notice the trade winds stall, the downwelling Kelvin wave depression moving east along the thermocline sheet, and the warm pool sliding east across the date line.
2. **0:45 - 1:45 (Disparate Regional Impacts)**:
   - Switch to **Super El Niño** scenario.
   - Press Key `4` (India Focus): observe the severe rainfall deficit columns in Mumbai and Delhi as the Walker cell ascent moves away.
   - Select **Chennai**: note the contrasting surplus column (+22%) driven by the Northeast Monsoon mechanism.
   - Press Key `5` (SE Asia Focus): observe severe drought flags in Jakarta, Bangkok, and Manila.
3. **1:45 - 3:00 (Equity Decision Engine & Counterfactual Action)**:
   - Open the **Equity & Policy** tab.
   - Show the Lorenz Curve and the 2.4x equity gap ratio: vulnerable populations bear disproportionate harm.
   - Select **Micro-Irrigation & Farm Ponds** and adjust the funding slider to ₹500 Million.
   - Toggle **After Action** in the 3D scene: watch the column heights shrink in prioritized communities as losses are averted.
   - Click **Run Test** to execute the 200x Monte Carlo perturbation test, proving recommendation stability under forecast uncertainty.
