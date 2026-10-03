/**
 * QUANTUM ECHO: THE CITY THAT FORGOT
 * Core Quantum State Vector Simulation Engine (Single-Qubit)
 */

class Complex {
    constructor(real = 0, imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    get magnitude() { return Math.sqrt(this.real * this.real + this.imag * this.imag); }
    get magnitudeSquared() { return this.real * this.real + this.imag * this.imag; }
    get phase() { return Math.atan2(this.imag, this.real); }

    static fromPolar(r, theta) {
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }

    conjugate() { return new Complex(this.real, -this.imag); }
    add(other) { return new Complex(this.real + other.real, this.imag + other.imag); }
    subtract(other) { return new Complex(this.real - other.real, this.imag - other.imag); }
    
    multiply(other) {
        if (typeof other === 'number') return new Complex(this.real * other, this.imag * other);
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    divide(scalar) {
        return new Complex(this.real / scalar, this.imag / scalar);
    }

    approxEquals(other, tol = 1e-6) {
        return Math.abs(this.real - other.real) <= tol && Math.abs(this.imag - other.imag) <= tol;
    }

    toString() {
        if (Math.abs(this.imag) < 1e-6) return this.real.toFixed(3);
        if (Math.abs(this.real) < 1e-6) return `${this.imag.toFixed(3)}i`;
        return this.imag >= 0
            ? `${this.real.toFixed(3)} + ${this.imag.toFixed(3)}i`
            : `${this.real.toFixed(3)} - ${Math.abs(this.imag).toFixed(3)}i`;
    }
}

const SQRT2_INV = 1.0 / Math.sqrt(2.0);

class QuantumGate {
    constructor(name, symbol, desc, m00, m01, m10, m11) {
        this.name = name;
        this.symbol = symbol;
        this.description = desc;
        this.m00 = m00;
        this.m01 = m01;
        this.m10 = m10;
        this.m11 = m11;
    }

    static get Identity() {
        return new QuantumGate("Identity", "I", "Leaves state unchanged",
            new Complex(1, 0), new Complex(0, 0),
            new Complex(0, 0), new Complex(1, 0));
    }

    static get X() {
        return new QuantumGate("Pauli-X", "X", "Bit flip gate: swaps |0⟩ and |1⟩ amplitudes. Self-inverse.",
            new Complex(0, 0), new Complex(1, 0),
            new Complex(1, 0), new Complex(0, 0));
    }

    static get Z() {
        return new QuantumGate("Pauli-Z", "Z", "Phase flip gate: adds π relative phase to |1⟩. Self-inverse.",
            new Complex(1, 0), new Complex(0, 0),
            new Complex(0, 0), new Complex(-1, 0));
    }

    static get H() {
        return new QuantumGate("Hadamard", "H", "Hadamard gate: creates equal superposition; 180° rotation around (X+Z)/√2 axis.",
            new Complex(SQRT2_INV, 0), new Complex(SQRT2_INV, 0),
            new Complex(SQRT2_INV, 0), new Complex(-SQRT2_INV, 0));
    }

    static get Y() {
        return new QuantumGate("Pauli-Y", "Y", "Bit and phase flip: rotates 180° around Y-axis.",
            new Complex(0, 0), new Complex(0, -1),
            new Complex(0, 1), new Complex(0, 0));
    }

    static get S() {
        return new QuantumGate("Phase S", "S", "Phase gate: introduces +π/2 relative phase to |1⟩. S² = Z.",
            new Complex(1, 0), new Complex(0, 0),
            new Complex(0, 0), new Complex(0, 1));
    }

    inverse() {
        // Conjugate transpose
        let invSymbol = (this.symbol === "X" || this.symbol === "Z" || this.symbol === "H" || this.symbol === "Y" || this.symbol === "I")
            ? this.symbol : `${this.symbol}†`;
        return new QuantumGate(`${this.name} Inverse`, invSymbol, `Inverse of ${this.name}`,
            this.m00.conjugate(), this.m10.conjugate(),
            this.m01.conjugate(), this.m11.conjugate());
    }
}

class QuantumState {
    constructor(alpha, beta, label = "Custom") {
        this.alpha = alpha;
        this.beta = beta;
        this.label = label;
        this.normalize();
    }

    static get Zero() { return new QuantumState(new Complex(1, 0), new Complex(0, 0), "|0⟩"); }
    static get One() { return new QuantumState(new Complex(0, 0), new Complex(1, 0), "|1⟩"); }
    static get Plus() { return new QuantumState(new Complex(SQRT2_INV, 0), new Complex(SQRT2_INV, 0), "|+⟩"); }
    static get Minus() { return new QuantumState(new Complex(SQRT2_INV, 0), new Complex(-SQRT2_INV, 0), "|−⟩"); }

    get prob0() { return this.alpha.magnitudeSquared; }
    get prob1() { return this.beta.magnitudeSquared; }
    get totalProb() { return this.prob0 + this.prob1; }

    normalize() {
        let norm = Math.sqrt(this.alpha.magnitudeSquared + this.beta.magnitudeSquared);
        if (norm > 1e-15 && Math.abs(norm - 1.0) > 1e-9) {
            this.alpha = this.alpha.divide(norm);
            this.beta = this.beta.divide(norm);
        }
    }

    get relativePhase() {
        if (this.alpha.magnitude < 1e-7 || this.beta.magnitude < 1e-7) return 0.0;
        let diff = this.beta.phase - this.alpha.phase;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        return diff;
    }

    get relativePhaseDegrees() {
        return this.relativePhase * (180.0 / Math.PI);
    }

    get blochCoordinates() {
        // x = 2 Re(α* β), y = 2 Im(α* β), z = |α|² - |β|²
        let prod = this.alpha.conjugate().multiply(this.beta);
        let x = 2.0 * prod.real;
        let y = 2.0 * prod.imag;
        let z = this.prob0 - this.prob1;
        return { x, y, z };
    }

    fidelityWith(target) {
        let ip = (target.alpha.conjugate().multiply(this.alpha))
            .add(target.beta.conjugate().multiply(this.beta));
        return ip.magnitudeSquared;
    }

    isEquivalentTo(target, tol = 1e-4) {
        return this.fidelityWith(target) >= (1.0 - tol);
    }

    clone() {
        return new QuantumState(new Complex(this.alpha.real, this.alpha.imag),
                                new Complex(this.beta.real, this.beta.imag), this.label);
    }
}

class QuantumSimulator {
    constructor() {
        this.history = [];
        this.hasMeasurementBoundary = false;
        this.prepare(QuantumState.Zero, "Init |0⟩");
    }

    prepare(state, label = "Prepare") {
        this.state = state.clone();
        this.state.label = label;
        this.history = [];
        this.hasMeasurementBoundary = false;
    }

    applyGate(gate, isInverse = false) {
        let prev = this.state.clone();
        let newA = (gate.m00.multiply(this.state.alpha)).add(gate.m01.multiply(this.state.beta));
        let newB = (gate.m10.multiply(this.state.alpha)).add(gate.m11.multiply(this.state.beta));

        this.state = new QuantumState(newA, newB, `${gate.symbol}|ψ⟩`);
        this.history.push({
            name: gate.name,
            symbol: gate.symbol,
            gate: gate,
            before: prev,
            after: this.state.clone(),
            isInverse: isInverse,
            isMeasurement: false
        });
    }

    canApplyLastInverse() {
        if (this.history.length === 0) return { can: false, reason: "No operations applied since preparation." };
        let last = this.history[this.history.length - 1];
        if (last.isMeasurement) {
            return {
                can: false,
                reason: "Cannot invert across a measurement boundary! Measurement collapses the superposition into a definite outcome; prior amplitudes cannot be recovered from the outcome alone."
            };
        }
        return { can: true, gate: last.gate.inverse() };
    }

    applyLastInverse() {
        let check = this.canApplyLastInverse();
        if (!check.can) return { success: false, message: check.reason };

        let invGate = check.gate;
        this.history.pop();
        this.applyGate(invGate, true);
        return { success: true, message: `Applied inverse gate [${invGate.symbol}]. State restored.` };
    }

    measure() {
        let prev = this.state.clone();
        let p0 = this.state.prob0;
        let roll = Math.random();
        let outcome = (roll < p0) ? 0 : 1;

        if (outcome === 0) {
            this.state = QuantumState.Zero.clone();
            this.state.label = "Measured |0⟩ (Collapsed)";
        } else {
            this.state = QuantumState.One.clone();
            this.state.label = "Measured |1⟩ (Collapsed)";
        }

        this.hasMeasurementBoundary = true;
        this.history.push({
            name: "Measurement",
            symbol: `M=${outcome}`,
            gate: null,
            before: prev,
            after: this.state.clone(),
            isInverse: false,
            isMeasurement: true,
            outcome: outcome
        });

        return outcome;
    }

    static measureTrials(state, count) {
        let c0 = 0, c1 = 0;
        let p0 = state.prob0;
        for (let i = 0; i < count; i++) {
            if (Math.random() < p0) c0++;
            else c1++;
        }
        return {
            count0: c0,
            count1: c1,
            ratio0: c0 / count,
            ratio1: c1 / count
        };
    }

    toCircuitString() {
        if (this.history.length === 0) return "Empty (Identity)";
        return this.history.map(h => h.symbol).join(" → ");
    }
}
