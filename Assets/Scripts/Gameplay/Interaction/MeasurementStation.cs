using System;
using UnityEngine;
using QuantumEcho.Gameplay.Interaction;
using QuantumEcho.Managers;
using QuantumEcho.Quantum;

namespace QuantumEcho.Gameplay.Interaction
{
    /// <summary>
    /// Chapter 7 Measurement Station & Experiment Lab.
    /// Demonstrates Born rule collapse, irreversibility across measurement boundaries,
    /// and statistical convergence across independent fresh trials.
    /// </summary>
    public class MeasurementStation : Interactable
    {
        [Header("Station Settings")]
        public GameObject BarrierToDeactivate;
        public Light DetectorLight;
        public Color Collapsed0Color = new Color(0.15f, 0.75f, 1.0f); // Cyan
        public Color Collapsed1Color = new Color(1.0f, 0.65f, 0.15f); // Amber

        public bool HasDemonstratedMeasurement { get; private set; }
        public int CumulativeTrials { get; private set; }
        public int CumulativeCount0 { get; private set; }
        public int CumulativeCount1 { get; private set; }

        private void Start()
        {
            PromptText = "Access Auditor Measurement Station & Lab";
        }

        public override void OnInteract(GameObject player)
        {
            GameManager.Instance?.OpenMeasurementLab(this);
        }

        /// <summary>
        /// Single-shot real measurement on the player's active carried qubit.
        /// Collapses state and records measurement boundary in history.
        /// </summary>
        public int PerformSingleShotMeasurement()
        {
            var sim = GameManager.Instance?.Simulator;
            if (sim == null) return 0;

            int outcome = sim.Measure();
            HasDemonstratedMeasurement = true;

            if (DetectorLight != null)
            {
                DetectorLight.color = outcome == 0 ? Collapsed0Color : Collapsed1Color;
                DetectorLight.intensity = 3.0f;
            }

            // Both outcomes provide a valid route forward to bypass the Auditor's gate
            if (BarrierToDeactivate != null)
            {
                BarrierToDeactivate.SetActive(false);
            }

            ProgressionManager.Instance?.CompletePuzzle("ch7_p1");

            return outcome;
        }

        /// <summary>
        /// Unlimited experiment lab: runs N independent trials.
        /// For each trial: prepares a FRESH |+⟩ state, then measures it.
        /// Accumulates statistics showing convergence towards 50/50 Born probability.
        /// </summary>
        public (int trialsRan, int c0, int c1, double p0, double p1) RunExperimentBatch(int trialCount)
        {
            var (c0, c1, p0, p1) = QuantumSimulator.MeasureIndependentTrials(QuantumState.Plus, trialCount);

            CumulativeTrials += trialCount;
            CumulativeCount0 += c0;
            CumulativeCount1 += c1;

            double totalP0 = (double)CumulativeCount0 / CumulativeTrials;
            double totalP1 = (double)CumulativeCount1 / CumulativeTrials;

            return (trialCount, c0, c1, totalP0, totalP1);
        }

        public void ResetStatistics()
        {
            CumulativeTrials = 0;
            CumulativeCount0 = 0;
            CumulativeCount1 = 0;
        }
    }
}
