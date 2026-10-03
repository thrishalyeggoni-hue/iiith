using System;
using System.Collections.Generic;

namespace QuantumEcho.Quantum
{
    /// <summary>
    /// Core deterministic, testable single-qubit quantum state simulator.
    /// Operates completely independent of Unity rendering.
    /// </summary>
    [Serializable]
    public class QuantumSimulator
    {
        public QuantumState State { get; private set; }
        public GateHistory History { get; private set; }

        public event Action<QuantumState> OnStateChanged;
        public event Action<QuantumGate> OnGateApplied;
        public event Action<int> OnMeasured;

        public QuantumSimulator()
        {
            History = new GateHistory();
            Prepare(QuantumState.Zero, "Initial |0⟩");
        }

        public QuantumSimulator(QuantumState initialState)
        {
            History = new GateHistory();
            Prepare(initialState, "Initial State");
        }

        /// <summary>
        /// Explicit state preparation: resets gate history and initializes to known state.
        /// Preparation is an irreversible physical preparation, NOT an inverse gate operation.
        /// </summary>
        public void Prepare(QuantumState initialState, string label = "Prepare")
        {
            State = initialState.Clone();
            State.Label = label;
            History.Clear();
            OnStateChanged?.Invoke(State);
        }

        /// <summary>
        /// Applies a unitary quantum gate: |ψ'⟩ = U |ψ⟩
        /// [ α' ] = [ M00  M01 ] [ α ]
        /// [ β' ]   [ M10  M11 ] [ β ]
        /// Preserves normalization |α'|² + |β'|² = 1.
        /// </summary>
        public void ApplyGate(QuantumGate gate, bool isInverseAction = false)
        {
            if (gate == null) throw new ArgumentNullException(nameof(gate));

            QuantumState previousState = State.Clone();

            ComplexNumber newAlpha = (gate.M00 * State.Alpha) + (gate.M01 * State.Beta);
            ComplexNumber newBeta = (gate.M10 * State.Alpha) + (gate.M11 * State.Beta);

            State = new QuantumState(newAlpha, newBeta, $"{gate.Symbol}|ψ⟩");
            History.RecordGate(gate, previousState, State, isInverse: isInverseAction);

            OnGateApplied?.Invoke(gate);
            OnStateChanged?.Invoke(State);
        }

        /// <summary>
        /// Applies the mathematical inverse of the most recently applied unitary gate:
        /// U⁻¹ (U |ψ⟩) = I |ψ⟩ = |ψ⟩
        /// Blocked if the previous operation was a measurement.
        /// </summary>
        public bool ApplyLastInverse(out string message)
        {
            if (!History.CanApplyLastInverse(out string reason))
            {
                message = reason;
                return false;
            }

            QuantumGate inverseGate = History.GetLastInverseGate();
            History.RemoveLast(); // Remove forward operation from history
            ApplyGate(inverseGate, isInverseAction: true);

            message = $"Applied inverse gate {inverseGate.Symbol}. State restored.";
            return true;
        }

        /// <summary>
        /// Performs a projective measurement in the computational basis {|0⟩, |1⟩}.
        /// Born Rule:
        /// P(0) = |α|²
        /// P(1) = |β|²
        /// The superposition collapses into a definite basis state.
        /// This is an irreversible, non-unitary process.
        /// </summary>
        public int Measure(Random rng = null)
        {
            rng ??= new Random();

            QuantumState previousState = State.Clone();
            double prob0 = State.Probability0;
            double roll = rng.NextDouble();

            int outcome = (roll < prob0) ? 0 : 1;

            if (outcome == 0)
            {
                State = QuantumState.Zero.Clone();
                State.Label = "Measured |0⟩ (Collapsed)";
            }
            else
            {
                State = QuantumState.One.Clone();
                State.Label = "Measured |1⟩ (Collapsed)";
            }

            History.RecordMeasurement(previousState, State, outcome);

            OnMeasured?.Invoke(outcome);
            OnStateChanged?.Invoke(State);

            return outcome;
        }

        /// <summary>
        /// Runs multiple independent experimental trials.
        /// For each trial: prepares a FRESH copy of the given state, then measures it.
        /// Demonstrates that finite sampling converges to Born probabilities.
        /// </summary>
        public static (int count0, int count1, double ratio0, double ratio1) MeasureIndependentTrials(
            QuantumState sourceState, int totalTrials, Random rng = null)
        {
            rng ??= new Random();
            int count0 = 0;
            int count1 = 0;
            double p0 = sourceState.Probability0;

            for (int i = 0; i < totalTrials; i++)
            {
                // Each trial is an independent preparation and measurement
                double roll = rng.NextDouble();
                if (roll < p0) count0++;
                else count1++;
            }

            double r0 = totalTrials > 0 ? (double)count0 / totalTrials : 0;
            double r1 = totalTrials > 0 ? (double)count1 / totalTrials : 0;

            return (count0, count1, r0, r1);
        }

        /// <summary>
        /// Tests whether current state satisfies a puzzle target within numerical tolerance.
        /// Uses fidelity F = |⟨φ|ψ⟩|² >= 1.0 - tolerance.
        /// Accepts states that are physically identical up to global phase.
        /// </summary>
        public bool CheckTargetReached(QuantumState targetState, double tolerance = 1e-4)
        {
            if (targetState == null) return false;
            return State.IsEquivalentTo(targetState, tolerance);
        }
    }
}
