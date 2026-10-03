using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace QuantumEcho.Managers
{
    [Serializable]
    public class SaveData
    {
        public int CurrentChapter = 1;
        public List<string> CompletedPuzzles = new List<string>();
        public float CheckpointPosX;
        public float CheckpointPosY;
        public float CheckpointPosZ;
        public float CheckpointRotY;
        public bool HasSavedCheckpoint;
        public float MasterVolume = 1.0f;
        public bool ShowBlochTrajectories = true;
    }

    /// <summary>
    /// Local persistent save system with JSON serialization and corrupt-data protection.
    /// </summary>
    public static class SaveSystem
    {
        private static string SavePath => Path.Combine(Application.persistentDataPath, "quantumecho_save.json");

        public static void Save(SaveData data)
        {
            try
            {
                string json = JsonUtility.ToJson(data, true);
                File.WriteAllText(SavePath, json);
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveSystem] Failed to save progress: {ex.Message}");
            }
        }

        public static SaveData Load()
        {
            if (!File.Exists(SavePath))
            {
                return new SaveData();
            }

            try
            {
                string json = File.ReadAllText(SavePath);
                SaveData data = JsonUtility.FromJson<SaveData>(json);
                return data ?? new SaveData();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[SaveSystem] Save file corrupt or unreadable, creating fresh save. Error: {ex.Message}");
                return new SaveData();
            }
        }

        public static void DeleteSave()
        {
            try
            {
                if (File.Exists(SavePath))
                    File.Delete(SavePath);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[SaveSystem] Could not delete save: {ex.Message}");
            }
        }
    }
}
