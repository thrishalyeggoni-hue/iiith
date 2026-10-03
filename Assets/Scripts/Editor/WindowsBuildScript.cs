#if UNITY_EDITOR
using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace QuantumEcho.Editor
{
    /// <summary>
    /// Standalone Windows x64 build script for 'Quantum Echo: The City That Forgot'.
    /// Invoked from Unity Editor Menu or command line via -executeMethod.
    /// </summary>
    public static class WindowsBuildScript
    {
        private const string ScenePath = "Assets/Scenes/MainCity.unity";
        private const string OutputFolder = "Builds/Windows";
        private const string OutputExecutable = "Builds/Windows/QuantumEcho.exe";

        [MenuItem("Quantum Echo/Build Windows Standalone (x64)", false, 2)]
        public static void BuildWindows()
        {
            Debug.Log("[WindowsBuildScript] Starting Windows Standalone build...");

            // Ensure scene exists, or setup first
            if (!File.Exists(ScenePath))
            {
                Debug.LogWarning("[WindowsBuildScript] MainCity.unity not found. Executing EditorProjectSetup first...");
                EditorProjectSetup.SetupProject();
            }

            if (!Directory.Exists(OutputFolder))
            {
                Directory.CreateDirectory(OutputFolder);
            }

            BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
            {
                scenes = new string[] { ScenePath },
                locationPathName = OutputExecutable,
                target = BuildTarget.StandaloneWindows64,
                options = BuildOptions.None
            };

            BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);
            BuildSummary summary = report.summary;

            if (summary.result == BuildResult.Succeeded)
            {
                Debug.Log($"[WindowsBuildScript] BUILD SUCCEEDED! Total size: {summary.totalSize} bytes. Output: {OutputExecutable}");
            }
            else if (summary.result == BuildResult.Failed)
            {
                Debug.LogError($"[WindowsBuildScript] BUILD FAILED! Total errors: {summary.totalErrors}");
                if (Application.isBatchMode)
                {
                    EditorApplication.Exit(1);
                }
            }
        }
    }
}
#endif
