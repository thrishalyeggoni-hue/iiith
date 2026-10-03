using System;
using System.Collections.Generic;
using UnityEngine;
using QuantumEcho.Quantum;

namespace QuantumEcho.Gameplay.Puzzles
{
    [Serializable]
    public class PuzzleDefinition
    {
        public string PuzzleId;
        public int ChapterNumber;
        public string ChapterTitle;
        public string PuzzleTitle;
        [TextArea(2, 5)] public string ObjectiveDescription;
        [TextArea(2, 5)] public string StoryContext;

        public QuantumState InitialState;
        public QuantumState TargetState;

        public bool AllowPrepare0 = true;
        public bool AllowPrepare1 = true;
        public List<string> AllowedGates = new List<string> { "X", "Z", "H" };

        public bool AllowInverseAction = true;
        public bool AllowMeasurement = false;

        public string[] Hints = new string[3];

        [TextArea(2, 4)] public string CompletionExplanation;

        public bool CheckSuccess(QuantumSimulator simulator, out string feedback)
        {
            if (simulator == null)
            {
                feedback = "Simulator offline.";
                return false;
            }

            // Check if current state matches target
            double fidelity = simulator.State.FidelityWith(TargetState);
            bool matched = simulator.CheckTargetReached(TargetState);

            if (matched)
            {
                feedback = $"Target state reached! Fidelity: {fidelity:F4}. Objective complete.";
                return true;
            }

            feedback = $"Current state does not match target. Fidelity: {fidelity:F4}.";
            return false;
        }

        // -------------------------------------------------------------
        // Static Repository of All 8 Chapters and Sub-Puzzles
        // -------------------------------------------------------------
        public static List<PuzzleDefinition> CreateAllChapterPuzzles()
        {
            var list = new List<PuzzleDefinition>();

            // CHAPTER 1: Arrival Harbor
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch1_p1",
                ChapterNumber = 1,
                ChapterTitle = "Arrival Harbor: What is a Qubit?",
                PuzzleTitle = "Terminal Alpha Calibration",
                ObjectiveDescription = "Prepare the Echo Lantern into basis state |0⟩ to activate Terminal Alpha.",
                StoryContext = "Mira arrives at Aster's silent harbor. Guide drone Lumi is trapped behind a powered gate. Terminal Alpha requires the fundamental zero state.",
                InitialState = QuantumState.One,
                TargetState = QuantumState.Zero,
                AllowPrepare0 = true,
                AllowPrepare1 = true,
                AllowedGates = new List<string>(), // Pure preparation introduction
                Hints = new string[]
                {
                    "Notice the preparation controls on your console.",
                    "Terminal Alpha specifically responds to the computational basis state |0⟩.",
                    "Press 'Prepare fresh |0⟩' to set your lantern's qubit to |0⟩."
                },
                CompletionExplanation = "Basis state |0⟩ verified! In this state, measuring in the computational basis yields outcome 0 with 100% certainty (P(0) = 1.0, P(1) = 0.0)."
            });

            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch1_p2",
                ChapterNumber = 1,
                ChapterTitle = "Arrival Harbor: What is a Qubit?",
                PuzzleTitle = "Terminal Beta Calibration",
                ObjectiveDescription = "Prepare the Echo Lantern into basis state |1⟩ to power Terminal Beta and release Lumi.",
                StoryContext = "Lumi's cage has a secondary circuit linked to Terminal Beta, requiring the orthogonal basis state |1⟩.",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.One,
                AllowPrepare0 = true,
                AllowPrepare1 = true,
                AllowedGates = new List<string>(),
                Hints = new string[]
                {
                    "Terminal Beta requires the opposite basis state from Alpha.",
                    "Basis states |0⟩ and |1⟩ are orthogonal: they represent distinct, mutually exclusive outcomes.",
                    "Press 'Prepare fresh |1⟩' to calibrate Terminal Beta."
                },
                CompletionExplanation = "Basis state |1⟩ verified! Deterministic measurement outcome 1 confirmed. Lumi is free!"
            });

            // CHAPTER 2: Switchworks
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch2_p1",
                ChapterNumber = 2,
                ChapterTitle = "Switchworks: The X Gate",
                PuzzleTitle = "Hydraulic Lift Activation",
                ObjectiveDescription = "Apply the Pauli-X gate to map |0⟩ to |1⟩ and power the lift.",
                StoryContext = "The district routing machinery is frozen. The lift power relay starts at |0⟩ but requires |1⟩ to engage its magnetic gears.",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.One,
                AllowPrepare0 = true,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "X" },
                Hints = new string[]
                {
                    "The X gate acts as a quantum bit flip, directly analogous to a classical NOT gate.",
                    "Applying X exchanges the amplitudes of |0⟩ and |1⟩: X|0⟩ = |1⟩.",
                    "Press the [X] gate button once."
                },
                CompletionExplanation = "X gate applied: X|0⟩ = |1⟩. The bit-flip exchanged the basis amplitudes. The hydraulic lift rises!"
            });

            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch2_p2",
                ChapterNumber = 2,
                ChapterTitle = "Switchworks: The X Gate",
                PuzzleTitle = "Gate Inversion & Double-X",
                ObjectiveDescription = "Start from |1⟩, apply X twice to test self-inversion, then configure the relay to |0⟩.",
                StoryContext = "Lumi notes: 'The old engineers designed operations that could be retraced. Applying X twice should bring us right back!'",
                InitialState = QuantumState.One,
                TargetState = QuantumState.Zero,
                AllowPrepare0 = false,
                AllowPrepare1 = true,
                AllowedGates = new List<string> { "X" },
                Hints =
                {
                    "The X gate is self-inverse: X² = X * X = Identity.",
                    "If you apply X once to |1⟩, it flips to |0⟩.",
                    "Apply X once to reach the target |0⟩, or try applying it twice to observe X² = I."
                },
                CompletionExplanation = "X is self-inverse (X² = I). Applying X to |1⟩ returns |0⟩, restoring the switchway."
            });

            // CHAPTER 3: The Twin-Light Garden
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch3_p1",
                ChapterNumber = 3,
                ChapterTitle = "The Twin-Light Garden: Superposition and H",
                PuzzleTitle = "The Coherence Relay",
                ObjectiveDescription = "Apply the Hadamard (H) gate to create equal superposition |+⟩ = (|0⟩ + |1⟩)/√2.",
                StoryContext = "The garden path is blocked by a Coherence Relay. It requires a balanced superposition state where both branches glow with equal amplitude.",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.Plus,
                AllowPrepare0 = true,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "H" },
                Hints =
                {
                    "The Hadamard gate H transforms definite basis states into quantum superpositions.",
                    "H|0⟩ creates |+⟩, where P(0) = 50% and P(1) = 50%.",
                    "Press the [H] gate button."
                },
                CompletionExplanation = "Superposition created! |+⟩ = 1/√2 |0⟩ + 1/√2 |1⟩. Notice the two light branches on your lantern: they represent complex probability amplitudes of a single qubit, not two physical lanterns!"
            });

            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch3_p2",
                ChapterNumber = 3,
                ChapterTitle = "The Twin-Light Garden: Superposition and H",
                PuzzleTitle = "Hadamard Reversibility",
                ObjectiveDescription = "Apply H to the superposition state |+⟩ to return deterministically to |0⟩.",
                StoryContext = "Lumi marvels: 'Unlike a measurement which forces a random outcome, applying H again cleanly recombines the branches!'",
                InitialState = QuantumState.Plus,
                TargetState = QuantumState.Zero,
                AllowPrepare0 = false,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "H" },
                Hints =
                {
                    "The Hadamard gate is also self-inverse: H² = I.",
                    "Applying H to |+⟩ causes constructive interference at |0⟩ and destructive interference at |1⟩.",
                    "Press [H] once to restore |0⟩."
                },
                CompletionExplanation = "H|+⟩ = |0⟩! Quantum interference cancelled out the |1⟩ amplitude and reinforced |0⟩. Reversible unitary evolution preserves coherence without collapse."
            });

            // CHAPTER 4: Phase Observatory
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch4_p1",
                ChapterNumber = 4,
                ChapterTitle = "Phase Observatory: The Z Gate",
                PuzzleTitle = "The Phase Flip",
                ObjectiveDescription = "Start from |+⟩, apply the Pauli-Z gate to create |−⟩. Observe identical probabilities but inverted relative phase.",
                StoryContext = "The observatory beacon has correct brightness (50/50 probability), but cannot pass the interference lens due to misaligned phase.",
                InitialState = QuantumState.Plus,
                TargetState = QuantumState.Minus,
                AllowPrepare0 = false,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "Z" },
                Hints =
                {
                    "The Pauli-Z gate leaves |0⟩ unchanged, but multiplies |1⟩ by -1.",
                    "Z|+⟩ = Z((|0⟩+|1⟩)/√2) = (|0⟩ - |1⟩)/√2 = |−⟩.",
                    "Press the [Z] gate button."
                },
                CompletionExplanation = "Phase flipped! Both |+⟩ and |−⟩ have identical 50/50 measurement probabilities, but their relative phase differs by π (180°). Phase is invisible to single-basis probability checks until converted by interference!"
            });

            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch4_p2",
                ChapterNumber = 4,
                ChapterTitle = "Phase Observatory: The Z Gate",
                PuzzleTitle = "Phase-to-Basis Conversion (H-Z-H)",
                ObjectiveDescription = "Starting from |0⟩, synthesize |1⟩ using ONLY Hadamard (H) and Phase (Z) gates. (X is disabled).",
                StoryContext = "The beacon's direct X-relay is burned out. You must use phase interference to flip the bit: H → Z → H.",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.One,
                AllowPrepare0 = true,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "H", "Z" },
                Hints =
                {
                    "First create superposition using H: H|0⟩ = |+⟩.",
                    "Then flip the relative phase using Z: Z|+⟩ = |−⟩.",
                    "Finally apply H again: H|−⟩ = |1⟩! The circuit sequence is H → Z → H."
                },
                CompletionExplanation = "Beacon restored! H → Z → H |0⟩ = |1⟩. This proves that relative phase is physically real: changing phase in the middle changed the final observable outcome from 0 to 1!"
            });

            // CHAPTER 5: Echo Bridge
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch5_p1",
                ChapterNumber = 5,
                ChapterTitle = "Echo Bridge: Gate Order",
                PuzzleTitle = "Order Matters: Synthesizing |−⟩",
                ObjectiveDescription = "Starting from |0⟩, create |−⟩ by applying gates in the correct chronological order.",
                StoryContext = "The first bridge pylons require |−⟩. Lumi warns: 'In quantum circuits, gate order matters! X then H produces a completely different state than H then X!'",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.Minus,
                AllowPrepare0 = true,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "X", "H" },
                Hints =
                {
                    "X|0⟩ = |1⟩. Then H|1⟩ = |−⟩.",
                    "Conversely, H|0⟩ = |+⟩, and X|+⟩ = |+⟩ (X does not flip |+⟩).",
                    "Apply [X] first, then apply [H]."
                },
                CompletionExplanation = "Relay locked! X followed by H yields |−⟩. Notice: H followed by X would have yielded |+⟩. Matrix multiplication is non-commutative: XH ≠ HX!"
            });

            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch5_p2",
                ChapterNumber = 5,
                ChapterTitle = "Echo Bridge: Gate Order",
                PuzzleTitle = "Order Matters: Synthesizing |+⟩",
                ObjectiveDescription = "Starting from |0⟩, create |+⟩ using both H and X gates.",
                StoryContext = "The second bridge pylon requires |+⟩. Verify the alternate gate order.",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.Plus,
                AllowPrepare0 = true,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "X", "H" },
                Hints =
                {
                    "Apply H first to reach |+⟩ = (|0⟩ + |1⟩)/√2.",
                    "Applying X to |+⟩ swaps |0⟩ and |1⟩, leaving |+⟩ invariant: X|+⟩ = |+⟩.",
                    "Apply [H] first, then [X] (or simply [H])."
                },
                CompletionExplanation = "Echo Bridge fully extended! Gate order determines the state trajectory on the Bloch sphere."
            });

            // CHAPTER 6: The Reversal Vault
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch6_p1",
                ChapterNumber = 6,
                ChapterTitle = "The Reversal Vault: Inverses",
                PuzzleTitle = "Unlocking Ishan's Archive",
                ObjectiveDescription = "The lock was scrambled with forward sequence: H → Z → X. Apply the mathematical inverse sequence to restore |0⟩.",
                StoryContext = "Dr. Ishan protected his vault using a reversible gate cipher. To undo (H Z X), you must apply (X Z H). Use the 'Apply Last Inverse' action or manual inverse sequence.",
                InitialState = new QuantumState(
                    new ComplexNumber(0.5, 0.5),
                    new ComplexNumber(0.5, -0.5),
                    "Scrambled (H Z X)"
                ),
                TargetState = QuantumState.Zero,
                AllowPrepare0 = false, // Must be mathematically inverted, not re-prepared!
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "X", "Z", "H" },
                AllowInverseAction = true,
                Hints =
                {
                    "Remember the inverse of a sequence (A B C) is (C⁻¹ B⁻¹ A⁻¹). You must reverse the gate order!",
                    "Since X, Z, and H are each self-inverse (X⁻¹=X, Z⁻¹=Z, H⁻¹=H), the inverse of H → Z → X is X → Z → H.",
                    "Apply [X], then [Z], then [H] — or use the 'Apply Last Inverse' feature!"
                },
                CompletionExplanation = "Vault unlocked! The inverse sequence (X → Z → H) perfectly cancelled the forward unitary evolution. Ishan's audio log plays: 'Unitary physics is completely reversible when the history is preserved.'"
            });

            // CHAPTER 7: Measurement Station
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch7_p1",
                ChapterNumber = 7,
                ChapterTitle = "Measurement Station: The Limit of Reversal",
                PuzzleTitle = "The Non-Unitary Boundary",
                ObjectiveDescription = "Prepare |+⟩, then engage the Auditor's Measurement Detector. Observe state collapse and why measurement cannot be inverted.",
                StoryContext = "The Auditor deployed measurement scanners that force qubits into classical outcomes, destroying coherence. Observe what happens when you attempt to undo a measurement.",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.Zero, // Either 0 or 1 will enable progression!
                AllowPrepare0 = true,
                AllowPrepare1 = false,
                AllowedGates = new List<string> { "H" },
                AllowMeasurement = true,
                Hints =
                {
                    "First create |+⟩ by pressing [H].",
                    "Next, press [Measure in Computational Basis]. Observe the Born rule collapse into |0⟩ or |1⟩.",
                    "Notice that 'Apply Last Inverse' is now blocked: measurement is non-unitary and destroys prior amplitude information!"
                },
                CompletionExplanation = "Measurement observed! When measured, the superposition collapsed into a definite outcome. Because arbitrary pre-measurement amplitudes cannot be recovered from the single outcome alone, measurement is irreversible. Both outcomes provide an authorized bypass code!"
            });

            // CHAPTER 8: The Echo Core
            list.Add(new PuzzleDefinition
            {
                PuzzleId = "ch8_final",
                ChapterNumber = 8,
                ChapterTitle = "The Echo Core: Final Application",
                PuzzleTitle = "Restoration of the Echo Core",
                ObjectiveDescription = "Complete the 6 staged quantum syntheses to recalibrate the core and stop the Auditor.",
                StoryContext = "Mira and Lumi reach the pinnacle of Aster. The Echo Core's 6 harmonic rings require precise state preparations and inversions to purge the Auditor's lock.",
                InitialState = QuantumState.Zero,
                TargetState = QuantumState.One,
                AllowPrepare0 = true,
                AllowPrepare1 = true,
                AllowedGates = new List<string> { "X", "Z", "H" },
                AllowInverseAction = true,
                AllowMeasurement = true,
                Hints =
                {
                    "Stage 1: |0⟩ -> X -> |1⟩.",
                    "Stage 2: |0⟩ -> H -> |+⟩.",
                    "Stage 3: |0⟩ -> H, Z -> |−⟩. Stage 4: H, Z, H -> |1⟩ (X disabled).",
                },
                CompletionExplanation = "Echo Core stabilized! The city of Aster hums with restored coherence. Dr. Ishan's legacy is preserved!"
            });

            return list;
        }
    }
}
