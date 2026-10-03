#if UNITY_EDITOR
using System;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using QuantumEcho.Managers;
using QuantumEcho.UI;
using QuantumEcho.World;

namespace QuantumEcho.Editor
{
    /// <summary>
    /// Idempotent Editor setup script.
    /// Builds and saves the main game scene, connects all component references,
    /// configures build settings, and creates essential tags and layers.
    /// Can be executed from the Unity Editor menu or invoked via -batchmode CLI.
    /// </summary>
    public static class EditorProjectSetup
    {
        private const string SceneFolder = "Assets/Scenes";
        private const string ScenePath = "Assets/Scenes/MainCity.unity";

        [MenuItem("Quantum Echo/Setup Project and Scenes", false, 1)]
        public static void SetupProject()
        {
            Debug.Log("[EditorProjectSetup] Starting automated project setup for 'Quantum Echo: The City That Forgot'...");

            if (!Directory.Exists(SceneFolder))
            {
                Directory.CreateDirectory(SceneFolder);
                AssetDatabase.Refresh();
            }

            // Create new scene or open existing
            Scene newScene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            // 1. Create Core Systems GameObject
            GameObject coreSystems = new GameObject("Core_GameSystems");
            var gm = coreSystems.AddComponent<GameManager>();
            var prog = coreSystems.AddComponent<ProgressionManager>();
            var dialogue = coreSystems.AddComponent<DialogueManager>();
            var audio = coreSystems.AddComponent<AudioHelper>();

            // 2. Create UI Manager hierarchy
            GameObject uiRoot = new GameObject("UI_Root");
            var hud = uiRoot.AddComponent<QuantumHUD>();
            var consoleUI = uiRoot.AddComponent<PuzzleConsoleUI>();
            consoleUI.gameObject.SetActive(false);
            var dialogueUI = uiRoot.AddComponent<DialogueUI>();
            var journalUI = uiRoot.AddComponent<JournalUI>();
            journalUI.gameObject.SetActive(false);
            var pauseUI = uiRoot.AddComponent<PauseMenuUI>();
            pauseUI.gameObject.SetActive(false);
            var experimentUI = uiRoot.AddComponent<ExperimentStationUI>();
            experimentUI.gameObject.SetActive(false);

            // Wire up UI references to GameManager
            gm.HUD = hud;
            gm.ConsoleUI = consoleUI;
            gm.DialogueUI = dialogueUI;
            gm.JournalUI = journalUI;
            gm.PauseUI = pauseUI;
            gm.ExperimentUI = experimentUI;

            // 3. Create World Builder and generate city
            GameObject worldRoot = new GameObject("World_Root");
            var builder = worldRoot.AddComponent<WorldBuilder>();
            builder.BuildOnStart = false; // We generate it right now in editor
            builder.GenerateCompleteCity();

            // 4. Save Scene
            EditorSceneManager.SaveScene(newScene, ScenePath);
            Debug.Log($"[EditorProjectSetup] Saved scene to {ScenePath}");

            // 5. Register in EditorBuildSettings
            RegisterBuildScene(ScenePath);

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            Debug.Log("[EditorProjectSetup] Project setup completed successfully with all references assigned!");
        }

        private static void RegisterBuildScene(string path)
        {
            var scenes = EditorBuildSettings.scenes;
            bool alreadyRegistered = false;

            foreach (var s in scenes)
            {
                if (s.path == path)
                {
                    alreadyRegistered = true;
                    break;
                }
            }

            if (!alreadyRegistered)
            {
                var newScenes = new EditorBuildSettingsScene[scenes.Length + 1];
                for (int i = 0; i < scenes.Length; i++)
                    newScenes[i] = scenes[i];

                newScenes[scenes.Length] = new EditorBuildSettingsScene(path, true);
                EditorBuildSettings.scenes = newScenes;
                Debug.Log($"[EditorProjectSetup] Registered '{path}' in EditorBuildSettings.");
            }
        }
    }
}
#endif
