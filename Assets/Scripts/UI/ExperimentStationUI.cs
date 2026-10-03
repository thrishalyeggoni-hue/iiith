using System;
using UnityEngine;
using QuantumEcho.Gameplay.Interaction;
using QuantumEcho.Managers;
using QuantumEcho.Quantum;

namespace QuantumEcho.UI
{
    /// <summary>
    /// Interactive UI for Chapter 7 Measurement Station & Experiment Lab.
    /// Allows single-shot measurement on active lantern, testing of blocked reversal,
    /// and running 10 / 100 / 1000 independent fresh-state trials to demonstrate the Born rule.
    /// </summary>
    public class ExperimentStationUI : MonoBehaviour
    {
        private MeasurementStation _activeStation;
        private QuantumSimulator _simulator;
        private bool _isOpen = false;

        private string _statusMessage = "";
        private float _statusTimer = 0f;

        public void Open(MeasurementStation station, QuantumSimulator simulator)
        {
            _activeStation = station;
            _simulator = simulator;
            _isOpen = true;
            _statusMessage = "Auditor Scanner Online. Prepare |+⟩ and observe measurement collapse.";
            gameObject.SetActive(true);
        }

        public void Close()
        {
            _isOpen = false;
            gameObject.SetActive(false);
        }

        private void Update()
        {
            if (_statusTimer > 0f)
            {
                _statusTimer -= Time.deltaTime;
                if (_statusTimer <= 0f) _statusMessage = "";
            }
        }

        public void OnClickSingleShotMeasure()
        {
            if (_activeStation == null || _simulator == null) return;

            int outcome = _activeStation.PerformSingleShotMeasurement();
            GameManager.Instance?.Audio?.PlayMeasurementCollapse();

            _statusMessage = $"Measurement Performed! State collapsed to definite basis state |{outcome}⟩. P(0) was {_simulator.State.Probability0 * 100:F0}%, P(1) was {_simulator.State.Probability1 * 100:F0}%. Both outcomes unlock the path!";
            _statusTimer = 6.0f;
        }

        public void OnClickTryUndoAcrossMeasurement()
        {
            if (_simulator == null) return;

            bool success = _simulator.ApplyLastInverse(out string message);
            if (!success)
            {
                GameManager.Instance?.Audio?.PlayError();
                _statusMessage = $"<b>REVERSAL FAILED:</b> {message}";
                _statusTimer = 7.0f;
            }
            else
            {
                _statusMessage = message;
                _statusTimer = 4.0f;
            }
        }

        public void OnClickRunBatchTrials(int count)
        {
            if (_activeStation == null) return;

            var (ran, c0, c1, p0, p1) = _activeStation.RunExperimentBatch(count);
            GameManager.Instance?.Audio?.PlayButtonClick();

            _statusMessage = $"Ran {ran} independent fresh trials on |+⟩. Cumulative total: {_activeStation.CumulativeTrials} trials. Outcome 0: {_activeStation.CumulativeCount0} ({p0 * 100:F1}%), Outcome 1: {_activeStation.CumulativeCount1} ({p1 * 100:F1}%).";
            _statusTimer = 6.0f;
        }

        public void OnClickResetStatistics()
        {
            if (_activeStation != null)
            {
                _activeStation.ResetStatistics();
                GameManager.Instance?.Audio?.PlayButtonClick();
                _statusMessage = "Trial statistics cleared.";
                _statusTimer = 3.0f;
            }
        }

        private void OnGUI()
        {
            if (!_isOpen || _activeStation == null || _simulator == null) return;

            GUI.skin.box.fontSize = 13;
            GUI.skin.button.fontSize = 13;
            GUI.skin.label.fontSize = 13;

            // Backdrop
            GUI.color = new Color(0.04f, 0.08f, 0.16f, 0.95f);
            GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Texture2D.whiteTexture);
            GUI.color = Color.white;

            float width = Mathf.Min(Screen.width - 60f, 920f);
            float height = Mathf.Min(Screen.height - 40f, 640f);
            Rect panelRect = new Rect((Screen.width - width) * 0.5f, (Screen.height - height) * 0.5f, width, height);

            GUILayout.BeginArea(panelRect, GUI.skin.box);

            // Header
            GUILayout.BeginHorizontal();
            GUILayout.Label("<b><size=18>AUDITOR MEASUREMENT STATION & EXPERIMENT LAB</size></b>");
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("✕ Close [Esc]", GUILayout.Width(110), GUILayout.Height(28)))
            {
                GameManager.Instance?.CloseMeasurementLab();
            }
            GUILayout.EndHorizontal();
            GUILayout.Space(6);

            GUILayout.BeginHorizontal();

            // LEFT: Real-time measurement on active qubit
            GUILayout.BeginVertical(GUI.skin.box, GUILayout.Width(width * 0.48f));
            GUILayout.Label("<b>1. ACTIVE QUBIT MEASUREMENT</b>");
            GUILayout.Label($"Carried State: <b>{_simulator.State.Label}</b>");
            GUILayout.Label($"Current Probabilities: P(|0⟩) = {_simulator.State.Probability0 * 100:F1}%, P(|1⟩) = {_simulator.State.Probability1 * 100:F1}%");

            GUILayout.Space(8);
            if (GUILayout.Button("Prepare fresh |+⟩ using Hadamard", GUILayout.Height(34)))
            {
                _simulator.Prepare(QuantumState.Zero, "Prep |0⟩");
                _simulator.ApplyGate(QuantumGate.H);
                GameManager.Instance?.Audio?.PlayGateApply();
                _statusMessage = "Prepared |+⟩ = (|0⟩ + |1⟩)/√2. Equal 50/50 superposition ready for measurement.";
                _statusTimer = 4f;
            }

            GUILayout.Space(4);
            GUI.color = new Color(1.0f, 0.4f, 0.4f);
            if (GUILayout.Button("Perform Computational-Basis Measurement", GUILayout.Height(40)))
            {
                OnClickSingleShotMeasure();
            }
            GUI.color = Color.white;

            GUILayout.Space(4);
            if (GUILayout.Button("Attempt Quantum Undo (Apply Inverse) Across Boundary", GUILayout.Height(34)))
            {
                OnClickTryUndoAcrossMeasurement();
            }

            GUILayout.Space(8);
            GUILayout.Label("<b>Scientific Observation:</b>\n" +
                            "• Before measurement, the qubit was in continuous superposition.\n" +
                            "• Measurement forced collapse into a single eigenvalue (0 or 1).\n" +
                            "• Prior amplitude and phase information is destroyed; inverse gates cannot un-measure the state!");

            GUILayout.EndVertical();

            // RIGHT: Unlimited Statistical Trial Experiment Station
            GUILayout.BeginVertical(GUI.skin.box, GUILayout.Width(width * 0.48f));
            GUILayout.Label("<b>2. STATISTICAL LAB: BORN RULE TRIALS</b>");
            GUILayout.Label("Each trial prepares a <i>fresh, independent |+⟩ state</i> and measures it.");
            GUILayout.Space(6);

            GUILayout.Label($"Total Independent Trials: <b>{_activeStation.CumulativeTrials}</b>");
            if (_activeStation.CumulativeTrials > 0)
            {
                double r0 = (double)_activeStation.CumulativeCount0 / _activeStation.CumulativeTrials;
                double r1 = (double)_activeStation.CumulativeCount1 / _activeStation.CumulativeTrials;

                GUILayout.Label($"Outcome 0 Count: {_activeStation.CumulativeCount0} ({r0 * 100:F1}%)");
                DrawProgressBar("Outcome 0:", (float)r0, new Color(0.2f, 0.8f, 1.0f));

                GUILayout.Label($"Outcome 1 Count: {_activeStation.CumulativeCount1} ({r1 * 100:F1}%)");
                DrawProgressBar("Outcome 1:", (float)r1, new Color(1.0f, 0.7f, 0.2f));

                GUILayout.Space(6);
                GUILayout.Label("<i>Notice: Small sample sizes (e.g. 10 trials) exhibit natural binomial fluctuation. As trial count grows to 1000+, the ratio converges to 50.0%.</i>");
            }
            else
            {
                GUILayout.Label("<i>No batch trials run yet. Choose a sample size below:</i>");
            }

            GUILayout.Space(8);
            GUILayout.BeginHorizontal();
            if (GUILayout.Button("+10 Trials", GUILayout.Height(32))) OnClickRunBatchTrials(10);
            if (GUILayout.Button("+100 Trials", GUILayout.Height(32))) OnClickRunBatchTrials(100);
            if (GUILayout.Button("+1,000 Trials", GUILayout.Height(32))) OnClickRunBatchTrials(1000);
            GUILayout.EndHorizontal();

            GUILayout.Space(4);
            if (GUILayout.Button("Reset Lab Statistics", GUILayout.Height(28)))
            {
                OnClickResetStatistics();
            }

            GUILayout.EndVertical();
            GUILayout.EndHorizontal();

            // Bottom Status Box
            if (!string.IsNullOrEmpty(_statusMessage))
            {
                GUILayout.Space(8);
                GUI.color = new Color(1.0f, 0.85f, 0.35f);
                GUILayout.Box($"<b>LAB STATUS:</b> {_statusMessage}", GUILayout.Height(34));
                GUI.color = Color.white;
            }

            GUILayout.EndArea();
        }

        private void DrawProgressBar(string label, float fraction, Color barColor)
        {
            GUILayout.BeginHorizontal();
            GUILayout.Label(label, GUILayout.Width(110));

            Rect r = GUILayoutUtility.GetRect(140, 16, GUILayout.ExpandWidth(true));
            GUI.color = new Color(0.15f, 0.2f, 0.25f);
            GUI.DrawTexture(r, Texture2D.whiteTexture);

            Rect fillRect = new Rect(r.x, r.y, r.width * Mathf.Clamp01(fraction), r.height);
            GUI.color = barColor;
            GUI.DrawTexture(fillRect, Texture2D.whiteTexture);

            GUI.color = Color.white;
            GUILayout.EndHorizontal();
        }
    }
}
