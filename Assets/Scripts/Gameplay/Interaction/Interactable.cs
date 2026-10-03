using UnityEngine;

namespace QuantumEcho.Gameplay.Interaction
{
    /// <summary>
    /// Base class for any object in the world Mira can interact with by pressing [E].
    /// </summary>
    public abstract class Interactable : MonoBehaviour
    {
        [Header("Interaction Settings")]
        public string PromptText = "Interact";
        public float InteractionDistance = 3.0f;
        public bool IsEnabled = true;

        public virtual string GetPrompt() => $"[E] {PromptText}";

        public abstract void OnInteract(GameObject player);

        public virtual bool CanInteract(GameObject player)
        {
            if (!IsEnabled) return false;
            float dist = Vector3.Distance(transform.position, player.transform.position);
            return dist <= InteractionDistance;
        }

        public virtual void OnFocusEnter() { }
        public virtual void OnFocusExit() { }
    }
}
