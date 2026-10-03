using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using QuantumEcho.Quantum;

namespace QuantumEcho.UI
{
    /// <summary>
    /// Renders an interactive, geometrically accurate Bloch sphere projection on Unity Canvas UI.
    /// Draws sphere outline, equator/meridian reference circles, principal quantum axes,
    /// state vectors for current and target states, and geodesic gate trajectories.
    /// </summary>
    public class BlochSphereUI : MonoBehaviour
    {
        [Header("Canvas Drawing Canvas")]
        public RectTransform SphereContainer;
        public float SphereRadius = 120.0f;
        public float PitchAngle = 20.0f; // Tilt viewing angle
        public float YawAngle = 35.0f;   // Orbit viewing angle

        [Header("State Colors")]
        public Color SphereOutlineColor = new Color(0.2f, 0.45f, 0.7f, 0.4f);
        public Color EquatorColor = new Color(0.3f, 0.6f, 0.8f, 0.3f);
        public Color AxisColor = new Color(0.6f, 0.7f, 0.85f, 0.7f);
        public Color CurrentStateColor = new Color(0.15f, 0.95f, 0.85f, 1.0f); // Bright Cyan
        public Color TargetStateColor = new Color(1.0f, 0.85f, 0.2f, 0.85f);  // Gold
        public Color TrajectoryColor = new Color(0.95f, 0.35f, 0.85f, 0.75f); // Violet

        private QuantumState _currentState;
        private QuantumState _targetState;
        private List<BlochVector> _activeTrajectory = new List<BlochVector>();

        public void SetStates(QuantumState current, QuantumState target)
        {
            _currentState = current;
            _targetState = target;
        }

        public void SetTrajectory(List<BlochVector> trajectory)
        {
            _activeTrajectory = trajectory ?? new List<BlochVector>();
        }

        public void ClearTrajectory()
        {
            _activeTrajectory.Clear();
        }

        /// <summary>
        /// Projects 3D quantum Bloch coordinates (X, Y, Z) onto 2D screen coordinates.
        /// Standard physics convention:
        /// +Z: |0⟩ (North Pole)
        /// -Z: |1⟩ (South Pole)
        /// +X: |+⟩ (Equator, front-right)
        /// -X: |−⟩ (Equator, back-left)
        /// +Y: |+i⟩
        /// -Y: |−i⟩
        /// </summary>
        public Vector2 ProjectBlochToScreen(double qx, double qy, double qz)
        {
            // Convert to radians
            float yawRad = YawAngle * Mathf.Deg2Rad;
            float pitchRad = PitchAngle * Mathf.Deg2Rad;

            // Rotate around Z (yaw)
            float rx = (float)(qx * Math.Cos(yawRad) - qy * Math.Sin(yawRad));
            float ry = (float)(qx * Math.Sin(yawRad) + qy * Math.Cos(yawRad));
            float rz = (float)qz;

            // Pitch tilt (tilt Z towards viewer)
            float screenX = rx;
            float screenY = rz * Mathf.Cos(pitchRad) - ry * Mathf.Sin(pitchRad);

            return new Vector2(screenX * SphereRadius, screenY * SphereRadius);
        }

        public (Vector2 currentPos, Vector2 targetPos, List<Vector2> trajPoints) GetProjectedCoordinates()
        {
            Vector2 curr = Vector2.zero;
            Vector2 targ = Vector2.zero;

            if (_currentState != null)
            {
                var (cx, cy, cz) = _currentState.BlochCoordinates;
                curr = ProjectBlochToScreen(cx, cy, cz);
            }

            if (_targetState != null)
            {
                var (tx, ty, tz) = _targetState.BlochCoordinates;
                targ = ProjectBlochToScreen(tx, ty, tz);
            }

            var projTraj = new List<Vector2>();
            foreach (var pt in _activeTrajectory)
            {
                projTraj.Add(ProjectBlochToScreen(pt.X, pt.Y, pt.Z));
            }

            return (curr, targ, projTraj);
        }
    }
}
