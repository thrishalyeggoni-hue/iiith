# IIITH Submission - Quantum Echo: The City That Never Was

**Project Name:** Quantum Echo: The City That Never Was  
**Author:** Thrishal Yeggoni ([@thrishalyeggoni-hue](https://github.com/thrishalyeggoni-hue))  
**Repository:** [https://github.com/thrishalyeggoni-hue/iiith](https://github.com/thrishalyeggoni-hue/iiith)  
**Organization:** International Institute of Information Technology, Hyderabad (IIITH)

---

## 🌌 Overview
Quantum Echo is an interactive 3D quantum computing exploration and educational game. Players traverse the floating city of Aster as Mira, solving authentic quantum gate puzzles across 8 distinct districts:
- **District 1 (Arrival Harbor):** Pauli-X Bit Flip Gates & Binary States
- **District 2 (Switchworks Terrace):** Hydraulic lift control & state inversion
- **District 3 (Harmonic Gardens):** Hadamard (H) Gate & Equal Superposition (|0⟩ → |+⟩)
- **District 4 (Observatory Spire):** Phase-Shift (Z) Gate & Relative Phase
- **District 5 (Resonance Chasm):** Quantum Phase Kickback & Interference
- **District 6 (Aether Docks):** Multi-stage gate sequence composition
- **District 7 (Measurement Station):** Wavefunction measurement collapse & quantum probability
- **District 8 (Echo Core Pinnacle):** The Final Application (H-Z-H sequence stabilization)

---

## 🎮 How to Run
### 1. Web Version (Instant in Browser)
Navigate to the `web/` folder and serve locally using any HTTP server:
```bash
cd web
python3 -m http.server 3000
# Or using Node.js:
# npx serve . -p 3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 2. Unity Project
Open the project directory in **Unity 2022.3 LTS** or newer.
- Main Scene: `Assets/Scenes/MainCity.unity`
- Core Scripts: `Assets/Scripts/Quantum/`, `Assets/Scripts/World/`, `Assets/Scripts/UI/`
