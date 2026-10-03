using System;
using UnityEngine;
using QuantumEcho.Managers;

namespace QuantumEcho.UI
{
    /// <summary>
    /// Pause menu providing options to resume, reload safe checkpoint, select chapters,
    /// adjust master audio volume, and toggle trajectory visualizations.
    /// </summary>
    public class PauseMenuUI : MonoBehaviour
    {
        private bool _isOpen = false;
        private float _volume = 1.0f;
        private bool _showTrajectories = true;
        private bool _showChapterSelect = false;

        public void Open()
        {
            _isOpen = true;
            gameObject.SetActive(true);
        }

        public void Close()
        {
            _isOpen = false;
            _showChapterSelect = false;
            gameObject.SetActive(false);
        }

        private void OnGUI()
        {
            if (!_isOpen) return;

            GUI.skin.box.fontSize = 13;
            GUI.skin.button.fontSize = 13;
            GUI.skin.label.fontSize = 13;

            // Dim backdrop
            GUI.color = new Color(0.02f, 0.05f, 0.12f, 0.92f);
            GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Texture2D.whiteTexture);
            GUI.color = Color.white;

            float width = 420f;
            float height = _showChapterSelect ? 520f : 420f;
            Rect rect = new Rect((Screen.width - width) * 0.5f, (Screen.height - height) * 0.5f, width, height);

            GUILayout.BeginArea(rect, GUI.skin.box);
            GUILayout.Space(8);
            GUILayout.Label("<b><size=20>PAUSED — QUANTUM ECHO</size></b>", new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter });
            GUILayout.Space(12);

            if (!_showChapterSelect)
            {
                if (GUILayout.Button("Resume Game [Esc]", GUILayout.Height(38)))
                {
                    GameManager.Instance?.ResumeGame();
                }

                GUILayout.Space(4);
                if (GUILayout.Button("Reload Checkpoint", GUILayout.Height(34)))
                {
                    GameManager.Instance?.ResumeGame();
                    GameManager.Instance?.Player?.RespawnAtSafePosition();
                }

                GUILayout.Space(4);
                if (GUILayout.Button("Chapter Select & Replay", GUILayout.Height(34)))
                {
                    _showChapterSelect = true;
                }

                GUILayout.Space(4);
                if (GUILayout.Button("Open Journal & Codex [J]", GUILayout.Height(34)))
                {
                    GameManager.Instance?.ResumeGame();
                    GameManager.Instance?.OpenJournal();
                }

                GUILayout.Space(12);
                GUILayout.Label($"<b>Audio Volume:</b> {Mathf.RoundToInt(_volume * 100)}%");
                _volume = GUILayout.HorizontalSlider(_volume, 0.0f, 1.0f);
                AudioListener.volume = _volume;

                GUILayout.Space(6);
                _showTrajectories = GUILayout.Toggle(_showTrajectories, "Show Bloch Sphere Trajectories");

                GUILayout.FlexibleSpace();
                if (GUILayout.Button("Quit Game", GUILayout.Height(32)))
                {
                    Application.Quit();
                }
            }
            else
            {
                GUILayout.Label("<b>SELECT CHAPTER TO REPLAY:</b>");
                string[] chapters = new string[]
                {
                    "Ch 1: Arrival Harbor (|0⟩ and |1⟩)",
                    "Ch 2: Switchworks (Pauli-X Gate)",
                    "Ch 3: Twin-Light Garden (Superposition & H)",
                    "Ch 4: Phase Observatory (Pauli-Z Gate)",
                    "Ch 5: Echo Bridge (Gate Order Matters)",
                    "Ch 6: Reversal Vault (Unitary Inverses)",
                    "Ch 7: Measurement Station (The Collapse)",
                    "Ch 8: Echo Core (Final Restoration)"
                };

                for (int i = 0; i < chapters.Length; i++)
                {
                    if (GUILayout.Button(chapters[i], GUILayout.Height(30)))
                    {
                        ProgressionManager.Instance?.SetChapter(i + 1);
                        GameManager.Instance?.ResumeGame();
                        GameManager.Instance?.Player?.RespawnAtSafePosition();
                    }
                }

                GUILayout.Space(8);
                if (GUILayout.Button("➔ Back to Menu", GUILayout.Height(30)))
                {
                    _showChapterSelect = false;
                }
            }

            GUILayout.EndArea();
        }
    }
}
