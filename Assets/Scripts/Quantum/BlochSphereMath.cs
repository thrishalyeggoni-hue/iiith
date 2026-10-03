using System;
using System.Collections.Generic;

namespace QuantumEcho.Quantum
{
    public struct BlochVector
    {
        public double X;
        public double Y;
        public double Z;

        public BlochVector(double x, double y, double z)
        {
            X = x;
            Y = y;
            Z = z;
        }

        public double Magnitude => Math.Sqrt(X * X + Y * Y + Z * Z);

        public BlochVector Normalized()
        {
            double m = Magnitude;
            if (m < 1e-15) return new BlochVector(0, 0, 1);
            return new BlochVector(X / m, Y / m, Z / m);
        }

        public static double Dot(BlochVector a, BlochVector b) =>
            a.X * b.X + a.Y * b.Y + a.Z * b.Z;

        public static BlochVector Cross(BlochVector a, BlochVector b) =>
            new BlochVector(
                a.Y * b.Z - a.Z * b.Y,
                a.Z * b.X - a.X * b.Z,
                a.X * b.Y - a.Y * b.X
            );

        public static BlochVector operator +(BlochVector a, BlochVector b) =>
            new BlochVector(a.X + b.X, a.Y + b.Y, a.Z + b.Z);

        public static BlochVector operator -(BlochVector a, BlochVector b) =>
            new BlochVector(a.X - b.X, a.Y - b.Y, a.Z - b.Z);

        public static BlochVector operator *(BlochVector a, double s) =>
            new BlochVector(a.X * s, a.Y * s, a.Z * s);

        public static BlochVector operator *(double s, BlochVector a) =>
            new BlochVector(a.X * s, a.Y * s, a.Z * s);

        public override string ToString() => $"({X:F3}, {Y:F3}, {Z:F3})";
    }

    /// <summary>
    /// Pure mathematical functions for Bloch sphere mapping and continuous geodesic trajectories.
    /// Independent of Unity UnityEngine.Vector3 (can convert to Unity coordinate system cleanly).
    /// </summary>
    public static class BlochSphereMath
    {
        private static readonly double Sqrt2Inv = 1.0 / Math.Sqrt(2.0);

        /// <summary>
        /// Converts a QuantumState to its Bloch unit vector (x, y, z):
        /// x = 2 Re(α* β)
        /// y = 2 Im(α* β)
        /// z = |α|² - |β|²
        /// </summary>
        public static BlochVector ToBlochVector(QuantumState state)
        {
            var (x, y, z) = state.BlochCoordinates;
            return new BlochVector(x, y, z);
        }

        /// <summary>
        /// Rotates vector v around unit rotation axis by angle theta (Rodrigues' rotation formula).
        /// v_rot = v cos(θ) + (axis × v) sin(θ) + axis (axis · v) (1 - cos(θ))
        /// </summary>
        public static BlochVector RotateAroundAxis(BlochVector v, BlochVector unitAxis, double angleRadians)
        {
            double cosT = Math.Cos(angleRadians);
            double sinT = Math.Sin(angleRadians);
            double dot = BlochVector.Dot(unitAxis, v);
            BlochVector cross = BlochVector.Cross(unitAxis, v);

            return (v * cosT) + (cross * sinT) + (unitAxis * (dot * (1.0 - cosT)));
        }

        /// <summary>
        /// Retrieves the exact physical rotation axis and angle for standard quantum gates.
        /// - Pauli-X: 180° around (1, 0, 0)
        /// - Pauli-Z: 180° around (0, 0, 1)
        /// - Hadamard H: 180° around (1/√2, 0, 1/√2) [diagonal halfway between X and Z]
        /// - Pauli-Y: 180° around (0, 1, 0)
        /// - Phase S: 90° around (0, 0, 1)
        /// - Phase S†: -90° around (0, 0, 1)
        /// - T: 45° around (0, 0, 1)
        /// - T†: -45° around (0, 0, 1)
        /// </summary>
        public static (BlochVector axis, double angleRadians, string explanation) GetGateRotationParameters(QuantumGate gate)
        {
            switch (gate.Symbol)
            {
                case "X":
                    return (new BlochVector(1, 0, 0), Math.PI,
                        "Pauli-X: 180° rotation around the X-axis (swaps |0⟩ and |1⟩).");

                case "Z":
                    return (new BlochVector(0, 0, 1), Math.PI,
                        "Pauli-Z: 180° rotation around the Z-axis (inverts relative phase).");

                case "H":
                    // Crucial: 180° around (X+Z)/√2 axis, NOT a 90° rotation!
                    return (new BlochVector(Sqrt2Inv, 0, Sqrt2Inv), Math.PI,
                        "Hadamard: 180° rotation around the diagonal (X+Z)/√2 axis halfway between X and Z.");

                case "Y":
                    return (new BlochVector(0, 1, 0), Math.PI,
                        "Pauli-Y: 180° rotation around the Y-axis.");

                case "S":
                    return (new BlochVector(0, 0, 1), Math.PI / 2.0,
                        "Phase S: 90° rotation around the Z-axis (introduces +π/2 relative phase).");

                case "S†":
                    return (new BlochVector(0, 0, 1), -Math.PI / 2.0,
                        "Phase S†: -90° rotation around the Z-axis.");

                case "T":
                    return (new BlochVector(0, 0, 1), Math.PI / 4.0,
                        "T Gate: 45° rotation around the Z-axis (introduces +π/4 relative phase).");

                case "T†":
                    return (new BlochVector(0, 0, 1), -Math.PI / 4.0,
                        "T† Gate: -45° rotation around the Z-axis.");

                default:
                    return (new BlochVector(0, 0, 1), 0.0, "Identity: No rotation.");
            }
        }

        /// <summary>
        /// Computes exact intermediate trajectory points along the geodesic rotation path on the Bloch sphere.
        /// Every point lies on the unit sphere for pure states.
        /// </summary>
        public static List<BlochVector> ComputeGateTrajectory(QuantumState startState, QuantumGate gate, int segments = 16)
        {
            var (axis, totalAngle, _) = GetGateRotationParameters(gate);
            BlochVector startV = ToBlochVector(startState);

            List<BlochVector> trajectory = new List<BlochVector>(segments + 1);
            trajectory.Add(startV);

            for (int i = 1; i <= segments; i++)
            {
                double fraction = (double)i / segments;
                double currentAngle = totalAngle * fraction;
                BlochVector intermediate = RotateAroundAxis(startV, axis, currentAngle);
                trajectory.Add(intermediate.Normalized());
            }

            return trajectory;
        }

        /// <summary>
        /// Maps standard quantum Bloch coordinates (X, Y, Z) to Unity 3D world/local space:
        /// Quantum Z (North/South computational basis) -> Unity Y (Up = |0⟩, Down = |1⟩)
        /// Quantum X (Superposition basis |+⟩, |−⟩) -> Unity X (Right = |+⟩, Left = |−⟩)
        /// Quantum Y (Phase basis |+i⟩, |−i⟩) -> Unity Z (Forward = |+i⟩, Back = |−i⟩)
        /// </summary>
        public static (float unityX, float unityY, float unityZ) QuantumToUnityCoordinates(double qx, double qy, double qz, float sphereRadius = 1.0f)
        {
            float uX = (float)qx * sphereRadius;
            float uY = (float)qz * sphereRadius; // Quantum Z is Unity Up
            float uZ = (float)qy * sphereRadius; // Quantum Y is Unity Forward
            return (uX, uY, uZ);
        }
    }
}
