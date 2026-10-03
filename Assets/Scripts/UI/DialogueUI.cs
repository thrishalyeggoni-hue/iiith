using System;
using UnityEngine;
using QuantumEcho.Managers;

namespace QuantumEcho.UI
{
    /// <summary>
    /// Narrative dialogue box displaying speaker names and story dialogues.
    /// </summary>
    public class DialogueUI : MonoBehaviour
    {
        private DialogueLine _currentLine;
        private bool _isActive = false;

        private void Start()
        {
            if (DialogueManager.Instance != null)
            {
                DialogueManager.Instance.OnLineDisplayed += OnLineDisplayed;
                DialogueManager.Instance.OnDialogueEnded += OnDialogueEnded;
            }
        }

        private void OnDestroy()
        {
            if (DialogueManager.Instance != null)
            {
                DialogueManager.Instance.OnLineDisplayed -= OnLineDisplayed;
                DialogueManager.Instance.OnDialogueEnded -= OnDialogueEnded;
            }
        }

        private void OnLineDisplayed(DialogueLine line)
        {
            _currentLine = line;
            _isActive = true;
        }

        private void OnDialogueEnded()
        {
            _isActive = false;
            _currentLine = null;
        }

        private void OnGUI()
        {
            if (!_isActive || _currentLine == null) return;

            float boxWidth = Mathf.Min(Screen.width - 60f, 760f);
            float boxHeight = 130f;
            float boxX = (Screen.width - boxWidth) * 0.5f;
            float boxY = Screen.height - boxHeight - 40f;

            Rect rect = new Rect(boxX, boxY, boxWidth, boxHeight);
            GUI.color = new Color(0.04f, 0.08f, 0.16f, 0.95f);
            GUI.DrawTexture(rect, Texture2D.whiteTexture);
            GUI.color = Color.white;

            GUILayout.BeginArea(rect, GUI.skin.box);
            GUILayout.Space(6);

            Color speakerColor = _currentLine.Speaker == "Mira" ? new Color(0.3f, 0.85f, 1.0f) :
                                 _currentLine.Speaker == "Lumi" ? new Color(1.0f, 0.8f, 0.25f) :
                                 _currentLine.Speaker == "Dr. Ishan" ? new Color(0.4f, 1.0f, 0.5f) :
                                 new Color(1.0f, 0.4f, 0.4f);

            GUI.color = speakerColor;
            GUILayout.Label($"<b><size=16>{_currentLine.Speaker.ToUpperInvariant()}</size></b>");
            GUI.color = Color.white;

            GUILayout.Label($"<size=14>{_currentLine.Text}</size>");

            GUILayout.FlexibleSpace();
            GUILayout.BeginHorizontal();
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("Next ➔ [Space/E]", GUILayout.Width(130), GUILayout.Height(26)))
            {
                DialogueManager.Instance?.AdvanceDialogue();
            }
            GUILayout.EndHorizontal();
            GUILayout.EndArea();
        }
    }
}
