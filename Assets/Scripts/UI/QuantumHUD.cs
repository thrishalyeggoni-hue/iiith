using System;
using UnityEngine;
using QuantumEcho.Managers;
using QuantumEcho.Quantum;

namespace QuantumEcho.UI
{
    /// <summary>
    /// In-game Heads-Up Display (HUD) showing current objective, interaction prompt,
    /// compact state vector readout, and banner messages.
    /// </summary>
    public class QuantumHUD : MonoBehaviour
    {
        private string _interactionPrompt = "";
        private string _bannerNotification = "";
        private float _bannerTimer = 0f;

        private QuantumState _currentState;
        private string _circuitString = "Empty";

        public void ShowInteractionPrompt(string prompt) => _interactionPrompt = prompt;
        public void HideInteractionPrompt() => _interactionPrompt = "";

        public void ShowBannerNotification(string message, float duration = 3.5f)
        {
            _bannerNotification = message;
            _bannerTimer = duration;
        }

        public void UpdateQuantumStateDisplay(QuantumState state, string circuitString)
        {
            _currentState = state;
            _circuitString = circuitString;
        }

        private void Update()
        {
            if (_bannerTimer > 0f)
            {
                _bannerTimer -= Time.deltaTime;
                if (_bannerTimer <= 0f)
                    _bannerNotification = "";
            }
        }

        private void OnGUI()
        {
            // Do not draw exploration HUD while a menu/console is open
            if (GameManager.Instance != null && GameManager.Instance.IsAnyUIOpen())
                return;

            GUI.skin.label.fontSize = 13;

            // 1. Top-Left: Chapter & Objective Card
            int chapter = ProgressionManager.Instance != null ? ProgressionManager.Instance.CurrentChapter : 1;
            Rect objRect = new Rect(20, 20, 360, 80);
            GUI.color = new Color(0.05f, 0.1f, 0.2f, 0.85f);
            GUI.DrawTexture(objRect, Texture2D.whiteTexture);
            GUI.color = Color.white;

            GUILayout.BeginArea(objRect);
            GUILayout.Space(6);
            GUILayout.Label($"<b><size=15>CHAPTER {chapter} — FLOATING CITY OF ASTER</size></b>");
            GUILayout.Label($"Press <b>[E]</b> to interact | <b>[J]</b> Journal | <b>[Esc]</b> Pause");
            GUILayout.EndArea();

            // 2. Top-Right: Echo Lantern Quantum State
            if (_currentState != null)
            {
                Rect stateRect = new Rect(Screen.width - 320, 20, 300, 110);
                GUI.color = new Color(0.05f, 0.1f, 0.2f, 0.85f);
                GUI.DrawTexture(stateRect, Texture2D.whiteTexture);
                GUI.color = Color.white;

                GUILayout.BeginArea(stateRect);
                GUILayout.Space(6);
                GUILayout.Label("<b><size=14>ECHO LANTERN QUBIT</size></b>");
                GUILayout.Label($"State: <b>{_currentState.Label}</b>");
                GUILayout.Label($"P(|0⟩): {_currentState.Probability0 * 100:F0}%  |  P(|1⟩): {_currentState.Probability1 * 100:F0}%");
                GUILayout.Label($"Relative Phase: {_currentState.RelativePhaseDegrees:F0}°");
                GUILayout.Label($"Circuit: {_circuitString}");
                GUILayout.EndArea();
            }

            // 3. Center Screen: Reticle & Interaction Prompt
            if (!string.IsNullOrEmpty(_interactionPrompt))
            {
                float promptWidth = 340f;
                float promptHeight = 36f;
                Rect pRect = new Rect((Screen.width - promptWidth) * 0.5f, (Screen.height * 0.5f) + 40f, promptWidth, promptHeight);

                GUI.color = new Color(0.1f, 0.2f, 0.4f, 0.9f);
                GUI.DrawTexture(pRect, Texture2D.whiteTexture);
                GUI.color = new Color(0.3f, 1.0f, 0.9f);

                GUI.Label(pRect, $"<b>{_interactionPrompt}</b>", new GUIStyle(GUI.skin.label)
                {
                    alignment = TextAnchor.MiddleCenter,
                    fontSize = 14
                });
                GUI.color = Color.white;
            }
            else
            {
                // Small center reticle dot
                float dotSize = 4f;
                Rect dotRect = new Rect((Screen.width - dotSize) * 0.5f, (Screen.height - dotSize) * 0.5f, dotSize, dotSize);
                GUI.color = new Color(1f, 1f, 1f, 0.6f);
                GUI.DrawTexture(dotRect, Texture2D.whiteTexture);
                GUI.color = Color.white;
            }

            // 4. Banner Notification
            if (!string.IsNullOrEmpty(_bannerNotification))
            {
                float bWidth = Mathf.Min(Screen.width - 80f, 600f);
                Rect bRect = new Rect((Screen.width - bWidth) * 0.5f, Screen.height - 110f, bWidth, 42f);

                GUI.color = new Color(0.08f, 0.25f, 0.45f, 0.95f);
                GUI.DrawTexture(bRect, Texture2D.whiteTexture);
                GUI.color = new Color(1.0f, 0.9f, 0.3f);

                GUI.Label(bRect, $"<b>{_bannerNotification}</b>", new GUIStyle(GUI.skin.label)
                {
                    alignment = TextAnchor.MiddleCenter,
                    fontSize = 14
                });
                GUI.color = Color.white;
            }
        }
    }
}
