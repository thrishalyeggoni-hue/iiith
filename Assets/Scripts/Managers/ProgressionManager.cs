using System;
using System.Collections.Generic;
using UnityEngine;
using QuantumEcho.Gameplay.Puzzles;

namespace QuantumEcho.Managers
{
    public class ProgressionManager : MonoBehaviour
    {
        public static ProgressionManager Instance { get; private set; }

        public int CurrentChapter { get; private set; } = 1;
        public event Action<int> OnChapterChanged;
        public event Action<string> OnPuzzleCompleted;

        private readonly Dictionary<string, PuzzleDefinition> _puzzlesById = new Dictionary<string, PuzzleDefinition>();
        private readonly HashSet<string> _completedPuzzles = new HashSet<string>();

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
            }
            else
            {
                Destroy(gameObject);
                return;
            }

            InitializePuzzles();
            LoadProgress();
        }

        private void InitializePuzzles()
        {
            var all = PuzzleDefinition.CreateAllChapterPuzzles();
            foreach (var p in all)
            {
                _puzzlesById[p.PuzzleId] = p;
            }
        }

        public PuzzleDefinition GetPuzzleDefinition(string id)
        {
            _puzzlesById.TryGetValue(id, out var def);
            return def;
        }

        public bool IsPuzzleCompleted(string id) => _completedPuzzles.Contains(id);

        public void CompletePuzzle(string id)
        {
            if (!_completedPuzzles.Contains(id))
            {
                _completedPuzzles.Add(id);
                OnPuzzleCompleted?.Invoke(id);

                CheckChapterProgression(id);
                SaveProgress();
            }
        }

        private void CheckChapterProgression(string lastCompletedId)
        {
            if (_puzzlesById.TryGetValue(lastCompletedId, out var def))
            {
                int puzzleChapter = def.ChapterNumber;
                if (puzzleChapter >= CurrentChapter)
                {
                    CurrentChapter = Mathf.Min(8, puzzleChapter + 1);
                    OnChapterChanged?.Invoke(CurrentChapter);
                }
            }
        }

        public void SetChapter(int chapter)
        {
            CurrentChapter = Mathf.Clamp(chapter, 1, 8);
            OnChapterChanged?.Invoke(CurrentChapter);
            SaveProgress();
        }

        public void SaveProgress()
        {
            var data = new SaveData
            {
                CurrentChapter = CurrentChapter,
                CompletedPuzzles = new List<string>(_completedPuzzles)
            };

            var player = GameManager.Instance?.Player;
            if (player != null)
            {
                data.CheckpointPosX = player.transform.position.x;
                data.CheckpointPosY = player.transform.position.y;
                data.CheckpointPosZ = player.transform.position.z;
                data.CheckpointRotY = player.transform.eulerAngles.y;
                data.HasSavedCheckpoint = true;
            }

            SaveSystem.Save(data);
        }

        public void LoadProgress()
        {
            var data = SaveSystem.Load();
            CurrentChapter = Mathf.Clamp(data.CurrentChapter, 1, 8);
            _completedPuzzles.Clear();
            foreach (var p in data.CompletedPuzzles)
                _completedPuzzles.Add(p);
        }

        public void ResetAllProgress()
        {
            _completedPuzzles.Clear();
            CurrentChapter = 1;
            SaveSystem.DeleteSave();
            OnChapterChanged?.Invoke(1);
        }
    }
}
