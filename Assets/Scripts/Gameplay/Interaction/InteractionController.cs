using UnityEngine;
using QuantumEcho.Managers;

namespace QuantumEcho.Gameplay.Interaction
{
    /// <summary>
    /// Scans for interactables in front of the player/camera, displays HUD prompts,
    /// and handles [E] trigger input.
    /// </summary>
    public class InteractionController : MonoBehaviour
    {
        [Header("Detection")]
        public float ReachDistance = 3.5f;
        public float SphereRadius = 0.5f;
        public LayerMask DetectionLayers = ~0;

        private Interactable _currentFocused;
        private Camera _mainCamera;

        public bool InputLocked { get; set; }

        private void Start()
        {
            _mainCamera = Camera.main;
        }

        private void Update()
        {
            if (_mainCamera == null)
                _mainCamera = Camera.main;

            if (InputLocked)
            {
                ClearFocus();
                return;
            }

            ScanForInteractables();

            if (_currentFocused != null && Input.GetKeyDown(KeyCode.E))
            {
                _currentFocused.OnInteract(gameObject);
            }
        }

        private void ScanForInteractables()
        {
            Vector3 origin = _mainCamera != null ? _mainCamera.transform.position : transform.position + Vector3.up * 1.2f;
            Vector3 direction = _mainCamera != null ? _mainCamera.transform.forward : transform.forward;

            Interactable bestCandidate = null;
            float bestDistance = ReachDistance;

            // Spherecast forward from camera
            Ray ray = new Ray(origin, direction);
            if (Physics.SphereCast(ray, SphereRadius, out RaycastHit hit, ReachDistance, DetectionLayers, QueryTriggerInteraction.Collide))
            {
                var interactable = hit.collider.GetComponentInParent<Interactable>();
                if (interactable != null && interactable.CanInteract(gameObject))
                {
                    bestCandidate = interactable;
                }
            }

            // Fallback: check small overlap sphere around player
            if (bestCandidate == null)
            {
                Collider[] colliders = Physics.OverlapSphere(transform.position + Vector3.up * 0.8f, 2.0f, DetectionLayers, QueryTriggerInteraction.Collide);
                foreach (var col in colliders)
                {
                    var inter = col.GetComponentInParent<Interactable>();
                    if (inter != null && inter.CanInteract(gameObject))
                    {
                        bestCandidate = inter;
                        break;
                    }
                }
            }

            if (bestCandidate != _currentFocused)
            {
                ClearFocus();
                _currentFocused = bestCandidate;
                if (_currentFocused != null)
                {
                    _currentFocused.OnFocusEnter();
                    GameManager.Instance?.HUD?.ShowInteractionPrompt(_currentFocused.GetPrompt());
                }
            }
        }

        private void ClearFocus()
        {
            if (_currentFocused != null)
            {
                _currentFocused.OnFocusExit();
                _currentFocused = null;
                GameManager.Instance?.HUD?.HideInteractionPrompt();
            }
        }
    }
}
