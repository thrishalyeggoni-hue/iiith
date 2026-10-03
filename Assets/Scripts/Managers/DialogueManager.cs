using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace QuantumEcho.Managers
{
    [Serializable]
    public class DialogueLine
    {
        public string Speaker;
        [TextArea(2, 5)] public string Text;

        public DialogueLine(string speaker, string text)
        {
            Speaker = speaker;
            Text = text;
        }
    }

    public class DialogueManager : MonoBehaviour
    {
        public static DialogueManager Instance { get; private set; }

        public bool IsDialogueActive { get; private set; }
        public event Action<DialogueLine> OnLineDisplayed;
        public event Action OnDialogueEnded;

        private Queue<DialogueLine> _lineQueue = new Queue<DialogueLine>();
        private Action _onCompleteCallback;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Update()
        {
            if (IsDialogueActive && (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.Return) || Input.GetKeyDown(KeyCode.E)))
            {
                AdvanceDialogue();
            }
        }

        public void ShowDialogue(string speaker, string text, Action onComplete = null)
        {
            ShowConversation(new List<DialogueLine> { new DialogueLine(speaker, text) }, onComplete);
        }

        public void ShowConversation(List<DialogueLine> lines, Action onComplete = null)
        {
            if (lines == null || lines.Count == 0) return;

            _lineQueue.Clear();
            foreach (var line in lines)
                _lineQueue.Enqueue(line);

            _onCompleteCallback = onComplete;
            IsDialogueActive = true;

            if (GameManager.Instance != null)
                GameManager.Instance.SetPlayerControlLocked(true);

            AdvanceDialogue();
        }

        public void AdvanceDialogue()
        {
            if (_lineQueue.Count > 0)
            {
                DialogueLine line = _lineQueue.Dequeue();
                OnLineDisplayed?.Invoke(line);
                GameManager.Instance?.Audio?.PlayButtonClick();
            }
            else
            {
                EndDialogue();
            }
        }

        public void EndDialogue()
        {
            IsDialogueActive = false;
            OnDialogueEnded?.Invoke();

            if (GameManager.Instance != null && !GameManager.Instance.IsAnyUIOpen())
                GameManager.Instance.SetPlayerControlLocked(false);

            _onCompleteCallback?.Invoke();
            _onCompleteCallback = null;
        }
    }
}
