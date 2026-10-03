#!/bin/bash
set -e
echo "Running Quantum Mechanics Mathematical Verification Suite..."
python3 "$(dirname "$0")/tests/verify_quantum_math.py"
