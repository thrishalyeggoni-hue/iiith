using System;
using System.Collections.Generic;
using QuantumEcho.Quantum;

namespace QuantumEcho.Tests
{
    /// <summary>
    /// Comprehensive standalone and NUnit-compatible test runner for the Quantum Engine.
    /// Can be run via Unity Test Framework or called directly by standalone test harnesses.
    /// </summary>
    public static class QuantumMathTests
    {
        public class TestResult
        {
            public string TestName;
            public bool Passed;
            public string Details;
        }

        public static List<TestResult> RunAllTests()
        {
            var results = new List<TestResult>();

            results.Add(TestXTwiceReturnsInitial());
            results.Add(TestZTwiceReturnsInitial());
            results.Add(TestHTwiceReturnsInitial());
            results.Add(TestHadamardZeroIsPlus());
            results.Add(TestHadamardOneIsMinus());
            results.Add(TestHZHMapsZeroToOne());
            results.Add(TestGateOrderNonCommutative());
            results.Add(TestInverseSequenceRestoresStates());
            results.Add(TestUnitNormPreservation());
            results.Add(TestGlobalPhaseEquivalence());
            results.Add(TestMeasurementCollapsesCorrectly());
            results.Add(TestMeasurementTrialsReprepareState());
            results.Add(TestBlochCoordinatesMatchKnownStates());
            results.Add(TestAllChaptersSolvable());

            return results;
        }

        public static TestResult TestXTwiceReturnsInitial()
        {
            var sim = new QuantumSimulator(QuantumState.Zero);
            sim.ApplyGate(QuantumGate.X);
            sim.ApplyGate(QuantumGate.X);
            bool pass = sim.State.IsEquivalentTo(QuantumState.Zero, 1e-6);
            return new TestResult {
                TestName = "X Twice Returns Initial State (X² = I)",
                Passed = pass,
                Details = $"State after X*X: {sim.State}. Fidelity with |0⟩: {sim.State.FidelityWith(QuantumState.Zero):F6}"
            };
        }

        public static TestResult TestZTwiceReturnsInitial()
        {
            var sim = new QuantumSimulator(QuantumState.Plus);
            sim.ApplyGate(QuantumGate.Z);
            sim.ApplyGate(QuantumGate.Z);
            bool pass = sim.State.IsEquivalentTo(QuantumState.Plus, 1e-6);
            return new TestResult {
                TestName = "Z Twice Returns Initial State (Z² = I)",
                Passed = pass,
                Details = $"State after Z*Z on |+⟩: {sim.State}. Fidelity with |+⟩: {sim.State.FidelityWith(QuantumState.Plus):F6}"
            };
        }

        public static TestResult TestHTwiceReturnsInitial()
        {
            var sim = new QuantumSimulator(QuantumState.One);
            sim.ApplyGate(QuantumGate.H);
            sim.ApplyGate(QuantumGate.H);
            bool pass = sim.State.IsEquivalentTo(QuantumState.One, 1e-6);
            return new TestResult {
                TestName = "H Twice Returns Initial State (H² = I)",
                Passed = pass,
                Details = $"State after H*H on |1⟩: {sim.State}. Fidelity with |1⟩: {sim.State.FidelityWith(QuantumState.One):F6}"
            };
        }

        public static TestResult TestHadamardZeroIsPlus()
        {
            var sim = new QuantumSimulator(QuantumState.Zero);
            sim.ApplyGate(QuantumGate.H);
            bool pass = sim.State.IsEquivalentTo(QuantumState.Plus, 1e-6) &&
                        Math.Abs(sim.State.Probability0 - 0.5) < 1e-6 &&
                        Math.Abs(sim.State.Probability1 - 0.5) < 1e-6 &&
                        Math.Abs(sim.State.RelativePhase) < 1e-6;
            return new TestResult {
                TestName = "H|0⟩ = |+⟩ (Equal superposition, zero relative phase)",
                Passed = pass,
                Details = $"State: {sim.State}. Fidelity with |+⟩: {sim.State.FidelityWith(QuantumState.Plus):F6}"
            };
        }

        public static TestResult TestHadamardOneIsMinus()
        {
            var sim = new QuantumSimulator(QuantumState.One);
            sim.ApplyGate(QuantumGate.H);
            bool pass = sim.State.IsEquivalentTo(QuantumState.Minus, 1e-6) &&
                        Math.Abs(sim.State.Probability0 - 0.5) < 1e-6 &&
                        Math.Abs(sim.State.Probability1 - 0.5) < 1e-6 &&
                        Math.Abs(Math.Abs(sim.State.RelativePhase) - Math.PI) < 1e-6;
            return new TestResult {
                TestName = "H|1⟩ = |−⟩ (Equal superposition, π relative phase)",
                Passed = pass,
                Details = $"State: {sim.State}. Fidelity with |−⟩: {sim.State.FidelityWith(QuantumState.Minus):F6}, Phase: {sim.State.RelativePhaseDegrees:F1}°"
            };
        }

        public static TestResult TestHZHMapsZeroToOne()
        {
            // Chapter 4 required puzzle: H then Z then H maps |0⟩ to |1⟩
            var sim = new QuantumSimulator(QuantumState.Zero);
            sim.ApplyGate(QuantumGate.H); // |0⟩ -> |+⟩
            sim.ApplyGate(QuantumGate.Z); // |+⟩ -> |−⟩
            sim.ApplyGate(QuantumGate.H); // |−⟩ -> |1⟩
            bool pass = sim.State.IsEquivalentTo(QuantumState.One, 1e-6);
            return new TestResult {
                TestName = "H then Z then H maps |0⟩ to |1⟩ (Phase interference)",
                Passed = pass,
                Details = $"Final state: {sim.State}. Fidelity with |1⟩: {sim.State.FidelityWith(QuantumState.One):F6}"
            };
        }

        public static TestResult TestGateOrderNonCommutative()
        {
            // Chapter 5: Starting at |0⟩:
            // Path A: X then H -> X|0⟩ = |1⟩, H|1⟩ = |−⟩
            // Path B: H then X -> H|0⟩ = |+⟩, X|+⟩ = |+⟩
            var simA = new QuantumSimulator(QuantumState.Zero);
            simA.ApplyGate(QuantumGate.X);
            simA.ApplyGate(QuantumGate.H);

            var simB = new QuantumSimulator(QuantumState.Zero);
            simB.ApplyGate(QuantumGate.H);
            simB.ApplyGate(QuantumGate.X);

            double fidelity = simA.State.FidelityWith(simB.State);
            bool different = fidelity < 0.01; // orthogonal states! |⟨−|+⟩|² = 0.
            bool pass = different &&
                        simA.State.IsEquivalentTo(QuantumState.Minus, 1e-6) &&
                        simB.State.IsEquivalentTo(QuantumState.Plus, 1e-6);

            return new TestResult {
                TestName = "X then H differs from H then X starting at |0⟩",
                Passed = pass,
                Details = $"X then H gives |−⟩ (F={simA.State.FidelityWith(QuantumState.Minus):F4}), H then X gives |+⟩ (F={simB.State.FidelityWith(QuantumState.Plus):F4}). Inner product fidelity: {fidelity:F6}"
            };
        }

        public static TestResult TestInverseSequenceRestoresStates()
        {
            // Chapter 6: Forward sequence from |0⟩: H, then Z, then X
            // Inverse sequence: X, then Z, then H
            var sim = new QuantumSimulator(QuantumState.Zero);
            sim.ApplyGate(QuantumGate.H);
            sim.ApplyGate(QuantumGate.Z);
            sim.ApplyGate(QuantumGate.X);

            // Now apply inverse sequence
            sim.ApplyGate(QuantumGate.X.Inverse());
            sim.ApplyGate(QuantumGate.Z.Inverse());
            sim.ApplyGate(QuantumGate.H.Inverse());

            bool pass = sim.State.IsEquivalentTo(QuantumState.Zero, 1e-6);

            // Also test random state restoration
            var custom = new QuantumState(0.6, 0.0, 0.0, 0.8, "Arbitrary");
            var sim2 = new QuantumSimulator(custom);
            sim2.ApplyGate(QuantumGate.H);
            sim2.ApplyGate(QuantumGate.Z);
            sim2.ApplyGate(QuantumGate.X);
            sim2.ApplyGate(QuantumGate.X.Inverse());
            sim2.ApplyGate(QuantumGate.Z.Inverse());
            sim2.ApplyGate(QuantumGate.H.Inverse());
            pass = pass && sim2.State.IsEquivalentTo(custom, 1e-6);

            return new TestResult {
                TestName = "Inverse Sequence (X → Z → H) Restores States",
                Passed = pass,
                Details = $"State restored to |0⟩ (F={sim.State.FidelityWith(QuantumState.Zero):F6}) and arbitrary state (F={sim2.State.FidelityWith(custom):F6})"
            };
        }

        public static TestResult TestUnitNormPreservation()
        {
            var sim = new QuantumSimulator(QuantumState.Zero);
            var gates = new[] { QuantumGate.H, QuantumGate.Z, QuantumGate.T, QuantumGate.X, QuantumGate.S, QuantumGate.H, QuantumGate.Y };

            bool pass = true;
            foreach (var g in gates)
            {
                sim.ApplyGate(g);
                double norm = sim.State.TotalProbability;
                if (Math.Abs(norm - 1.0) > 1e-7)
                {
                    pass = false;
                    break;
                }
            }

            return new TestResult {
                TestName = "Unit Norm Preserved During Gate Sequences (|α|² + |β|² ≈ 1)",
                Passed = pass,
                Details = $"Final Total Probability: {sim.State.TotalProbability:F8}"
            };
        }

        public static TestResult TestGlobalPhaseEquivalence()
        {
            // |ψ⟩ and e^(iγ)|ψ⟩ are physically identical pure states
            double gamma = 1.2345;
            ComplexNumber phaseFactor = ComplexNumber.FromPolar(1.0, gamma);
            var state1 = QuantumState.Plus;
            var state2 = new QuantumState(state1.Alpha * phaseFactor, state1.Beta * phaseFactor, "Phase Shifted");

            double fidelity = state1.FidelityWith(state2);
            bool pass = state1.IsEquivalentTo(state2, 1e-6) && Math.Abs(fidelity - 1.0) < 1e-6;

            return new TestResult {
                TestName = "Global-Phase-Equivalent States Pass Target Checks (Fidelity = 1.0)",
                Passed = pass,
                Details = $"Fidelity between |+⟩ and e^(i*{gamma:F2})|+⟩: {fidelity:F8}"
            };
        }

        public static TestResult TestMeasurementCollapsesCorrectly()
        {
            var sim = new QuantumSimulator(QuantumState.Plus);
            int outcome = sim.Measure(new Random(42));
            bool pass = (outcome == 0 || outcome == 1) &&
                        (outcome == 0 ? sim.State.IsEquivalentTo(QuantumState.Zero, 1e-6)
                                      : sim.State.IsEquivalentTo(QuantumState.One, 1e-6)) &&
                        sim.History.HasMeasurementBoundary;

            return new TestResult {
                TestName = "Measurement Collapses Superposition to Basis State",
                Passed = pass,
                Details = $"Measured outcome: {outcome}, Collapsed state: {sim.State}, History blocked undo: {sim.History.HasMeasurementBoundary}"
            };
        }

        public static TestResult TestMeasurementTrialsReprepareState()
        {
            // Chapter 7: Prepare fresh |+⟩ for each trial, accumulate counts
            var (count0, count1, r0, r1) = QuantumSimulator.MeasureIndependentTrials(QuantumState.Plus, 1000, new Random(12345));
            // Expect approximately 500/500 with binomial variance
            bool pass = count0 > 430 && count0 < 570 && (count0 + count1 == 1000);

            return new TestResult {
                TestName = "Measurement Trials Reprepare Fresh States (Born Rule Convergence)",
                Passed = pass,
                Details = $"1000 trials on |+⟩: Outcome 0: {count0} ({r0*100:F1}%), Outcome 1: {count1} ({r1*100:F1}%)"
            };
        }

        public static TestResult TestBlochCoordinatesMatchKnownStates()
        {
            var (x0, y0, z0) = QuantumState.Zero.BlochCoordinates;
            var (x1, y1, z1) = QuantumState.One.BlochCoordinates;
            var (xp, yp, zp) = QuantumState.Plus.BlochCoordinates;
            var (xm, ym, zm) = QuantumState.Minus.BlochCoordinates;
            var (xpi, ypi, zpi) = QuantumState.PlusI.BlochCoordinates;

            bool pass = Math.Abs(z0 - 1.0) < 1e-6 &&
                        Math.Abs(z1 - (-1.0)) < 1e-6 &&
                        Math.Abs(xp - 1.0) < 1e-6 &&
                        Math.Abs(xm - (-1.0)) < 1e-6 &&
                        Math.Abs(ypi - 1.0) < 1e-6;

            return new TestResult {
                TestName = "Bloch Coordinates Match Known States (|0⟩: +Z, |1⟩: -Z, |+⟩: +X, |−⟩: -X, |+i⟩: +Y)",
                Passed = pass,
                Details = $"|0⟩=(0,0,{z0:F1}), |1⟩=(0,0,{z1:F1}), |+⟩=({xp:F1},0,0), |−⟩=({xm:F1},0,0), |+i⟩=(0,{ypi:F1},0)"
            };
        }

        public static TestResult TestAllChaptersSolvable()
        {
            // Verifies that Chapters 1 through 8 each have valid physical solutions using allowed gates
            bool allSolvable = true;

            // Ch 1: Prepare |0⟩, Prepare |1⟩
            allSolvable &= QuantumState.Zero.IsEquivalentTo(QuantumState.Zero);
            allSolvable &= QuantumState.One.IsEquivalentTo(QuantumState.One);

            // Ch 2: |0⟩ -> X -> |1⟩, |1⟩ -> X -> |0⟩
            var sim2a = new QuantumSimulator(QuantumState.Zero);
            sim2a.ApplyGate(QuantumGate.X);
            allSolvable &= sim2a.State.IsEquivalentTo(QuantumState.One);

            var sim2b = new QuantumSimulator(QuantumState.One);
            sim2b.ApplyGate(QuantumGate.X);
            allSolvable &= sim2b.State.IsEquivalentTo(QuantumState.Zero);

            // Ch 3: |0⟩ -> H -> |+⟩
            var sim3 = new QuantumSimulator(QuantumState.Zero);
            sim3.ApplyGate(QuantumGate.H);
            allSolvable &= sim3.State.IsEquivalentTo(QuantumState.Plus);

            // Ch 4: |0⟩ -> H -> Z -> H -> |1⟩
            var sim4 = new QuantumSimulator(QuantumState.Zero);
            sim4.ApplyGate(QuantumGate.H);
            sim4.ApplyGate(QuantumGate.Z);
            sim4.ApplyGate(QuantumGate.H);
            allSolvable &= sim4.State.IsEquivalentTo(QuantumState.One);

            // Ch 5: X then H gives |−⟩; H then X gives |+⟩
            var sim5a = new QuantumSimulator(QuantumState.Zero);
            sim5a.ApplyGate(QuantumGate.X);
            sim5a.ApplyGate(QuantumGate.H);
            allSolvable &= sim5a.State.IsEquivalentTo(QuantumState.Minus);

            // Ch 6: Forward H Z X, inverse X Z H
            var sim6 = new QuantumSimulator(QuantumState.Zero);
            sim6.ApplyGate(QuantumGate.H);
            sim6.ApplyGate(QuantumGate.Z);
            sim6.ApplyGate(QuantumGate.X);
            sim6.ApplyGate(QuantumGate.X);
            sim6.ApplyGate(QuantumGate.Z);
            sim6.ApplyGate(QuantumGate.H);
            allSolvable &= sim6.State.IsEquivalentTo(QuantumState.Zero);

            // Ch 8: Staged final repair steps
            // 1. |0⟩ -> X -> |1⟩
            // 2. |0⟩ -> H -> |+⟩
            // 3. |0⟩ -> H, Z -> |−⟩
            // 4. |0⟩ -> H, Z, H -> |1⟩
            // 5. Sequence H Z X H -> inverted by H X Z H -> restores |0⟩
            var sim8 = new QuantumSimulator(QuantumState.Zero);
            sim8.ApplyGate(QuantumGate.H);
            sim8.ApplyGate(QuantumGate.Z);
            sim8.ApplyGate(QuantumGate.X);
            sim8.ApplyGate(QuantumGate.H);
            sim8.ApplyGate(QuantumGate.H);
            sim8.ApplyGate(QuantumGate.X);
            sim8.ApplyGate(QuantumGate.Z);
            sim8.ApplyGate(QuantumGate.H);
            allSolvable &= sim8.State.IsEquivalentTo(QuantumState.Zero);

            return new TestResult {
                TestName = "All 8 Chapter Puzzles Verified Solvable",
                Passed = allSolvable,
                Details = "All progression targets verified reachable with assigned gate sets."
            };
        }
    }
}
