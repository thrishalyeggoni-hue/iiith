using System;

namespace QuantumEcho.Quantum
{
    /// <summary>
    /// Double-precision complex number implementation for quantum state vectors and unitary matrices.
    /// </summary>
    [Serializable]
    public struct ComplexNumber : IEquatable<ComplexNumber>
    {
        public double Real;
        public double Imaginary;

        public static readonly ComplexNumber Zero = new ComplexNumber(0, 0);
        public static readonly ComplexNumber One = new ComplexNumber(1, 0);
        public static readonly ComplexNumber I = new ComplexNumber(0, 1);

        public ComplexNumber(double real, double imaginary)
        {
            Real = real;
            Imaginary = imaginary;
        }

        public double Magnitude => Math.Sqrt(Real * Real + Imaginary * Imaginary);
        public double MagnitudeSquared => Real * Real + Imaginary * Imaginary;
        public double Phase => Math.Atan2(Imaginary, Real);

        public static ComplexNumber FromPolar(double magnitude, double phase)
        {
            return new ComplexNumber(magnitude * Math.Cos(phase), magnitude * Math.Sin(phase));
        }

        public ComplexNumber Conjugate() => new ComplexNumber(Real, -Imaginary);

        public static ComplexNumber operator +(ComplexNumber a, ComplexNumber b) =>
            new ComplexNumber(a.Real + b.Real, a.Imaginary + b.Imaginary);

        public static ComplexNumber operator -(ComplexNumber a, ComplexNumber b) =>
            new ComplexNumber(a.Real - b.Real, a.Imaginary - b.Imaginary);

        public static ComplexNumber operator -(ComplexNumber a) =>
            new ComplexNumber(-a.Real, -a.Imaginary);

        public static ComplexNumber operator *(ComplexNumber a, ComplexNumber b) =>
            new ComplexNumber(a.Real * b.Real - a.Imaginary * b.Imaginary,
                              a.Real * b.Imaginary + a.Imaginary * b.Real);

        public static ComplexNumber operator *(ComplexNumber a, double scalar) =>
            new ComplexNumber(a.Real * scalar, a.Imaginary * scalar);

        public static ComplexNumber operator *(double scalar, ComplexNumber a) =>
            new ComplexNumber(a.Real * scalar, a.Imaginary * scalar);

        public static ComplexNumber operator /(ComplexNumber a, double scalar)
        {
            if (Math.Abs(scalar) < 1e-15) throw excitingDivideByZero();
            return new ComplexNumber(a.Real / scalar, a.Imaginary / scalar);
        }

        public static ComplexNumber operator /(ComplexNumber a, ComplexNumber b)
        {
            double denom = b.Real * b.Real + b.Imaginary * b.Imaginary;
            if (denom < 1e-30) throw excitingDivideByZero();
            return new ComplexNumber(
                (a.Real * b.Real + a.Imaginary * b.Imaginary) / denom,
                (a.Imaginary * b.Real - a.Real * b.Imaginary) / denom);
        }

        private static DivideByZeroException excitingDivideByZero() =>
            new DivideByZeroException("Complex number division by near-zero.");

        public bool Equals(ComplexNumber other) =>
            Math.Abs(Real - other.Real) < 1e-9 && Math.Abs(Imaginary - other.Imaginary) < 1e-9;

        public bool ApproxEquals(ComplexNumber other, double tolerance = 1e-6) =>
            Math.Abs(Real - other.Real) <= tolerance && Math.Abs(Imaginary - other.Imaginary) <= tolerance;

        public override bool Equals(object obj) => obj is ComplexNumber other && Equals(other);

        public override int GetHashCode() => HashCode.Combine(Real, Imaginary);

        public override string ToString()
        {
            if (Math.Abs(Imaginary) < 1e-9)
                return Real.ToString("F3");
            if (Math.Abs(Real) < 1e-9)
                return $"{Imaginary:F3}i";
            return Imaginary >= 0
                ? $"{Real:F3} + {Imaginary:F3}i"
                : $"{Real:F3} - {Math.Abs(Imaginary):F3}i";
        }
    }
}
