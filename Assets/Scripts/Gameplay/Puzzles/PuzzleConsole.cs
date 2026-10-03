using System;
using UnityEngine;
using QuantumEcho.Gameplay.Interaction;
using QuantumEcho.Managers;
using QuantumEcho.Quantum;

namespace QuantumEcho.Gameplay.Puzzles
{
    /// <summary>
    /// World console where Mira interfaces her Echo Lantern with the district infrastructure.
    /// Opens the interactive quantum HUD, Bloch sphere, and gate manipulation controls.
    /// </summary>
    public class PuzzleConsole : Interactable
    {
        [Header("Puzzle Configuration")]
        public string PuzzleId = "ch1_p1";
        public Transform ConsoleCameraPoint;
        public GameObject SolvedIndicatorObject;
        public GameObject WorldObjectToUnlock; // Door, bridge, lift, beacon
        public bool IsSolved { get; private set; }

        private PuzzleDefinition _definition;

        private void Start()
        {
            PromptText = "Access Quantum Console";
            _definition = ProgressionManager.Instance != null ?
                ProgressionManager.Instance.GetPuzzleDefinition(PuzzleId) : null;

            UpdateVisualState();
        }

        public override void OnInteract(GameObject player)
        {
            if (GameManager.Instance == null) return;

            // Load puzzle definition
            if (_definition == null && ProgressionManager.Instance != null)
            {
                _definition = ProgressionManager.Instance.GetPuzzleDefinition(PuzzleId);
            }

            if (_definition != null)
            {
                GameManager.Instance.OpenPuzzleConsole(this, _definition);
            }
        }

        public void MarkSolved()
        {
            IsSolved = true;
            UpdateVisualState();

            if (WorldObjectToUnlock != null)
            {
                // Trigger unlock (e.g. deactivate barrier, activate bridge)
                WorldObjectToUnlock.SetActive(false); // If it's a barrier
            }

            if (ProgressionManager.Instance != null)
            {
                ProgressionManager.Instance.CompletePuzzle(PuzzleId);
            }
        }

        private void UpdateVisualState()
        {
            if (SolvedIndicatorObject != null)
            {
                SolvedIndicatorObject.SetActive(IsSolved);
            }
        }
    }
}
