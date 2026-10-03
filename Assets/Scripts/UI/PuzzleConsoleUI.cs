using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using QuantumEcho.Gameplay.Puzzles;
using QuantumEcho.Managers;
using QuantumEcho.Quantum;

namespace QuantumEcho.UI
{
    /// <summary>
    /// Interactive Puzzle Console interface.
    /// Manages gate buttons, state vector display, probability bars, phase dials,
    /// target comparison, gate history timeline, and progressive hints.
    /// Includes both uGUI bindings and self-contained IMGUI fallback rendering.
    /// </summary>
    public class PuzzleConsoleUI : MonoBehaviour
    {
        [Header("Bloch Sphere Projection")]
        public BlochSphereUI BlochView;

        private PuzzleDefinition _activePuzzle;
        private QuantumSimulator _simulator;
        private int _revealedHintIndex = 0;
        private string _statusBanner = "";
        private float _statusBannerTimer = 0f;
        private bool _isOpen = false;

        public bool IsOpen => _isOpen;

        public void Open(PuzzleDefinition puzzle, QuantumSimulator simulator)
        {
            _activePuzzle = puzzle;
            _simulator = simulator;
            _revealedHintIndex = 0;
            _statusBanner = "";
            _isOpen = true;
            gameObject.SetActive(true);

            if (BlochView != null)
            {
                BlochView.SetStates(_simulator.State, _activePuzzle.TargetState);
            }
        }

        public void Close()
        {
            _isOpen = false;
            gameObject.SetActive(false);
            if (BlochView != null)
                BlochView.ClearTrajectory();
        }

        public void RefreshUI(QuantumState state, GateHistory history)
        {
            if (BlochView != null && _activePuzzle != null)
            {
                BlochView.SetStates(state, _activePuzzle.TargetState);
            }
        }

        private void Update()
        {
            if (!_isOpen) return;

            if (_statusBannerTimer > 0f)
            {
                _statusBannerTimer -= Time.deltaTime;
                if (_statusBannerTimer <= 0f) _statusBanner = "";
            }

            // Check if player solved the puzzle
            if (_activePuzzle != null && _simulator != null)
            {
                if (_simulator.CheckTargetReached(_activePuzzle.TargetState))
                {
                    // Target reached
                }
            }
        }

        public void OnClickPrepare(int basis)
        {
            if (_simulator == null) return;
            QuantumState prepState = (basis == 0) ? QuantumState.Zero : QuantumState.One;
            _simulator.Prepare(prepState, $"Prepared |{basis}⟩");
            GameManager.Instance?.Audio?.PlayButtonClick();
            SetStatus($"Prepared fresh basis state |{basis}⟩. Gate history reset.");
        }

        public void OnClickGate(string gateSymbol)
        {
            if (_simulator == null) return;

            try
            {
                QuantumGate gate = QuantumGate.GetByName(gateSymbol);
                QuantumState prevState = _simulator.State.Clone();

                // Compute continuous trajectory on Bloch sphere
                if (BlochView != null)
                {
                    var traj = BlochSphereMath.ComputeGateTrajectory(prevState, gate, 16);
                    BlochView.SetTrajectory(traj);
                }

                _simulator.ApplyGate(gate);
                GameManager.Instance?.Audio?.PlayGateApply();

                var (axis, angle, explanation) = BlochSphereMath.GetGateRotationParameters(gate);
                SetStatus($"Applied [{gate.Symbol}] gate: {explanation}");

                // Auto check completion
                CheckTarget();
            }
            catch (Exception ex)
            {
                SetStatus($"Error applying gate: {ex.Message}");
            }
        }

        public void OnClickApplyInverse()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.ApplyInverseLastGate();
            }
        }

        public void OnClickReset()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.ResetCurrentPuzzle();
                SetStatus("Puzzle reset to initial state.");
            }
        }

        public void OnClickCheckSolution()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.CheckActivePuzzleSuccess();
            }
        }

        public void OnClickRevealNextHint()
        {
            if (_activePuzzle == null || _activePuzzle.Hints == null) return;

            if (_revealedHintIndex < _activePuzzle.Hints.Length)
            {
                _revealedHintIndex++;
                GameManager.Instance?.Audio?.PlayButtonClick();
            }
        }

        private void CheckTarget()
        {
            if (_activePuzzle != null && _simulator != null)
            {
                if (_simulator.CheckTargetReached(_activePuzzle.TargetState))
                {
                    SetStatus("TARGET STATE ACHIEVED! Press [Interface / Submit] to lock in.");
                }
            }
        }

        private void SetStatus(string message)
        {
            _statusBanner = message;
            _statusBannerTimer = 4.0f;
        }

        // -------------------------------------------------------------
        // Comprehensive IMGUI Rendering for 100% Reliable Visuals
        // -------------------------------------------------------------
        private void OnGUI()
        {
            if (!_isOpen || _activePuzzle == null || _simulator == null) return;

            GUI.skin.box.fontSize = 13;
            GUI.skin.button.fontSize = 13;
            GUI.skin.label.fontSize = 13;

            // Semi-transparent backdrop
            GUI.color = new Color(0.04f, 0.08f, 0.15f, 0.94f);
            GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Texture2D.whiteTexture);
            GUI.color = Color.white;

            float panelWidth = Mathf.Min(Screen.width - 60f, 960f);
            float panelHeight = Mathf.Min(Screen.height - 40f, 680f);
            float panelX = (Screen.width - panelWidth) * 0.5f;
            float panelY = (Screen.height - panelHeight) * 0.5f;

            GUILayout.BeginArea(new Rect(panelX, panelY, panelWidth, panelHeight), GUI.skin.box);

            // 1. Header
            GUILayout.BeginHorizontal();
            GUILayout.Label($"<b><size=18>QUANTUM CONSOLE — CHAPTER {_activePuzzle.ChapterNumber}: {_activePuzzle.ChapterTitle}</size></b>");
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("✕ Close [Esc]", GUILayout.Width(110), GUILayout.Height(28)))
            {
                GameManager.Instance?.ClosePuzzleConsole();
            }
            GUILayout.EndHorizontal();

            GUILayout.Label($"<b>Objective:</b> {_activePuzzle.ObjectiveDescription}", GUILayout.Height(24));
            GUILayout.Space(6);

            // 2. Main Content Split: Left (Quantum Readout & Controls) | Right (Bloch Sphere & Target)
            GUILayout.BeginHorizontal();

            // LEFT COLUMN (Width: ~55%)
            GUILayout.BeginVertical(GUILayout.Width(panelWidth * 0.56f));

            // Current State Vector
            GUILayout.BeginVertical(GUI.skin.box);
            GUILayout.Label("<b>CURRENT QUANTUM STATE VECTOR</b>");
            GUILayout.Label($"|ψ⟩ = ({_simulator.State.Alpha}) |0⟩ + ({_simulator.State.Beta}) |1⟩");

            // Probability Bars
            double p0 = _simulator.State.Probability0;
            double p1 = _simulator.State.Probability1;
            GUILayout.Space(4);
            GUILayout.Label($"<b>Computational Basis Probabilities:</b>");
            DrawProgressBar("Outcome |0⟩ (P₀):", (float)p0, new Color(0.2f, 0.8f, 1.0f));
            DrawProgressBar("Outcome |1⟩ (P₁):", (float)p1, new Color(1.0f, 0.7f, 0.2f));

            // Relative Phase
            double phaseDeg = _simulator.State.RelativePhaseDegrees;
            double phaseRad = _simulator.State.RelativePhase;
            GUILayout.Space(4);
            GUILayout.Label($"<b>Relative Phase φ:</b> {phaseDeg:F1}° ({phaseRad:F2} rad)");

            // Special comparison note when in equal superposition
            if (Math.Abs(p0 - 0.5) < 0.05 && Math.Abs(p1 - 0.5) < 0.05)
            {
                GUI.color = new Color(0.85f, 0.45f, 1.0f);
                if (Math.Abs(phaseDeg) < 15.0)
                    GUILayout.Label("➔ State is |+⟩: Same 50/50 probabilities, Phase = 0°.");
                else if (Math.Abs(Math.Abs(phaseDeg) - 180.0) < 15.0)
                    GUILayout.Label("➔ State is |−⟩: Same 50/50 probabilities, Phase = 180° (π)!");
                GUI.color = Color.white;
            }

            GUILayout.EndVertical();

            // Circuit Timeline / Gate History
            GUILayout.Space(6);
            GUILayout.BeginVertical(GUI.skin.box);
            GUILayout.Label($"<b>Circuit Timeline (Chronological):</b> {_simulator.History.ToCircuitString()}");
            if (_simulator.History.CanApplyLastInverse(out _))
            {
                GUILayout.Label($"<i>Inverse Circuit:</i> {_simulator.History.GetFullInverseSequenceString()}");
            }
            GUILayout.EndVertical();

            // Gate Action Controls
            GUILayout.Space(6);
            GUILayout.BeginVertical(GUI.skin.box);
            GUILayout.Label("<b>AVAILABLE OPERATIONS</b>");

            // Preparation row
            GUILayout.BeginHorizontal();
            if (_activePuzzle.AllowPrepare0)
            {
                if (GUILayout.Button("Prepare fresh |0⟩", GUILayout.Height(32)))
                    OnClickPrepare(0);
            }
            if (_activePuzzle.AllowPrepare1)
            {
                if (GUILayout.Button("Prepare fresh |1⟩", GUILayout.Height(32)))
                    OnClickPrepare(1);
            }
            GUILayout.EndHorizontal();

            // Unitary Gate Buttons
            GUILayout.BeginHorizontal();
            if (_activePuzzle.AllowedGates.Contains("X"))
            {
                if (GUILayout.Button("Gate [X]\nBit Flip", GUILayout.Height(42)))
                    OnClickGate("X");
            }
            if (_activePuzzle.AllowedGates.Contains("Z"))
            {
                if (GUILayout.Button("Gate [Z]\nPhase Flip", GUILayout.Height(42)))
                    OnClickGate("Z");
            }
            if (_activePuzzle.AllowedGates.Contains("H"))
            {
                if (GUILayout.Button("Gate [H]\nHadamard", GUILayout.Height(42)))
                    OnClickGate("H");
            }
            if (_activePuzzle.AllowedGates.Contains("Y"))
            {
                if (GUILayout.Button("Gate [Y]", GUILayout.Height(42)))
                    OnClickGate("Y");
            }
            if (_activePuzzle.AllowedGates.Contains("S"))
            {
                if (GUILayout.Button("Gate [S]", GUILayout.Height(42)))
                    OnClickGate("S");
            }
            GUILayout.EndHorizontal();

            // Inverse & Reset Actions
            GUILayout.BeginHorizontal();
            GUI.enabled = _simulator.History.CanApplyLastInverse(out _);
            if (GUILayout.Button("Apply Last Inverse [Z/Q]", GUILayout.Height(30)))
                OnClickApplyInverse();
            GUI.enabled = true;

            if (GUILayout.Button("Reset Puzzle [R]", GUILayout.Height(30)))
                OnClickReset();

            GUILayout.EndHorizontal();
            GUILayout.EndVertical();

            GUILayout.EndVertical();

            // RIGHT COLUMN (Width: ~45%)
            GUILayout.BeginVertical(GUILayout.Width(panelWidth * 0.41f));

            // Target State & Fidelity
            GUILayout.BeginVertical(GUI.skin.box);
            GUILayout.Label("<b>TARGET REQUIREMENT</b>");
            GUILayout.Label($"Target: <b>{_activePuzzle.TargetState?.Label}</b>");

            double fidelity = _simulator.State.FidelityWith(_activePuzzle.TargetState);
            bool isSatisfied = _simulator.CheckTargetReached(_activePuzzle.TargetState);

            GUILayout.Label($"State Fidelity F = |⟨φ|ψ⟩|²: <b>{fidelity * 100:F1}%</b>");
            DrawProgressBar("Target Match:", (float)fidelity, isSatisfied ? Color.green : new Color(1f, 0.8f, 0.2f));

            if (isSatisfied)
            {
                GUI.color = Color.green;
                GUILayout.Label("✓ TARGET MET! Click below to interface.");
                GUI.color = Color.white;
            }

            GUILayout.Space(4);
            GUI.color = isSatisfied ? new Color(0.2f, 0.9f, 0.3f) : Color.white;
            if (GUILayout.Button("Interface / Lock In Solution [Space]", GUILayout.Height(36)))
            {
                OnClickCheckSolution();
            }
            GUI.color = Color.white;
            GUILayout.EndVertical();

            // Bloch Sphere Text Projection
            GUILayout.Space(6);
            GUILayout.BeginVertical(GUI.skin.box);
            GUILayout.Label("<b>BLOCH SPHERE COORDINATES</b>");
            var (bx, by, bz) = _simulator.State.BlochCoordinates;
            GUILayout.Label($"Vector (x, y, z): ({bx:F3}, {by:F3}, {bz:F3})");
            GUILayout.Label("• +Z pole = |0⟩  |  -Z pole = |1⟩");
            GUILayout.Label("• +X pole = |+⟩  |  -X pole = |−⟩");
            GUILayout.Label("• +Y pole = |+i⟩ |  -Y pole = |−i⟩");
            GUILayout.Label("• Hadamard H = 180° rotation around (X+Z)/√2 axis.");
            GUILayout.EndVertical();

            // Progressive Hint Box
            GUILayout.Space(6);
            GUILayout.BeginVertical(GUI.skin.box);
            GUILayout.BeginHorizontal();
            GUILayout.Label($"<b>HINTS ({_revealedHintIndex}/{_activePuzzle.Hints.Length})</b>");
            if (_revealedHintIndex < _activePuzzle.Hints.Length)
            {
                if (GUILayout.Button("Reveal Next Hint", GUILayout.Width(130)))
                    OnClickRevealNextHint();
            }
            GUILayout.EndHorizontal();

            for (int i = 0; i < _revealedHintIndex; i++)
            {
                GUILayout.Label($"<b>Hint {i + 1}:</b> {_activePuzzle.Hints[i]}");
            }
            if (_revealedHintIndex == 0)
            {
                GUILayout.Label("<i>Need assistance? Click 'Reveal Next Hint'.</i>");
            }
            GUILayout.EndVertical();

            GUILayout.EndVertical();
            GUILayout.EndHorizontal();

            // Bottom Status Banner
            if (!string.IsNullOrEmpty(_statusBanner))
            {
                GUILayout.Space(6);
                GUI.color = new Color(1.0f, 0.9f, 0.4f);
                GUILayout.Box($"<b>NOTIFICATION:</b> {_statusBanner}", GUILayout.Height(28));
                GUI.color = Color.white;
            }

            GUILayout.EndArea();
        }

        private void DrawProgressBar(string label, float fraction, Color barColor)
        {
            GUILayout.BeginHorizontal();
            GUILayout.Label(label, GUILayout.Width(150));

            Rect r = GUILayoutUtility.GetRect(160, 18, GUILayout.ExpandWidth(true));
            GUI.color = new Color(0.15f, 0.2f, 0.25f);
            GUI.DrawTexture(r, Texture2D.whiteTexture);

            Rect fillRect = new Rect(r.x, r.y, r.width * Mathf.Clamp01(fraction), r.height);
            GUI.color = barColor;
            GUI.DrawTexture(fillRect, Texture2D.whiteTexture);

            GUI.color = Color.white;
            GUI.Label(new Rect(r.x + 8, r.y - 1, r.width, r.height), $"{fraction * 100:F1}%");
            GUILayout.EndHorizontal();
        }
    }
}
