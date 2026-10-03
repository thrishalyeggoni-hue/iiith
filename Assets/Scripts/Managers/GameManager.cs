using System;
using UnityEngine;
using QuantumEcho.Gameplay.Player;
using QuantumEcho.Gameplay.Interaction;
using QuantumEcho.Gameplay.Puzzles;
using QuantumEcho.Quantum;
using QuantumEcho.UI;

namespace QuantumEcho.Managers
{
    public enum GameState
    {
        Exploring,
        InPuzzleConsole,
        InDialogue,
        InMeasurementLab,
        InJournal,
        Paused,
        Victory
    }

    /// <summary>
    /// Master coordinator for gameplay state, simulator lifetime, player inputs, and UI panels.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Runtime Simulator")]
        public QuantumSimulator Simulator { get; private set; }

        [Header("Player & Camera References")]
        public ThirdPersonController Player;
        public ThirdPersonCamera CameraController;
        public EchoLantern Lantern;
        public InteractionController Interactor;

        [Header("UI Managers")]
        public QuantumHUD HUD;
        public PuzzleConsoleUI ConsoleUI;
        public DialogueUI DialogueUI;
        public JournalUI JournalUI;
        public PauseMenuUI PauseUI;
        public ExperimentStationUI ExperimentUI;

        [Header("Audio")]
        public AudioHelper Audio;
        public DialogueManager Dialogue;
        public ProgressionManager Progression;

        public GameState State { get; private set; } = GameState.Exploring;

        private PuzzleConsole _activeConsole;
        private PuzzleDefinition _activePuzzle;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else { Destroy(gameObject); return; }

            Simulator = new QuantumSimulator(QuantumState.Zero);

            if (Audio == null) Audio = GetComponentInChildren<AudioHelper>() ?? gameObject.AddComponent<AudioHelper>();
            if (Dialogue == null) Dialogue = GetComponentInChildren<DialogueManager>() ?? gameObject.AddComponent<DialogueManager>();
            if (Progression == null) Progression = GetComponentInChildren<ProgressionManager>() ?? gameObject.AddComponent<ProgressionManager>();
        }

        private void Start()
        {
            if (Simulator != null)
            {
                Simulator.OnStateChanged += OnQuantumStateChanged;
                // Initial update
                OnQuantumStateChanged(Simulator.State);
            }

            SetState(GameState.Exploring);

            // Play introductory dialogue
            Dialogue?.ShowConversation(new System.Collections.Generic.List<DialogueLine>
            {
                new DialogueLine("Mira", "Aster... the city of light and coherence. It's completely dark. The Echo Core must have destabilized."),
                new DialogueLine("Lumi", "Bzzzt... Mira! You've returned! The Auditor initiated universal measurements across our power grid. It forced all our coherent circuits into classical bits!"),
                new DialogueLine("Mira", "We have to reach the Echo Core. I have my father's Echo Lantern—we can retrace and reconstruct the circuits, but we must protect our states from unwanted measurement."),
                new DialogueLine("Lumi", "Terminal Alpha is just ahead at the harbor gate. Use your console to prepare a fresh |0⟩ basis state to calibrate it!")
            });
        }

        private void Update()
        {
            HandleGlobalHotkeys();
        }

        private void HandleGlobalHotkeys()
        {
            if (Input.GetKeyDown(KeyCode.Escape))
            {
                if (State == GameState.Paused)
                    ResumeGame();
                else if (State == GameState.InPuzzleConsole || State == GameState.InMeasurementLab || State == GameState.InJournal)
                    CloseActiveSubMenu();
                else if (State == GameState.Exploring)
                    PauseGame();
            }

            if (Input.GetKeyDown(KeyCode.J) && State == GameState.Exploring)
            {
                OpenJournal();
            }

            if (Input.GetKeyDown(KeyCode.R) && State == GameState.InPuzzleConsole)
            {
                ResetCurrentPuzzle();
            }

            if ((Input.GetKeyDown(KeyCode.Z) || Input.GetKeyDown(KeyCode.Q)) && State == GameState.InPuzzleConsole)
            {
                ApplyInverseLastGate();
            }
        }

        private void OnQuantumStateChanged(QuantumState state)
        {
            if (Lantern != null)
                Lantern.UpdateVisuals(state);

            if (HUD != null)
                HUD.UpdateQuantumStateDisplay(state, Simulator?.History?.ToCircuitString());

            if (ConsoleUI != null && ConsoleUI.gameObject.activeSelf)
                ConsoleUI.RefreshUI(state, Simulator?.History);
        }

        public void OpenPuzzleConsole(PuzzleConsole console, PuzzleDefinition def)
        {
            _activeConsole = console;
            _activePuzzle = def;

            SetState(GameState.InPuzzleConsole);

            // Initialize simulator with puzzle's initial state
            Simulator.Prepare(def.InitialState, $"Puzzle Init: {def.PuzzleTitle}");

            if (ConsoleUI != null)
            {
                ConsoleUI.Open(def, Simulator);
            }
        }

        public void ClosePuzzleConsole()
        {
            if (ConsoleUI != null)
                ConsoleUI.Close();

            _activeConsole = null;
            _activePuzzle = null;

            SetState(GameState.Exploring);
        }

        public void OpenMeasurementLab(MeasurementStation station)
        {
            SetState(GameState.InMeasurementLab);
            if (ExperimentUI != null)
            {
                ExperimentUI.Open(station, Simulator);
            }
        }

        public void CloseMeasurementLab()
        {
            if (ExperimentUI != null)
                ExperimentUI.Close();

            SetState(GameState.Exploring);
        }

        public void OpenJournal()
        {
            SetState(GameState.InJournal);
            if (JournalUI != null)
                JournalUI.Open();
        }

        public void CloseJournal()
        {
            if (JournalUI != null)
                JournalUI.Close();

            SetState(GameState.Exploring);
        }

        public void PauseGame()
        {
            SetState(GameState.Paused);
            Time.timeScale = 0f;
            if (PauseUI != null)
                PauseUI.Open();
        }

        public void ResumeGame()
        {
            Time.timeScale = 1f;
            if (PauseUI != null)
                PauseUI.Close();

            SetState(GameState.Exploring);
        }

        public void CloseActiveSubMenu()
        {
            if (State == GameState.InPuzzleConsole) ClosePuzzleConsole();
            else if (State == GameState.InMeasurementLab) CloseMeasurementLab();
            else if (State == GameState.InJournal) CloseJournal();
        }

        public void ResetCurrentPuzzle()
        {
            if (_activePuzzle != null && Simulator != null)
            {
                Simulator.Prepare(_activePuzzle.InitialState, "Reset to Start");
                Audio?.PlayButtonClick();
            }
        }

        public void ApplyInverseLastGate()
        {
            if (Simulator != null)
            {
                bool success = Simulator.ApplyLastInverse(out string message);
                if (success)
                {
                    Audio?.PlayGateApply();
                    HUD?.ShowBannerNotification(message);
                }
                else
                {
                    Audio?.PlayError();
                    HUD?.ShowBannerNotification($"Inverse Blocked: {message}");
                }
            }
        }

        public void CheckActivePuzzleSuccess()
        {
            if (_activePuzzle == null || _activeConsole == null) return;

            if (_activePuzzle.CheckSuccess(Simulator, out string feedback))
            {
                Audio?.PlaySuccessChime();
                HUD?.ShowBannerNotification(feedback);

                _activeConsole.MarkSolved();

                if (!string.IsNullOrEmpty(_activePuzzle.CompletionExplanation))
                {
                    Dialogue?.ShowDialogue("Lumi", _activePuzzle.CompletionExplanation, () =>
                    {
                        ClosePuzzleConsole();
                    });
                }
                else
                {
                    ClosePuzzleConsole();
                }
            }
        }

        public void SetPlayerControlLocked(bool locked)
        {
            if (Player != null) Player.InputLocked = locked;
            if (CameraController != null)
            {
                CameraController.InputLocked = locked;
                CameraController.SetCursorLocked(!locked);
            }
            if (Interactor != null) Interactor.InputLocked = locked;
        }

        public bool IsAnyUIOpen()
        {
            return State != GameState.Exploring;
        }

        private void SetState(GameState newState)
        {
            State = newState;
            bool lockControl = (newState != GameState.Exploring);
            SetPlayerControlLocked(lockControl);
        }
    }
}
