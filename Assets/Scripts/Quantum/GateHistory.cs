using System;
using System.Collections.Generic;
using System.Text;

namespace QuantumEcho.Quantum
{
    [Serializable]
    public class GateHistoryEntry
    {
        public string OperationName;
        public string GateSymbol;
        public QuantumGate GateApplied;
        public QuantumState StateBefore;
        public QuantumState StateAfter;
        public bool IsInverseAction;
        public bool IsMeasurement;
        public int MeasurementOutcome; // 0 or 1 if measurement

        public GateHistoryEntry(string opName, string symbol, QuantumGate gate,
            QuantumState before, QuantumState after, bool isInverse = false,
            bool isMeasurement = false, int outcome = -1)
        {
            OperationName = opName;
            GateSymbol = symbol;
            GateApplied = gate;
            StateBefore = before;
            StateAfter = after;
            IsInverseAction = isInverse;
            IsMeasurement = isMeasurement;
            MeasurementOutcome = outcome;
        }
    }

    [Serializable]
    public class GateHistory
    {
        private readonly List<GateHistoryEntry> _entries = new List<GateHistoryEntry>();

        public IReadOnlyList<GateHistoryEntry> Entries => _entries;
        public int Count => _entries.Count;

        public bool HasMeasurementBoundary { get; private set; }

        public void Clear()
        {
            _entries.Clear();
            HasMeasurementBoundary = false;
        }

        public void RecordGate(QuantumGate gate, QuantumState before, QuantumState after, bool isInverse = false)
        {
            _entries.Add(new GateHistoryEntry(
                gate.Name,
                gate.Symbol,
                gate,
                before.Clone(),
                after.Clone(),
                isInverse: isInverse,
                isMeasurement: false
            ));
        }

        public void RecordMeasurement(QuantumState before, QuantumState after, int outcome)
        {
            HasMeasurementBoundary = true;
            _entries.Add(new GateHistoryEntry(
                "Computational Basis Measurement",
                $"M={outcome}",
                null,
                before.Clone(),
                after.Clone(),
                isInverse: false,
                isMeasurement: true,
                outcome: outcome
            ));
        }

        /// <summary>
        /// Quantum undo is mathematically valid only when:
        /// 1. We have at least one reversible gate in history.
        /// 2. The most recent operation was NOT a measurement boundary.
        /// (Measurement is non-unitary and irreversible).
        /// </summary>
        public bool CanApplyLastInverse(out string reasonIfNot)
        {
            if (_entries.Count == 0)
            {
                reasonIfNot = "No operations have been applied since last preparation.";
                return false;
            }

            GateHistoryEntry last = _entries[_entries.Count - 1];
            if (last.IsMeasurement)
            {
                reasonIfNot = "Cannot invert across a measurement boundary! Measurement collapses the superposition into a definite outcome; arbitrary prior quantum amplitudes cannot be recovered from the outcome alone.";
                return false;
            }

            reasonIfNot = string.Empty;
            return true;
        }

        /// <summary>
        /// Returns the inverse gate that should be applied to undo the most recent unitary gate.
        /// </summary>
        public QuantumGate GetLastInverseGate()
        {
            if (!CanApplyLastInverse(out _))
                return null;

            GateHistoryEntry last = _entries[_entries.Count - 1];
            return last.GateApplied.Inverse();
        }

        /// <summary>
        /// Pop the last entry when an inverse is applied or step is rewound.
        /// </summary>
        public GateHistoryEntry RemoveLast()
        {
            if (_entries.Count == 0) return null;
            int idx = _entries.Count - 1;
            GateHistoryEntry entry = _entries[idx];
            _entries.RemoveAt(idx);
            return entry;
        }

        /// <summary>
        /// Formats chronological circuit sequence (left-to-right).
        /// e.g. "H → Z → X"
        /// </summary>
        public string ToCircuitString()
        {
            if (_entries.Count == 0) return "Empty (Identity)";

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < _entries.Count; i++)
            {
                if (i > 0) sb.Append(" → ");
                sb.Append(_entries[i].GateSymbol);
            }
            return sb.ToString();
        }

        /// <summary>
        /// Returns the mathematical inverse sequence for the currently applied unitary sequence:
        /// (G₁ G₂ ... Gₙ)⁻¹ = Gₙ⁻¹ ... G₂⁻¹ G₁⁻¹
        /// </summary>
        public List<QuantumGate> GetFullInverseSequence()
        {
            List<QuantumGate> inverseList = new List<QuantumGate>();
            for (int i = _entries.Count - 1; i >= 0; i--)
            {
                if (_entries[i].IsMeasurement)
                    break; // Cannot invert past measurement
                inverseList.Add(_entries[i].GateApplied.Inverse());
            }
            return inverseList;
        }

        public string GetFullInverseSequenceString()
        {
            List<QuantumGate> invList = GetFullInverseSequence();
            if (invList.Count == 0) return "None";

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < invList.Count; i++)
            {
                if (i > 0) sb.Append(" → ");
                sb.Append(invList[i].Symbol);
            }
            return sb.ToString();
        }
    }
}
