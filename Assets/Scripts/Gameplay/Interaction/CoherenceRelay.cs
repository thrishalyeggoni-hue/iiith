using System;
using UnityEngine;
using QuantumEcho.Gameplay.Interaction;
using QuantumEcho.Managers;
using QuantumEcho.Quantum;

namespace QuantumEcho.Gameplay.Interaction
{
    /// <summary>
    /// A gameplay device that verifies the coherence of the player's carried lantern qubit.
    /// Note: This is an educational gameplay device whose state is verified by the underlying simulator;
    /// it is not a physical single-shot measurement that could extract unknown state parameters.
    /// </summary>
    public class CoherenceRelay : Interactable
    {
        [Header("Target State Requirement")]
        public string RequiredStateName = "|+⟩";
        public GameObject BarrierToOpen;
        public Light RelayGlowLight;
        public Renderer RelayCoreRenderer;
        public Color ActiveColor = new Color(0.15f, 0.9f, 0.95f);
        public Color InactiveColor = new Color(0.4f, 0.4f, 0.5f);

        public bool IsUnlocked { get; private set; }

        private void Start()
        {
            PromptText = $"Interface with Coherence Relay (Requires {RequiredStateName})";
            UpdateVisuals();
        }

        public override void OnInteract(GameObject player)
        {
            if (IsUnlocked)
            {
                GameManager.Instance?.Dialogue?.ShowDialogue("Lumi", "This coherence relay is already energized. The path forward remains stable!");
                return;
            }

            var sim = GameManager.Instance?.Simulator;
            if (sim == null) return;

            QuantumState target = RequiredStateName == "|+⟩" ? QuantumState.Plus :
                                  RequiredStateName == "|−⟩" ? QuantumState.Minus :
                                  RequiredStateName == "|1⟩" ? QuantumState.One : QuantumState.Zero;

            double fidelity = sim.State.FidelityWith(target);
            if (sim.CheckTargetReached(target))
            {
                IsUnlocked = true;
                UpdateVisuals();
                if (BarrierToOpen != null)
                {
                    BarrierToOpen.SetActive(false);
                }

                GameManager.Instance?.Dialogue?.ShowDialogue("Lumi",
                    $"Coherence relay energized! The state {RequiredStateName} matched with fidelity {fidelity:F4}. The garden gates are open!");
                GameManager.Instance?.Audio?.PlaySuccessChime();
            }
            else
            {
                GameManager.Instance?.Dialogue?.ShowDialogue("Lumi",
                    $"The relay rejected our state. It requires {RequiredStateName}, but our current state is {sim.State.Label} (Fidelity: {fidelity:F4}). Return to the console to prepare the required superposition!");
            }
        }

        private void UpdateVisuals()
        {
            if (RelayGlowLight != null)
            {
                RelayGlowLight.color = IsUnlocked ? ActiveColor : InactiveColor;
                RelayGlowLight.intensity = IsUnlocked ? 2.5f : 0.6f;
            }

            if (RelayCoreRenderer != null)
            {
                RelayCoreRenderer.material.color = IsUnlocked ? ActiveColor : InactiveColor;
            }
        }
    }
}
