using UnityEngine;

namespace QuantumEcho.Gameplay.Player
{
    /// <summary>
    /// Orbiting third-person camera with smooth damping and wall occlusion avoidance.
    /// </summary>
    public class ThirdPersonCamera : MonoBehaviour
    {
        [Header("Target & Offsets")]
        public Transform Target;
        public Vector3 TargetOffset = new Vector3(0.0f, 1.4f, 0.0f);
        public float Distance = 4.2f;
        public float MinDistance = 1.0f;
        public float MaxDistance = 6.5f;

        [Header("Sensitivity & Limits")]
        public float MouseSensitivity = 2.0f;
        public float MinPitch = -20.0f;
        public float MaxPitch = 60.0f;
        public float SmoothTime = 0.05f;

        [Header("Occlusion Collision")]
        public LayerMask CollisionLayers = ~0;
        public float CollisionRadius = 0.25f;

        private float _yaw;
        private float _pitch = 15.0f;
        private Vector3 _currentVelocity;
        private float _currentDistance;

        public bool InputLocked { get; set; }

        private void Start()
        {
            _currentDistance = Distance;
            if (Target != null)
            {
                _yaw = Target.eulerAngles.y;
            }
            SetCursorLocked(true);
        }

        private void LateUpdate()
        {
            if (Target == null) return;

            if (!InputLocked)
            {
                float mouseX = Input.GetAxis("Mouse X") * MouseSensitivity;
                float mouseY = Input.GetAxis("Mouse Y") * MouseSensitivity;

                _yaw += mouseX;
                _pitch -= mouseY;
                _pitch = Mathf.Clamp(_pitch, MinPitch, MaxPitch);
            }

            Quaternion rotation = Quaternion.Euler(_pitch, _yaw, 0.0f);
            Vector3 focusPoint = Target.position + TargetOffset;

            // Check collision ray from focus point to desired camera position
            Vector3 desiredDirection = rotation * -Vector3.forward;
            Vector3 desiredPosition = focusPoint + desiredDirection * Distance;

            float targetDist = Distance;
            if (Physics.SphereCast(focusPoint, CollisionRadius, desiredDirection, out RaycastHit hit, Distance, CollisionLayers, QueryTriggerInteraction.Ignore))
            {
                targetDist = Mathf.Clamp(hit.distance - 0.1f, MinDistance, MaxDistance);
            }

            _currentDistance = Mathf.Lerp(_currentDistance, targetDist, Time.deltaTime * 12.0f);
            Vector3 finalPos = focusPoint + desiredDirection * _currentDistance;

            transform.position = finalPos;
            transform.rotation = rotation;
        }

        public void SetCursorLocked(bool locked)
        {
            Cursor.lockState = locked ? CursorLockMode.Locked : CursorLockMode.None;
            Cursor.visible = !locked;
        }
    }
}
