# QUANTUM ECHO: THE CITY THAT FORGOT

> A third-person story adventure in Unity that teaches the core principles of quantum computing through physical gameplay, environmental restoration, and rigorous state-vector simulation.

---

## 1. STORY & LEARNING PREMISE

The floating city of **Aster** runs on a quantum energy network called the **Echo Core**. A maintenance intelligence named **The Auditor** attempted to make the city perfectly predictable. To achieve this, it activated measurement devices across the entire network—collapsing coherent states into classical bits, cutting power to districts, and erasing information from the city archives.

The player is **Mira**, a young engineer returning to Aster to find her missing mentor, **Dr. Ishan**. Assisted by a damaged guide drone named **Lumi**, Mira carries an **Echo Lantern** containing a pure single-qubit quantum state. By manipulating the qubit through unitary gates, matching physical resonances, and discovering why measurement behaves fundamentally differently from reversible operations, Mira repairs Aster's infrastructure and reaches the Echo Core.

### Core Pedagogical Lesson
- **Reversible Unitary Evolution:** Any gate sequence $(G_1 G_2 \dots G_n)$ can be deterministically undone when its history is known by applying inverses in reverse order: $(G_1 G_2 \dots G_n)^{-1} = G_n^{-1} \dots G_2^{-1} G_1^{-1}$.
- **Irreversible Measurement:** Measurement forces state collapse according to the Born Rule ($P = |\text{amplitude}|^2$). An arbitrary unknown pre-measurement state cannot be recovered from the single measurement outcome alone.
- **The Story Resolution:** Mira cannot magically "reverse" the Auditor's measurements; instead, she stabilizes the surviving infrastructure and reconstructs the city from Dr. Ishan's protected preparation instructions.

---

## 2. THE EIGHT DISTRICTS & CHAPTER PROGRESSION

| Chapter | District | Primary Concept | Core Mechanic / Puzzle |
|---|---|---|---|
| **1** | **Arrival Harbor** | Basis States $\|0\rangle$ and $\|1\rangle$ | Calibrate Terminal Alpha ($\|0\rangle$) and Beta ($\|1\rangle$) via fresh preparation. |
| **2** | **Switchworks** | Pauli-X Gate | Apply $X$ bit-flip ($X\|0\rangle = \|1\rangle$); demonstrate self-inversion ($X^2 = I$). |
| **3** | **Twin-Light Garden** | Superposition & Hadamard $H$ | Create equal superposition $\|+\rangle = \frac{\|0\rangle + \|1\rangle}{\sqrt{2}}$; power Coherence Relay; test $H^2 = I$. |
| **4** | **Phase Observatory** | Pauli-Z Gate & Relative Phase | Compare $\|+\rangle$ and $\|-\rangle$ (same 50/50 probabilities, different phase); synthesize bit-flip via $H \to Z \to H$. |
| **5** | **Echo Bridge** | Gate Order (Non-Commutativity) | Compare $X \to H \implies \|-\rangle$ versus $H \to X \implies \|+\rangle$; lock bridge relays. |
| **6** | **The Reversal Vault** | Unitary Inverses | Invert forward cipher $(H \to Z \to X)$ by executing $(X \to Z \to H)$ or "Apply Last Inverse". |
| **7** | **Measurement Station** | Limits of Reversal & Born Rule | Observe collapse; verify undo is blocked across measurement; run statistical trial lab (10 to 1,000 runs). |
| **8** | **The Echo Core** | Master Synthesis | 6-stage core calibration applying all learned concepts to stabilize Aster. |

---

## 3. CONTROLS

- **W / A / S / D:** Move Mira (camera-relative movement).
- **Mouse:** Orbit camera (smooth damping, collision avoidance).
- **Left Shift:** Sprint.
- **E:** Interact with consoles, terminals, coherence relays, and checkpoints.
- **R:** Reset active puzzle to its initial state.
- **Z / Q:** Apply Last Inverse (applies mathematical inverse of last unitary gate).
- **J:** Open Aster Codex / Journal (in-depth quantum explanations).
- **Escape:** Pause menu / Close current console.

---

## 4. MATHEMATICAL VERIFICATION RESULTS

The quantum engine includes an automated verification suite ([`tests/verify_quantum_math.py`](file:///Users/thrishalyeggoni/quantum/tests/verify_quantum_math.py) and [`Assets/Scripts/Tests/QuantumMathTests.cs`](file:///Users/thrishalyeggoni/quantum/Assets/Scripts/Tests/QuantumMathTests.cs)). All 14 tests pass with 100% precision:

1. **$X^2 = I$:** Applying $X$ twice returns the initial state (Fidelity = 1.000000).
2. **$Z^2 = I$:** Applying $Z$ twice returns the initial state (Fidelity = 1.000000).
3. **$H^2 = I$:** Applying $H$ twice returns the initial state (Fidelity = 1.000000).
4. **$H\|0\rangle = \|+\rangle$:** Yields equal probabilities ($P_0 = 50\%$, $P_1 = 50\%$) and zero relative phase.
5. **$H\|1\rangle = \|-\rangle$:** Yields equal probabilities ($P_0 = 50\%$, $P_1 = 50\%$) and $\pi$ ($180^\circ$) relative phase.
6. **$H Z H \|0\rangle = \|1\rangle$:** Demonstrates phase-to-basis conversion through constructive/destructive interference.
7. **$XH \ne HX$:** Starting at $\|0\rangle$, $X$ then $H$ yields $\|-\rangle$, whereas $H$ then $X$ yields $\|+\rangle$ (inner product fidelity = 0.000000, orthogonal).
8. **Inverse Sequence:** $(H Z X)^{-1} = X Z H$ perfectly restores the initial state vector.
9. **Unit Norm Preservation:** $|\alpha|^2 + |\beta|^2 = 1.00000000$ across long random unitary gate sequences.
10. **Global Phase Invariance:** Pure states differing by $e^{i\gamma}$ evaluate to Fidelity = 1.00000000.
11. **Measurement Collapse:** Born rule projection collapses superposition to a definite computational basis state ($\|0\rangle$ or $\|1\rangle$) and flags history to block inverse operations.
12. **Born Rule Convergence:** Multi-shot fresh preparation trials converge to theoretical Born probabilities.
13. **Bloch Sphere Coordinates:** Pure states correspond to unit sphere coordinates ($\|0\rangle: +Z$, $\|1\rangle: -Z$, $\|+\rangle: +X$, $\|-\rangle: -X$, $\|+i\rangle: +Y$).
14. **Hadamard Rotation Geometry:** Proved that Hadamard is a $180^\circ$ rotation around the diagonal $(X+Z)/\sqrt{2}$ axis on the Bloch sphere, *not* a generic $90^\circ$ rotation.

---

## 5. RUN & BUILD INSTRUCTIONS

### Option A: Windows Automated Script (PowerShell)
On your Windows PC, open PowerShell in the project directory and run:
```powershell
.\build_and_run_windows.ps1
```
This script will:
1. Locate your installed Unity Editor executable automatically.
2. Run the idempotent setup command (`QuantumEcho.Editor.EditorProjectSetup.SetupProject`) to generate scenes and assign references.
3. Build the Windows standalone x64 executable to `Builds\Windows\QuantumEcho.exe`.
4. Launch the game.

### Option B: Unity Editor (Play Mode)
1. Open the project folder (`quantum/`) in Unity Hub using Unity 2022.3 LTS or compatible.
2. In the top menu bar, select:
   **Quantum Echo ➔ Setup Project and Scenes**
3. Open `Assets/Scenes/MainCity.unity` and click **Play**.

### Option C: Standalone Math Test Runner (Any OS)
To verify the quantum simulation algorithms without opening Unity:
```bash
./run_math_tests.sh
# or
python3 tests/verify_quantum_math.py
```

---

## 6. ARCHITECTURE & CODE RESPONSIBILITIES

```
Assets/Scripts/
├── Quantum/
│   ├── ComplexNumber.cs      # Double-precision complex arithmetic (add, mul, div, polar, conjugate)
│   ├── QuantumGate.cs        # 2x2 Unitary matrices (X, Z, H, Y, S, T), inverses, and composition
│   ├── QuantumState.cs       # State vector |ψ⟩ = α|0⟩ + β|1⟩, Born probabilities, phase, fidelity
│   ├── QuantumSimulator.cs   # Deterministic single-qubit simulator, Born measurement, batch trials
│   ├── GateHistory.cs        # Chronological timeline, inverse sequence generator, collapse boundary
│   └── BlochSphereMath.cs    # Rodrigues rotation, geodesic trajectories, coordinate projection
├── Gameplay/
│   ├── Player/
│   │   ├── ThirdPersonController.cs # Movement, camera-relative motion, fall recovery, procedural walking
│   │   ├── ThirdPersonCamera.cs     # Smooth orbit camera with sphere-cast wall collision
│   │   └── EchoLantern.cs           # Carried lantern with branching light beams and phase ring
│   ├── Interaction/
│   │   ├── Interactable.cs          # Base interaction interface
│   │   ├── InteractionController.cs # Sphere-cast detection and HUD prompt triggers
│   │   ├── CheckpointTrigger.cs     # Safe checkpoint storage
│   │   ├── HazardZone.cs            # Canal/fall respawn triggers
│   │   ├── CoherenceRelay.cs        # Environmental state verification gateway
│   │   └── MeasurementStation.cs    # Auditor scanner and statistical experiment lab
│   └── Puzzles/
│       ├── PuzzleDefinition.cs      # Data-driven definitions and solutions for all 8 chapters
│       └── PuzzleConsole.cs         # World interaction consoles
├── Managers/
│   ├── GameManager.cs        # Master game state orchestrator, hotkeys, simulator link
│   ├── ProgressionManager.cs # Chapter transitions, solved puzzles, save sync
│   ├── DialogueManager.cs   # Narrative queue and companion subtitles
│   ├── SaveSystem.cs         # JSON local persistence with corruption protection
│   └── AudioHelper.cs        # Procedural audio synthesis (gate whooshes, chimes, collapse sounds)
├── UI/
│   ├── QuantumHUD.cs         # Heads-up display, reticle, objective tracker, state readout
│   ├── BlochSphereUI.cs      # 2D projection of Bloch sphere, poles, vectors, and trajectories
│   ├── PuzzleConsoleUI.cs    # Full console interface: gates, probability bars, phase, hints
│   ├── DialogueUI.cs         # Subtitles and companion conversation boxes
│   ├── JournalUI.cs          # In-depth Aster Codex & Quantum Mechanics Journal
│   ├── PauseMenuUI.cs        # Pause screen, checkpoint reload, volume, chapter replay
│   └── ExperimentStationUI.cs# Born rule statistical trial lab
├── World/
│   ├── ProceduralMeshGenerator.cs # Generates 3D models for Mira, Lumi, consoles, lantern in code
│   ├── DistrictData.cs            # Regional catalog of Aster's 8 districts
│   └── WorldBuilder.cs            # Programmatic builder of the 8-district floating city
├── Editor/
│   ├── EditorProjectSetup.cs # Idempotent scene generator and reference binder
│   └── WindowsBuildScript.cs # StandaloneWindows64 automated build pipeline
└── Tests/
    └── QuantumMathTests.cs   # Automated NUnit/standalone test suite
```
