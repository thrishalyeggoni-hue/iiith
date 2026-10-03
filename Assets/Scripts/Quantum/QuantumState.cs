using System;

namespace QuantumEcho.Quantum
{
    /// <summary>
    /// Represents a pure single-qubit quantum state: |ψ⟩ = α|0⟩ + β|1⟩.
    /// Uses double-precision complex amplitudes, preserving normalization |α|² + |β|² = 1.
    /// </summary>
    [Serializable]
    public class QuantumState
    {
        public ComplexNumber Alpha { get; private set; }
        public ComplexNumber Beta { get; private set; }

        public string Label { get; set; }

        private static readonly double Sqrt2Inv = 1.0 / Math.Sqrt(2.0);

        public QuantumState(ComplexNumber alpha, ComplexNumber beta, string label = "Custom")
        {
            Alpha = alpha;
            Beta = beta;
            Label = label;
            Normalize();
        }

        public QuantumState(double alphaReal, double alphaImag, double betaReal, double betaImag, string label = "Custom")
            : this(new ComplexNumber(alphaReal, alphaImag), new ComplexNumber(betaReal, betaImag), label)
        {
        }

        public static QuantumState Zero => new QuantumState(ComplexNumber.One, ComplexNumber.Zero, "|0⟩");
        public static QuantumState One => new QuantumState(ComplexNumber.Zero, ComplexNumber.One, "|1⟩");
        public static QuantumState Plus => new QuantumState(new ComplexNumber(Sqrt2Inv, 0), new ComplexNumber(Sqrt2Inv, 0), "|+⟩");
        public static QuantumState Minus => new QuantumState(new ComplexNumber(Sqrt2Inv, 0), new ComplexNumber(-Sqrt2Inv, 0), "|−⟩");
        public static QuantumState PlusI => new QuantumState(new ComplexNumber(Sqrt2Inv, 0), new ComplexNumber(0, Sqrt2Inv), "|+i⟩");
        public static QuantumState MinusI => new QuantumState(new ComplexNumber(Sqrt2Inv, 0), new ComplexNumber(0, -Sqrt2Inv), "|−i⟩");

        public double Probability0 => Alpha.MagnitudeSquared;
        public double Probability1 => Beta.MagnitudeSquared;

        public double TotalProbability => Probability0 + Probability1;

        public void Normalize()
        {
            double norm = Math.Sqrt(Alpha.MagnitudeSquared + Beta.MagnitudeSquared);
            if (norm > 1e-15 && Math.Abs(norm - 1.0) > 1e-9)
            {
                Alpha = Alpha / norm;
                Beta = Beta / norm;
            }
        }

        /// <summary>
        /// Calculates relative phase φ between |1⟩ and |0⟩ in radians, within [-π, π].
        /// In standard representation |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩ (ignoring global phase).
        /// If either amplitude is zero, relative phase is not physically observable and returns 0.
        /// </summary>
        public double RelativePhase
        {
            get
            {
                if (Alpha.Magnitude < 1e-7 || Beta.Magnitude < 1e-7)
                    return 0.0;

                double phaseDiff = Beta.Phase - Alpha.Phase;
                while (phaseDiff > Math.PI) phaseDiff -= 2 * Math.PI;
                while (phaseDiff < -Math.PI) phaseDiff += 2 * Math.PI;
                return phaseDiff;
            }
        }

        public double RelativePhaseDegrees => RelativePhase * (180.0 / Math.PI);

        /// <summary>
        /// Bloch sphere vector coordinates (x, y, z):
        /// x = 2 * Re(α* β)
        /// y = 2 * Im(α* β)
        /// z = |α|² - |β|²
        /// For pure states, x² + y² + z² = 1.
        /// </summary>
        public (double x, double y, double z) BlochCoordinates
        {
            get
            {
                ComplexNumber prod = Alpha.Conjugate() * Beta;
                double x = 2.0 * prod.Real;
                double y = 2.0 * prod.Imaginary;
                double z = Probability0 - Probability1;
                return (x, y, z);
            }
        }

        /// <summary>
        /// Calculates quantum state fidelity F = |⟨φ|ψ⟩|² between this state |ψ⟩ and target |φ⟩.
        /// Pure state fidelity is 1.0 if and only if states are identical up to a global phase.
        /// </summary>
        public double FidelityWith(QuantumState target)
        {
            ComplexNumber innerProduct = (target.Alpha.Conjugate() * Alpha) + (target.Beta.Conjugate() * Beta);
            return innerProduct.MagnitudeSquared;
        }

        /// <summary>
        /// Checks if this state matches target within numerical tolerance (default 1e-4),
        /// correctly accepting states that differ only by an unobservable global phase e^(iγ).
        /// </summary>
        public bool IsEquivalentTo(QuantumState target, double tolerance = 1e-4)
        {
            double f = FidelityWith(target);
            return f >= (1.0 - tolerance);
        }

        public QuantumState Clone()
        {
            return new QuantumState(Alpha, Beta, Label);
        }

        public override string ToString()
        {
            string labelStr = !string.IsNullOrEmpty(Label) ? $" [{Label}]" : "";
            return $"({Alpha})|0⟩ + ({Beta})|1⟩ | P(0)={Probability0 * 100:F1}%, P(1)={Probability1 * 100:F1}%, Phase={RelativePhaseDegrees:F1}°{labelStr}";
        }
    }
}
