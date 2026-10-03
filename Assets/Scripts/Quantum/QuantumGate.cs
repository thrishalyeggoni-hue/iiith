using System;

namespace QuantumEcho.Quantum
{
    /// <summary>
    /// Represents a single-qubit unitary quantum gate as a 2x2 complex matrix:
    /// [ M00  M01 ]
    /// [ M10  M11 ]
    /// </summary>
    [Serializable]
    public class QuantumGate
    {
        public string Name { get; private set; }
        public string Symbol { get; private set; }
        public string Description { get; private set; }

        public ComplexNumber M00;
        public ComplexNumber M01;
        public ComplexNumber M10;
        public ComplexNumber M11;

        public QuantumGate(string name, string symbol, string description,
            ComplexNumber m00, ComplexNumber m01,
            ComplexNumber m10, ComplexNumber m11)
        {
            Name = name;
            Symbol = symbol;
            Description = description;
            M00 = m00;
            M01 = m01;
            M10 = m10;
            M11 = m11;
        }

        private static readonly double Sqrt2Inv = 1.0 / Math.Sqrt(2.0);

        /// <summary>
        /// Identity Gate I: leaves qubit unchanged.
        /// </summary>
        public static QuantumGate Identity => new QuantumGate(
            "Identity", "I", "Leaves the qubit state unchanged.",
            ComplexNumber.One, ComplexNumber.Zero,
            ComplexNumber.Zero, ComplexNumber.One
        );

        /// <summary>
        /// Pauli-X (Flip Switch / Bit Flip): Swaps Blue |0⟩ and Amber |1⟩.
        /// Matrix: [[0, 1], [1, 0]]. Self-inverse (X² = I).
        /// </summary>
        public static QuantumGate X => new QuantumGate(
            "Flip Switch [X]", "X", "Flip Switch: Instantly swaps Blue (0) and Amber (1). Works like a power switch.",
            ComplexNumber.Zero, ComplexNumber.One,
            ComplexNumber.One, ComplexNumber.Zero
        );

        /// <summary>
        /// Pauli-Z (Phase Mirror / Phase Flip): Mirrors vibration phase of |1⟩.
        /// Matrix: [[1, 0], [0, -1]]. Self-inverse (Z² = I).
        /// </summary>
        public static QuantumGate Z => new QuantumGate(
            "Phase Mirror [Z]", "Z", "Phase Mirror: Inverts wave vibration polarity upside down without altering the 50/50 power balance.",
            ComplexNumber.One, ComplexNumber.Zero,
            ComplexNumber.Zero, new ComplexNumber(-1, 0)
        );

        /// <summary>
        /// Hadamard (Quantum Blender): Creates an equal 50/50 mix (Superposition).
        /// Matrix: 1/√2 * [[1, 1], [1, -1]]. Self-inverse (H² = I).
        /// </summary>
        public static QuantumGate H => new QuantumGate(
            "Quantum Blender [H]", "H", "Quantum Blender: Mixes Blue (0) and Amber (1) into an equal 50/50 blend (Superposition).",
            new ComplexNumber(Sqrt2Inv, 0), new ComplexNumber(Sqrt2Inv, 0),
            new ComplexNumber(Sqrt2Inv, 0), new ComplexNumber(-Sqrt2Inv, 0)
        );

        /// <summary>
        /// Pauli-Y Gate: Bit and phase flip combined.
        /// Matrix: [[0, -i], [i, 0]]. Self-inverse (Y² = I).
        /// </summary>
        public static QuantumGate Y => new QuantumGate(
            "Pauli-Y", "Y", "Bit and phase flip: rotates 180° around Y-axis on the Bloch sphere.",
            ComplexNumber.Zero, new ComplexNumber(0, -1),
            new ComplexNumber(0, 1), ComplexNumber.Zero
        );

        /// <summary>
        /// Phase Gate S (√Z): Adds π/2 phase to |1⟩.
        /// Matrix: [[1, 0], [0, i]]. S² = Z.
        /// </summary>
        public static QuantumGate S => new QuantumGate(
            "Phase S", "S", "Phase gate: introduces a π/2 (90°) relative phase to |1⟩. S² = Z.",
            ComplexNumber.One, ComplexNumber.Zero,
            ComplexNumber.Zero, ComplexNumber.I
        );

        /// <summary>
        /// Inverse Phase Gate S†: Subtracts π/2 phase from |1⟩.
        /// Matrix: [[1, 0], [0, -i]].
        /// </summary>
        public static QuantumGate SDagger => new QuantumGate(
            "Phase S†", "S†", "Inverse phase gate: rotates -90° around Z-axis.",
            ComplexNumber.One, ComplexNumber.Zero,
            ComplexNumber.Zero, new ComplexNumber(0, -1)
        );

        /// <summary>
        /// T Gate (π/8 gate, fourth root of Z): Adds π/4 phase to |1⟩.
        /// Matrix: [[1, 0], [0, e^(iπ/4)]]. T² = S, T⁴ = Z.
        /// </summary>
        public static QuantumGate T => new QuantumGate(
            "T Gate", "T", "T gate: introduces a π/4 (45°) relative phase to |1⟩. T² = S.",
            ComplexNumber.One, ComplexNumber.Zero,
            ComplexNumber.Zero, ComplexNumber.FromPolar(1.0, Math.PI / 4.0)
        );

        /// <summary>
        /// Inverse T Gate T†: Subtracts π/4 phase from |1⟩.
        /// </summary>
        public static QuantumGate TDagger => new QuantumGate(
            "T† Gate", "T†", "Inverse T gate: rotates -45° around Z-axis.",
            ComplexNumber.One, ComplexNumber.Zero,
            ComplexNumber.Zero, ComplexNumber.FromPolar(1.0, -Math.PI / 4.0)
        );

        /// <summary>
        /// Computes matrix product: Result = this * other.
        /// Note: in circuit order, applying gate A then gate B means State' = B * (A * State) = (B * A) * State.
        /// </summary>
        public QuantumGate Multiply(QuantumGate other)
        {
            ComplexNumber r00 = M00 * other.M00 + M01 * other.M10;
            ComplexNumber r01 = M00 * other.M01 + M01 * other.M11;
            ComplexNumber r10 = M10 * other.M00 + M11 * other.M10;
            ComplexNumber r11 = M10 * other.M01 + M11 * other.M11;

            return new QuantumGate($"{Name}*{other.Name}", $"{Symbol}{other.Symbol}", "Composite gate",
                r00, r01, r10, r11);
        }

        /// <summary>
        /// Computes conjugate transpose (Hermitian adjoint) U†.
        /// For any unitary matrix, U† = U⁻¹.
        /// </summary>
        public QuantumGate Inverse()
        {
            string invSymbol = Symbol.EndsWith("†") ? Symbol.Substring(0, Symbol.Length - 1) : $"{Symbol}†";
            if (Symbol == "X" || Symbol == "Z" || Symbol == "H" || Symbol == "Y" || Symbol == "I")
            {
                invSymbol = Symbol; // Self-inverse
            }

            return new QuantumGate(
                $"{Name} Inverse",
                invSymbol,
                $"Inverse of {Name}",
                M00.Conjugate(), M10.Conjugate(),
                M01.Conjugate(), M11.Conjugate()
            );
        }

        /// <summary>
        /// Verifies U† * U ≈ I within numerical tolerance.
        /// </summary>
        public bool IsUnitary(double tolerance = 1e-6)
        {
            QuantumGate adj = Inverse();
            QuantumGate prod = adj.Multiply(this);
            return prod.M00.ApproxEquals(ComplexNumber.One, tolerance) &&
                   prod.M01.ApproxEquals(ComplexNumber.Zero, tolerance) &&
                   prod.M10.ApproxEquals(ComplexNumber.Zero, tolerance) &&
                   prod.M11.ApproxEquals(ComplexNumber.One, tolerance);
        }

        public static QuantumGate GetByName(string name)
        {
            switch (name.ToUpperInvariant())
            {
                case "X": return X;
                case "Z": return Z;
                case "H": return H;
                case "Y": return Y;
                case "S": return S;
                case "S_DAGGER":
                case "SDAGGER":
                case "S†": return SDagger;
                case "T": return T;
                case "T_DAGGER":
                case "TDAGGER":
                case "T†": return TDagger;
                case "I":
                case "IDENTITY": return Identity;
                default:
                    throw new ArgumentException($"Unknown gate name: {name}");
            }
        }
    }
}
