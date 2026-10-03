using System;
using UnityEngine;

namespace QuantumEcho.Gameplay.Player
{
    /// <summary>
    /// Smooth third-person character controller for Mira.
    /// Handles camera-relative movement, sprinting, gravity, safe fall recovery,
    /// and procedural movement bobbing/animation.
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    public class ThirdPersonController : MonoBehaviour
    {
        [Header("Movement Speeds")]
        public float WalkSpeed = 4.5f;
        public float SprintSpeed = 7.5f;
        public float RotationSmoothTime = 0.12f;
        public float SpeedChangeRate = 10.0f;

        [Header("Gravity & Physics")]
        public float Gravity = -18.0f;
        public float FallLimitY = -12.0f;

        [Header("Procedural Visuals")]
        public Transform VisualRoot;
        public Transform LeftLeg;
        public Transform RightLeg;
        public Transform LanternHoldPoint;

        private CharacterController _controller;
        private Transform _cameraTransform;
        private float _currentSpeed;
        private float _rotationVelocity;
        private float _verticalVelocity;
        private Vector3 _lastSafePosition;
        private Quaternion _lastSafeRotation;

        private float _walkCycle;
        private bool _isGrounded;

        public bool InputLocked { get; set; }

        private void Awake()
        {
            _controller = GetComponent<CharacterController>();
            if (Camera.main != null)
                _cameraTransform = Camera.main.transform;

            _lastSafePosition = transform.position;
            _lastSafeRotation = transform.rotation;
        }

        private void Start()
        {
            if (_cameraTransform == null && Camera.main != null)
                _cameraTransform = Camera.main.transform;
        }

        private void Update()
        {
            if (_cameraTransform == null && Camera.main != null)
                _cameraTransform = Camera.main.transform;

            CheckFallRecovery();

            if (InputLocked)
            {
                ApplyGravityOnly();
                return;
            }

            HandleMovement();
            AnimateProceduralWalking();
        }

        private void HandleMovement()
        {
            _isGrounded = _controller.isGrounded;
            if (_isGrounded && _verticalVelocity < 0.0f)
            {
                _verticalVelocity = -2f;
            }

            float h = Input.GetAxisRaw("Horizontal");
            float v = Input.GetAxisRaw("Vertical");
            Vector3 inputDirection = new Vector3(h, 0.0f, v).normalized;

            bool isSprinting = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
            float targetSpeed = inputDirection.magnitude > 0.1f ? (isSprinting ? SprintSpeed : WalkSpeed) : 0.0f;

            float currentHorizontalSpeed = new Vector3(_controller.velocity.x, 0.0f, _controller.velocity.z).magnitude;
            float speedOffset = 0.1f;

            if (currentHorizontalSpeed < targetSpeed - speedOffset || currentHorizontalSpeed > targetSpeed + speedOffset)
            {
                _currentSpeed = Mathf.Lerp(currentHorizontalSpeed, targetSpeed, Time.deltaTime * SpeedChangeRate);
            }
            else
            {
                _currentSpeed = targetSpeed;
            }

            Vector3 moveDir = Vector3.zero;

            if (inputDirection.magnitude > 0.1f)
            {
                float cameraYaw = _cameraTransform != null ? _cameraTransform.eulerAngles.y : 0f;
                float targetRotation = Mathf.Atan2(inputDirection.x, inputDirection.z) * Mathf.Rad2Deg + cameraYaw;
                float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetRotation, ref _rotationVelocity, RotationSmoothTime);

                transform.rotation = Quaternion.Euler(0.0f, angle, 0.0f);
                moveDir = Quaternion.Euler(0.0f, targetRotation, 0.0f) * Vector3.forward;
            }

            _verticalVelocity += Gravity * Time.deltaTime;

            Vector3 velocity = (moveDir.normalized * _currentSpeed) + new Vector3(0.0f, _verticalVelocity, 0.0f);
            _controller.Move(velocity * Time.deltaTime);

            if (_isGrounded && _controller.velocity.magnitude < 0.1f)
            {
                // Periodically update safe ground position
                if (transform.position.y > FallLimitY + 5.0f)
                {
                    _lastSafePosition = transform.position;
                    _lastSafeRotation = transform.rotation;
                }
            }
        }

        private void ApplyGravityOnly()
        {
            _isGrounded = _controller.isGrounded;
            if (_isGrounded && _verticalVelocity < 0.0f)
                _verticalVelocity = -2f;

            _verticalVelocity += Gravity * Time.deltaTime;
            _controller.Move(new Vector3(0.0f, _verticalVelocity, 0.0f) * Time.deltaTime);
        }

        private void CheckFallRecovery()
        {
            if (transform.position.y < FallLimitY)
            {
                RespawnAtSafePosition();
            }
        }

        public void SetSafeCheckpoint(Vector3 position, Quaternion rotation)
        {
            _lastSafePosition = position;
            _lastSafeRotation = rotation;
        }

        public void RespawnAtSafePosition()
        {
            _controller.enabled = false;
            transform.position = _lastSafePosition + Vector3.up * 0.5f;
            transform.rotation = _lastSafeRotation;
            _verticalVelocity = 0f;
            _currentSpeed = 0f;
            _controller.enabled = true;
        }

        private void AnimateProceduralWalking()
        {
            float horizontalSpeed = new Vector3(_controller.velocity.x, 0.0f, _controller.velocity.z).magnitude;
            if (horizontalSpeed > 0.2f && _isGrounded)
            {
                float freq = horizontalSpeed * 3.5f;
                _walkCycle += Time.deltaTime * freq;

                float legSwing = Mathf.Sin(_walkCycle) * 28.0f;
                float bodyBob = Mathf.Abs(Mathf.Sin(_walkCycle * 2.0f)) * 0.08f;

                if (VisualRoot != null)
                    VisualRoot.localPosition = new Vector3(0, bodyBob, 0);

                if (LeftLeg != null)
                    LeftLeg.localRotation = Quaternion.Euler(legSwing, 0, 0);
                if (RightLeg != null)
                    RightLeg.localRotation = Quaternion.Euler(-legSwing, 0, 0);
            }
            else
            {
                _walkCycle = 0f;
                if (VisualRoot != null)
                    VisualRoot.localPosition = Vector3.Lerp(VisualRoot.localPosition, Vector3.zero, Time.deltaTime * 8f);
                if (LeftLeg != null)
                    LeftLeg.localRotation = Quaternion.Slerp(LeftLeg.localRotation, Quaternion.identity, Time.deltaTime * 8f);
                if (RightLeg != null)
                    RightLeg.localRotation = Quaternion.Slerp(RightLeg.localRotation, Quaternion.identity, Time.deltaTime * 8f);
            }
        }
    }
}
