/**
 * QUANTUM ECHO: THE CITY THAT FORGOT
 * Complete 3D Third-Person Web Adventure & Quantum Engine Simulator
 */

// -------------------------------------------------------------
// 1. Audio System (Procedural Web Audio API)
// -------------------------------------------------------------
class SoundManager {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playTone(freq, duration, type = 'sine') {
        this.init();
        if (!this.ctx) return;
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    playGateApply() {
        this.playTone(440, 0.18, 'sine');
        setTimeout(() => this.playTone(660, 0.22, 'triangle'), 60);
    }

    playSuccessChime() {
        this.init();
        if (!this.ctx) return;
        // Slow, warm, ethereal harmonic chime that swells gracefully
        let notes = [392.00, 493.88, 587.33, 783.99, 987.77]; // G4, B4, D5, G5, B5
        notes.forEach((f, i) => {
            setTimeout(() => {
                try {
                    let t = this.ctx.currentTime;
                    let osc = this.ctx.createOscillator();
                    let gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, t);
                    // Slow attack and long gentle release
                    gain.gain.setValueAtTime(0.001, t);
                    gain.gain.linearRampToValueAtTime(0.18, t + 0.25);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(t);
                    osc.stop(t + 1.65);
                } catch (e) {}
            }, i * 220); // Spaced 220ms apart: smooth slow progression over 1.2s
        });
    }

    playPartyPopperSound() {
        this.init();
        if (!this.ctx) return;
        try {
            let t = this.ctx.currentTime;

            // 1. Multiple Rapid "POP! POP! POP!" Cannons
            [0, 0.14, 0.32, 0.55].forEach((delay, idx) => {
                let popTime = t + delay;

                // High-pressure snappy balloon/popper pop
                let popOsc = this.ctx.createOscillator();
                let popGain = this.ctx.createGain();
                popOsc.type = 'triangle';
                popOsc.frequency.setValueAtTime(520 + Math.random() * 220, popTime);
                popOsc.frequency.exponentialRampToValueAtTime(35, popTime + 0.08);

                popGain.gain.setValueAtTime(0.48, popTime);
                popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.08);

                popOsc.connect(popGain);
                popGain.connect(this.ctx.destination);
                popOsc.start(popTime);
                popOsc.stop(popTime + 0.09);

                // Confetti streamer noise hiss / flutter
                let bufferSize = Math.floor(this.ctx.sampleRate * 0.32);
                let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                let data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.10));
                }
                let noiseNode = this.ctx.createBufferSource();
                noiseNode.buffer = buffer;

                let filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(3400 + idx * 450, popTime);
                filter.Q.value = 3.2;

                let noiseGain = this.ctx.createGain();
                noiseGain.gain.setValueAtTime(0.38, popTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.32);

                noiseNode.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(this.ctx.destination);
                noiseNode.start(popTime);
                noiseNode.stop(popTime + 0.33);
            });

            // 2. Triumphant Victory Fanfare Chords (Majestic brass-like synthesis)
            // Sequence: C5 -> E5 -> G5 -> C6 -> E6 -> G6 harmony swell!
            const fanfareNotes = [
                { f: 523.25, time: t + 0.18, dur: 0.28 }, // C5
                { f: 659.25, time: t + 0.36, dur: 0.28 }, // E5
                { f: 783.99, time: t + 0.54, dur: 0.30 }, // G5
                { f: 1046.50, time: t + 0.74, dur: 0.95 }, // C6
                { f: 1318.51, time: t + 0.84, dur: 0.85 }, // E6 harmony
                { f: 1567.98, time: t + 0.94, dur: 0.75 }  // G6 harmony
            ];

            fanfareNotes.forEach(note => {
                let osc = this.ctx.createOscillator();
                let gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(note.f, note.time);

                gain.gain.setValueAtTime(0.001, note.time);
                gain.gain.linearRampToValueAtTime(0.30, note.time + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, note.time + note.dur);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(note.time);
                osc.stop(note.time + note.dur);
            });

            // 3. Celebratory bells & sparkle cascade
            [1200, 1500, 1800, 2100, 2400].forEach((freq, idx) => {
                let bellTime = t + 0.85 + idx * 0.12;
                let bellOsc = this.ctx.createOscillator();
                let bellGain = this.ctx.createGain();
                bellOsc.type = 'sine';
                bellOsc.frequency.setValueAtTime(freq, bellTime);

                bellGain.gain.setValueAtTime(0.20, bellTime);
                bellGain.gain.exponentialRampToValueAtTime(0.001, bellTime + 0.45);

                bellOsc.connect(bellGain);
                bellGain.connect(this.ctx.destination);
                bellOsc.start(bellTime);
                bellOsc.stop(bellTime + 0.45);
            });

        } catch (e) {}
    }

    playMeasurementCollapse() {
        this.playTone(180, 0.35, 'sawtooth');
    }

    playClick() {
        this.playTone(880, 0.04, 'sine');
    }

    playError() {
        this.playTone(130, 0.2, 'sawtooth');
    }

    playJump() {
        this.init();
        if (!this.ctx) return;
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.14);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.14);
        } catch (e) {}
    }

    playDeath() {
        this.init();
        if (!this.ctx) return;
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.45);
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.45);
        } catch (e) {}
    }

    playRespawn() {
        this.playTone(440, 0.12, 'triangle');
        setTimeout(() => this.playTone(660, 0.22, 'sine'), 90);
    }

    // Realistic Heavy Mechanical Blast Gate Opening Sound:
    // Realistic Heavy Mechanical & Hydraulic Activation Sound:
    // 1. Heavy resonant unlatch with deep echo
    // 2. Slow-swelling pneumatic steam & hiss that fades in gently over 1.4s and exhales over 4.8s
    // 3. Deep low-frequency hydraulic motor & gear rumble that builds slowly
    // 4. Soft cushion lock thud at 3.8s
    playGateOpen() {
        this.init();
        if (!this.ctx) return;
        try {
            let t = this.ctx.currentTime;

            // 1. Resonant Mechanical Unlatch Click (Smooth warm attack)
            let clickOsc = this.ctx.createOscillator();
            let clickGain = this.ctx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(240, t);
            clickOsc.frequency.exponentialRampToValueAtTime(55, t + 0.35);
            clickGain.gain.setValueAtTime(0.001, t);
            clickGain.gain.linearRampToValueAtTime(0.25, t + 0.08);
            clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
            clickOsc.connect(clickGain);
            clickGain.connect(this.ctx.destination);
            clickOsc.start(t);
            clickOsc.stop(t + 0.45);

            // 2. High-Pressure Pneumatic Steam Hiss (Slow build-up & long gentle exhale)
            let bufferSize = Math.floor(this.ctx.sampleRate * 4.8);
            let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            let data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            let noiseNode = this.ctx.createBufferSource();
            noiseNode.buffer = buffer;

            let filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(650, t);
            filter.frequency.linearRampToValueAtTime(1600, t + 1.8);
            filter.frequency.exponentialRampToValueAtTime(420, t + 4.6);
            filter.Q.value = 2.0;

            let noiseGain = this.ctx.createGain();
            // SLOW SWELL: Starts at zero, gently builds over 1.4 seconds!
            noiseGain.gain.setValueAtTime(0.0001, t);
            noiseGain.gain.linearRampToValueAtTime(0.24, t + 1.4);
            noiseGain.gain.linearRampToValueAtTime(0.18, t + 2.8);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 4.8);

            noiseNode.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noiseNode.start(t + 0.05);
            noiseNode.stop(t + 4.8);

            // 3. Deep Low Motor & Hydraulic Oil Pressure Rumble (Builds slowly)
            let motorOsc = this.ctx.createOscillator();
            let motorGain = this.ctx.createGain();
            motorOsc.type = 'sawtooth';
            motorOsc.frequency.setValueAtTime(48, t);
            motorOsc.frequency.linearRampToValueAtTime(64, t + 2.0);
            motorOsc.frequency.linearRampToValueAtTime(38, t + 4.8);

            let motorFilter = this.ctx.createBiquadFilter();
            motorFilter.type = 'lowpass';
            motorFilter.frequency.value = 160;

            motorGain.gain.setValueAtTime(0.0001, t);
            motorGain.gain.linearRampToValueAtTime(0.20, t + 1.5);
            motorGain.gain.linearRampToValueAtTime(0.16, t + 3.2);
            motorGain.gain.exponentialRampToValueAtTime(0.0001, t + 5.0);

            motorOsc.connect(motorFilter);
            motorFilter.connect(motorGain);
            motorGain.connect(this.ctx.destination);
            motorOsc.start(t);
            motorOsc.stop(t + 5.0);

            // 4. Soft completion thud when mechanical action completes (at 3.8s)
            setTimeout(() => {
                try {
                    let thudOsc = this.ctx.createOscillator();
                    let thudGain = this.ctx.createGain();
                    thudOsc.type = 'sine';
                    let t2 = this.ctx.currentTime;
                    thudOsc.frequency.setValueAtTime(90, t2);
                    thudOsc.frequency.exponentialRampToValueAtTime(35, t2 + 0.35);
                    thudGain.gain.setValueAtTime(0.20, t2);
                    thudGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.35);
                    thudOsc.connect(thudGain);
                    thudGain.connect(this.ctx.destination);
                    thudOsc.start(t2);
                    thudOsc.stop(t2 + 0.35);
                } catch (e) {}
            }, 3800);

        } catch (e) {}
    }

    playGateClose() {
        this.init();
        if (!this.ctx) return;
        try {
            let t = this.ctx.currentTime;
            // Motor hum closing
            let motorOsc = this.ctx.createOscillator();
            let motorGain = this.ctx.createGain();
            motorOsc.type = 'triangle';
            motorOsc.frequency.setValueAtTime(85, t);
            motorOsc.frequency.linearRampToValueAtTime(55, t + 0.85);
            motorGain.gain.setValueAtTime(0.18, t);
            motorGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
            motorOsc.connect(motorGain);
            motorGain.connect(this.ctx.destination);
            motorOsc.start(t);
            motorOsc.stop(t + 0.9);

            // Heavy Metallic Clamp / Slam shut
            setTimeout(() => {
                try {
                    let slamOsc = this.ctx.createOscillator();
                    let slamGain = this.ctx.createGain();
                    slamOsc.type = 'sawtooth';
                    let t2 = this.ctx.currentTime;
                    slamOsc.frequency.setValueAtTime(210, t2);
                    slamOsc.frequency.exponentialRampToValueAtTime(35, t2 + 0.22);
                    slamGain.gain.setValueAtTime(0.32, t2);
                    slamGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.22);
                    slamOsc.connect(slamGain);
                    slamGain.connect(this.ctx.destination);
                    slamOsc.start(t2);
                    slamOsc.stop(t2 + 0.22);
                } catch (e) {}
            }, 750);
        } catch (e) {}
    }
}

const sounds = new SoundManager();

// -------------------------------------------------------------
// 1.5 Party Popper & Confetti Particle System
// Explosive celebration with celebratory cannons, flutter & ribbons
// -------------------------------------------------------------
class ConfettiCelebration {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isActive = false;
        this.animationId = null;
    }

    init() {
        if (!this.canvas) {
            this.canvas = document.getElementById('celebration-confetti-canvas');
            if (this.canvas) {
                this.ctx = this.canvas.getContext('2d');
                window.addEventListener('resize', () => this.resize());
                this.resize();
            }
        }
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start(durationMs = 7000) {
        this.init();
        if (!this.canvas || !this.ctx) return;
        this.resize();
        this.canvas.style.display = 'block';
        this.isActive = true;
        this.particles = [];

        // Play loud snappy party popper sound + victory fanfare!
        sounds.playPartyPopperSound();

        // 1. Immediate 360° inward party popper eruption from the surrounding rings!
        this.inwardRingBlast(220);
        setTimeout(() => this.inwardRingBlast(160), 220);
        setTimeout(() => this.inwardRingBlast(140), 450);

        // 2. Continuous waves of poppers erupting around the rings and falling INWARD!
        let interval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(interval);
                return;
            }
            sounds.playClick();
            this.inwardRingBlast(110);
        }, 520);

        setTimeout(() => {
            clearInterval(interval);
            setTimeout(() => {
                this.stop();
            }, 3500);
        }, durationMs);

        if (!this.animationId) {
            this.loop();
        }
    }

    // Party Poppers erupt along the outer harmonic ring and shower INWARD toward Mira and the pinnacle center
    inwardRingBlast(count = 160) {
        const colors = [
            '#f59e0b', '#ec4899', '#38bdf8', '#22c55e', '#a855f7',
            '#e11d48', '#fbbf24', '#06b6d4', '#f97316', '#ffffff', '#ffd700'
        ];

        let cx = window.innerWidth / 2;
        let cy = window.innerHeight * 0.44; // Center focus on Mira & the Echo Core pinnacle
        let rx = window.innerWidth * 0.33; // Exact match to the glowing harmonic ring framing Mira
        let ry = window.innerHeight * 0.22;

        for (let i = 0; i < count; i++) {
            // Erupt directly along the circumference of the visible harmonic ring
            let theta = Math.random() * Math.PI * 2;
            let ringDist = 0.94 + Math.random() * 0.12;
            let startX = cx + Math.cos(theta) * (rx * ringDist);
            let startY = cy + Math.sin(theta) * (ry * ringDist);

            // Vector pointing strictly INWARD towards the Echo Core pinnacle center
            let toX = cx + (Math.random() - 0.5) * 80 - startX;
            let toY = cy + (Math.random() - 0.5) * 80 - startY;
            let dist = Math.hypot(toX, toY) || 1;

            let speed = 7.0 + Math.random() * 11.0;
            let isRibbon = Math.random() < 0.55;

            this.particles.push({
                x: startX,
                y: startY,
                vx: (toX / dist) * speed + (Math.random() - 0.5) * 2.0,
                vy: (toY / dist) * speed + (Math.random() - 0.5) * 2.0,
                gravity: 0.18 + Math.random() * 0.18, // Gentle downward gravity as it falls inward
                drag: 0.985, // High glide retention so confetti carries inward toward the center
                color: colors[Math.floor(Math.random() * colors.length)],
                width: isRibbon ? (5 + Math.random() * 6) : (10 + Math.random() * 12),
                height: isRibbon ? (24 + Math.random() * 38) : (10 + Math.random() * 12),
                rotX: Math.random() * Math.PI,
                rotY: Math.random() * Math.PI,
                rotZ: Math.random() * Math.PI,
                vRotX: (Math.random() - 0.5) * 0.32,
                vRotY: (Math.random() - 0.5) * 0.32,
                vRotZ: (Math.random() - 0.5) * 0.32,
                opacity: 1.0,
                fade: 0.0022 + Math.random() * 0.003
            });
        }
    }

    loop() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;

            p.rotX += p.vRotX;
            p.rotY += p.vRotY;
            p.rotZ += p.vRotZ;
            p.opacity -= p.fade;

            if (p.opacity <= 0 || p.y > this.canvas.height + 60) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotZ);
            this.ctx.scale(Math.cos(p.rotX), Math.sin(p.rotY));
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            this.ctx.restore();
        }

        if (this.particles.length > 0 || this.isActive) {
            this.animationId = requestAnimationFrame(() => this.loop());
        } else {
            this.canvas.style.display = 'none';
            this.animationId = null;
        }
    }

    stop() {
        this.isActive = false;
    }
}

const confetti = new ConfettiCelebration();

// -------------------------------------------------------------
// 2. Puzzle Data (All 8 Chapters)
// -------------------------------------------------------------
const PUZZLE_DATA = [
    {
        id: "ch1_p1",
        chapter: 1,
        chapterTitle: "Arrival Harbor: What is a Qubit?",
        title: "Terminal Alpha Calibration",
        machineName: "District 1 City Security Gate (Left Pillar)",
        machineStatus: "LOCKED 🔒 (Energy barrier active across canal)",
        machineGoal: "Set your lantern to 🔵 BLUE MODE (0) to initialize Terminal Alpha!",
        objective: "Set your lantern to Blue Mode (0) to calibrate Terminal Alpha.",
        story: "Mira arrives at Aster's silent harbor. Terminal Alpha on your LEFT responds only to pure Blue Light (State 0).",
        target: QuantumState.Zero,
        allowPrep0: true,
        allowPrep1: true,
        allowedGates: [],
        hints: [
            "Click the blue button: '🔵 Set to Blue (0 / Reset)'.",
            "Check the Blue Power gauge: it should be at 100%!",
            "Click '⚡ ACTIVATE CITY MACHINE' to lock in your solution!"
        ],
        explanation: "Great job! 🔵 The left terminal is glowing blue. Now walk to the RIGHT terminal and set it to Yellow to fully open the gate!"
    },
    {
        id: "ch1_p2",
        chapter: 1,
        chapterTitle: "Arrival Harbor: What is a Qubit?",
        title: "Terminal Beta Calibration",
        machineName: "District 1 City Security Gate & Lumi's Pod",
        machineStatus: "ALPHA ONLINE ➔ Calibrating Beta to Unlock Gate",
        machineGoal: "Set your lantern to 🟡 YELLOW MODE (1) to release Lumi and open the gate!",
        objective: "Set your lantern to Yellow Mode (1) to power Terminal Beta and release Lumi.",
        story: "Terminal Beta on your RIGHT controls the service gate locking Lumi's compartment. It requires pure Yellow Light (State 1).",
        target: QuantumState.One,
        allowPrep0: true,
        allowPrep1: true,
        allowedGates: [],
        hints: [
            "Click the orange button: '🟠 Set to Yellow (1 / Power)'.",
            "Notice that Yellow Power reaches 100%!",
            "Click '⚡ ACTIVATE CITY MACHINE' to unlock the gate!"
        ],
        explanation: "The gate is OPEN! 🟢 You set both terminals and the barrier powered down. I'm free! I'm Lumi — I'll guide you through the city. Let's go!"
    },
    {
        id: "ch2_p1",
        chapter: 2,
        chapterTitle: "Switchworks: The Flip Switch Tool",
        title: "Hydraulic Lift: Power Up With Flip Switch [X]",
        machineName: "Switchworks Heavy Hydraulic Lift",
        machineStatus: "LOWERED at Plaza Level (Needs Yellow 1)",
        machineGoal: "Use the [X] FLIP SWITCH to turn Blue (0) into Yellow (1) and ELEVATE THE LIFT!",
        objective: "Starting from Blue (0), click [X] once to flip to Yellow (1) and power the lift platform UP.",
        story: "The hydraulic lift starts lowered at 0 (Blue). The magnetic gears need 1 (Yellow / Power) to lift you to the upper terrace.",
        target: QuantumState.One,
        allowPrep0: true,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "The [X] FLIP SWITCH acts like a light switch: it flips Blue to Yellow and Yellow to Blue!",
            "Click the [X] FLIP SWITCH button once.",
            "Watch your lantern flip from Blue (0) to Yellow (1), then click '⚡ ACTIVATE CITY MACHINE'!"
        ],
        explanation: "The lift powered UP! 🔼 The Flip Switch [X] turned your lantern from Blue to Yellow, and the hydraulic pistons raised the platform. Now head up to the Upper Security Gate!"
    },
    {
        id: "ch2_p2",
        chapter: 2,
        chapterTitle: "Switchworks: The Flip Switch Tool",
        title: "Upper Security Gate: Flip Back to Blue (0)",
        machineName: "Switchworks Upper Security Gate",
        machineStatus: "LOCKED 🔒 (Requires Blue Light / 0)",
        machineGoal: "Use the [X] FLIP SWITCH to flip from Yellow (1) back to Blue (0) to unlock the gate!",
        objective: "Your lantern is currently Yellow (1). Click [X] once to flip back to Blue (0) and open the gate.",
        story: "Lumi says: 'Look! The upper gate responds only to Blue Light (0). But your lantern is still Yellow from the lift! Click [X] to flip back to Blue. See? Flipping twice returns you right back to where you started!'",
        target: QuantumState.Zero,
        allowPrep0: false,
        allowPrep1: true,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "Your lantern is currently Yellow (1) from the lift.",
            "Click the [X] FLIP SWITCH once: it flips Yellow right back to Blue (0)!",
            "Click '⚡ ACTIVATE CITY MACHINE' to unlock the gate!"
        ],
        explanation: "The Upper Gate is OPEN! 🟢 Two flips brought you back to Blue. You just learned that quantum flips can always be undone with zero loss. Welcome to the Twin-Light Garden!"
    },
    {
        id: "ch3_p1",
        chapter: 3,
        chapterTitle: "Twin-Light Garden: The Blender Tool",
        title: "The Light Bridge: Mix Blue + Yellow Equally",
        machineName: "Twin-Light Superposition Bridge",
        machineStatus: "UNSTABLE ➔ Light beams out of balance",
        machineGoal: "Use [H] BLENDER to create an equal 50/50 mix of Blue and Yellow to solidify the bridge!",
        objective: "Apply the [H] Blender to mix Blue and Yellow light equally (50% Blue + 50% Yellow).",
        story: "The garden bridge requires both light rays woven together equally at the same time: a quantum Superposition!",
        target: QuantumState.Plus,
        allowPrep0: true,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "The [H] gate is a Quantum Blender: it mixes both colors equally!",
            "Click the [H] BLENDER button.",
            "Look at the gauges: both Blue and Yellow will show exactly 50%! Click '⚡ ACTIVATE CITY MACHINE'!"
        ],
        explanation: "The bridge appeared! 🌉 Your lantern is now shining BOTH Blue and Yellow light at the same time — 50% each. The bridge needs that equal mix to stay solid. Walk across!"
    },
    {
        id: "ch3_p2",
        chapter: 3,
        chapterTitle: "Twin-Light Garden: The Blender Tool",
        title: "Blend Twice = Back to Blue! (Blender Undoes Itself)",
        machineName: "Garden Gate Lock",
        machineStatus: "50/50 BLEND ➔ Now re-combine the light",
        machineGoal: "Click [H] BLENDER again to merge the 50/50 mix cleanly back into pure Blue (0)!",
        objective: "Apply the [H] Blender a second time to prove blending twice returns you to the start.",
        story: "Lumi says: 'The Blender works both ways! Blue → Blend → Blend again = back to Blue. It's like stirring milk into coffee and then unstirring it!'",
        target: QuantumState.Zero,
        allowPrep0: false,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "The Quantum Blender is also self-reversing!",
            "Click [H] BLENDER one more time.",
            "Watch the two 50% beams merge back into 100% Blue!"
        ],
        explanation: "The bridge folded back to pure Blue! 🔵 The Blender undoes itself when you use it twice. Blue → Blend → Blue again. The gate ahead is open!"
    },
    {
        id: "ch4_p1",
        chapter: 4,
        chapterTitle: "Phase Observatory: The Mirror Tool",
        title: "Wave Direction: The Mirror Tool (Z)",
        machineName: "Phase Observatory Focus Lens",
        machineStatus: "POLARITY MISALIGNED ➔ Mirrored wave needed",
        machineGoal: "Apply [Z] PHASE MIRROR to flip wave vibration reflection without changing 50/50 brightness!",
        objective: "Starting from the 50/50 blend, apply [Z] MIRROR to invert the wave polarity.",
        story: "The observatory beacon has the correct 50/50 brightness, but cannot pass the focus lens due to an inverted wave polarity.",
        target: QuantumState.Minus,
        allowPrep0: false,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "Click the [Z] MIRROR button.",
            "Notice that Blue and Yellow are STILL 50% and 50%! Only the wave vibration (phase) flipped.",
            "Click '⚡ ACTIVATE CITY MACHINE' to calibrate the lens!"
        ],
        explanation: "The wave direction flipped! 🟣 Your lantern still shows 50% Blue and 50% Yellow, but the waves inside are now bouncing in the OPPOSITE direction. The machine can feel that difference!"
    },
    {
        id: "ch4_p2",
        chapter: 4,
        chapterTitle: "Phase Observatory: The Mirror Tool",
        title: "Secret Path: Blend → Mirror → Blend = Yellow!",
        machineName: "Phase Observatory Harmonic Beacon",
        machineStatus: "FLIP SWITCH BROKEN ➔ Find another way!",
        machineGoal: "Turn Blue (0) into Yellow (1) WITHOUT using the Flip Switch: Blend (H) ➔ Mirror (Z) ➔ Blend (H)!",
        objective: "Turn 0 into 1 using only [H] and [Z]: Blend → Mirror → Blend.",
        story: "Lumi says: 'The Flip Switch is broken, but there's another way! Blend the light, mirror the wave, then blend again. Three steps — same result!'",
        target: QuantumState.One,
        allowPrep0: true,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "Step 1: Click [H] BLENDER to create a 50/50 mix.",
            "Step 2: Click [Z] MIRROR to flip the wave vibration.",
            "Step 3: Click [H] BLENDER again: the mirrored waves recombine into 100% Yellow Light!"
        ],
        explanation: "You turned Blue into Yellow without using the Flip Switch! 🟡 You used Blend → Mirror → Blend. Three steps, same result — different path! The beacon is restored!"
    },
    {
        id: "ch5_p1",
        chapter: 5,
        chapterTitle: "Echo Bridge: Step Order Matters!",
        title: "Step 1: Flip THEN Blend (different from Blend first!)",
        machineName: "Echo Bridge Left Pylon",
        machineStatus: "MISALIGNED ➔ Order of steps matters!",
        machineGoal: "Flip Switch FIRST [X], then Blend [H] to create the Mirrored Mix!",
        objective: "Starting from Blue (0), apply X then H to create the Mirrored Blend.",
        story: "Lumi says: 'Think of making a sandwich. Bread then butter is different from butter then bread! Same steps, different order, different result.'",
        target: QuantumState.Minus,
        allowPrep0: true,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "Click [X] FLIP SWITCH first (turns 0 to 1).",
            "Then click [H] BLENDER (turns 1 into mirrored 50/50 blend).",
            "Click '⚡ ACTIVATE CITY MACHINE'!"
        ],
        explanation: "First bridge segment locked! 🌉 Flip first THEN Blend gives a mirrored mix — it's different from just Blending alone. The order of your steps matters!"
    },
    {
        id: "ch5_p2",
        chapter: 5,
        chapterTitle: "Echo Bridge: Step Order Matters!",
        title: "Step 2: Blend THEN Flip (try the other order!)",
        machineName: "Echo Bridge Right Pylon",
        machineStatus: "MISALIGNED ➔ Try the other order!",
        machineGoal: "Blend FIRST [H], then Flip [X] — see how this gives a different result!",
        objective: "Starting from Blue (0), apply H then X to create the Even Blend.",
        story: "Lumi says: 'Now do it in the OPPOSITE order! Blend first, then flip. See the difference? Same tools, different sequence = different result!'",
        target: QuantumState.Plus,
        allowPrep0: true,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "Click [H] BLENDER first (turns 0 into in-sync 50/50 blend).",
            "Then click [X] FLIP SWITCH (keeps it in an in-sync 50/50 blend).",
            "Click '⚡ ACTIVATE CITY MACHINE' to connect the bridge!"
        ],
        explanation: "Echo Bridge extended! 🌉 You proved it — Blend THEN Flip gives a different result than Flip THEN Blend. Order matters, just like cooking: adding flour before eggs is not the same as after!"
    },
    {
        id: "ch6_p1",
        chapter: 6,
        chapterTitle: "The Reversal Vault: Undo Your Steps!",
        title: "Unlocking Ishan's Archive",
        machineName: "Dr. Ishan's Vault Blast Door",
        machineStatus: "SCRAMBLED LOCK (Sequence: H ➔ Z ➔ X)",
        machineGoal: "Undo the scrambled combination in REVERSE order: [X] ➔ [Z] ➔ [H] to unlock the vault!",
        objective: "Undo the scrambled lock by applying the inverse sequence (X → Z → H) or using Undo Last Gate.",
        story: "Dr. Ishan locked his vault with a 3-switch sequence (H → Z → X). To unlock it, apply the switches in reverse: X → Z → H!",
        target: QuantumState.Zero,
        allowPrep0: false,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "To undo a sequence, you must undo the LAST action first!",
            "Click [X], then [Z], then [H].",
            "Or click '↩ Undo Last Gate' three times!"
        ],
        explanation: "Vault unlocked! 🔓 Every step you took can be reversed exactly. Run the steps backwards and you get your original starting point — nothing is lost. Dr. Ishan's message is playing..."
    },
    {
        id: "ch7_p1",
        chapter: 7,
        chapterTitle: "Measurement Station: Once You Look, It's Fixed!",
        title: "The Scanner Room: Make It 50/50, Then Let the Scanner See!",
        machineName: "Auditor Measurement Scanner",
        machineStatus: "SCANNER ONLINE ➡ Set lantern to 50/50 Blend and Activate!",
        machineGoal: "Simple! Click [H] to blend into 50/50, then click ⚡ ACTIVATE. The scanner does the rest!",
        objective: "Click [H] Blender to make 50/50 mix, then click ⚡ ACTIVATE to pass the scanner.",
        story: "Lumi says: 'Easy one! Just blend your lantern into a 50/50 mix with [H], then hit ACTIVATE. The scanner will see the blend and unlock the path!'",
        target: QuantumState.Plus,
        allowPrep0: true,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "Click [H] BLENDER — your lantern glows purple (50% Blue + 50% Yellow).",
            "Click '⚡ ACTIVATE CITY MACHINE' to pass the scan!",
            "The scanner accepts the 50/50 blend and clears the barrier."
        ],
        explanation: "Scanner cleared! 🟢 Your lantern was in a 50/50 superposition — both colors at once. The scanner detected that and opened the path. Climb to the Echo Core!"
    },
    {
        id: "ch8_final",
        chapter: 8,
        chapterTitle: "The Echo Core: Final Application",
        title: "Save the City: Use Everything You Learned!",
        machineName: "The Great Echo Core Pinnacle",
        machineStatus: "CRITICAL ➔ Awaiting Harmonic Key",
        machineGoal: "Synthesize the harmonic quantum key: [H] ➔ [Z] ➔ [H] to reignite Aster's Core!",
        objective: "Complete the final synthesis: start at 0, apply H, then Z, then H to calibrate the core at 1.",
        story: "Mira reaches the pinnacle of Aster. The Echo Core's harmonic rings require the wave interference key to restart the city!",
        target: QuantumState.One,
        allowPrep0: true,
        allowPrep1: false,
        allowedGates: ["X", "H", "Z"],
        hints: [
            "Click [H] to blend into 50/50.",
            "Click [Z] to mirror the wave reflection.",
            "Click [H] again to direct all power into Yellow (1)!"
        ],
        explanation: "🏆 YOU DID IT! The Echo Core is stable! The city of Aster is saved! You went from not knowing what Blue and Yellow light meant... to understanding how these incredible lanterns power an entire floating city. Mira, you're a hero!"
    }
];

// -------------------------------------------------------------
// 2.5 Quantum Diagrams, Matrices & Bloch Evolution Data
// References User Attachments 1, 2, and 3
// -------------------------------------------------------------
const PUZZLE_DIAGRAMS = {
    "ch1_p1": {
        title: "Terminal Alpha Calibration",
        formula: "|0⟩ = [1, 0]ᵀ     I|0⟩ = |0⟩",
        matrix: "I = [ 1   0 ]\n    [ 0   1 ]",
        matrixDesc: "Identity operator preserves pure ground state |0⟩ (Blue).",
        machineEffect: "Terminal Alpha calibrated to pure Blue (0). Gateway power relay primed!",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="20" y1="35" x2="160" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="30" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩</text>
            <rect x="160" y="18" width="60" height="34" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="4"/>
            <text x="190" y="40" fill="#3b82f6" font-size="14" font-weight="bold" text-anchor="middle">|0⟩ PREP</text>
            <line x1="220" y1="35" x2="380" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="240" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩ ALPHA OK</text>
            <text x="400" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Calibrate |0⟩", stateLabel: "|0⟩", vec: [0, 0, 1], axis: 'z', arc: null }
        ]
    },
    "ch1_p2": {
        title: "Terminal Beta Calibration",
        formula: "X|0⟩ = |1⟩     X² = I",
        matrix: "X = [ 0   1 ]\n    [ 1   0 ]",
        matrixDesc: "Bit-flip operator rotates qubit 180° around X-axis from |0⟩ to |1⟩.",
        machineEffect: "Terminal Beta set to Yellow (1). District 1 City Gate unlatches and slides open!",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="20" y1="35" x2="160" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="30" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩</text>
            <rect x="160" y="18" width="50" height="34" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
            <text x="185" y="40" fill="#60a5fa" font-size="15" font-weight="bold" text-anchor="middle">X</text>
            <line x1="210" y1="35" x2="380" y2="35" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="230" y="26" fill="#f59e0b" font-size="13" font-weight="bold">|1⟩ BETA OK</text>
            <text x="400" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔ GATE OPEN</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Apply X-gate", stateLabel: "|1⟩", vec: [0, 0, -1], axis: 'x', arc: 'x_rot' }
        ]
    },
    "ch2_p1": {
        title: "Hydraulic Lift: Power Up With Flip Switch [X]",
        formula: "X|0⟩ = |1⟩     X|1⟩ = |0⟩     X² = I",
        matrix: "X = [ 0   1 ]\n    [ 1   0 ]",
        matrixDesc: "Pauli-X flips state from Blue (0) to Yellow (1), engaging the hydraulic lift pistons.",
        machineEffect: "Heavy hydraulic pressure powers up! Lift platform rises to upper terrace.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="20" y1="35" x2="160" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="30" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩</text>
            <rect x="160" y="18" width="50" height="34" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
            <text x="185" y="40" fill="#60a5fa" font-size="15" font-weight="bold" text-anchor="middle">X</text>
            <line x1="210" y1="35" x2="380" y2="35" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="230" y="26" fill="#f59e0b" font-size="13" font-weight="bold">|1⟩ LIFT UP</text>
            <text x="400" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Apply X-gate", stateLabel: "|1⟩", vec: [0, 0, -1], axis: 'x', arc: 'x_rot' }
        ]
    },
    "ch2_p2": {
        title: "Upper Security Gate: Flip Back to Blue [X]",
        formula: "X|1⟩ = |0⟩     X² = I",
        matrix: "X = [ 0   1 ]\n    [ 1   0 ]",
        matrixDesc: "Applying X a second time returns qubit from |1⟩ back to |0⟩ (quantum reversibility!).",
        machineEffect: "Upper Security Gate unlocks! Passage into District 3 Twin-Light Garden is open.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="20" y1="35" x2="160" y2="35" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="30" y="26" fill="#f59e0b" font-size="13" font-weight="bold">|1⟩</text>
            <rect x="160" y="18" width="50" height="34" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
            <text x="185" y="40" fill="#60a5fa" font-size="15" font-weight="bold" text-anchor="middle">X</text>
            <line x1="210" y1="35" x2="380" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="230" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩ GATE OPEN</text>
            <text x="400" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|1⟩", vec: [0, 0, -1], axis: null, arc: null },
            { label: "Apply X-gate", stateLabel: "|0⟩", vec: [0, 0, 1], axis: 'x', arc: 'x_rot' }
        ]
    },
    "ch3_p1": {
        title: "Twin-Light Bridge: 50/50 Superposition [H]",
        formula: "H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2     H² = I",
        matrix: "H = 1/√2 [ 1   1 ]\n         [ 1  -1 ]",
        matrixDesc: "Hadamard gate rotates the qubit 90° into the equator, creating equal 50/50 superposition.",
        machineEffect: "Harmonic interference bridges the void! Twin-Light Bridge solidifies into walkable path.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="20" y1="35" x2="160" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="30" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩</text>
            <rect x="160" y="18" width="50" height="34" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="185" y="40" fill="#c084fc" font-size="15" font-weight="bold" text-anchor="middle">H</text>
            <line x1="210" y1="35" x2="380" y2="35" stroke="#9333ea" stroke-width="2.5"/>
            <text x="230" y="26" fill="#c084fc" font-size="13" font-weight="bold">|+⟩ BRIDGE SOLID</text>
            <text x="400" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Apply H-gate", stateLabel: "|+⟩", vec: [1, 0, 0], axis: 'diag', arc: 'diag_rot' }
        ]
    },
    "ch3_p2": {
        title: "Garden Gate: Un-Blend Back to Blue [H]",
        formula: "H|+⟩ = |0⟩     H² = I",
        matrix: "H = 1/√2 [ 1   1 ]\n         [ 1  -1 ]",
        matrixDesc: "Hadamard applied twice returns the qubit to pure |0⟩ (destructive interference).",
        machineEffect: "Twin waves recombine! Garden exit gate unlatches, revealing the ramp to District 4.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="20" y1="35" x2="160" y2="35" stroke="#9333ea" stroke-width="2.5"/>
            <text x="30" y="26" fill="#c084fc" font-size="13" font-weight="bold">|+⟩</text>
            <rect x="160" y="18" width="50" height="34" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="185" y="40" fill="#c084fc" font-size="15" font-weight="bold" text-anchor="middle">H</text>
            <line x1="210" y1="35" x2="380" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="230" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩ GATE OPEN</text>
            <text x="400" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|+⟩", vec: [1, 0, 0], axis: null, arc: null },
            { label: "Apply H-gate", stateLabel: "|0⟩", vec: [0, 0, 1], axis: 'diag', arc: 'diag_rot' }
        ]
    },
    "ch4_p1": {
        title: "Phase Observatory: Wave Mirror [Z]",
        formula: "Z|+⟩ = |−⟩ = (|0⟩ − |1⟩)/√2     Z² = I",
        matrix: "Z = [ 1   0 ]\n    [ 0  -1 ]",
        matrixDesc: "Pauli-Z rotates 180° around the Z-axis, flipping the relative phase from +1 to -1.",
        machineEffect: "Observatory Lens polarized! Wave phase inverted to negative reflection.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="20" y1="35" x2="160" y2="35" stroke="#9333ea" stroke-width="2.5"/>
            <text x="30" y="26" fill="#c084fc" font-size="13" font-weight="bold">|+⟩</text>
            <rect x="160" y="18" width="50" height="34" fill="#1e293b" stroke="#4ade80" stroke-width="2" rx="4"/>
            <text x="185" y="40" fill="#4ade80" font-size="15" font-weight="bold" text-anchor="middle">Z</text>
            <line x1="210" y1="35" x2="380" y2="35" stroke="#9333ea" stroke-width="2.5"/>
            <text x="230" y="26" fill="#4ade80" font-size="13" font-weight="bold">|−⟩ MIRRORED</text>
            <text x="400" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|+⟩", vec: [1, 0, 0], axis: null, arc: null },
            { label: "Apply Z-gate", stateLabel: "|−⟩", vec: [-1, 0, 0], axis: 'z', arc: 'z_rot' }
        ]
    },
    "ch4_p2": {
        title: "Harmonic Beacon: Flip Without [X] (H·Z·H = X)",
        formula: "H·Z·H|0⟩ = X|0⟩ = |1⟩     (HZH = X)",
        matrix: "H·Z·H = [ 0   1 ] = X\n        [ 1   0 ]",
        matrixDesc: "Three gate sequence H ➔ Z ➔ H exactly synthesizes Pauli-X without using the switch!",
        machineEffect: "Harmonic Beacon fires Yellow resonance! Observatory exit gate unlocks to District 5.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 540 60">
            <line x1="10" y1="35" x2="80" y2="35" stroke="#3b82f6" stroke-width="2"/>
            <text x="15" y="26" fill="#3b82f6" font-size="12" font-weight="bold">|0⟩</text>
            <rect x="80" y="18" width="36" height="32" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="98" y="39" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="116" y1="35" x2="186" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="130" y="26" fill="#9333ea" font-size="11" font-weight="bold">|+⟩</text>
            <rect x="186" y="18" width="36" height="32" fill="#1e293b" stroke="#4ade80" stroke-width="2" rx="4"/>
            <text x="204" y="39" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle">Z</text>
            <line x1="222" y1="35" x2="292" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="236" y="26" fill="#9333ea" font-size="11" font-weight="bold">|−⟩</text>
            <rect x="292" y="18" width="36" height="32" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="310" y="39" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="328" y1="35" x2="440" y2="35" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="345" y="26" fill="#f59e0b" font-size="13" font-weight="bold">|1⟩ BEACON ON</text>
            <text x="460" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        // EXACT REPLICA OF USER ATTACHMENT 2!
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Apply H-gate", stateLabel: "|+⟩", vec: [1, 0, 0], axis: 'diag', arc: 'diag_rot' },
            { label: "Apply Z-gate", stateLabel: "|−⟩", vec: [-1, 0, 0], axis: 'z', arc: 'z_rot' },
            { label: "Apply H-gate", stateLabel: "|1⟩", vec: [0, 0, -1], axis: 'diag', arc: 'diag_rot' }
        ]
    },
    "ch5_p1": {
        title: "Echo Bridge Left Pylon: Flip THEN Blend (X ➔ H)",
        formula: "H·X|0⟩ = H|1⟩ = |−⟩     (X then H)",
        matrix: "H·X = 1/√2 [ 1  -1 ]\n          [ 1   1 ]",
        matrixDesc: "Applying X first produces |1⟩, then H creates Mirrored Superposition |−⟩.",
        machineEffect: "Left Pylon anchors in mirrored resonance! Now align the Right Pylon.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="10" y1="35" x2="90" y2="35" stroke="#3b82f6" stroke-width="2"/>
            <text x="20" y="26" fill="#3b82f6" font-size="12" font-weight="bold">|0⟩</text>
            <rect x="90" y="18" width="40" height="34" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
            <text x="110" y="40" fill="#60a5fa" font-size="14" font-weight="bold" text-anchor="middle">X</text>
            <line x1="130" y1="35" x2="210" y2="35" stroke="#f59e0b" stroke-width="2"/>
            <text x="145" y="26" fill="#f59e0b" font-size="12" font-weight="bold">|1⟩</text>
            <rect x="210" y="18" width="40" height="34" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="230" y="40" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="250" y1="35" x2="370" y2="35" stroke="#9333ea" stroke-width="2.5"/>
            <text x="270" y="26" fill="#818cf8" font-size="13" font-weight="bold">|−⟩ LEFT PYLON</text>
            <text x="390" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Apply X-gate", stateLabel: "|1⟩", vec: [0, 0, -1], axis: 'x', arc: 'x_rot' },
            { label: "Apply H-gate", stateLabel: "|−⟩", vec: [-1, 0, 0], axis: 'diag', arc: 'diag_rot' }
        ]
    },
    "ch5_p2": {
        title: "Echo Bridge Right Pylon: Blend THEN Flip (H ➔ X)",
        formula: "X·H|0⟩ = X|+⟩ = |+⟩     (H then X, XH ≠ HX!)",
        matrix: "X·H = 1/√2 [ 1   1 ]\n          [ 1  -1 ]",
        matrixDesc: "Applying H first produces |+⟩, then X leaves |+⟩ unchanged: XH ≠ HX proves non-commutativity!",
        machineEffect: "Both pylons linked! Echo Bridge gate opens — Grand Skyway to Ishan's Vault connects!",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 460 60">
            <line x1="10" y1="35" x2="90" y2="35" stroke="#3b82f6" stroke-width="2"/>
            <text x="20" y="26" fill="#3b82f6" font-size="12" font-weight="bold">|0⟩</text>
            <rect x="90" y="18" width="40" height="34" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="110" y="40" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="130" y1="35" x2="210" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="145" y="26" fill="#c084fc" font-size="12" font-weight="bold">|+⟩</text>
            <rect x="210" y="18" width="40" height="34" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
            <text x="230" y="40" fill="#60a5fa" font-size="14" font-weight="bold" text-anchor="middle">X</text>
            <line x1="250" y1="35" x2="370" y2="35" stroke="#9333ea" stroke-width="2.5"/>
            <text x="270" y="26" fill="#818cf8" font-size="13" font-weight="bold">|+⟩ RIGHT PYLON</text>
            <text x="390" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Apply H-gate", stateLabel: "|+⟩", vec: [1, 0, 0], axis: 'diag', arc: 'diag_rot' },
            { label: "Apply X-gate", stateLabel: "|+⟩", vec: [1, 0, 0], axis: 'x', arc: 'x_rot' }
        ]
    },
    "ch6_p1": {
        title: "Dr. Ishan's Vault Blast Door: Reverse Sequence (X ➔ Z ➔ H)",
        formula: "(H·Z·X)⁻¹ = X·Z·H     Reverse each step!",
        matrix: "U_unlock = X·Z·H = [ 0  -1 ]\n                   [ -1  0 ]",
        matrixDesc: "Quantum reversibility: applying operators in inverse order unwinds the lock back to |0⟩.",
        machineEffect: "Vault security combination unlocked! Blast door retracts into the floor.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 540 60">
            <line x1="10" y1="35" x2="80" y2="35" stroke="#f87171" stroke-width="2"/>
            <text x="15" y="26" fill="#f87171" font-size="12" font-weight="bold">LOCK</text>
            <rect x="80" y="18" width="36" height="32" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="98" y="39" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="116" y1="35" x2="186" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="130" y="26" fill="#9333ea" font-size="11" font-weight="bold">|+⟩</text>
            <rect x="186" y="18" width="36" height="32" fill="#1e293b" stroke="#4ade80" stroke-width="2" rx="4"/>
            <text x="204" y="39" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle">Z</text>
            <line x1="222" y1="35" x2="292" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="236" y="26" fill="#9333ea" font-size="11" font-weight="bold">|−⟩</text>
            <rect x="292" y="18" width="36" height="32" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
            <text x="310" y="39" fill="#60a5fa" font-size="14" font-weight="bold" text-anchor="middle">X</text>
            <line x1="328" y1="35" x2="440" y2="35" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="345" y="26" fill="#3b82f6" font-size="13" font-weight="bold">|0⟩ VAULT OPEN</text>
            <text x="460" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Scrambled", stateLabel: "Lock", vec: [0, 0, -1], axis: null, arc: null },
            { label: "Apply H-gate", stateLabel: "|+⟩", vec: [1, 0, 0], axis: 'diag', arc: 'diag_rot' },
            { label: "Apply Z-gate", stateLabel: "|−⟩", vec: [-1, 0, 0], axis: 'z', arc: 'z_rot' },
            { label: "Apply X-gate", stateLabel: "|0⟩", vec: [0, 0, 1], axis: 'x', arc: 'x_rot' }
        ]
    },
    "ch7_p1": {
        title: "Auditor Measurement Scanner: Wave Function Collapse",
        formula: "Measure |+⟩ ➔ |0⟩ (50%) or |1⟩ (50%)",
        matrix: "Projective Measurement:\nΠ₀ = [ 1  0; 0  0 ],  Π₁ = [ 0  0; 0  1 ]",
        matrixDesc: "Observation collapses the superposition instantly into an irreversible classical outcome.",
        machineEffect: "Auditor Scanner satisfied by quantum collapse! Security barrier dissolves.",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 480 60">
            <line x1="10" y1="35" x2="100" y2="35" stroke="#3b82f6" stroke-width="2"/>
            <text x="20" y="26" fill="#3b82f6" font-size="12" font-weight="bold">|0⟩</text>
            <rect x="100" y="18" width="40" height="34" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="120" y="40" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="140" y1="35" x2="230" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="155" y="26" fill="#c084fc" font-size="12" font-weight="bold">|+⟩ 50/50</text>
            <rect x="230" y="14" width="70" height="40" fill="#1e1010" stroke="#ef4444" stroke-width="2" rx="4"/>
            <text x="265" y="32" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">MEASURE</text>
            <text x="265" y="46" fill="#ef4444" font-size="11" text-anchor="middle">👁️ SCAN</text>
            <line x1="300" y1="35" x2="410" y2="35" stroke="#22c55e" stroke-width="2.5"/>
            <text x="315" y="26" fill="#22c55e" font-size="12" font-weight="bold">COLLAPSED</text>
            <text x="430" y="40" fill="#22c55e" font-size="16" font-weight="bold">✔</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Superposition", stateLabel: "|+⟩", vec: [1, 0, 0], axis: 'diag', arc: 'diag_rot' },
            { label: "Collapsed", stateLabel: "|0⟩ / |1⟩", vec: [0, 0, 1], axis: 'z', arc: 'z_rot' }
        ]
    },
    "ch8_final": {
        title: "The Great Echo Core Pinnacle: Master Synthesis (H·Z·H = X)",
        formula: "H·Z·H|0⟩ = |1⟩     (Pinnacle Core Ignition)",
        matrix: "H·Z·H = [ 0   1 ] = X\n        [ 1   0 ]",
        matrixDesc: "The pinnacle core requires full harmonic synthesis: H ➔ Z ➔ H reignites the city grid!",
        machineEffect: "Echo Core harmonic resonance fully ignited! The City of Aster is saved! 🏆",
        circuitSvg: `<svg width="100%" height="60" viewBox="0 0 540 60">
            <line x1="10" y1="35" x2="80" y2="35" stroke="#3b82f6" stroke-width="2"/>
            <text x="15" y="26" fill="#3b82f6" font-size="12" font-weight="bold">|0⟩</text>
            <rect x="80" y="18" width="36" height="32" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="98" y="39" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="116" y1="35" x2="186" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="130" y="26" fill="#9333ea" font-size="11" font-weight="bold">|+⟩</text>
            <rect x="186" y="18" width="36" height="32" fill="#1e293b" stroke="#4ade80" stroke-width="2" rx="4"/>
            <text x="204" y="39" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle">Z</text>
            <line x1="222" y1="35" x2="292" y2="35" stroke="#9333ea" stroke-width="2"/>
            <text x="236" y="26" fill="#9333ea" font-size="11" font-weight="bold">|−⟩</text>
            <rect x="292" y="18" width="36" height="32" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
            <text x="310" y="39" fill="#c084fc" font-size="14" font-weight="bold" text-anchor="middle">H</text>
            <line x1="328" y1="35" x2="440" y2="35" stroke="#eab308" stroke-width="2.5"/>
            <text x="345" y="26" fill="#eab308" font-size="13" font-weight="bold">|1⟩ CITY SAVED!</text>
            <text x="460" y="40" fill="#22c55e" font-size="18" font-weight="bold">🏆</text>
        </svg>`,
        steps: [
            { label: "Start", stateLabel: "|0⟩", vec: [0, 0, 1], axis: null, arc: null },
            { label: "Apply H-gate", stateLabel: "|+⟩", vec: [1, 0, 0], axis: 'diag', arc: 'diag_rot' },
            { label: "Apply Z-gate", stateLabel: "|−⟩", vec: [-1, 0, 0], axis: 'z', arc: 'z_rot' },
            { label: "Apply H-gate", stateLabel: "|1⟩", vec: [0, 0, -1], axis: 'diag', arc: 'diag_rot' }
        ]
    }
};

// -------------------------------------------------------------
// Bloch Sphere Canvas Renderer (References User Attachments 1 & 2)
// -------------------------------------------------------------
function drawBlochSphereCanvas(canvas, stepData) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2 + 4;
    const R = Math.min(w, h) * 0.35;

    ctx.clearRect(0, 0, w, h);

    // 1. Shaded Sphere Background (Picture 1 & 2 style)
    let sphereGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    sphereGrad.addColorStop(0, 'rgba(240, 249, 255, 0.22)');
    sphereGrad.addColorStop(0.7, 'rgba(148, 163, 184, 0.12)');
    sphereGrad.addColorStop(1, 'rgba(15, 23, 42, 0.45)');
    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Sphere perimeter
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Latitudinal Equator Line (perspective ellipse)
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. Longitudinal Prime Meridian (perspective vertical ellipse)
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 0.32, R, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // 4. Coordinate Axes (x, y, z)
    // Z-axis (vertical)
    ctx.beginPath();
    ctx.setLineDash([3, 2]);
    ctx.moveTo(cx, cy + R + 4);
    ctx.lineTo(cx, cy - R - 6);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Z-axis arrow & labels
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|0⟩', cx, cy - R - 8);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('|1⟩', cx, cy + R + 14);

    // X-axis (projected bottom-left)
    let xEndX = cx - R * 0.58;
    let xEndY = cy + R * 0.42;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(xEndX, xEndY);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 10px sans-serif';
    ctx.fillText('x', xEndX - 8, xEndY + 4);

    // Y-axis (projected horizontal right)
    let yEndX = cx + R * 0.88;
    let yEndY = cy + R * 0.16;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(yEndX, yEndY);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillText('y', yEndX + 8, yEndY + 4);

    // 5. Rotation axis & arc arrow (from Picture 2!)
    if (stepData && stepData.axis === 'diag') {
        ctx.beginPath();
        ctx.setLineDash([4, 3]);
        ctx.moveTo(cx - R * 0.55, cy + R * 0.55);
        ctx.lineTo(cx + R * 0.55, cy - R * 0.55);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
    } else if (stepData && stepData.axis === 'z') {
        ctx.beginPath();
        ctx.setLineDash([4, 3]);
        ctx.moveTo(cx, cy - R * 0.85);
        ctx.lineTo(cx, cy + R * 0.85);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
    } else if (stepData && stepData.axis === 'x') {
        ctx.beginPath();
        ctx.setLineDash([4, 3]);
        ctx.moveTo(cx - R * 0.7, cy + R * 0.5);
        ctx.lineTo(cx + R * 0.7, cy - R * 0.5);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (stepData && stepData.arc) {
        ctx.beginPath();
        if (stepData.arc === 'diag_rot') {
            ctx.arc(cx + 6, cy + 4, R * 0.42, -0.4, Math.PI * 0.55);
        } else if (stepData.arc === 'z_rot') {
            ctx.arc(cx, cy, R * 0.45, 0.1, Math.PI * 0.75);
        } else {
            ctx.arc(cx, cy, R * 0.4, -0.2, Math.PI * 0.65);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.stroke();
        let arrowX = cx + (stepData.arc === 'diag_rot' ? 14 : -12);
        let arrowY = cy + (stepData.arc === 'diag_rot' ? 22 : 18);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(arrowX, arrowY, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // 6. State Vector Arrow (Pink/Magenta, Picture 2!)
    let vec = (stepData && stepData.vec) ? stepData.vec : [0, 0, 1];
    let vx = vec[0], vy = vec[1], vz = vec[2];
    let targetX = cx + R * (-0.58 * vx + 0.88 * vy);
    let targetY = cy + R * (0.42 * vx + 0.16 * vy - 1.0 * vz);

    // Glow line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Arrowhead
    let angle = Math.atan2(targetY - cy, targetX - cx);
    let headLen = 10;
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(targetX - headLen * Math.cos(angle - Math.PI / 6), targetY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(targetX - headLen * Math.cos(angle + Math.PI / 6), targetY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // State Label near arrow tip
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    let labelOffset = 14;
    ctx.fillText(stepData.stateLabel || '', targetX + Math.cos(angle) * labelOffset, targetY + Math.sin(angle) * labelOffset + 4);

    // Step title at top (e.g. "Apply H-gate", like Picture 2)
    if (stepData.label) {
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(stepData.label, cx, 14);
    }
}

// -------------------------------------------------------------
// 3. Codex / Journal Articles (Layman Summaries + Details)
// -------------------------------------------------------------
const JOURNAL_ARTICLES = [
    {
        title: "1. Qubit Basis States: Blue (0) & Yellow (1)",
        category: "Fundamentals",
        text: "💡 LAYMAN SUMMARY:\nThink of a qubit like a futuristic quantum light bulb. It has two primary colors:\n• State |0⟩ = Pure Blue light (like switch DOWN / OFF).\n• State |1⟩ = Pure Yellow light (like switch UP / ON).\nWhen set to 100% Blue, measuring it will always give 0. When set to 100% Yellow Light, it will always give 1.\n\n🔬 TECHNICAL DETAILS:\nIn quantum mechanics, |0⟩ and |1⟩ form an orthonormal computational basis. A state vector is normalized: |α|² + |β|² = 1."
    },
    {
        title: "2. Superposition: The 50/50 Blend",
        category: "Fundamentals",
        text: "💡 LAYMAN SUMMARY:\nUnlike a regular light switch that MUST be either UP or DOWN, a quantum qubit can be BOTH AT ONCE! This is called Superposition.\nImagine mixing blue and yellow paint together—the lantern glows with both colors simultaneously until someone looks at it.\n\n🔬 TECHNICAL DETAILS:\nA qubit can exist in a linear combination: |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes."
    },
    {
        title: "3. The [X] Switch: Color Inverter",
        category: "Operations",
        text: "💡 LAYMAN SUMMARY:\nThe [X] gate is simply a FLIP SWITCH:\n• If your light is Blue (0), [X] flips it to Yellow (1).\n• If your light is Yellow (1), [X] flips it back to Blue (0).\nIf you click [X] twice, you return right back to where you started (X² = Identity)!\n\n🔬 TECHNICAL DETAILS:\nPauli-X acts as a quantum NOT gate, swapping amplitudes: X|0⟩ = |1⟩, X|1⟩ = |0⟩. Matrix: [[0,1],[1,0]]."
    },
    {
        title: "4. The [H] Gate: The Quantum Blender",
        category: "Operations",
        text: "💡 LAYMAN SUMMARY:\nThe [H] Hadamard gate is a QUANTUM BLENDER:\n• Put in pure Blue (0) ➔ It blends it into a 50/50 mix of Blue and Yellow!\n• Put in pure Yellow (1) ➔ It blends it into a 50/50 mix with mirrored wave polarity!\nIf you blend twice with [H], the waves cleanly recombine back into the original color with zero loss!\n\n🔬 TECHNICAL DETAILS:\nHadamard creates equal superposition: H|0⟩ = (|0⟩+|1⟩)/√2. H is unitary and self-inverse (H² = I)."
    },
    {
        title: "5. The [Z] Gate: The Wave Mirror",
        category: "Phase",
        text: "💡 LAYMAN SUMMARY:\nLight is made of waves. Two lights can have the exact same brightness (50% Blue and 50% Yellow), but their waves can vibrate in-sync or opposite each other.\nThe [Z] gate acts like a mirror: it flips the vibration upside-down without changing brightness!\n\n🔬 TECHNICAL DETAILS:\nPauli-Z applies a relative phase of π (180°): Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩. It maps |+⟩ to |−⟩."
    },
    {
        title: "6. Switch Order Matters (X-then-H vs H-then-X)",
        category: "Operations",
        text: "💡 LAYMAN SUMMARY:\nIn ordinary math, 2 + 3 is the same as 3 + 2. But in quantum computing, SWITCH ORDER MATTERS!\nThink about everyday life: putting on socks then shoes is fine, but putting on shoes then socks is a mess! Similarly, flipping [X] then blending [H] creates a mirrored blend (|−⟩), while blending [H] then flipping [X] creates an in-sync blend (|+⟩)!\n\n🔬 TECHNICAL DETAILS:\nQuantum gate operators do not commute in general (XH ≠ HX). Gate order determines state trajectory."
    },
    {
        title: "7. Reversing Circuits (The Rewind Rule)",
        category: "Reversibility",
        text: "💡 LAYMAN SUMMARY:\nTo undo a series of quantum switches, you must undo them in REVERSE ORDER!\nIf you did: Step 1 (H) ➔ Step 2 (Z) ➔ Step 3 (X),\nto undo it you must press: Step 3 (X) ➔ Step 2 (Z) ➔ Step 1 (H).\n\n🔬 TECHNICAL DETAILS:\nUnitary evolution preserves information: (U₁ U₂ U₃)⁻¹ = U₃⁻¹ U₂⁻¹ U₁⁻¹."
    },
    {
        title: "8. Measurement: Why You Cannot Undo Looking",
        category: "The Auditor's Error",
        text: "💡 LAYMAN SUMMARY:\nWhen a qubit is in a 50/50 blend, it is a fluid quantum wave. But the instant a sensor or camera measures it, the wave 'snaps' (collapses) into either 0 or 1.\nOnce it snaps, the delicate wave information is gone forever—you cannot hit 'Undo' on a measurement! The Auditor failed because he tried to force measurement everywhere, destroying Aster's quantum coherence.\n\n🔬 TECHNICAL DETAILS:\nMeasurement is a non-unitary projection onto an eigenbasis. Prior quantum coherence cannot be reconstructed without prior preparation knowledge."
    }
];


// -------------------------------------------------------------
// 4. Game Master Class
// -------------------------------------------------------------
class Game {
    constructor() {
        this.sim = new QuantumSimulator();
        this.activePuzzle = PUZZLE_DATA[0];
        this.revealedHints = 0;

        // Player stands firmly on the stone platform surface (y = 0.75)
        this.playerPos = new THREE.Vector3(0, 0.75, 2.0);
        this.playerYaw = 0;
        this.moveSpeed = 8.5;
        this.moveDirection = { forward: false, backward: false, left: false, right: false, sprint: false };

        // -------------------------------------------------------------
        // Layman Level Player Physics (Jumping, Falling, and Respawning)
        // -------------------------------------------------------------
        this.playerVelocityY = 0; // Vertical speed (goes up when jumping, pulled down by gravity)
        this.isGrounded = true;   // True when Mira's feet are safely touching a platform
        this.isDead = false;       // True when Mira falls outside into the void
        this.platforms = [];      // Stores every platform & step so Mira can stand & jump onto them
        this.barriers = [];       // Forcefield walls that block movement until puzzles are solved
        this.lastSafeCheckpoint = new THREE.Vector3(0, 0.75, 2.0); // Safe spot to bring Mira back if she falls

        // Camera starts BEHIND the player looking forward into the city (+Z)
        this.cameraDist = 4.8;
        this.cameraPitch = 0.28;
        this.cameraYaw = 0;

        // Interaction
        this.nearbyInteractable = null;
        this.isUIOpen = false;

        // Statistics
        this.totalTrials = 0;
        this.count0 = 0;
        this.count1 = 0;

        this.initThree();
        this.buildCity();
        this.initEvents();
        this.initCodex();
        this.updateHUD();
        this.animate();

        // Welcome dialogue
        this.showDialogue("Mira", "Welcome to Aster! Guide drone Lumi is trapped at Terminal Beta! Look to your LEFT for Terminal Alpha (Blue 0). Walk over and press [E] to begin.");
    }

    initThree() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060b17);
        this.scene.fog = new THREE.FogExp2(0x060b17, 0.005);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        let ambient = new THREE.AmbientLight(0x28426b, 1.3);
        this.scene.add(ambient);

        this.sun = new THREE.DirectionalLight(0xfff6e6, 1.5);
        this.sun.position.set(30, 80, 40);
        this.scene.add(this.sun);

        // Bloch Canvas
        this.blochCanvas = document.getElementById('bloch-canvas');
        this.blochCtx = this.blochCanvas.getContext('2d');
        this.resizeBlochCanvas();
    }

    resizeBlochCanvas() {
        if (!this.blochCanvas) return;
        this.blochCanvas.width = this.blochCanvas.clientWidth || 360;
        this.blochCanvas.height = this.blochCanvas.clientHeight || 220;
    }

    createSkyStars() {
        this.skyGroup = new THREE.Group();
        this.scene.add(this.skyGroup);

        // Circular Star Glow Texture (procedurally generated on 64x64 canvas)
        let canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        let ctx = canvas.getContext('2d');
        let grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        grad.addColorStop(0.25, 'rgba(224, 242, 254, 0.85)');
        grad.addColorStop(0.55, 'rgba(125, 211, 252, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        let starTexture = new THREE.CanvasTexture(canvas);

        // 1. Distant Celestial Stars Dome (1,800 stars across the sky)
        let starCount = 1800;
        let starGeo = new THREE.BufferGeometry();
        let starPositions = new Float32Array(starCount * 3);
        let starColors = new Float32Array(starCount * 3);

        let colorPalette = [
            new THREE.Color(0xffffff), // Pure white
            new THREE.Color(0xf0f9ff), // Diamond bright
            new THREE.Color(0x7dd3fc), // Quantum sky blue
            new THREE.Color(0x38bdf8), // Cyan star
            new THREE.Color(0xfef08a), // Golden star
            new THREE.Color(0xe9d5ff), // Soft lavender star
        ];

        for (let i = 0; i < starCount; i++) {
            // Distribute across upper celestial hemisphere
            let radius = 220 + Math.random() * 260; // 220m to 480m distance
            let theta = Math.random() * Math.PI * 2; // Azimuth 0 to 360 deg
            let phi = 0.08 + Math.pow(Math.random(), 1.35) * (Math.PI / 2 - 0.1); // Elevation above horizon

            let x = radius * Math.cos(phi) * Math.sin(theta);
            let y = radius * Math.sin(phi) + 15; // Raised high into the sky
            let z = 100 + radius * Math.cos(phi) * Math.cos(theta); // Centered over Aster city axis

            starPositions[i * 3] = x;
            starPositions[i * 3 + 1] = y;
            starPositions[i * 3 + 2] = z;

            let col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            starColors[i * 3] = col.r;
            starColors[i * 3 + 1] = col.g;
            starColors[i * 3 + 2] = col.b;
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

        this.starFieldMat = new THREE.PointsMaterial({
            size: 3.8,
            map: starTexture,
            transparent: true,
            opacity: 0.92,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false // Stars remain sparkling and crisp through atmospheric distance fog
        });

        this.celestialStarField = new THREE.Points(starGeo, this.starFieldMat);
        this.skyGroup.add(this.celestialStarField);

        // 2. Atmospheric Floating Stardust Particles (drifting with minimal speed)
        let dustCount = 450;
        this.stardustGeo = new THREE.BufferGeometry();
        this.stardustPositions = new Float32Array(dustCount * 3);
        this.stardustVels = new Float32Array(dustCount * 3);
        let dustColors = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            let x = (Math.random() - 0.5) * 280;
            let y = 10 + Math.random() * 95;
            let z = -30 + Math.random() * 300;

            this.stardustPositions[i * 3] = x;
            this.stardustPositions[i * 3 + 1] = y;
            this.stardustPositions[i * 3 + 2] = z;

            // Minimal speed drift velocities (slow, peaceful motion)
            this.stardustVels[i * 3] = (Math.random() - 0.5) * 0.05;
            this.stardustVels[i * 3 + 1] = (Math.random() - 0.5) * 0.03 + 0.01; // gentle upward thermal
            this.stardustVels[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

            let col = Math.random() > 0.4 ? new THREE.Color(0x38bdf8) : (Math.random() > 0.5 ? new THREE.Color(0xfef08a) : new THREE.Color(0xffffff));
            dustColors[i * 3] = col.r;
            dustColors[i * 3 + 1] = col.g;
            dustColors[i * 3 + 2] = col.b;
        }

        this.stardustGeo.setAttribute('position', new THREE.BufferAttribute(this.stardustPositions, 3));
        this.stardustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

        this.stardustMat = new THREE.PointsMaterial({
            size: 2.4,
            map: starTexture,
            transparent: true,
            opacity: 0.78,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false
        });

        this.stardustField = new THREE.Points(this.stardustGeo, this.stardustMat);
        this.skyGroup.add(this.stardustField);
    }

    buildCity() {
        this.cityGroup = new THREE.Group();
        this.scene.add(this.cityGroup);

        // Sky Star Particles
        this.createSkyStars();

        let stoneMat = new THREE.MeshStandardMaterial({ color: 0x303847, roughness: 0.75 });
        let canalMat = new THREE.MeshStandardMaterial({ color: 0x091426, roughness: 0.3 });

        // Hazard floor
        let hazard = new THREE.Mesh(new THREE.BoxGeometry(700, 2, 700), canalMat);
        hazard.position.set(0, -6, 120);
        this.cityGroup.add(hazard);

        // Central Pinnacle Tower (Echo Core)
        let towerMat = new THREE.MeshStandardMaterial({ color: 0x141f2e, roughness: 0.5 });
        let ringMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x1d4ed8,
            emissiveIntensity: 0.5,
            roughness: 0.35,
            metalness: 0.7
        });

        let tower = new THREE.Mesh(new THREE.CylinderGeometry(8, 15, 95, 20), towerMat);
        tower.position.set(0, 45, 240);
        this.cityGroup.add(tower);

        this.harmonicRings = [];
        for (let r = 0; r < 6; r++) {
            let ring = new THREE.Mesh(new THREE.TorusGeometry(13 + r * 1.6, 0.45, 8, 36), ringMat);
            ring.position.set(0, 20 + r * 10, 240);
            ring.rotation.x = Math.PI / 2;
            this.cityGroup.add(ring);
            this.harmonicRings.push(ring);
        }

        // District 1: Arrival Harbor (Surface height Y = 0.75)
        this.addPlatform(0, 0, 0, 30, 1.5, 32, stoneMat);

        // -------------------------------------------------------------
        // Real 3D Mechanical City Security Gate (District 1)
        // -------------------------------------------------------------
        this.d1Gate = this.createMechanicalGate('d1', 0, 0, 14, 11, 7.2, 1.8);
        this.d1GateOpen = false;
        this.d1GateOpenPermanently = false;
        this.smokeParticles = [];

        this.addMachineSign('d1_gate', 0, 8.4, 14, "DISTRICT 1 CITY GATE", "LOCKED 🔒 (Requires Alpha + Beta)", 0xef4444);

        // Practice Jump Steps in Arrival Harbor (Layman level: try pressing [J] to hop onto them!)
        let stepMat = new THREE.MeshStandardMaterial({ color: 0x3b4759, roughness: 0.65 });
        let trimMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.45, metalness: 0.6 });

        // Step 1: Low step (Height = 1.20, easily reachable with jump)
        this.addPlatform(8.0, 0.45, -1.0, 4.0, 0.9, 4.0, stepMat);
        let step1Trim = new THREE.Mesh(new THREE.BoxGeometry(4.05, 0.04, 4.05), trimMat);
        step1Trim.position.set(8.0, 0.92, -1.0);
        this.cityGroup.add(step1Trim);

        // Step 2: Higher step (Height = 1.65, reachable with jump from Step 1 or from ground)
        this.addPlatform(8.0, 0.90, -6.0, 4.0, 1.8, 4.0, stepMat);
        let step2Trim = new THREE.Mesh(new THREE.BoxGeometry(4.05, 0.04, 4.05), new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.45, metalness: 0.5 }));
        step2Trim.position.set(8.0, 1.82, -6.0);
        this.cityGroup.add(step2Trim);

        // Terminal Alpha (LEFT, +X) & Beta (RIGHT, -X) with tall glowing beacon pillars!
        this.addConsole("ch1_p1", 4.5, 0.75, 5.0, "◀ Terminal Alpha (Blue 0)", 0x3b82f6);
        this.addConsole("ch1_p2", -4.5, 0.75, 5.0, "Terminal Beta (Yellow 1) ▶", 0xf59e0b);

        // District 2: Switchworks
        this.createSlope('d1_ramp', 0, 17.5, 8, 14, 21, 0.75, 1.10, true);
        this.addPlatform(0, 0.5, 27, 7, 1.2, 12, stoneMat); // Walkway surface Y = 1.10

        // Stepping Stones / Staircase between District 1 Walkway and District 2 Plaza
        this.addPlatform(0, 0.95, 31.0, 6.0, 0.9, 2.6, stepMat); // Step A: topY = 1.40
        this.addPlatform(0, 1.45, 33.6, 6.0, 0.9, 2.6, stepMat); // Step B: topY = 1.90
        this.addPlatform(0, 1.95, 36.2, 6.0, 0.9, 2.6, stepMat); // Step C: topY = 2.40

        this.addPlatform(0, 2.0, 42, 30, 1.5, 26, stoneMat); // Plaza surface Y = 2.75

        // Wide illuminated stone staircase from Plaza (Y = 2.75) to Upper Terrace (Y = 4.75)
        this.addPlatform(1.0, 2.35, 49.0, 12.0, 1.6, 2.5, stepMat); // Step 1: topY = 3.15
        this.addPlatform(1.0, 2.55, 51.5, 12.0, 2.0, 2.5, stepMat); // Step 2: topY = 3.55
        this.addPlatform(1.0, 2.75, 54.0, 12.0, 2.4, 2.5, stepMat); // Step 3: topY = 3.95
        this.addPlatform(1.0, 2.95, 56.5, 12.0, 2.8, 2.5, stepMat); // Step 4: topY = 4.35
        this.addPlatform(1.0, 3.15, 59.0, 12.0, 3.2, 2.5, stepMat); // Step 5: topY = 4.75

        // Twin glowing ramps flanking the lift so the player can always effortlessly walk up to the Upper Terrace
        this.createSlope('d2_terrace_ramp_west', 0.5, 53.5, 6.0, 48.0, 59.0, 2.75, 4.75, true);
        this.createSlope('d2_terrace_ramp_east', 22.5, 53.5, 5.0, 48.0, 59.0, 2.75, 4.75, true);

        // Switchworks Heavy Hydraulic Lift: Starts lowered at Y = 2.50, elevates to Y = 4.15 on State 1
        this.d2Lift = this.addPlatform(14, 2.5, 54, 14, 1.2, 6, stoneMat);
        this.d2LiftPlatform = this.d2Lift.userData.platform;
        this.d2LiftTargetY = 2.50;

        // Lift industrial hydraulic pistons / glowing guide columns
        let pistonMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.25 });
        let p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 10.0, 16), pistonMat);
        p1.position.set(6.8, 5.0, 54);
        this.cityGroup.add(p1);
        let p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 10.0, 16), pistonMat);
        p2.position.set(21.2, 5.0, 54);
        this.cityGroup.add(p2);

        this.addMachineSign('d2_lift', 14, 6.8, 54, "HYDRAULIC LIFT", "LOWERED 🔒 (Needs Yellow 1)", 0xf59e0b);
        this.addConsole("ch2_p1", 8.0, 2.75, 48, "◀ Lift Console (Flip to 1)", 0xf59e0b);

        // Upper Terrace Walkway connecting Lift and Steps directly to District 3
        this.addPlatform(14, 4.0, 62, 24, 1.5, 8, stoneMat); // surface Y = 4.75, Z: 58 to 66, X: 2 to 26

        // Upper Security Gate blocking passage from District 2 Upper Terrace into District 3
        this.d2Gate = this.createMechanicalGate('d2', 18, 4.75, 66, 10, 6.8, 1.8);
        this.addMachineSign('d2_gate', 18, 12.0, 66, "UPPER SECURITY GATE", "LOCKED 🔒 (Requires Blue 0)", 0x3b82f6);
        this.addConsole("ch2_p2", 13.0, 4.75, 62, "◀ Upper Gate (Flip to 0)", 0x3b82f6);

        // District 3: Twin-Light Garden
        this.addPlatform(28, 4.0, 75, 30, 1.5, 32, stoneMat); // Surface Y = 4.75, Z: 59..91, X: 13..43
        this.d3Gate = this.createMechanicalGate('d3', 40, 4.0, 88, 10, 6.8, 1.8);
        this.addMachineSign('d3_bridge', 40, 8.8, 88, "TWIN-LIGHT BRIDGE", "UNSTABLE 🔒 (Needs 50/50 Mix [H])", 0xc084fc);
        this.addConsole("ch3_p1", 22, 4.75, 75, "◀ Bridge Console (Blend 50/50)", 0x22d3ee);
        this.addConsole("ch3_p2", 34, 4.75, 75, "Garden Gate (Blend Twice) ▶", 0xf59e0b);

        // Permanent Ramp from D3 Garden (Y=4.75, Z=88) to D4 Walkway (Y=6.10, Z=96)
        this.createSlope('d3_ramp', 44, 92, 8, 88, 96, 4.75, 6.10, true);

        // District 4: Phase Observatory
        this.addPlatform(48, 5.5, 99, 8, 1.2, 6, stoneMat); // Walkway surface Y = 6.10, Z: 96..102, X: 44..52
        // Glowing slope from walkway up to Observatory terrace (Fixes elevation gap!)
        this.createSlope('d4_terrace_ramp', 48, 105, 8, 102, 108, 6.10, 7.75, true);
        this.addPlatform(55, 7.0, 118, 28, 1.5, 20, stoneMat); // Observatory surface Y = 7.75, Z: 108..128, X: 41..69
        this.addConsole("ch4_p1", 49, 7.75, 115, "◀ Lens Console (Mirror Wave Z)", 0xc084fc);
        this.addConsole("ch4_p2", 61, 7.75, 115, "Beacon Console (H-Z-H) ▶", 0x22d3ee);
        // Gate 4: physical barrier at D4 exit (Z=128, end of Observatory)
        this.d4Gate = this.createMechanicalGate('d4', 48, 7.0, 128, 10, 5.5, 1.8);
        this.addMachineSign('d4_gate', 48, 12.5, 128, "OBSERVATORY EXIT GATE", "LOCKED 🔒 (Solve H-Z-H Beacon)", 0x22d3ee);

        // Ramp D4 Observatory to D5 Approach
        this.createSlope('d4_to_d5_ramp', 41, 131, 8, 128, 134, 7.75, 9.10, true);

        // District 5: Echo Bridge — redesigned for clean ramp access
        // D4 ramp lands at Z=134, Y=9.10. Approach walkway runs Z:134..145, X:28..46, surface=9.10
        this.addPlatform(37, 8.5, 139.5, 18, 1.2, 11, stoneMat); // D5 Approach, surface Y=9.10
        // Gentle slope from approach (Y=9.10, Z=145) up to relay (Y=10.25, Z=155)
        this.createSlope('d5_relay_ramp', 24, 150, 10, 145, 155, 9.10, 10.25, true);
        // Relay platform surface Y=10.25, Z:155..167, X:9..33
        this.addPlatform(21, 9.5, 161, 24, 1.5, 12, stoneMat);
        this.addConsole("ch5_p1", 14, 10.25, 161, "◀ Left Pylon (Flip THEN Blend)", 0x22d3ee);
        this.addConsole("ch5_p2", 28, 10.25, 161, "Right Pylon (Blend THEN Flip) ▶", 0xf59e0b);
        // Gate 5: physical barrier at D5 exit (Z=167)
        this.d5Gate = this.createMechanicalGate('d5', 8, 9.5, 167, 10, 5.5, 1.8);
        this.addMachineSign('d5_gate', 8, 14.5, 167, "ECHO BRIDGE EXIT GATE", "LOCKED 🔒 (Solve Both Pylons)", 0x818cf8);
        // ─────────────────────────────────────────────────────────────
        // GRAND ECHO SKYWAY: Seamless Bridge from District 5 to District 6
        // Spans directly from D5 Gate (X=8, Z=167, Y=10.25) across to
        // District 6 Vault East Edge (X=-30, Z=167, Y=11.25).
        // ─────────────────────────────────────────────────────────────
        let bridgeRailMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
        let bridgeGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });

        // 1. D5 Gate Landing Plaza (solid footing immediately before and past Gate 5)
        this.addPlatform(10, 9.5, 167, 14, 1.5, 10, stoneMat); // surface Y = 10.25, X: 3..17, Z: 162..172

        // 2. Continuous 3-tier Skyway bridging the void (X: 3 down to -30, Z: 163..171)
        // Segment A: East (near D5 Gate)
        this.addPlatform(0, 9.75, 167, 14, 1.5, 8, stoneMat);   // surface Y = 10.50, X: -7..7, Z: 163..171
        // Segment B: Mid
        this.addPlatform(-14, 10.10, 167, 16, 1.5, 8, stoneMat); // surface Y = 10.85, X: -22..-6, Z: 163..171
        // Segment C: West (merges directly into D6 Vault East edge at X=-30)
        this.addPlatform(-26, 10.45, 167, 12, 1.5, 8, stoneMat); // surface Y = 11.20, X: -32..-20, Z: 163..171

        // Illuminated Skyway Guardrails with glowing neon borders
        for (let railZ of [162.8, 171.2]) {
            let railMesh = new THREE.Mesh(new THREE.BoxGeometry(40, 0.6, 0.2), bridgeRailMat);
            railMesh.position.set(-11, 11.2, railZ);
            this.cityGroup.add(railMesh);

            let neonEdge = new THREE.Mesh(new THREE.BoxGeometry(40, 0.08, 0.25), bridgeGlowMat);
            neonEdge.position.set(-11, 11.55, railZ);
            this.cityGroup.add(neonEdge);
        }

        // Bridge support pylons extending down into the mist
        for (let px of [-4, -14, -24]) {
            let pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 18, 12), bridgeRailMat);
            pylon.position.set(px, 1.0, 167);
            this.cityGroup.add(pylon);
        }

        // Holographic Bridge Sign
        this.addMachineSign('d5_d6_link', -11, 14.5, 167, "ECHO SKYWAY BRIDGE", "CH.5 ⇄ CH.6 LINK 🌉", 0x38bdf8);

        // District 6: The Reversal Vault
        this.addPlatform(-45, 10.5, 158, 30, 1.5, 26, stoneMat); // Vault: surface Y = 11.25, Z: 145..171
        this.d6Door = this.createMechanicalGate('d6', -35, 10.5, 173, 10, 6.8, 1.8);
        this.addMachineSign('d6_door', -35, 15.5, 173, "ISHAN'S VAULT DOOR", "LOCKED 🔒 (Scrambled Lock)", 0xf59e0b);
        this.addConsole("ch6_p1", -45, 11.25, 160, "◀ Archive Lock (Undo X-Z-H)", 0xf59e0b);

        // Ramp D6 Vault to D7 Walkway
        this.createSlope('d6_ramp', -30, 176, 8, 172, 180, 11.25, 12.10, true);

        // District 7: Measurement Station
        this.addPlatform(-25, 11.5, 186, 8, 1.2, 12, stoneMat); // Walkway: surface Y = 12.10, Z: 180..192
        this.createSlope('d7_station_ramp', -20, 195, 8, 192, 198, 12.10, 13.25, true);
        this.addPlatform(-10, 12.5, 206, 26, 1.5, 16, stoneMat); // Platform: surface Y = 13.25, Z: 198..214
        this.d7Barrier = this.createMechanicalGate('d7', 0, 12.5, 215, 14, 7.2, 1.8);
        this.addMachineSign('d7_scanner', 0, 18.0, 215, "AUDITOR SCANNER BARRIER", "MEASUREMENT REQUIRED 🔒", 0xef4444);
        this.addMeasurementStation(-10, 13.25, 206);

        // Ramp D7 to D8 Pinnacle
        this.createSlope('d7_to_d8_ramp', 0, 222, 10, 214, 230, 13.25, 15.90, true);

        // District 8: The Echo Core Pinnacle
        this.addPlatform(0, 15.0, 242, 36, 1.8, 24, stoneMat); // Pinnacle: surface Y = 15.90, Z: 230..254
        this.addConsole("ch8_final", 0, 16.0, 242, "⚡ Echo Core Pinnacle (H-Z-H)", 0x22d3ee);

        // Player (Mira) & Lantern & Drone (Lumi)
        this.createMira();
    }

    // Layman level: Add a solid floor or step block and register its boundaries
    addPlatform(x, y, z, w, h, d, mat) {
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.position.set(x, y, z);
        this.cityGroup.add(mesh);

        let plat = {
            x: x, y: y, z: z,
            w: w, h: h, d: d,
            minX: x - w / 2,
            maxX: x + w / 2,
            minZ: z - d / 2,
            maxZ: z + d / 2,
            topY: y + h / 2,
            mesh: mesh
        };
        mesh.userData.platform = plat;
        if (!this.platforms) this.platforms = [];
        this.platforms.push(plat);
        return mesh;
    }

    // Floating 3D Machine Holographic Signs for Direct World Alignment
    addMachineSign(id, x, y, z, title, statusText, colorHex) {
        this.machineSigns = this.machineSigns || {};

        let canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 140;
        let ctx = canvas.getContext('2d');

        let texture = new THREE.CanvasTexture(canvas);
        let spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        let sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(4.8, 1.35, 1);
        sprite.position.set(x, y, z);
        this.cityGroup.add(sprite);

        let signObj = {
            id: id,
            canvas: canvas,
            ctx: ctx,
            texture: texture,
            sprite: sprite,
            title: title,
            status: statusText,
            colorHex: colorHex
        };
        this.machineSigns[id] = signObj;
        this.renderMachineSign(signObj);
    }

    renderMachineSign(signObj) {
        let ctx = signObj.ctx;
        let w = signObj.canvas.width;
        let h = signObj.canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Background card
        ctx.fillStyle = 'rgba(10, 18, 36, 0.94)';
        if (ctx.roundRect) {
            ctx.roundRect(8, 8, w - 16, h - 16, 16);
            ctx.fill();
        } else {
            ctx.fillRect(8, 8, w - 16, h - 16);
        }

        let hex = '#' + signObj.colorHex.toString(16).padStart(6, '0');
        ctx.strokeStyle = hex;
        ctx.lineWidth = 5;
        ctx.stroke();

        // Machine Title
        ctx.font = 'bold 22px "Segoe UI", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(signObj.title, w / 2, 20);

        // Status Readout
        ctx.font = 'bold 28px "Segoe UI", sans-serif';
        ctx.fillStyle = hex;
        ctx.fillText(signObj.status, w / 2, 68);

        signObj.texture.needsUpdate = true;
    }

    updateMachineSign(id, statusText, colorHex) {
        if (this.machineSigns && this.machineSigns[id]) {
            let s = this.machineSigns[id];
            s.status = statusText;
            if (colorHex !== undefined) s.colorHex = colorHex;
            this.renderMachineSign(s);
        }
    }

    // Realistic pneumatic steam / slow billowing smoke puff particle spawner for opening gates & machines
    spawnGateSmoke(x, y, z, count = 12, vxSpread = 1.0, vyBoost = 1.0) {
        if (!this.smokeParticles) this.smokeParticles = [];
        if (!this._smokeGeo) {
            this._smokeGeo = new THREE.SphereGeometry(0.38, 8, 8);
        }
        for (let i = 0; i < count; i++) {
            let mat = new THREE.MeshBasicMaterial({
                color: 0xe2e8f0,
                transparent: true,
                opacity: 0.0, // starts at 0, slowly fades in!
                depthWrite: false
            });
            let mesh = new THREE.Mesh(this._smokeGeo, mat);
            mesh.position.set(
                x + (Math.random() - 0.5) * 1.2,
                y + (Math.random() - 0.5) * 0.4,
                z + (Math.random() - 0.5) * 0.9
            );
            let baseScale = 0.45 + Math.random() * 0.65;
            mesh.scale.setScalar(baseScale * 0.3);
            this.scene.add(mesh);

            this.smokeParticles.push({
                mesh: mesh,
                vx: (Math.random() - 0.5) * 0.45 * vxSpread,
                vy: (0.32 + Math.random() * 0.38) * vyBoost, // rises SLOWLY!
                vz: (Math.random() - 0.5) * 0.45,
                baseScale: baseScale,
                targetOpacity: 0.42 + Math.random() * 0.25,
                age: 0,
                maxAge: 4.2 + Math.random() * 1.8 // lives 4.2 to 6.0 seconds!
            });
        }
    }

    // Spawns continuous slow billowing waves of steam/smoke over several seconds
    spawnSlowBillowingSmoke(x, y, z, duration = 3800) {
        let interval = 420;
        let steps = Math.floor(duration / interval);
        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                let jitterX = (Math.random() - 0.5) * 1.5;
                let jitterZ = (Math.random() - 0.5) * 1.5;
                this.spawnGateSmoke(x + jitterX, y, z + jitterZ, 6, 0.7, 0.65);
            }, i * interval);
        }
    }

    // Real 3D Mechanical Gate with Stone Pillars, Sliding Double Steel Doors, Rotating Gears & Steam/Smoke Vents
    createMechanicalGate(id, x, y, z, width = 11, height = 7.0, depth = 1.8) {
        if (!this.mechanicalGates) this.mechanicalGates = [];

        let gateSteelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.35 });
        let gateBarsMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.2 });
        let gateHazardMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
        let gatePillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });

        let gateGroup = new THREE.Group();
        gateGroup.position.set(x, y, z);
        this.cityGroup.add(gateGroup);

        let halfW = width / 2;
        let halfH = height / 2;

        // Left & Right Stone Archway Pillars
        let pillarL = new THREE.Mesh(new THREE.BoxGeometry(1.6, height, depth), gatePillarMat);
        pillarL.position.set(-halfW, halfH, 0);
        gateGroup.add(pillarL);

        let pillarR = new THREE.Mesh(new THREE.BoxGeometry(1.6, height, depth), gatePillarMat);
        pillarR.position.set(halfW, halfH, 0);
        gateGroup.add(pillarR);

        // Top Arch Overhead Track & Pulley Beam
        let archBeam = new THREE.Mesh(new THREE.BoxGeometry(width + 2.0, 1.2, depth + 0.2), gateSteelMat);
        archBeam.position.set(0, height, 0);
        gateGroup.add(archBeam);

        // Industrial hazard stripe trim along top beam
        let stripeTrim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 0.25, depth + 0.25), gateHazardMat);
        stripeTrim.position.set(0, height - 0.45, 0);
        gateGroup.add(stripeTrim);

        // Rotating mechanical gears atop the track beam
        let gears = [];
        let gearMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.25 });
        let gearCount = Math.max(3, Math.floor(width / 3));
        for (let g = 0; g < gearCount; g++) {
            let gear = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.16, 12), gearMat);
            gear.rotation.x = Math.PI / 2;
            let gx = -halfW + 1.6 + g * ((width - 3.2) / (gearCount - 1 || 1));
            gear.position.set(gx, height, depth * 0.55);
            gateGroup.add(gear);
            gears.push(gear);
        }

        // --- Left Mechanical Sliding Gate Door ---
        let doorLeft = new THREE.Group();
        let doorW = halfW - 0.15;
        doorLeft.position.set(-doorW / 2, halfH, 0);
        gateGroup.add(doorLeft);

        let doorLFrame = new THREE.Mesh(new THREE.BoxGeometry(doorW, height - 1.4, 0.35), gateSteelMat);
        doorLeft.add(doorLFrame);

        let barCount = Math.max(3, Math.floor(doorW / 0.8));
        for (let b = 0; b < barCount; b++) {
            let barMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, height - 1.8, 8), gateBarsMat);
            barMesh.position.set(-doorW / 2 + 0.5 + b * ((doorW - 1.0) / (barCount - 1 || 1)), 0, 0.05);
            doorLeft.add(barMesh);
        }
        let braceL = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.3, 0.15, 0.4), gateBarsMat);
        braceL.rotation.z = 0.35;
        doorLeft.add(braceL);

        // --- Right Mechanical Sliding Gate Door ---
        let doorRight = new THREE.Group();
        doorRight.position.set(doorW / 2, halfH, 0);
        gateGroup.add(doorRight);

        let doorRFrame = new THREE.Mesh(new THREE.BoxGeometry(doorW, height - 1.4, 0.35), gateSteelMat);
        doorRight.add(doorRFrame);

        for (let b = 0; b < barCount; b++) {
            let barMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, height - 1.8, 8), gateBarsMat);
            barMesh.position.set(-doorW / 2 + 0.5 + b * ((doorW - 1.0) / (barCount - 1 || 1)), 0, 0.05);
            doorRight.add(barMesh);
        }
        let braceR = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.3, 0.15, 0.4), gateBarsMat);
        braceR.rotation.z = -0.35;
        doorRight.add(braceR);

        // Center Magnetic Lock Indicator Light (Starts RED)
        let lockMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 1.5 });
        let lockLight = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), lockMat);
        lockLight.position.set(0, halfH, depth * 0.6);
        gateGroup.add(lockLight);

        // Physical Collision Barrier
        let barrier = {
            id: id,
            minX: x - halfW,
            maxX: x + halfW,
            minZ: z - 1.0,
            maxZ: z + 1.0,
            active: true
        };
        if (!this.barriers) this.barriers = [];
        this.barriers.push(barrier);

        let gateObj = {
            id: id,
            group: gateGroup,
            x: x, y: y, z: z,
            width: width,
            height: height,
            doorLeft: doorLeft,
            doorRight: doorRight,
            doorBaseX: doorW / 2,
            doorTravel: doorW * 0.95,
            lockLight: lockLight,
            gears: gears,
            barrier: barrier,
            isOpen: false,
            openProgress: 0.0,
            prevOpen: false
        };
        this.mechanicalGates.push(gateObj);
        return gateObj;
    }

    openMechanicalGate(id) {
        if (!this.mechanicalGates) return;
        let g = this.mechanicalGates.find(gate => gate.id === id);
        if (g) {
            g.isOpen = true;
        }
    }

    // -----------------------------------------------------------------------
    // DYNAMIC SLOPE SYSTEM
    // When a gate opens and there is an elevation difference between the two
    // platforms on either side, spawn a visible stone ramp so the player can
    // walk across without needing to jump.
    // -----------------------------------------------------------------------
    createSlope(id, x, z, w, fromZ, toZ, fromY, toY, silentMode) {
        // Builds a visible ramp + collision steps bridging two surfaces at different heights.
        if (!this.slopesCreated) this.slopesCreated = new Set();
        if (id && this.slopesCreated.has(id)) return;
        if (id) this.slopesCreated.add(id);

        let slopeMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.52, metalness: 0.30 });
        let lenZ   = toZ - fromZ;            // horizontal span along Z
        let dY     = toY - fromY;            // total rise
        let midZ   = (fromZ + toZ) / 2;
        let midY   = (fromY + toY) / 2 + 0.08; // slight lift so ramp sits ON top, not inside
        let angle  = Math.atan2(dY, lenZ);   // tilt angle for the ramp surface
        let rampLen = Math.hypot(lenZ, dY);

        // ---- Visual ramp body ----
        let slopeMesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.30, rampLen), slopeMat);
        slopeMesh.position.set(x, midY, midZ);
        slopeMesh.rotation.x = -angle;
        this.cityGroup.add(slopeMesh);

        // ---- Glowing cyan top-edge so it is impossible to miss ----
        let edgeMat  = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75, depthWrite: false });
        let edgeMesh = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.06, rampLen + 0.1), edgeMat);
        edgeMesh.position.set(x, midY + 0.16, midZ);
        edgeMesh.rotation.x = -angle;
        this.cityGroup.add(edgeMesh);

        // ---- Left & right guard rails ----
        let railMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
        for (let side of [-1, 1]) {
            let rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, rampLen), railMat);
            rail.position.set(x + side * (w / 2 + 0.07), midY + 0.32, midZ);
            rail.rotation.x = -angle;
            this.cityGroup.add(rail);
        }

        // ---- Collision: register micro-steps along the slope ----
        // Gentle micro-steps (<= 0.14m rise) so Mira automatically climbs without snagging
        let numSteps = Math.max(8, Math.ceil(Math.abs(dY) / 0.14));
        for (let i = 0; i <= numSteps; i++) {
            let t  = i / numSteps;
            let sz = fromZ + t * lenZ;
            let sy = fromY + t * dY;
            let segD = Math.abs(lenZ) / numSteps + 0.35;
            let stepPlat = {
                x: x,  y: sy - 0.15,  z: sz,
                w: w,  h: 0.30,       d: segD,
                minX: x - w / 2,  maxX: x + w / 2,
                minZ: sz - segD / 2, maxZ: sz + segD / 2,
                topY: sy,
                mesh: null
            };
            if (!this.platforms) this.platforms = [];
            this.platforms.push(stepPlat);
        }

        // ---- Smoke puff + dialogue (skip if silentMode = quiet world init) ----
        if (!silentMode) {
            setTimeout(() => this.spawnGateSmoke(x, midY + 0.5, midZ, 12, 1.2, 0.9), 200);
            this.showToast('📐 Ramp deployed! A glowing slope now bridges the elevation gap — walk straight onto it!');
            setTimeout(() => {
                this.showDialogue('Lumi', '📐 RAMP ONLINE! The two buildings are at different heights — I just deployed an emergency ramp between them. Walk onto the glowing cyan slope and Mira will climb across automatically!');
            }, 800);
        }
    }

    // Layman level: Add mechanical security gate (replaces all legacy pink walls)
    addBarrier(x, y, z, w, h, d, mat) {
        return this.createMechanicalGate('gate_' + Math.floor(z), x, y - h / 2, z, w, h, d);
    }

    addConsole(puzzleId, x, y, z, label, beaconColor = 0x22d3ee) {
        let base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 1.1, 10),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }));
        base.position.set(x, y, z);
        this.cityGroup.add(base);

        let screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.65),
            new THREE.MeshStandardMaterial({ color: beaconColor, emissive: beaconColor, emissiveIntensity: 1.2 }));
        screen.position.set(x, y + 0.65, z + 0.1);
        screen.rotation.x = 0.5;
        this.cityGroup.add(screen);

        // Glowing floor target ring showing exact interaction boundary
        let ringGeo = new THREE.RingGeometry(0.7, 0.95, 24);
        let ringMat = new THREE.MeshBasicMaterial({ color: beaconColor, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
        let ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, y + 0.03, z);
        this.cityGroup.add(ring);

        // Floating 3D Text Badge for crystal clear on-screen identification
        let canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(10, 15, 29, 0.88)';
        if (ctx.roundRect) {
            ctx.roundRect(10, 10, 492, 108, 16);
            ctx.fill();
        } else {
            ctx.fillRect(10, 10, 492, 108);
        }
        let hex = '#' + beaconColor.toString(16).padStart(6, '0');
        ctx.strokeStyle = hex;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.font = 'bold 32px "Segoe UI", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 256, 64);

        let texture = new THREE.CanvasTexture(canvas);
        let spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        let sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(3.6, 0.9, 1);
        sprite.position.set(x, y + 2.5, z);
        this.cityGroup.add(sprite);

        // Glowing beacon light pillar so consoles are instantly visible from afar
        let beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8.0, 8),
            new THREE.MeshBasicMaterial({ color: beaconColor, transparent: true, opacity: 0.45 }));
        beacon.position.set(x, y + 4.5, z);
        this.cityGroup.add(beacon);

        // Console Point Light
        let light = new THREE.PointLight(beaconColor, 1.8, 6.0);
        light.position.set(x, y + 1.2, z);
        this.cityGroup.add(light);

        base.userData = { type: 'console', puzzleId: puzzleId, label: label };
        this.interactables = this.interactables || [];
        this.interactables.push(base);
    }

    addMeasurementStation(x, y, z) {
        let station = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 1.3, 10),
            new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 0.9 }));
        station.position.set(x, y, z);
        this.cityGroup.add(station);

        let beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 8.0, 8),
            new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.5 }));
        beacon.position.set(x, y + 4.5, z);
        this.cityGroup.add(beacon);

        station.userData = { type: 'measurement_station', label: "Auditor Measurement Station & Lab" };
        this.interactables = this.interactables || [];
        this.interactables.push(station);
    }

    createMira() {
        this.mira = new THREE.Group();
        this.scene.add(this.mira);

        // ── 1. PROCEDURAL TEXTURES (SHERIFF WOODY SIGNATURE LOOK) ────────────
        // Yellow Plaid Windowpane Shirt Texture
        const shirtCanvas = document.createElement('canvas');
        shirtCanvas.width = 128;
        shirtCanvas.height = 128;
        const sCtx = shirtCanvas.getContext('2d');
        sCtx.fillStyle = '#facc15'; // Bright canary yellow
        sCtx.fillRect(0, 0, 128, 128);
        sCtx.strokeStyle = '#dc2626'; // Bold red check lines
        sCtx.lineWidth = 3.5;
        for (let i = 0; i <= 128; i += 32) {
            sCtx.beginPath();
            sCtx.moveTo(i, 0);
            sCtx.lineTo(i, 128);
            sCtx.stroke();
            sCtx.beginPath();
            sCtx.moveTo(0, i);
            sCtx.lineTo(128, i);
            sCtx.stroke();
        }
        const shirtTex = new THREE.CanvasTexture(shirtCanvas);
        shirtTex.wrapS = THREE.RepeatWrapping;
        shirtTex.wrapT = THREE.RepeatWrapping;
        shirtTex.repeat.set(2, 2);

        // Black & White Cowhide Vest Texture
        const vestCanvas = document.createElement('canvas');
        vestCanvas.width = 128;
        vestCanvas.height = 128;
        const vCtx = vestCanvas.getContext('2d');
        vCtx.fillStyle = '#ffffff'; // Crisp white cowhide
        vCtx.fillRect(0, 0, 128, 128);
        vCtx.fillStyle = '#111827'; // Dark cow spots
        const drawCowSpot = (cx, cy, rx, ry, rot) => {
            vCtx.save();
            vCtx.translate(cx, cy);
            vCtx.rotate(rot);
            vCtx.beginPath();
            vCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            vCtx.fill();
            vCtx.beginPath();
            vCtx.arc(rx * 0.45, ry * 0.35, rx * 0.55, 0, Math.PI * 2);
            vCtx.fill();
            vCtx.restore();
        };
        drawCowSpot(28, 28, 18, 12, 0.4);
        drawCowSpot(96, 36, 20, 14, -0.35);
        drawCowSpot(64, 88, 24, 16, 0.75);
        drawCowSpot(18, 105, 14, 10, 0.2);
        drawCowSpot(110, 102, 16, 12, -0.5);
        const vestTex = new THREE.CanvasTexture(vestCanvas);
        vestTex.wrapS = THREE.RepeatWrapping;
        vestTex.wrapT = THREE.RepeatWrapping;

        // ── 2. MATERIALS ───────────────────────────────────────────────────
        const skinMat     = new THREE.MeshStandardMaterial({ color: 0xfbd3a7, roughness: 0.5 }); // Toy peach skin
        const skinShadow  = new THREE.MeshStandardMaterial({ color: 0xdeb384, roughness: 0.6 });
        const hairMat     = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.85 }); // Chocolate brown toy hair
        const hatMat      = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.65 }); // Woody saddle brown hat
        const hatBandMat  = new THREE.MeshStandardMaterial({ color: 0x271206, roughness: 0.8 }); // Dark hat band
        const shirtMat    = new THREE.MeshStandardMaterial({ map: shirtTex, roughness: 0.65 });
        const vestMat     = new THREE.MeshStandardMaterial({ map: vestTex, roughness: 0.55 });
        const jeansMat    = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.75 }); // Denim blue
        const bandanaMat  = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 }); // Crimson red
        const beltMat     = new THREE.MeshStandardMaterial({ color: 0x542307, roughness: 0.7 }); // Leather belt
        const buckleMat   = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.25 }); // Gold buckle
        const holsterMat  = new THREE.MeshStandardMaterial({ color: 0x6b3010, roughness: 0.7 }); // Gun holster
        const bootMat     = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }); // Cowboy boots
        const bootSoleMat = new THREE.MeshStandardMaterial({ color: 0x2a1408, roughness: 0.9 });
        const spurMat     = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 }); // Gold spurs
        const badgeMat    = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.92, roughness: 0.2 }); // Sheriff Star
        const buttonMat   = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }); // White shirt buttons
        const eyeWhite    = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const eyeIris     = new THREE.MeshStandardMaterial({ color: 0x5c3317, roughness: 0.2 }); // Brown irises
        const eyePupil    = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });
        const teethMat    = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }); // Grin teeth
        const lipMat      = new THREE.MeshStandardMaterial({ color: 0xc27456, roughness: 0.6 });
        const shadowMat   = new THREE.MeshBasicMaterial({ color: 0x050a14, transparent: true, opacity: 0.55 });

        // ── 3. GROUND SHADOW DISC ──────────────────────────────────────────
        this.miraShadow = new THREE.Mesh(new THREE.CircleGeometry(0.48, 24), shadowMat);
        this.miraShadow.rotation.x = -Math.PI / 2;
        this.miraShadow.position.y = 0.01;
        this.mira.add(this.miraShadow);

        // ── 4. LEGS & COWBOY BOOTS WITH GOLDEN SPURS (ANIMATED SWING) ─────
        // Left Leg Group (hinged at hip y = 0.62)
        this.leftLeg = new THREE.Group();
        this.leftLeg.position.set(-0.11, 0.62, 0);
        this.mira.add(this.leftLeg);

        // Blue denim thigh
        const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.058, 0.30, 12), jeansMat);
        lThigh.position.set(0, -0.11, 0);
        this.leftLeg.add(lThigh);

        // Blue denim shin
        const lShin = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.28, 12), jeansMat);
        lShin.position.set(0, -0.34, 0);
        this.leftLeg.add(lShin);

        // Left Cowboy Boot (tall reddish-brown leather with angled heel & pointed toe)
        const lBootTop = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.16, 12), bootMat);
        lBootTop.position.set(0, -0.44, 0);
        this.leftLeg.add(lBootTop);

        const lBootRim = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.008, 6, 14), bootMat);
        lBootRim.rotation.x = Math.PI / 2;
        lBootRim.position.set(0, -0.36, 0);
        this.leftLeg.add(lBootRim);

        const lBootFoot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.20), bootMat);
        lBootFoot.position.set(0, -0.55, 0.03);
        this.leftLeg.add(lBootFoot);

        const lToe = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.08, 10), bootMat);
        lToe.rotation.x = Math.PI / 2;
        lToe.position.set(0, -0.55, 0.15);
        this.leftLeg.add(lToe);

        const lHeel = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.07), bootSoleMat);
        lHeel.position.set(0, -0.58, -0.05);
        this.leftLeg.add(lHeel);

        // Left Boot Ankle Strap
        const lAnkleStrap = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.009, 6, 14), beltMat);
        lAnkleStrap.rotation.x = Math.PI / 2;
        lAnkleStrap.position.set(0, -0.52, 0);
        this.leftLeg.add(lAnkleStrap);

        // Left Golden Spur & Wheel
        const lSpurBar = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.07, 6), spurMat);
        lSpurBar.rotation.x = Math.PI / 2;
        lSpurBar.position.set(0, -0.56, -0.09);
        this.leftLeg.add(lSpurBar);

        const lSpurWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.006, 8), spurMat);
        lSpurWheel.rotation.z = Math.PI / 2;
        lSpurWheel.position.set(0, -0.56, -0.13);
        this.leftLeg.add(lSpurWheel);

        // Right Leg Group (hinged at hip y = 0.62)
        this.rightLeg = new THREE.Group();
        this.rightLeg.position.set(0.11, 0.62, 0);
        this.mira.add(this.rightLeg);

        const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.058, 0.30, 12), jeansMat);
        rThigh.position.set(0, -0.11, 0);
        this.rightLeg.add(rThigh);

        const rShin = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.28, 12), jeansMat);
        rShin.position.set(0, -0.34, 0);
        this.rightLeg.add(rShin);

        const rBootTop = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.16, 12), bootMat);
        rBootTop.position.set(0, -0.44, 0);
        this.rightLeg.add(rBootTop);

        const rBootRim = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.008, 6, 14), bootMat);
        rBootRim.rotation.x = Math.PI / 2;
        rBootRim.position.set(0, -0.36, 0);
        this.rightLeg.add(rBootRim);

        const rBootFoot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.20), bootMat);
        rBootFoot.position.set(0, -0.55, 0.03);
        this.rightLeg.add(rBootFoot);

        const rToe = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.08, 10), bootMat);
        rToe.rotation.x = Math.PI / 2;
        rToe.position.set(0, -0.55, 0.15);
        this.rightLeg.add(rToe);

        const rHeel = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.07), bootSoleMat);
        rHeel.position.set(0, -0.58, -0.05);
        this.rightLeg.add(rHeel);

        const rAnkleStrap = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.009, 6, 14), beltMat);
        rAnkleStrap.rotation.x = Math.PI / 2;
        rAnkleStrap.position.set(0, -0.52, 0);
        this.rightLeg.add(rAnkleStrap);

        const rSpurBar = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.07, 6), spurMat);
        rSpurBar.rotation.x = Math.PI / 2;
        rSpurBar.position.set(0, -0.56, -0.09);
        this.rightLeg.add(rSpurBar);

        const rSpurWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.006, 8), spurMat);
        rSpurWheel.rotation.z = Math.PI / 2;
        rSpurWheel.position.set(0, -0.56, -0.13);
        this.rightLeg.add(rSpurWheel);

        // ── 5. BELT, OVAL STEER BUCKLE & GUN HOLSTER ───────────────────────
        const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.18, 0.06, 16), beltMat);
        belt.position.set(0, 0.65, 0);
        this.mira.add(belt);

        // Large Golden Oval Steer Buckle
        const buckle = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.022, 16), buckleMat);
        buckle.rotation.x = Math.PI / 2;
        buckle.scale.set(1.45, 0.95, 1);
        buckle.position.set(0, 0.65, 0.185);
        this.mira.add(buckle);

        // Steer horn / center motif
        const steerMotif = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.005, 5, 8, Math.PI), beltMat);
        steerMotif.rotation.z = Math.PI;
        steerMotif.position.set(0, 0.655, 0.20);
        this.mira.add(steerMotif);

        // Leather Gun Holster (on right hip)
        const holster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.07), holsterMat);
        holster.rotation.z = -0.15;
        holster.position.set(0.20, 0.58, 0.02);
        this.mira.add(holster);

        // ── 6. TORSO: YELLOW PLAID SHIRT & COWHIDE VEST ───────────────────
        // Slender tapered torso (yellow plaid shirt)
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.18, 0.44, 14), shirtMat);
        torso.position.set(0, 0.88, 0);
        this.mira.add(torso);

        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.175, 0.22, 14), shirtMat);
        chest.position.set(0, 1.05, 0);
        this.mira.add(chest);

        // White Pearl Buttons down shirt front
        for (let i = 0; i < 3; i++) {
            const btn = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 8), buttonMat);
            btn.scale.set(1, 1, 0.4);
            btn.position.set(0, 0.80 + i * 0.12, 0.188);
            this.mira.add(btn);
        }

        // Cowhide Vest Panels (worn open over the yellow shirt)
        // Left Vest Panel
        const lVest = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.188, 0.38, 14, 1, false, Math.PI * 0.45, Math.PI * 0.85), vestMat);
        lVest.position.set(0, 0.98, 0);
        this.mira.add(lVest);

        // Right Vest Panel
        const rVest = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.188, 0.38, 14, 1, false, -Math.PI * 0.30, Math.PI * 0.85), vestMat);
        rVest.position.set(0, 0.98, 0);
        this.mira.add(rVest);

        // Vest Back
        const backVest = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.188, 0.38, 14, 1, false, -Math.PI * 0.95, Math.PI * 0.9), vestMat);
        backVest.position.set(0, 0.98, 0);
        this.mira.add(backVest);

        // ── 7. SHERIFF GOLDEN STAR BADGE (ON LEFT CHEST) ──────────────────
        const badgeGrp = new THREE.Group();
        badgeGrp.position.set(-0.095, 1.06, 0.195);
        badgeGrp.rotation.y = 0.25;
        this.mira.add(badgeGrp);

        // Star center disc
        const starCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.008, 10), badgeMat);
        starCenter.rotation.x = Math.PI / 2;
        badgeGrp.add(starCenter);

        // 5 Star Points with gold tip balls
        for (let p = 0; p < 5; p++) {
            const angle = (p * Math.PI * 2) / 5 - Math.PI / 2;
            const pt = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.028, 4), badgeMat);
            pt.position.set(Math.cos(angle) * 0.024, Math.sin(angle) * 0.024, 0);
            pt.rotation.z = angle - Math.PI / 2;
            pt.rotation.x = Math.PI / 2;
            badgeGrp.add(pt);

            const tipBall = new THREE.Mesh(new THREE.SphereGeometry(0.005, 5, 5), badgeMat);
            tipBall.position.set(Math.cos(angle) * 0.038, Math.sin(angle) * 0.038, 0);
            badgeGrp.add(tipBall);
        }

        // ── 8. RED BANDANA / NECKERCHIEF & NECK ────────────────────────────
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.062, 0.12, 12), skinMat);
        neck.position.set(0, 1.25, 0);
        this.mira.add(neck);

        // Bandana Ring around collar
        const bandanaRing = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.026, 8, 16), bandanaMat);
        bandanaRing.rotation.x = Math.PI / 2;
        bandanaRing.position.set(0, 1.22, 0);
        this.mira.add(bandanaRing);

        // Triangular folded point hanging down in front
        const bandanaPoint = new THREE.Mesh(new THREE.ConeGeometry(0.060, 0.095, 3), bandanaMat);
        bandanaPoint.rotation.z = Math.PI;
        bandanaPoint.scale.set(1, 1, 0.35);
        bandanaPoint.position.set(0, 1.15, 0.178);
        this.mira.add(bandanaPoint);

        // ── 9. ARMS & PLAID SLEEVES ───────────────────────────────────────
        // Left Arm (swing animated)
        this.leftArm = new THREE.Group();
        this.leftArm.position.set(-0.25, 1.16, 0);
        this.mira.add(this.leftArm);

        const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.046, 0.25, 10), shirtMat);
        lUpperArm.position.set(-0.04, -0.12, 0);
        lUpperArm.rotation.z = 0.14;
        this.leftArm.add(lUpperArm);

        const lForeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.040, 0.23, 10), shirtMat);
        lForeArm.position.set(-0.07, -0.32, 0);
        lForeArm.rotation.z = 0.08;
        this.leftArm.add(lForeArm);

        const lCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.04, 10), shirtMat);
        lCuff.position.set(-0.09, -0.42, 0);
        this.leftArm.add(lCuff);

        const lCuffBtn = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), buttonMat);
        lCuffBtn.position.set(-0.13, -0.42, 0.02);
        this.leftArm.add(lCuffBtn);

        const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), skinMat);
        lHand.scale.set(0.9, 1.1, 0.75);
        lHand.position.set(-0.10, -0.49, 0);
        this.leftArm.add(lHand);

        // Right Arm (swing animated, holds quantum lantern)
        this.rightArm = new THREE.Group();
        this.rightArm.position.set(0.25, 1.16, 0);
        this.mira.add(this.rightArm);

        const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.046, 0.25, 10), shirtMat);
        rUpperArm.position.set(0.04, -0.12, 0);
        rUpperArm.rotation.z = -0.14;
        this.rightArm.add(rUpperArm);

        const rForeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.040, 0.23, 10), shirtMat);
        rForeArm.position.set(0.07, -0.32, 0);
        rForeArm.rotation.z = -0.08;
        this.rightArm.add(rForeArm);

        const rCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.04, 10), shirtMat);
        rCuff.position.set(0.09, -0.42, 0);
        this.rightArm.add(rCuff);

        const rCuffBtn = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), buttonMat);
        rCuffBtn.position.set(0.13, -0.42, 0.02);
        this.rightArm.add(rCuffBtn);

        const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), skinMat);
        rHand.scale.set(0.9, 1.1, 0.75);
        rHand.position.set(0.10, -0.49, 0);
        this.rightArm.add(rHand);

        // ── 10. HEAD, WOODY'S FACE & COWBOY HAT (ANIMATED BOBBING) ────────
        this.miraHead = new THREE.Group();
        this.miraHead.position.set(0, 1.44, 0);
        this.mira.add(this.miraHead);

        // Slender tall cranium (classic Woody silhouette)
        const cranium = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.095, 0.20, 16), skinMat);
        cranium.position.set(0, 0.02, 0);
        this.miraHead.add(cranium);

        const headTop = new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 12), skinMat);
        headTop.position.set(0, 0.11, 0);
        this.miraHead.add(headTop);

        // Tapered jaw & chin with signature Woody cleft
        const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.068, 0.12, 12), skinMat);
        jaw.position.set(0, -0.07, 0.015);
        this.miraHead.add(jaw);

        const chin = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 8), skinMat);
        chin.position.set(0, -0.12, 0.062);
        this.miraHead.add(chin);

        // Chin cleft indent
        const cleft = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.024, 0.01), skinShadow);
        cleft.position.set(0, -0.12, 0.115);
        this.miraHead.add(cleft);

        // Woody's Molded Brown Hair (under hat brim)
        const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.126, 14, 10), hairMat);
        hairBack.scale.set(1.02, 0.95, 0.92);
        hairBack.position.set(0, 0.04, -0.035);
        this.miraHead.add(hairBack);

        // Sideburns
        const lSideburn = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.08, 0.04), hairMat);
        lSideburn.position.set(-0.116, 0.01, 0.02);
        this.miraHead.add(lSideburn);

        const rSideburn = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.08, 0.04), hairMat);
        rSideburn.position.set(0.116, 0.01, 0.02);
        this.miraHead.add(rSideburn);

        // Signature Forehead Hair Swirl
        const hairSwirl = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.009, 6, 10, Math.PI * 1.2), hairMat);
        hairSwirl.rotation.y = 0.2;
        hairSwirl.position.set(0.02, 0.10, 0.112);
        this.miraHead.add(hairSwirl);

        // Ears
        const lEar = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), skinMat);
        lEar.scale.set(0.4, 0.9, 0.6);
        lEar.position.set(-0.124, 0.01, -0.01);
        this.miraHead.add(lEar);

        const rEar = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), skinMat);
        rEar.scale.set(0.4, 0.9, 0.6);
        rEar.position.set(0.124, 0.01, -0.01);
        this.miraHead.add(rEar);

        // ── EYES (Large, friendly cartoon eyes) ───────────────────────────
        // Left Eye
        const lEyeGrp = new THREE.Group();
        lEyeGrp.position.set(-0.048, 0.036, 0.108);
        this.miraHead.add(lEyeGrp);

        const lEyeball = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 10), eyeWhite);
        lEyeGrp.add(lEyeball);

        const lIris = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), eyeIris);
        lIris.position.set(0, 0, 0.014);
        lEyeGrp.add(lIris);

        const lPupil = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), eyePupil);
        lPupil.position.set(0, 0, 0.022);
        lEyeGrp.add(lPupil);

        const lShine = new THREE.Mesh(new THREE.SphereGeometry(0.005, 5, 4), buttonMat);
        lShine.position.set(0.005, 0.005, 0.025);
        lEyeGrp.add(lShine);

        // Right Eye
        const rEyeGrp = new THREE.Group();
        rEyeGrp.position.set(0.048, 0.036, 0.108);
        this.miraHead.add(rEyeGrp);

        const rEyeball = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 10), eyeWhite);
        rEyeGrp.add(rEyeball);

        const rIris = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), eyeIris);
        rIris.position.set(0, 0, 0.014);
        rEyeGrp.add(rIris);

        const rPupil = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), eyePupil);
        rPupil.position.set(0, 0, 0.022);
        rEyeGrp.add(rPupil);

        const rShine = new THREE.Mesh(new THREE.SphereGeometry(0.005, 5, 4), buttonMat);
        rShine.position.set(0.005, 0.005, 0.025);
        rEyeGrp.add(rShine);

        // Eyebrows (arched brown cartoon brows)
        const lBrow = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.008, 0.012), hairMat);
        lBrow.position.set(-0.048, 0.070, 0.112);
        lBrow.rotation.z = 0.15;
        this.miraHead.add(lBrow);

        const rBrow = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.008, 0.012), hairMat);
        rBrow.position.set(0.048, 0.070, 0.112);
        rBrow.rotation.z = -0.15;
        this.miraHead.add(rBrow);

        // ── NOSE (Woody's distinctive sculpted button nose) ───────────────
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.020, 0.055, 8), skinMat);
        nose.rotation.x = Math.PI / 2;
        nose.position.set(0, -0.012, 0.130);
        this.miraHead.add(nose);

        // ── MOUTH (Woody's trademark wide toothy grin) ────────────────────
        const smileBacking = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.025, 0.01), lipMat);
        smileBacking.position.set(0, -0.062, 0.110);
        this.miraHead.add(smileBacking);

        const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.066, 0.015, 0.014), teethMat);
        teeth.position.set(0, -0.059, 0.114);
        this.miraHead.add(teeth);

        const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.008, 0.012), lipMat);
        lowerLip.position.set(0, -0.074, 0.114);
        this.miraHead.add(lowerLip);

        // ── 11. SHERIFF COWBOY STETSON HAT (ATTACHMENT 2 SIGNATURE) ───────
        const hatGrp = new THREE.Group();
        hatGrp.position.set(0, 0.12, -0.01);
        this.miraHead.add(hatGrp);

        // Wide Stetson Brim (curved upwards at sides like Woody's!)
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.35, 0.016, 24), hatMat);
        brim.scale.set(0.90, 1.0, 1.20);
        hatGrp.add(brim);

        // Curled brim edge rim
        const brimCurledEdge = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.010, 6, 24), hatMat);
        brimCurledEdge.rotation.x = Math.PI / 2;
        brimCurledEdge.scale.set(0.90, 1.0, 1.20);
        hatGrp.add(brimCurledEdge);

        // Dark Brown Leather Hat Band
        const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.158, 0.032, 20), hatBandMat);
        hatBand.position.set(0, 0.024, 0);
        hatGrp.add(hatBand);

        // Pinched Tall Cowboy Crown
        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.152, 0.19, 16), hatMat);
        crown.scale.set(0.86, 1.0, 1.05);
        crown.position.set(0, 0.115, 0);
        hatGrp.add(crown);

        // Top Crease / Dent of Cowboy Hat
        const crownCrease = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.035, 0.15), hatBandMat);
        crownCrease.position.set(0, 0.205, 0);
        crownCrease.scale.set(0.7, 0.35, 0.9);
        hatGrp.add(crownCrease);

        // ── 12. ECHO LANTERN (UNCHANGED — 100% OPERATIONAL) ───────────────
        this.lantern = new THREE.Group();
        this.lantern.position.set(0.38, 0.75, 0.35);
        this.mira.add(this.lantern);

        let orbMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 2.2 });
        this.lanternOrb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), orbMat);
        this.lantern.add(this.lanternOrb);

        this.lanternLight = new THREE.PointLight(0x22d3ee, 2.2, 9);
        this.lantern.add(this.lanternLight);

        // ── 13. COMPANION DRONE LUMI (UNCHANGED) ──────────────────────────
        this.lumi = new THREE.Group();
        let lumiBody = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 }));
        this.lumi.add(lumiBody);

        let lumiEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 3.5 }));
        lumiEye.position.set(0, 0, 0.2);
        this.lumi.add(lumiEye);

        this.scene.add(this.lumi);
    }

    initEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.resizeBlochCanvas();
            this.renderBlochSphere();
        });

        // Focus window on click anywhere on canvas
        window.addEventListener('click', () => { window.focus(); });

        // Robust Key Mapping (handles both e.code, e.key, and visual button feedback)
        const updateKey = (e, isDown) => {
            let k = e.key ? e.key.toLowerCase() : '';
            let c = e.code || '';

            if (k === 'w' || c === 'KeyW' || c === 'ArrowUp') {
                this.moveDirection.forward = isDown;
                let btn = document.getElementById('key-w');
                if (btn) btn.classList.toggle('active', isDown);
            }
            if (k === 's' || c === 'KeyS' || c === 'ArrowDown') {
                this.moveDirection.backward = isDown;
                let btn = document.getElementById('key-s');
                if (btn) btn.classList.toggle('active', isDown);
            }
            if (k === 'a' || c === 'KeyA' || c === 'ArrowLeft') {
                this.moveDirection.left = isDown;
                let btn = document.getElementById('key-a');
                if (btn) btn.classList.toggle('active', isDown);
            }
            if (k === 'd' || c === 'KeyD' || c === 'ArrowRight') {
                this.moveDirection.right = isDown;
                let btn = document.getElementById('key-d');
                if (btn) btn.classList.toggle('active', isDown);
            }
            if (e.shiftKey) this.moveDirection.sprint = isDown;
        };

        window.addEventListener('keydown', (e) => {
            // Prevent default page scroll on arrow keys and space during gameplay
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) &&
                e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }

            updateKey(e, true);
            let k = e.key ? e.key.toLowerCase() : '';
            let c = e.code || '';

            if (k === 'e' || c === 'KeyE') {
                let onBtn = document.getElementById('hud-interact-btn');
                if (onBtn) onBtn.classList.add('active');
                if (document.getElementById('dialogue-box').style.display === 'block') {
                    this.advanceDialogue();
                }
                if (this.nearbyInteractable && !this.isUIOpen) {
                    this.triggerInteraction(this.nearbyInteractable);
                }
            }

            if ((k === 'r' || c === 'KeyR') && this.isUIOpen) {
                this.resetCurrentPuzzle();
            }

            if ((k === 'z' || k === 'q' || c === 'KeyZ' || c === 'KeyQ') && this.isUIOpen) {
                this.applyInverseAction();
            }

            if (k === ' ' || c === 'Space') {
                if (document.getElementById('dialogue-box').style.display === 'block') {
                    this.advanceDialogue();
                } else if (this.isUIOpen) {
                    this.checkPuzzleSolution();
                } else {
                    this.jump();
                }
            }

            // Layman level: Pressing [J] on your keyboard makes Mira jump!
            if ((k === 'j' || c === 'KeyJ') && !this.isUIOpen) {
                this.jump();
            }

            // Layman level: Pressing [C] on your keyboard opens the Aster Codex journal
            if ((k === 'c' || c === 'KeyC') && !this.isUIOpen) {
                this.openCodex();
            }

            // Layman level: Pressing [G] on your keyboard opens the Gate Guide
            if ((k === 'g' || c === 'KeyG') && !this.isUIOpen) {
                let gg = document.getElementById('gate-guide-modal');
                if (gg) gg.style.display = (gg.style.display === 'flex') ? 'none' : 'flex';
            }

            // Press [P] anytime to trigger Party Poppers!
            if (k === 'p' || c === 'KeyP') {
                this.launchPartyPoppers(6000);
            }

            if (k === 'escape' || c === 'Escape') {
                if (this.isUIOpen) {
                    this.closeModals();
                } else {
                    this.togglePause();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            updateKey(e, false);
            let k = e.key ? e.key.toLowerCase() : '';
            let c = e.code || '';
            if (k === 'e' || c === 'KeyE') {
                let onBtn = document.getElementById('hud-interact-btn');
                if (onBtn) onBtn.classList.remove('active');
            }
        });

        // Virtual On-Screen D-Pad (Mouse and Touch support)
        const bindButtonMovement = (id, directionProp) => {
            let btn = document.getElementById(id);
            if (!btn) return;
            const startMove = (ev) => {
                ev.preventDefault();
                this.moveDirection[directionProp] = true;
                btn.classList.add('active');
            };
            const stopMove = (ev) => {
                ev.preventDefault();
                this.moveDirection[directionProp] = false;
                btn.classList.remove('active');
            };
            btn.addEventListener('mousedown', startMove);
            btn.addEventListener('mouseup', stopMove);
            btn.addEventListener('mouseleave', stopMove);
            btn.addEventListener('touchstart', startMove, { passive: false });
            btn.addEventListener('touchend', stopMove, { passive: false });
            btn.addEventListener('touchcancel', stopMove, { passive: false });
        };

        bindButtonMovement('key-w', 'forward');
        bindButtonMovement('key-s', 'backward');
        bindButtonMovement('key-a', 'left');
        bindButtonMovement('key-d', 'right');

        // On-Screen Action Keys
        let jumpBtn = document.getElementById('hud-jump-btn');
        if (jumpBtn) {
            const doJump = (ev) => {
                ev.preventDefault();
                this.jump();
            };
            jumpBtn.addEventListener('click', doJump);
            jumpBtn.addEventListener('touchstart', doJump, { passive: false });
        }

        let interactBtn = document.getElementById('hud-interact-btn');
        if (interactBtn) {
            interactBtn.onclick = () => {
                if (document.getElementById('dialogue-box').style.display === 'block') {
                    this.advanceDialogue();
                }
                if (this.nearbyInteractable && !this.isUIOpen) {
                    this.triggerInteraction(this.nearbyInteractable);
                }
            };
        }
        let codexBtn = document.getElementById('hud-codex-btn');
        if (codexBtn) codexBtn.onclick = () => this.openCodex();
        let pauseBtn = document.getElementById('hud-pause-btn');
        if (pauseBtn) pauseBtn.onclick = () => this.togglePause();

        // How to Play Tutorial Modal
        let helpBtn = document.getElementById('btn-how-to-play');
        let helpModal = document.getElementById('help-modal');
        let helpCloseBtn = document.getElementById('help-close-btn');
        let helpStartBtn = document.getElementById('help-start-btn');
        const openHelp = () => {
            if (helpModal) helpModal.style.display = 'flex';
            this.isUIOpen = true;
        };
        const closeHelp = () => {
            if (helpModal) helpModal.style.display = 'none';
            this.isUIOpen = false;
        };
        if (helpBtn) helpBtn.onclick = openHelp;
        if (helpCloseBtn) helpCloseBtn.onclick = closeHelp;
        if (helpStartBtn) helpStartBtn.onclick = closeHelp;

        // Mouse look on drag
        let isMouseDown = false;
        window.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'CANVAS' && !this.isUIOpen) isMouseDown = true;
        });
        window.addEventListener('mouseup', () => { isMouseDown = false; });
        window.addEventListener('mousemove', (e) => {
            if (isMouseDown && !this.isUIOpen) {
                this.cameraYaw -= e.movementX * 0.005;
                this.cameraPitch = Math.max(-0.4, Math.min(1.0, this.cameraPitch - e.movementY * 0.005));
            }
        });

        // Direct click on prompt opens interaction
        let promptEl = document.getElementById('interact-prompt');
        if (promptEl) {
            promptEl.onclick = () => {
                if (document.getElementById('dialogue-box').style.display === 'block') {
                    this.advanceDialogue();
                }
                if (this.nearbyInteractable && !this.isUIOpen) {
                    this.triggerInteraction(this.nearbyInteractable);
                }
            };
        }

        // 3D Direct Click on Consoles & Terminals in the world
        const raycaster = new THREE.Raycaster();
        const mouseVec = new THREE.Vector2();
        window.addEventListener('click', (e) => {
            if (this.isUIOpen) return;
            if (e.target.closest && (e.target.closest('.interactive') || e.target.closest('.modal-window'))) return;
            mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVec, this.camera);
            if (this.cityGroup) {
                let hits = raycaster.intersectObjects(this.cityGroup.children, true);
                for (let hit of hits) {
                    let obj = hit.object;
                    while (obj && !obj.userData.type && obj.parent && obj !== this.scene) {
                        obj = obj.parent;
                    }
                    if (obj && obj.userData && obj.userData.type) {
                        this.triggerInteraction(obj);
                        break;
                    }
                }
            }
        });

        // Console UI Events
        document.getElementById('console-close-btn').onclick = () => this.closeModals();
        document.getElementById('btn-prep-0').onclick = () => this.prepState(0);
        document.getElementById('btn-prep-1').onclick = () => this.prepState(1);
        document.getElementById('btn-apply-inverse').onclick = () => this.applyInverseAction();
        document.getElementById('btn-reset-puzzle').onclick = () => this.resetCurrentPuzzle();
        document.getElementById('btn-lock-in').onclick = () => this.checkPuzzleSolution();
        document.getElementById('btn-reveal-hint').onclick = () => this.revealNextHint();

        // Gate Buttons
        document.querySelectorAll('.gate-btn').forEach(btn => {
            btn.onclick = () => {
                let gateKey = btn.getAttribute('data-gate');
                this.applyGate(gateKey);
            };
        });

        // Dialogue advance button or clicking dialogue box directly
        document.getElementById('dialogue-advance-btn').onclick = (e) => {
            e.stopPropagation();
            this.advanceDialogue();
        };
        document.getElementById('dialogue-box').onclick = () => this.advanceDialogue();

        let poppersBtn = document.getElementById('dialogue-poppers-btn');
        if (poppersBtn) {
            poppersBtn.onclick = (e) => {
                e.stopPropagation();
                this.launchPartyPoppers(8000);
            };
        }

        let fireMoreBtn = document.getElementById('btn-fire-more-poppers');
        if (fireMoreBtn) {
            fireMoreBtn.onclick = () => this.launchPartyPoppers(7000);
        }

        let vicContBtn = document.getElementById('btn-victory-continue');
        if (vicContBtn) {
            vicContBtn.onclick = () => {
                let vicModal = document.getElementById('victory-celebration-modal');
                if (vicModal) vicModal.style.display = 'none';
            };
        }

        // Measurement Lab Events
        document.getElementById('experiment-close-btn').onclick = () => this.closeModals();
        document.getElementById('btn-prep-superposition').onclick = () => {
            this.sim.prepare(QuantumState.Zero, "Prep |0⟩");
            this.sim.applyGate(QuantumGate.H);
            sounds.playGateApply();
            this.updateMeasurementLabUI("Prepared |+⟩ equal superposition.");
        };
        document.getElementById('btn-measure-single').onclick = () => this.runSingleShotMeasurement();
        document.getElementById('btn-try-undo-measurement').onclick = () => this.tryUndoAcrossMeasurement();
        document.getElementById('btn-exp-10').onclick = () => this.runBatchTrials(10);
        document.getElementById('btn-exp-100').onclick = () => this.runBatchTrials(100);
        document.getElementById('btn-exp-1000').onclick = () => this.runBatchTrials(1000);
        document.getElementById('btn-exp-reset').onclick = () => this.resetLabTrials();

        // Codex Events
        document.getElementById('journal-close-btn').onclick = () => this.closeModals();

        // Pause Events
        document.getElementById('btn-pause-resume').onclick = () => this.closeModals();
        document.getElementById('btn-pause-checkpoint').onclick = () => {
            this.respawnAtCheckpoint();
            this.closeModals();
        };
        document.getElementById('btn-pause-journal').onclick = () => {
            this.closeModals();
            this.openCodex();
        };
    }

    initCodex() {
        let topicList = document.getElementById('journal-topic-list');
        if (!topicList) return;
        topicList.innerHTML = '';
        JOURNAL_ARTICLES.forEach((art, idx) => {
            let btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.style.textAlign = 'left';
            btn.style.fontSize = '12px';
            btn.innerText = art.title;
            btn.onclick = () => this.showCodexArticle(idx);
            topicList.appendChild(btn);
        });
        this.showCodexArticle(0);
    }

    showCodexArticle(idx) {
        let art = JOURNAL_ARTICLES[idx];
        let box = document.getElementById('journal-content-box');
        if (!box) return;
        box.innerHTML = `
            <div style="font-size: 18px; font-weight: 700; color: var(--cyan); margin-bottom: 4px;">${art.title}</div>
            <div style="font-size: 12px; color: var(--violet); margin-bottom: 12px;">Category: ${art.category}</div>
            <div style="line-height: 1.6; color: #f1f5f9; white-space: pre-line;">${art.text}</div>
        `;
        sounds.playClick();
    }

    openCodex() {
        this.isUIOpen = true;
        document.getElementById('journal-modal').style.display = 'flex';
    }

    togglePause() {
        let modal = document.getElementById('pause-modal');
        if (modal.style.display === 'flex') {
            this.closeModals();
        } else {
            this.isUIOpen = true;
            modal.style.display = 'flex';
        }
    }

    closeModals() {
        this.isUIOpen = false;
        document.getElementById('console-modal').style.display = 'none';
        document.getElementById('experiment-modal').style.display = 'none';
        document.getElementById('journal-modal').style.display = 'none';
        document.getElementById('pause-modal').style.display = 'none';
        let hm = document.getElementById('help-modal');
        if (hm) hm.style.display = 'none';
        let gg = document.getElementById('gate-guide-modal');
        if (gg) gg.style.display = 'none';
        this.updateTutorialGuide();
    }

    prepState(basis) {
        let s = (basis === 0) ? QuantumState.Zero : QuantumState.One;
        this.sim.prepare(s, `Prep |${basis}⟩`);
        sounds.playClick();
        this.syncWorldMachinesWithSimulation();
        this.updateConsoleUI();
        this.updateHUD();
    }

    applyGate(gateKey) {
        let g = QuantumGate[gateKey];
        if (!g) return;

        // Check if gate is allowed for current puzzle
        let p = this.activePuzzle;
        if (p && (!p.allowedGates || p.allowedGates.length === 0)) {
            sounds.playError();
            this.showToast('Gates are not required for this calibration. Use the Set to Blue and Set to Yellow light selectors below.');
            return;
        }

        // Capture state BEFORE applying gate for feedback
        let p0Before = Math.round(this.sim.state.prob0 * 100);
        let p1Before = Math.round(this.sim.state.prob1 * 100);

        this.sim.applyGate(g);
        sounds.playGateApply();

        // State AFTER applying gate
        let stateAfter = this.sim.state.label;
        let p0After = Math.round(this.sim.state.prob0 * 100);
        let p1After = Math.round(this.sim.state.prob1 * 100);

        // Context-specific feedback message
        let feedbackMsg = '';
        if (gateKey === 'X') {
            if (p0Before === 100 && p1After === 100) {
                feedbackMsg = '[X] FLIP SWITCH: Blue (100%) flipped to Yellow (100%)!';
            } else if (p1Before === 100 && p0After === 100) {
                feedbackMsg = '[X] FLIP SWITCH: Yellow (100%) flipped back to Blue (100%)!';
            } else {
                feedbackMsg = '[X] FLIP SWITCH: Blue ' + p0Before + '% to ' + p0After + '% | Yellow ' + p1Before + '% to ' + p1After + '%';
            }
        } else if (gateKey === 'H') {
            if (p0Before === 100 || p1Before === 100) {
                feedbackMsg = '[H] BLENDER: Created 50/50 mix! Blue: ' + p0After + '%, Yellow: ' + p1After + '%';
            } else if (Math.abs(p0Before - 50) < 10) {
                feedbackMsg = '[H] BLENDER (2nd use): Waves recombined! Result: ' + stateAfter + ' (Blue: ' + p0After + '%, Yellow: ' + p1After + '%)';
            } else {
                feedbackMsg = '[H] BLENDER: ' + stateAfter + ' (Blue: ' + p0After + '%, Yellow: ' + p1After + '%)';
            }
        } else if (gateKey === 'Z') {
            feedbackMsg = '[Z] MIRROR: Wave polarity flipped! Brightness unchanged (Blue: ' + p0After + '%, Yellow: ' + p1After + '%). Check the phase angle.';
        } else {
            feedbackMsg = 'Gate [' + gateKey + '] applied. Result: ' + stateAfter;
        }

        this.showToast(feedbackMsg);
        this.syncWorldMachinesWithSimulation();
        this.updateConsoleUI();
        this.updateHUD();
    }

    applyInverseAction() {
        let res = this.sim.applyLastInverse();
        if (res.success) {
            sounds.playGateApply();
            this.showToast(res.message);
        } else {
            sounds.playError();
            this.showToast(res.message);
        }
        this.syncWorldMachinesWithSimulation();
        this.updateConsoleUI();
        this.updateHUD();
    }

    initPuzzleStartingState(pid) {
        if (!this.puzzleStatesInitialized) this.puzzleStatesInitialized = {};
        if (this.puzzleStatesInitialized[pid]) return;
        this.puzzleStatesInitialized[pid] = true;

        if (pid === "ch1_p1") this.sim.prepare(QuantumState.One, "Init");
        else if (pid === "ch1_p2") this.sim.prepare(QuantumState.Zero, "Init");
        else if (pid === "ch2_p1") this.sim.prepare(QuantumState.Zero, "Init");
        else if (pid === "ch2_p2") this.sim.prepare(QuantumState.One, "Init");
        else if (pid === "ch3_p1") this.sim.prepare(QuantumState.Zero, "Init");
        else if (pid === "ch3_p2") this.sim.prepare(QuantumState.Plus, "Init");
        else if (pid === "ch4_p1") this.sim.prepare(QuantumState.Plus, "Init");
        else if (pid === "ch4_p2") this.sim.prepare(QuantumState.Zero, "Init");
        else if (pid === "ch5_p1") this.sim.prepare(QuantumState.Zero, "Init");
        else if (pid === "ch5_p2") this.sim.prepare(QuantumState.Zero, "Init");
        else if (pid === "ch6_p1") {
            this.sim.prepare(QuantumState.Zero, "Init");
            this.sim.applyGate(QuantumGate.H);
            this.sim.applyGate(QuantumGate.Z);
            this.sim.applyGate(QuantumGate.X);
        } else {
            this.sim.prepare(QuantumState.Zero, "Init");
        }
    }

    resetCurrentPuzzle() {
        if (this.activePuzzle) {
            if (this.puzzleStatesInitialized) delete this.puzzleStatesInitialized[this.activePuzzle.id];
            this.initPuzzleStartingState(this.activePuzzle.id);
            sounds.playClick();
            this.showToast("Puzzle reset to initial state.");
            this.syncWorldMachinesWithSimulation();
            this.updateConsoleUI();
            this.updateHUD();
        }
    }

    // Layman Level: Direct alignment between quantum console and physical 3D city machines
    syncWorldMachinesWithSimulation() {
        if (!this.activePuzzle) return;
        let pid = this.activePuzzle.id;
        let isSolved = this.sim.state.isEquivalentTo(this.activePuzzle.target);

        // Update Console Animated Gate Widget (Visual real mechanical gate in console)
        let gateWidget = document.getElementById('console-gate-anim');
        let gateCaption = document.getElementById('gate-caption-text');
        let gateLock = document.getElementById('gate-anim-lock');

        if (gateWidget) {
            if (isSolved || this.d1GateOpenPermanently) {
                gateWidget.classList.add('gate-open');
                if (gateCaption) gateCaption.innerText = "CIRCUIT MATCHED! 🟢 Click 'ACTIVATE' to open gate in map";
                if (gateLock) gateLock.innerText = "🔓";
            } else {
                gateWidget.classList.remove('gate-open');
                if (gateCaption) gateCaption.innerText = "MECHANICAL GATE IS CLOSED & LOCKED 🔒 (Adjust switches to open)";
                if (gateLock) gateLock.innerText = "🔒";
            }
        }

        // District 1 City Security Gate (Real 3D Mechanical Sliding Gate in the map)
        if (pid === 'ch1_p1' || pid === 'ch1_p2') {
            if (pid === 'ch1_p2') {
                if (this.d1GateOpenPermanently) {
                    this.d1GateOpen = true;
                    this.updateMachineSign('d1_gate', 'GATE FULLY OPEN 🟢', 0x22c55e);
                } else if (isSolved) {
                    this.updateMachineSign('d1_gate', 'CIRCUIT MATCHED 🟢 - Press ACTIVATE', 0x22c55e);
                } else {
                    this.d1GateOpen = false;
                    this.updateMachineSign('d1_gate', 'GATE CLOSED 🔒 (Requires Yellow 1)', 0xef4444);
                }
            }
        }

        // Switchworks (District 2):
        if (pid === 'ch2_p1') {
            if (this.sim.state.prob1 > 0.8 || this.d2LiftElevated) {
                this.d2LiftTargetY = 4.15; // Elevate lift to upper terrace
                this.updateMachineSign('d2_lift', 'ELEVATING / RAISED (Yellow 1) 🟢', 0x22c55e);
            } else {
                this.d2LiftTargetY = 2.50; // Lower lift to plaza floor
                this.updateMachineSign('d2_lift', 'LOWERED 🔒 (Needs Yellow 1)', 0xf59e0b);
            }
        } else if (pid === 'ch2_p2') {
            if (this.d2GateOpenPermanently) {
                this.updateMachineSign('d2_gate', 'UPPER GATE OPEN 🟢', 0x22c55e);
            } else if (isSolved) {
                this.updateMachineSign('d2_gate', 'CIRCUIT MATCHED 🟢 - Press ACTIVATE', 0x22c55e);
            } else {
                this.updateMachineSign('d2_gate', 'GATE LOCKED 🔒 (Requires Blue 0)', 0xef4444);
            }
        }

        // Twin-Light Superposition Bridge & Garden Gate (District 3):
        if (pid === 'ch3_p1' || pid === 'ch3_p2') {
            let chNum = this.activePuzzle.chapter;
            if (this.d3GateOpenPermanently || chNum >= 4) {
                this.updateMachineSign('d3_bridge', 'GARDEN GATE OPEN 🟢', 0x22c55e);
            } else if (isSolved) {
                this.updateMachineSign('d3_bridge', 'CIRCUIT MATCHED 🟢 - Press ACTIVATE', 0x22c55e);
            } else {
                let isSuper = Math.abs(this.sim.state.prob0 - 0.5) < 0.08 && Math.abs(this.sim.state.prob1 - 0.5) < 0.08;
                if (isSuper || (pid === 'ch3_p2' && isSolved)) {
                    this.updateMachineSign('d3_bridge', 'BRIDGE STABILIZING (50/50) 🟢', 0x22c55e);
                } else {
                    this.updateMachineSign('d3_bridge', 'UNSTABLE 🔒 (Needs 50/50 Mix [H])', 0xc084fc);
                }
            }
        }

        // Phase Observatory Gate (District 4):
        if (pid === 'ch4_p1' || pid === 'ch4_p2') {
            let chNum = this.activePuzzle.chapter;
            if (this.d4GateOpenPermanently || chNum >= 5) {
                this.updateMachineSign('d4_gate', 'OBSERVATORY GATE OPEN 🟢', 0x22c55e);
            } else if (isSolved && pid === 'ch4_p2') {
                this.updateMachineSign('d4_gate', 'CIRCUIT MATCHED 🟢 - Press ACTIVATE', 0x22c55e);
            }
        }

        // Echo Bridge Gate (District 5):
        if (pid === 'ch5_p1' || pid === 'ch5_p2') {
            let chNum = this.activePuzzle.chapter;
            if (this.d5GateOpenPermanently || chNum >= 6) {
                this.updateMachineSign('d5_gate', 'ECHO BRIDGE GATE OPEN 🟢', 0x22c55e);
            } else if (isSolved && pid === 'ch5_p2') {
                this.updateMachineSign('d5_gate', 'CIRCUIT MATCHED 🟢 - Press ACTIVATE', 0x22c55e);
            }
        }
    }

    revealNextHint() {
        if (!this.activePuzzle || !this.activePuzzle.hints) return;
        if (this.revealedHints < this.activePuzzle.hints.length) {
            this.revealedHints++;
            sounds.playClick();
            this.renderHints();
        }
    }

    renderHints() {
        let container = document.getElementById('hints-container');
        document.getElementById('hints-title').innerText = `Step-by-Step Help (${this.revealedHints}/${this.activePuzzle.hints.length})`;
        if (this.revealedHints === 0) {
            container.innerHTML = "<i>Need guidance? Click 'Reveal Next Step'.</i>";
        } else {
            container.innerHTML = this.activePuzzle.hints.slice(0, this.revealedHints)
                .map((h, i) => `<div><b>Step ${i + 1}:</b> ${h}</div>`).join('');
        }
    }

    checkPuzzleSolution() {
        if (!this.activePuzzle) return;
        let isSolved = this.sim.state.isEquivalentTo(this.activePuzzle.target);
        if (this.activePuzzle.id === 'ch7_p1') {
            // For measurement station, either collapsed state (0 or 1) is a valid measured outcome
            isSolved = (this.sim.state.prob0 > 0.95 || this.sim.state.prob1 > 0.95);
        }
        let fidelity = isSolved ? 1.0 : this.sim.state.fidelityWith(this.activePuzzle.target);
        if (isSolved) {
            sounds.playSuccessChime();
            
            // Immediate slow billowing smoke & pneumatic pressure release around the active machine
            let currentPuzzleId = this.activePuzzle.id;
            if (currentPuzzleId === 'ch1_p1') {
                this.spawnSlowBillowingSmoke(-14, 1.2, 10, 4200);
            } else if (currentPuzzleId === 'ch1_p2') {
                this.openMechanicalGate('d1');
                this.d1GateOpenPermanently = true;
                this.spawnSlowBillowingSmoke(14, 1.2, 10, 4200);
            } else if (currentPuzzleId === 'ch2_p1') {
                this.d2LiftTargetY = 4.15;
                this.d2LiftElevated = true;
                this.spawnSlowBillowingSmoke(14, 2.5, 54, 4800);
                this.spawnSlowBillowingSmoke(8, 2.0, 51, 4000);
                this.spawnSlowBillowingSmoke(20, 2.0, 57, 4000);
            } else if (currentPuzzleId === 'ch2_p2') {
                this.openMechanicalGate('d2');
                this.d2GateOpenPermanently = true;
                this.spawnSlowBillowingSmoke(18, 4.75, 66, 4500);
            } else if (currentPuzzleId === 'ch3_p1' || currentPuzzleId === 'ch3_p2') {
                this.openMechanicalGate('d3');
                this.d3GateOpenPermanently = true;
                this.updateMachineSign('d3_bridge', 'GARDEN GATE OPEN 🟢', 0x22c55e);
                this.spawnSlowBillowingSmoke(40, 4.0, 88, 4500);
            } else if (currentPuzzleId === 'ch4_p2') {
                this.openMechanicalGate('d4');
                this.d4GateOpenPermanently = true;
                this.spawnSlowBillowingSmoke(48, 7.0, 128, 4500);
            } else if (currentPuzzleId === 'ch5_p2') {
                this.openMechanicalGate('d5');
                this.d5GateOpenPermanently = true;
                this.spawnSlowBillowingSmoke(8, 9.5, 167, 4500);
            } else if (currentPuzzleId === 'ch6_p1') {
                this.openMechanicalGate('d6');
                this.d6GateOpenPermanently = true;
                this.spawnSlowBillowingSmoke(-35, 10.5, 173, 4500);
            } else if (currentPuzzleId === 'ch7_p1') {
                this.openMechanicalGate('d7');
                this.d7GateOpenPermanently = true;
            } else if (currentPuzzleId === 'ch8_final') {
                this.launchPartyPoppers(18000);
                this.spawnSlowBillowingSmoke(0, 16.0, 242, 4500);
            } else if (this.playerPos) {
                this.spawnSlowBillowingSmoke(this.playerPos.x, this.playerPos.y, this.playerPos.z, 3800);
            }

            // Visual feedback on the success button
            let lockInBtn = document.getElementById('btn-lock-in');
            if (lockInBtn) {
                lockInBtn.innerText = "✅ SEQUENCE VERIFIED! STAND BY...";
                lockInBtn.style.background = "linear-gradient(135deg, #16a34a, #22c55e)";
            }

            // Close console modal
            this.closeModals();

            // Open cinematic Activation Diagram Modal (User Attachments 1, 2, & 3)
            let explanation = this.activePuzzle.explanation;
            this.showActivationDiagram(currentPuzzleId, explanation);
        } else {
            sounds.playError();
            this.showToast(`State mismatch (Fidelity: ${(fidelity * 100).toFixed(1)}%). Adjust your switches!`);
        }
    }

    handlePuzzleUnlocked(id) {
        if (id === "ch1_p1") {
            this.updateMachineSign('d1_gate', 'ALPHA ONLINE 🟡 - Calibrate Beta ▶', 0xf59e0b);
            this.advanceToPuzzle("ch1_p2");
            this.showToast("Terminal Alpha calibrated! Walk across to Terminal Beta on your RIGHT ▶ to finish opening the gate.");
            sounds.playGateOpen();
            this.spawnSlowBillowingSmoke(-14, 1.2, 10, 3200);
        } else if (id === "ch1_p2") {
            this.openMechanicalGate('d1');
            this.d1GateOpenPermanently = true;
            this.updateMachineSign('d1_gate', 'GATE FULLY OPEN 🟢', 0x22c55e);
            this.advanceToPuzzle("ch2_p1");
            this.showToast("City Security Gate unlocked! Guide drone Lumi is free!");
            this.spawnSlowBillowingSmoke(14, 1.2, 10, 3200);
            // D1 → D2: Rise from topY=0.75 to topY=1.10. Z=14 (gate) to Z=24 (walkway start)
            setTimeout(() => this.createSlope('d1_ramp', 0, 17, 10, 15, 24, 0.75, 1.10), 600);
        } else if (id === "ch2_p1") {
            this.d2LiftTargetY = 4.15; // Elevate lift slowly
            this.d2LiftElevated = true; // Keep elevated permanently
            this.updateMachineSign('d2_lift', 'LIFT ELEVATED (Yellow 1) 🟢', 0x22c55e);
            this.advanceToPuzzle("ch2_p2");
            this.showToast("Hydraulic Lift elevated! Slow pneumatic pressure engaged.");
            sounds.playGateOpen();
            this.spawnSlowBillowingSmoke(14, 2.5, 54, 4500);
            this.spawnSlowBillowingSmoke(8, 2.0, 51, 3800);
            this.spawnSlowBillowingSmoke(20, 2.0, 57, 3800);
        } else if (id === "ch2_p2") {
            this.openMechanicalGate('d2');
            this.d2GateOpenPermanently = true;
            this.updateMachineSign('d2_gate', 'UPPER GATE OPEN 🟢', 0x22c55e);
            this.advanceToPuzzle("ch3_p1");
            this.showToast("Upper Gate unlocked! Two flips returned you to Blue. Welcome to District 3!");
        } else if (id === "ch3_p1") {
            this.openMechanicalGate('d3');
            this.d3GateOpenPermanently = true;
            this.updateMachineSign('d3_bridge', 'BRIDGE STABILIZED 🟢', 0x22c55e);
            this.advanceToPuzzle("ch3_p2");
            this.showToast("50/50 Superposition achieved! Twin-light bridge solidified!");
            // D3 → D4: Rise from D3 topY=4.75 (Z≈91) to D4 approach topY=6.10 (Z≈98)
            setTimeout(() => this.createSlope('d3_ramp', 44, 91, 8, 91, 98, 4.75, 6.10), 600);
        } else if (id === "ch3_p2") {
            this.openMechanicalGate('d3');
            this.d3GateOpenPermanently = true;
            this.updateMachineSign('d3_bridge', 'GARDEN GATE OPEN 🟢', 0x22c55e);
            sounds.playGateOpen();
            this.spawnSlowBillowingSmoke(40, 4.0, 88, 4500);
            this.advanceToPuzzle("ch4_p1");
            this.showToast("Waves recombined! Garden Gate opens — proceed to Phase Observatory.");
            setTimeout(() => this.createSlope('d3_ramp', 44, 91, 8, 91, 98, 4.75, 6.10), 600);
        } else if (id === "ch4_p1") {
            this.advanceToPuzzle("ch4_p2");
            this.showToast("Phase polarity mirrored! Now calibrate the harmonic beacon.");
        } else if (id === "ch4_p2") {
            this.openMechanicalGate('d4');
            this.d4GateOpenPermanently = true;
            this.updateMachineSign('d4_gate', 'OBSERVATORY GATE OPEN 🟢', 0x22c55e);
            sounds.playGateOpen();
            this.spawnSlowBillowingSmoke(48, 7.0, 128, 4500);
            this.advanceToPuzzle("ch5_p1");
            this.showToast("H-Z-H sequence verified! Observatory gate slides open — head to Echo Bridge!");
        } else if (id === "ch5_p1") {
            this.advanceToPuzzle("ch5_p2");
            this.showToast("Left Pylon locked (X→H)! Now align the Right Pylon (H→X).");
        } else if (id === "ch5_p2") {
            this.openMechanicalGate('d5');
            this.d5GateOpenPermanently = true;
            this.updateMachineSign('d5_gate', 'ECHO BRIDGE GATE OPEN 🟢', 0x22c55e);
            sounds.playGateOpen();
            this.spawnSlowBillowingSmoke(8, 9.5, 167, 4500);
            this.advanceToPuzzle("ch6_p1");
            this.showToast("Both pylons aligned! Echo Bridge gate opens — cross to Dr. Ishan's Vault!");
        } else if (id === "ch6_p1") {
            this.openMechanicalGate('d6');
            this.d6GateOpenPermanently = true;
            this.updateMachineSign('d6_door', 'VAULT UNLOCKED 🟢', 0x22c55e);
            sounds.playGateOpen();
            this.spawnSlowBillowingSmoke(-35, 10.5, 173, 4500);
            this.advanceToPuzzle("ch7_p1");
            this.showToast("Vault blast door opened! Accessing Auditor Measurement Station.");
            // D6 → D7: Connect vault floor (Z≈175 end, topY≈12.0) to D7 walkway (Z≈182, topY≈12.0)
            setTimeout(() => this.createSlope('d6_ramp', -35, 175, 8, 175, 182, 12.0, 12.0), 600);
        } else if (id === "ch7_p1") {
            this.openMechanicalGate('d7');
            this.d7GateOpenPermanently = true;
            this.updateMachineSign('d7_scanner', 'PATHWAY CLEARED 🟢', 0x22c55e);
            sounds.playGateOpen();
            this.spawnSlowBillowingSmoke(0, 12.5, 215, 4500);
            this.advanceToPuzzle("ch8_final");
            this.showToast("Quantum wave measured and collapsed! Climb to the Echo Core!");
        } else if (id === "ch8_final") {
            this.showToast("🏆 VICTORY! Aster's quantum network is stabilized!");
            this.launchPartyPoppers(10000);
            this.showVictoryModal();
        }
    }

    advanceToPuzzle(nextId) {
        let p = PUZZLE_DATA.find(x => x.id === nextId);
        if (p) {
            this.activePuzzle = p;
            this.updateHUD();
        }
    }

    triggerInteraction(obj) {
        let data = obj.userData;
        if (data.type === 'console') {
            let p = PUZZLE_DATA.find(x => x.id === data.puzzleId);
            if (p) {
                this.activePuzzle = p;
                this.revealedHints = 0;
                this.initPuzzleStartingState(p.id);
                this.isUIOpen = true;
                document.getElementById('console-modal').style.display = 'flex';
                this.resizeBlochCanvas();
                this.updateConsoleUI();
                this.updateTutorialGuide();
            }
        } else if (data.type === 'measurement_station') {
            this.isUIOpen = true;
            document.getElementById('experiment-modal').style.display = 'flex';
            this.updateMeasurementLabUI("Auditor scanner online. Ready for measurement.");
            this.updateTutorialGuide();
        }
    }

    runSingleShotMeasurement() {
        let outcome = this.sim.measure();
        sounds.playMeasurementCollapse();
        this.updateMeasurementLabUI(`Single-shot measurement collapsed state to basis state |${outcome}⟩! Both outcomes unlock the path.`);
        this.openMechanicalGate('d7');
        this.handlePuzzleUnlocked("ch7_p1");
        this.updateHUD();
    }

    tryUndoAcrossMeasurement() {
        let res = this.sim.applyLastInverse();
        if (!res.success) {
            sounds.playError();
            this.updateMeasurementLabUI(`<b>REVERSAL BLOCKED:</b> ${res.message}`);
        } else {
            this.updateMeasurementLabUI(res.message);
        }
    }

    runBatchTrials(count) {
        let res = QuantumSimulator.measureTrials(QuantumState.Plus, count);
        sounds.playClick();
        this.totalTrials += count;
        this.count0 += res.count0;
        this.count1 += res.count1;

        let r0 = this.count0 / this.totalTrials;
        let r1 = this.count1 / this.totalTrials;

        document.getElementById('exp-total-trials').innerText = this.totalTrials.toLocaleString();
        document.getElementById('exp-p0-ratio').innerText = `${this.count0} (${(r0 * 100).toFixed(1)}%)`;
        document.getElementById('exp-p1-ratio').innerText = `${this.count1} (${(r1 * 100).toFixed(1)}%)`;
        document.getElementById('exp-meter-0').style.width = `${r0 * 100}%`;
        document.getElementById('exp-meter-1').style.width = `${r1 * 100}%`;

        this.updateMeasurementLabUI(`Ran ${count} fresh independent trials on |+⟩. Empirical ratio: ${(r0 * 100).toFixed(1)}% / ${(r1 * 100).toFixed(1)}%`);
    }

    resetLabTrials() {
        this.totalTrials = 0;
        this.count0 = 0;
        this.count1 = 0;
        document.getElementById('exp-total-trials').innerText = "0";
        document.getElementById('exp-p0-ratio').innerText = "0 (0%)";
        document.getElementById('exp-p1-ratio').innerText = "0 (0%)";
        document.getElementById('exp-meter-0').style.width = "0%";
        document.getElementById('exp-meter-1').style.width = "0%";
        sounds.playClick();
        this.updateMeasurementLabUI("Statistics reset.");
    }

    updateMeasurementLabUI(msg) {
        let box = document.getElementById('measurement-result-box');
        if (box) box.innerHTML = msg;
    }

    updateConsoleUI() {
        if (!this.activePuzzle) return;
        let p = this.activePuzzle;

        document.getElementById('console-chapter-header').innerText = 'Chapter ' + p.chapter + ': ' + p.chapterTitle;
        document.getElementById('console-title').innerText = p.title;

        // === GATE BUTTON VISIBILITY: Show all available gates when gates are enabled ===
        let hasGates = p.allowedGates && p.allowedGates.length > 0;
        document.querySelectorAll('.gate-btn').forEach(function(btn) {
            if (hasGates) {
                // All available gates (X, H, Z) are visible and usable so the user has full agency
                btn.style.display = '';
                btn.disabled = false;
                btn.style.opacity = '1';
            } else {
                // Pure color preparation stages (e.g. Chapter 1)
                btn.style.display = 'none';
                btn.disabled = true;
            }
        });

        // Show/hide Prep buttons based on puzzle settings
        let prep0Btn = document.getElementById('btn-prep-0');
        let prep1Btn = document.getElementById('btn-prep-1');
        if (prep0Btn) {
            prep0Btn.style.display = p.allowPrep0 ? '' : 'none';
            prep0Btn.disabled = !p.allowPrep0;
        }
        if (prep1Btn) {
            prep1Btn.style.display = p.allowPrep1 ? '' : 'none';
            prep1Btn.disabled = !p.allowPrep1;
        }

        // Update the available tools label
        let toolsTitle = document.getElementById('available-tools-title');
        if (toolsTitle) {
            let gateNames = hasGates ? ['[X] Flip Switch', '[H] Blender', '[Z] Mirror'] : [];
            let prepNames = [];
            if (p.allowPrep0) prepNames.push('Set Blue (0)');
            if (p.allowPrep1) prepNames.push('Set Yellow (1)');
            let allTools = prepNames.concat(gateNames);
            toolsTitle.innerText = allTools.length > 0
                ? 'Tools for This Puzzle: ' + allTools.join(', ')
                : 'Tools: Only use the Set Buttons below';
        }

        // Connected City Machine Card Readout (Layman 3D World Alignment)
        let mTitle = document.getElementById('console-machine-title');
        let mDesc = document.getElementById('console-machine-desc');
        let mStatus = document.getElementById('console-machine-status');
        let mIcon = document.getElementById('console-machine-icon');

        if (mTitle) mTitle.innerText = `CONNECTED CITY MACHINE: ${p.machineName || p.title}`;
        if (mDesc) mDesc.innerText = p.machineGoal || p.objective;

        let fidelity = this.sim.state.fidelityWith(p.target);
        let isSolved = this.sim.state.isEquivalentTo(p.target);
        if (mStatus) {
            if (isSolved) {
                mStatus.innerText = "READY TO ACTIVATE ✅";
                mStatus.className = "machine-banner-status unlocked";
            } else {
                mStatus.innerText = p.machineStatus || "CALIBRATING ⏳";
                mStatus.className = "machine-banner-status";
            }
        }

        // Mathematical vector readout in expandable details
        let formulaEl = document.getElementById('console-state-formula');
        if (formulaEl) {
            formulaEl.innerText = `|ψ⟩ = (${this.sim.state.alpha.toString()}) |0⟩ + (${this.sim.state.beta.toString()}) |1⟩`;
        }

        let p0 = this.sim.state.prob0;
        let p1 = this.sim.state.prob1;
        document.getElementById('console-p0-label').innerText = `${(p0 * 100).toFixed(0)}%`;
        document.getElementById('console-p1-label').innerText = `${(p1 * 100).toFixed(0)}%`;
        document.getElementById('console-meter-0').style.width = `${p0 * 100}%`;
        document.getElementById('console-meter-1').style.width = `${p1 * 100}%`;

        let phaseDeg = this.sim.state.relativePhaseDegrees;
        let phaseLabel = document.getElementById('console-phase-label');
        if (phaseLabel) {
            if (Math.abs(phaseDeg) < 15) phaseLabel.innerText = "Normal In-Sync (0°)";
            else if (Math.abs(phaseDeg - 180) < 15 || Math.abs(phaseDeg + 180) < 15) phaseLabel.innerText = "Opposite-Mirrored (180° / π)";
            else phaseLabel.innerText = `${phaseDeg.toFixed(1)}°`;
        }

        // Layman State Badge & Friendly Description
        let badge = document.getElementById('console-state-badge');
        let badgeText = document.getElementById('console-state-badge-text');
        let laymanDesc = document.getElementById('console-state-layman-desc');

        if (p0 > 0.95) {
            if (badge) badge.className = 'layman-state-badge badge-blue';
            if (badgeText) badgeText.innerText = '🔵 BLUE MODE (STATE 0 / OFF)';
            if (laymanDesc) laymanDesc.innerText = 'Output is 100% Blue light. The connected city machine is in its lower/idle position.';
        } else if (p1 > 0.95) {
            if (badge) badge.className = 'layman-state-badge badge-amber';
            if (badgeText) badgeText.innerText = '🟡 YELLOW MODE (STATE 1 / ON)';
            if (laymanDesc) laymanDesc.innerText = 'Output is 100% Yellow Light light. The connected city machine is powered up and elevated!';
        } else if (Math.abs(p0 - 0.5) < 0.08) {
            if (badge) badge.className = 'layman-state-badge badge-blend';
            let isMirrored = Math.abs(phaseDeg) > 90;
            if (badgeText) badgeText.innerText = isMirrored ? '🟣 50/50 BLEND (MIRRORED WAVES)' : '🟣 50/50 BLEND (IN-SYNC WAVES)';
            if (laymanDesc) laymanDesc.innerText = isMirrored
                ? '50% Blue + 50% Yellow mixed with mirrored wave polarity. Stabilizes quantum bridges!'
                : '50% Blue + 50% Yellow mixed in-sync. Both colors active at once!';
        } else {
            if (badge) badge.className = 'layman-state-badge badge-custom';
            if (badgeText) badgeText.innerText = `⚡ ${(p0 * 100).toFixed(0)}% BLUE / ${(p1 * 100).toFixed(0)}% YELLOW MIX`;
            if (laymanDesc) laymanDesc.innerText = 'Power is split across both channels. Use switches to direct energy to the target!';
        }

        // Comparison banner when equal superposition
        let phaseBanner = document.getElementById('console-phase-banner');
        if (Math.abs(p0 - 0.5) < 0.05 && Math.abs(p1 - 0.5) < 0.05) {
            phaseBanner.style.display = 'block';
            phaseBanner.innerText = (Math.abs(phaseDeg) < 15)
                ? "➔ State is In-Sync: 50% Blue + 50% Yellow, in-sync wave vibration (0°)."
                : "➔ State is Mirrored: 50% Blue + 50% Yellow, mirrored wave vibration (180° / opposite)!";
        } else {
            phaseBanner.style.display = 'none';
        }

        // Plain English Switch Sequence Timeline
        let timelineEl = document.getElementById('console-circuit-timeline');
        if (timelineEl) {
            let hist = Array.isArray(this.sim.history) ? this.sim.history : [];
            let gateSteps = hist.filter(h => h && h.type === 'gate');
            if (gateSteps.length === 0) {
                timelineEl.innerText = "[No switches applied yet]";
            } else {
                timelineEl.innerText = gateSteps.map(step => {
                    let sym = step.symbol || (step.gate && step.gate.symbol) || '';
                    if (sym === 'X') return '[X] Flip Switch';
                    if (sym === 'H') return '[H] Blender';
                    if (sym === 'Z') return '[Z] Mirror';
                    return `[${sym}]`;
                }).join(' ➔ ');
            }
        }

        let invCheck = this.sim.canApplyLastInverse();
        let invPreview = document.getElementById('console-inverse-preview');
        if (invPreview) {
            invPreview.innerText = invCheck.can
                ? `Undo Action Available: [${invCheck.gate.symbol === 'X' ? 'X Flip' : invCheck.gate.symbol === 'H' ? 'H Blender' : 'Z Mirror'}]`
                : `Undo Blocked: ${invCheck.reason}`;
        }

        // Target requirement & Fidelity (100% Layman Friendly)
        let targetLabel = document.getElementById('console-target-label');
        if (targetLabel) {
            if (p.target && p.target.isEquivalentTo(QuantumState.Zero)) {
                targetLabel.innerText = "Target: 🔵 Blue Mode (0)";
            } else if (p.target && p.target.isEquivalentTo(QuantumState.One)) {
                targetLabel.innerText = "Target: 🟠 Yellow Mode (1)";
            } else if (p.target && p.target.isEquivalentTo(QuantumState.Plus)) {
                targetLabel.innerText = "Target: 🟣 50/50 In-Sync Blend";
            } else if (p.target && p.target.isEquivalentTo(QuantumState.Minus)) {
                targetLabel.innerText = "Target: 🟣 50/50 Mirrored Blend";
            } else {
                targetLabel.innerText = `Target: ${p.target ? p.target.label : 'Custom'}`;
            }
        }

        let fidelityLabel = document.getElementById('console-fidelity-label');
        if (fidelityLabel) {
            fidelityLabel.innerText = isSolved
                ? "Match: 100% (READY TO ACTIVATE!)"
                : `Match: ${(fidelity * 100).toFixed(0)}% (Adjust Switches)`;
            fidelityLabel.style.color = isSolved ? "var(--green)" : (fidelity > 0.5 ? "var(--amber)" : "var(--red)");
        }
        document.getElementById('console-fidelity-meter').style.width = `${fidelity * 100}%`;
        document.getElementById('console-fidelity-meter').style.background = isSolved ? "var(--green)" : "var(--amber)";

        // === SIMPLE BEGINNER CARDS: Lantern Now + Barrier Needs ===
        let phaseDeg2 = this.sim.state.relativePhaseDegrees;
        let isMirrored2 = Math.abs(phaseDeg2) > 90;

        // --- Your Lantern Now ---
        let lanternIcon = document.getElementById('simple-lantern-icon');
        let lanternName = document.getElementById('simple-lantern-name');
        let lanternDesc = document.getElementById('simple-lantern-desc');
        if (lanternIcon) {
            if (p0 > 0.95) {
                lanternIcon.innerText = '🔵'; lanternName.innerText = 'Blue Light'; lanternDesc.innerText = '100% Blue · 0% Yellow';
            } else if (p1 > 0.95) {
                lanternIcon.innerText = '🟡'; lanternName.innerText = 'Yellow Light'; lanternDesc.innerText = '0% Blue · 100% Yellow';
            } else if (Math.abs(p0 - 0.5) < 0.08) {
                lanternIcon.innerText = '🟣'; lanternName.innerText = isMirrored2 ? 'Mirrored Blend' : 'Even Blend';
                lanternDesc.innerText = 'Blue 50% · Yellow 50%';
            } else {
                lanternIcon.innerText = '🔮'; lanternName.innerText = 'Mixed Light';
                lanternDesc.innerText = 'Blue ' + Math.round(p0*100) + '% · Yellow ' + Math.round(p1*100) + '%';
            }
        }

        // --- Barrier Needs ---
        let targetIcon = document.getElementById('simple-target-icon');
        let targetName = document.getElementById('simple-target-name');
        let targetDesc = document.getElementById('simple-target-desc');
        if (targetIcon) {
            if (p.target.isEquivalentTo(QuantumState.Zero)) {
                targetIcon.innerText = '🔵'; targetName.innerText = 'Blue Light'; targetDesc.innerText = '100% Blue · 0% Yellow';
            } else if (p.target.isEquivalentTo(QuantumState.One)) {
                targetIcon.innerText = '🟡'; targetName.innerText = 'Yellow Light'; targetDesc.innerText = '0% Blue · 100% Yellow';
            } else if (p.target.isEquivalentTo(QuantumState.Plus)) {
                targetIcon.innerText = '🟣'; targetName.innerText = 'Even Blend'; targetDesc.innerText = 'Blue 50% · Yellow 50%';
            } else if (p.target.isEquivalentTo(QuantumState.Minus)) {
                targetIcon.innerText = '🟣'; targetName.innerText = 'Mirrored Blend'; targetDesc.innerText = 'Blue 50% · Yellow 50% (flipped wave)';
            } else {
                targetIcon.innerText = '🔮'; targetName.innerText = 'Custom'; targetDesc.innerText = p.target.label;
            }
        }

        // --- Match Status Bar ---
        let matchBar = document.getElementById('simple-match-bar');
        let matchText = document.getElementById('simple-match-text');
        if (matchBar && matchText) {
            if (isSolved) {
                matchBar.style.borderColor = '#22c55e';
                matchText.style.color = '#22c55e';
                matchText.innerHTML = '✅ <b>Match! Your lantern matches the barrier.</b> Click ⚡ OPEN THE BARRIER below!';
            } else if (fidelity > 0.5) {
                matchBar.style.borderColor = '#f59e0b';
                matchText.style.color = '#f59e0b';
                matchText.innerHTML = '🔶 Getting closer... adjust your lantern to reach 100% match.';
            } else {
                matchBar.style.borderColor = '#ef4444';
                matchText.style.color = '#ef4444';
                matchText.innerHTML = '❌ <b>Not matching yet</b> — use the buttons below to change your lantern.';
            }
        }

        let lockInBtn = document.getElementById('btn-lock-in');
        if (lockInBtn) {
            if (isSolved) {
                lockInBtn.innerText = "⚡ ACTIVATE CITY MACHINE (READY!) 🟢 [Space]";
                lockInBtn.style.background = "linear-gradient(135deg, #16a34a, #22c55e)";
            } else {
                lockInBtn.innerText = "⚡ ACTIVATE CITY MACHINE [Space / Enter]";
                lockInBtn.style.background = "";
            }
        }

        this.renderHints();
        this.renderBlochSphere();
        this.updateConsoleQuantumDiagram();
    }

    renderBlochSphere() {
        if (!this.blochCtx || !this.blochCanvas) return;
        let ctx = this.blochCtx;
        let w = this.blochCanvas.width;
        let h = this.blochCanvas.height;
        let cx = w / 2;
        let cy = h / 2;
        let R = Math.min(w, h) * 0.38;

        ctx.clearRect(0, 0, w, h);

        // Outer sphere circle
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        // Equator ellipse
        ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, R, R * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Vertical meridian
        ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * 0.32, R, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Layman colored poles & equator markers
        // North Pole: Blue Mode |0⟩
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(cx, cy - R, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.fillText("🔵 Blue (0)", cx - 28, cy - R - 8);

        // South Pole: Yellow Mode |1⟩
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(cx, cy + R, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("🟡 Yellow (1)", cx - 32, cy + R + 18);

        // Equator: 50/50 Mix
        ctx.fillStyle = "#c084fc";
        ctx.fillText("🟣 50/50 In-Sync", cx + R + 6, cy + 4);
        ctx.fillText("🟣 50/50 Mirrored", cx - R - 100, cy + 4);

        // Project State Vector (x, y, z)
        let coords = this.sim.state.blochCoordinates;
        let yaw = 0.55;
        let pitch = 0.32;

        let px = cx + (coords.x * Math.cos(yaw) - coords.y * Math.sin(yaw)) * R;
        let py = cy - coords.z * R * 0.88 + (coords.x * Math.sin(yaw) + coords.y * Math.cos(yaw)) * R * Math.sin(pitch);

        // Choose color based on state
        let needleColor = (this.sim.state.prob0 > 0.85) ? "#38bdf8"
            : (this.sim.state.prob1 > 0.85) ? "#fbbf24"
            : "#c084fc";

        // Draw Compass Vector Arrow
        ctx.strokeStyle = needleColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Vector tip
        ctx.fillStyle = needleColor;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // State text label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Inter, sans-serif";
        ctx.fillText(this.sim.state.label, px + 8, py - 4);
    }

    updateConsoleQuantumDiagram() {
        if (!this.activePuzzle) return;
        const diag = PUZZLE_DIAGRAMS[this.activePuzzle.id] || PUZZLE_DIAGRAMS['ch1_p1'];

        let hist = Array.isArray(this.sim.history) ? this.sim.history : [];
        let gateSteps = hist.filter(h => h && !h.isMeasurement);
        let isTargetMatched = this.sim.state.isEquivalentTo(this.activePuzzle.target);

        // 1. Top formula screen (dynamically aligned with selected option / state)
        const formulaEl = document.getElementById('console-diagram-formula');
        if (formulaEl) {
            if (gateSteps.length === 0) {
                let p0 = this.sim.state.prob0;
                let p1 = this.sim.state.prob1;
                if (p0 > 0.85) {
                    formulaEl.innerText = `|ψ⟩ = |0⟩ = [1, 0]ᵀ (Pure Blue Light) • Target: ${this.activePuzzle.target.label}`;
                } else if (p1 > 0.85) {
                    formulaEl.innerText = `|ψ⟩ = |1⟩ = [0, 1]ᵀ (Pure Yellow Light) • Target: ${this.activePuzzle.target.label}`;
                } else if (this.sim.state.label === '|+⟩' || (Math.abs(p0 - 0.5) < 0.1 && Math.abs(this.sim.state.phase) < 0.1)) {
                    formulaEl.innerText = `|ψ⟩ = |+⟩ = 1/√2(|0⟩ + |1⟩) (50/50 Mix) • Target: ${this.activePuzzle.target.label}`;
                } else if (this.sim.state.label === '|−⟩') {
                    formulaEl.innerText = `|ψ⟩ = |−⟩ = 1/√2(|0⟩ - |1⟩) (Mirrored Mix) • Target: ${this.activePuzzle.target.label}`;
                } else {
                    formulaEl.innerText = `|ψ⟩ = ${this.sim.state.label} • Target: ${this.activePuzzle.target.label}`;
                }
            } else {
                let lastGate = gateSteps[gateSteps.length - 1];
                let sym = lastGate.symbol;
                if (sym === 'X') {
                    formulaEl.innerText = "X|0⟩ = |1⟩     X|1⟩ = |0⟩     X² = I (Bit-Flip)";
                } else if (sym === 'H') {
                    formulaEl.innerText = "H|0⟩ = |+⟩     H|1⟩ = |−⟩     H² = I (Blender)";
                } else if (sym === 'Z') {
                    formulaEl.innerText = "Z|0⟩ = |0⟩     Z|1⟩ = -|1⟩    Z|+⟩ = |−⟩ (Phase Mirror)";
                } else {
                    formulaEl.innerText = diag.formula;
                }
            }
        }

        const sublabelEl = document.getElementById('console-diagram-sublabel');
        if (sublabelEl) {
            sublabelEl.innerText = `${this.activePuzzle.title} • Qubit Wire [State: ${this.sim.state.label}]`;
        }

        // 2. Circuit SVG Container: Dynamic live wire (auto-updates as state or gates change)
        const svgContainer = document.getElementById('console-circuit-svg-container');
        if (svgContainer) {
            if (gateSteps.length === 0) {
                // Dynamically render interactive wire reflecting current prepared state (Blue vs Yellow)
                let p0 = this.sim.state.prob0;
                let p1 = this.sim.state.prob1;
                let isBlue = p0 > 0.85;
                let isYellow = p1 > 0.85;
                let wireColor = isBlue ? '#38bdf8' : isYellow ? '#fbbf24' : '#c084fc';
                let stateLabel = isBlue ? '|0⟩' : isYellow ? '|1⟩' : this.sim.state.label;
                let stateDescriptor = isBlue ? 'BLUE (0)' : isYellow ? 'YELLOW (1)' : '50/50 BLEND';

                let totalWidth = 460;
                let svg = `<svg width="100%" height="60" viewBox="0 0 ${totalWidth} 60">`;
                // Main input wire
                svg += `<line x1="20" y1="35" x2="250" y2="35" stroke="${wireColor}" stroke-width="3"/>`;
                svg += `<circle cx="20" cy="35" r="4" fill="${wireColor}"/>`;
                svg += `<text x="32" y="24" fill="${wireColor}" font-size="13" font-weight="bold">${stateLabel} ${stateDescriptor}</text>`;

                if (isTargetMatched) {
                    svg += `<line x1="250" y1="35" x2="310" y2="35" stroke="#22c55e" stroke-width="3"/>`;
                    svg += `<circle cx="310" cy="35" r="4" fill="#22c55e"/>`;
                    svg += `<text x="325" y="40" fill="#22c55e" font-size="14" font-weight="bold">✔ READY TO ACTIVATE</text>`;
                } else {
                    svg += `<line x1="250" y1="35" x2="300" y2="35" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>`;
                    let targetLabel = this.activePuzzle.target.label;
                    let targetColor = (this.activePuzzle.target.prob0 > 0.85) ? '#38bdf8' : (this.activePuzzle.target.prob1 > 0.85) ? '#fbbf24' : '#c084fc';
                    svg += `<text x="312" y="32" fill="#f59e0b" font-size="12" font-weight="bold">Target: <tspan fill="${targetColor}">${targetLabel}</tspan></text>`;
                    let actionHint = (this.activePuzzle.allowedGates && this.activePuzzle.allowedGates.length > 0)
                        ? 'Apply gate to match'
                        : (isBlue ? 'Switch to Yellow' : 'Switch to Blue');
                    svg += `<text x="312" y="47" fill="#94a3b8" font-size="11">${actionHint}</text>`;
                }
                svg += `</svg>`;
                svgContainer.innerHTML = svg;
            } else {
                // Dynamically build interactive wire reflecting actual applied gates
                let startState = (gateSteps[0] && gateSteps[0].before) ? gateSteps[0].before : QuantumState.Zero;
                let startColor = (startState.prob0 > 0.85) ? '#38bdf8' : (startState.prob1 > 0.85) ? '#fbbf24' : '#c084fc';
                let totalWidth = Math.max(460, 100 + gateSteps.length * 110 + 150);
                let svg = `<svg width="100%" height="60" viewBox="0 0 ${totalWidth} 60">`;
                let currX = 20;

                // Input wire & start label
                svg += `<line x1="${currX}" y1="35" x2="${currX + 60}" y2="35" stroke="${startColor}" stroke-width="3"/>`;
                svg += `<circle cx="${currX}" cy="35" r="4" fill="${startColor}"/>`;
                svg += `<text x="${currX + 8}" y="24" fill="${startColor}" font-size="12" font-weight="bold">${startState.label}</text>`;
                currX += 60;

                gateSteps.forEach((step, idx) => {
                    let sym = step.symbol || (step.gate && step.gate.symbol) || 'U';
                    let strokeColor = sym === 'X' ? '#60a5fa' : sym === 'H' ? '#c084fc' : sym === 'Z' ? '#4ade80' : '#f59e0b';
                    svg += `<rect x="${currX}" y="17" width="46" height="36" fill="#0b1329" stroke="${strokeColor}" stroke-width="2" rx="5"/>`;
                    svg += `<text x="${currX + 23}" y="40" fill="${strokeColor}" font-size="15" font-weight="bold" text-anchor="middle">${sym}</text>`;
                    currX += 46;

                    let wireOutColor = (step.after.prob0 > 0.85) ? '#38bdf8' : (step.after.prob1 > 0.85) ? '#fbbf24' : '#c084fc';
                    let nextX = currX + 65;
                    svg += `<line x1="${currX}" y1="35" x2="${nextX}" y2="35" stroke="${wireOutColor}" stroke-width="3"/>`;
                    svg += `<text x="${currX + 8}" y="24" fill="${wireOutColor}" font-size="12" font-weight="bold">${step.after.label}</text>`;
                    currX = nextX;
                });

                if (isTargetMatched) {
                    svg += `<circle cx="${currX}" cy="35" r="4" fill="#22c55e"/>`;
                    svg += `<text x="${currX + 10}" y="40" fill="#22c55e" font-size="14" font-weight="bold">✔ TARGET MATCHED</text>`;
                } else {
                    svg += `<circle cx="${currX}" cy="35" r="3.5" fill="#f59e0b"/>`;
                    let targetLabel = this.activePuzzle.target.label;
                    let targetColor = (this.activePuzzle.target.prob0 > 0.85) ? '#38bdf8' : (this.activePuzzle.target.prob1 > 0.85) ? '#fbbf24' : '#c084fc';
                    svg += `<text x="${currX + 10}" y="31" fill="#f59e0b" font-size="11" font-weight="bold">Target: <tspan fill="${targetColor}">${targetLabel}</tspan></text>`;
                    svg += `<text x="${currX + 10}" y="46" fill="#94a3b8" font-size="10">Apply next gate or Undo</text>`;
                }
                svg += `</svg>`;
                svgContainer.innerHTML = svg;
            }
        }

        // 3. Mini Bloch Canvas (User Attachment 1 & 2)
        const blochCanvas2 = document.getElementById('console-bloch-canvas-2');
        if (blochCanvas2) {
            let coords = this.sim.state.blochCoordinates;
            let lastGate = gateSteps.length > 0 ? gateSteps[gateSteps.length - 1] : null;
            let axis = null, arc = null;
            if (lastGate && lastGate.symbol === 'H') { axis = 'diag'; arc = 'diag_rot'; }
            else if (lastGate && lastGate.symbol === 'Z') { axis = 'z'; arc = 'z_rot'; }
            else if (lastGate && lastGate.symbol === 'X') { axis = 'x'; arc = 'x_rot'; }
            else {
                axis = (this.sim.state.prob0 > 0.85 || this.sim.state.prob1 > 0.85) ? 'z' : 'x';
            }

            drawBlochSphereCanvas(blochCanvas2, {
                vec: [coords.x, coords.y, coords.z],
                axis: axis,
                arc: arc
            });
        }

        const stateBadge = document.getElementById('console-bloch-state-badge');
        if (stateBadge) {
            stateBadge.innerText = `|ψ⟩ = ${this.sim.state.label}`;
            stateBadge.style.color = (this.sim.state.prob0 > 0.85) ? '#38bdf8'
                : (this.sim.state.prob1 > 0.85) ? '#fbbf24'
                : '#ec4899';
        }

        // 4. Matrix & Operator metadata: Aligns with selected option
        const opNameEl = document.getElementById('console-diagram-op-name');
        const rotAxisEl = document.getElementById('console-diagram-rot-axis');
        const matrixBoxEl = document.getElementById('console-diagram-matrix-box');
        const descTextEl = document.getElementById('console-diagram-desc-text');

        if (gateSteps.length === 0) {
            let p0 = this.sim.state.prob0;
            let p1 = this.sim.state.prob1;
            let isMatched = this.sim.state.isEquivalentTo(this.activePuzzle.target);
            if (p0 > 0.85) {
                if (opNameEl) opNameEl.innerText = "State Prep: |0⟩ (Blue Light)";
                if (rotAxisEl) rotAxisEl.innerText = "Axis: +Z (North Pole)";
                if (matrixBoxEl) matrixBoxEl.innerText = "|0⟩ = [ 1 ]\n     [ 0 ]";
                if (descTextEl) descTextEl.innerText = `Prepared ground state |0⟩ (100% Blue). Target: ${this.activePuzzle.target.label} ${isMatched ? '(MATCHED ✔)' : '(Mismatch)'}`;
            } else if (p1 > 0.85) {
                if (opNameEl) opNameEl.innerText = "State Prep: |1⟩ (Yellow Light)";
                if (rotAxisEl) rotAxisEl.innerText = "Axis: -Z (South Pole)";
                if (matrixBoxEl) matrixBoxEl.innerText = "|1⟩ = [ 0 ]\n     [ 1 ]";
                if (descTextEl) descTextEl.innerText = `Prepared excited state |1⟩ (100% Yellow). Target: ${this.activePuzzle.target.label} ${isMatched ? '(MATCHED ✔)' : '(Mismatch)'}`;
            } else {
                if (opNameEl) opNameEl.innerText = `State Prep: ${this.sim.state.label} (50/50 Mix)`;
                if (rotAxisEl) rotAxisEl.innerText = "Axis: Equator (X/Y)";
                if (matrixBoxEl) matrixBoxEl.innerText = "|+⟩ = 1/√2 * [ 1 ]\n             [ 1 ]";
                if (descTextEl) descTextEl.innerText = `Prepared 50/50 superposition blend of Blue and Yellow. Target: ${this.activePuzzle.target.label} ${isMatched ? '(MATCHED ✔)' : ''}`;
            }
        } else {
            let lastGate = gateSteps[gateSteps.length - 1];
            let sym = lastGate.symbol;
            if (sym === 'X') {
                if (opNameEl) opNameEl.innerText = "Operator: [X] Pauli-X (Flip Switch)";
                if (rotAxisEl) rotAxisEl.innerText = "Axis: X-Axis (180° Flip)";
                if (matrixBoxEl) matrixBoxEl.innerText = "X = [ 0   1 ]\n    [ 1   0 ]";
                if (descTextEl) descTextEl.innerText = "Bit-flip operator rotates qubit 180° around X-axis. Swaps Blue (|0⟩) and Yellow (|1⟩).";
            } else if (sym === 'H') {
                if (opNameEl) opNameEl.innerText = "Operator: [H] Hadamard (Quantum Blender)";
                if (rotAxisEl) rotAxisEl.innerText = "Axis: Diagonal X+Z (180°)";
                if (matrixBoxEl) matrixBoxEl.innerText = "H = 1/√2 * [ 1   1 ]\n         [ 1  -1 ]";
                if (descTextEl) descTextEl.innerText = "Hadamard blender creates 50/50 superposition between Blue and Yellow, or recombines interference waves.";
            } else if (sym === 'Z') {
                if (opNameEl) opNameEl.innerText = "Operator: [Z] Pauli-Z (Phase Mirror)";
                if (rotAxisEl) rotAxisEl.innerText = "Axis: Z-Axis (180° Phase Flip)";
                if (matrixBoxEl) matrixBoxEl.innerText = "Z = [ 1   0 ]\n    [ 0  -1 ]";
                if (descTextEl) descTextEl.innerText = "Phase-flip operator mirrors wave polarity across Z-axis without changing Blue/Yellow color probabilities.";
            } else {
                if (opNameEl) opNameEl.innerText = `Operator: [${sym}] ${lastGate.name || 'Gate'}`;
                if (rotAxisEl) rotAxisEl.innerText = "Axis: Unitary";
                if (matrixBoxEl) matrixBoxEl.innerText = diag.matrix || "U = [ ... ]";
                if (descTextEl) descTextEl.innerText = diag.matrixDesc || "";
            }
        }
    }

    showActivationDiagram(puzzleId, explanation) {
        const diag = PUZZLE_DIAGRAMS[puzzleId] || PUZZLE_DIAGRAMS['ch1_p1'];
        const modal = document.getElementById('activation-diagram-modal');
        if (!modal) {
            this.handlePuzzleUnlocked(puzzleId);
            this.showDialogue("Lumi", explanation);
            return;
        }

        // Populate elements
        const titleEl = document.getElementById('act-modal-title');
        if (titleEl) titleEl.innerText = `${diag.title}`;

        const formulaEl = document.getElementById('act-modal-formula');
        if (formulaEl) formulaEl.innerText = diag.formula;

        const circuitSvgEl = document.getElementById('act-modal-circuit-svg');
        if (circuitSvgEl) circuitSvgEl.innerHTML = diag.circuitSvg;

        const matrixContentEl = document.getElementById('act-modal-matrix-content');
        if (matrixContentEl) matrixContentEl.innerText = `${diag.matrix}\n\n${diag.matrixDesc}`;

        const machineEffectEl = document.getElementById('act-modal-machine-effect');
        if (machineEffectEl) machineEffectEl.innerText = diag.machineEffect;

        // Render Step-by-Step Bloch Spheres row (Attachment 2 style: Start -> Apply Gate -> Apply Gate ...)
        const stepsRow = document.getElementById('act-modal-bloch-steps-row');
        if (stepsRow) {
            stepsRow.innerHTML = '';
            diag.steps.forEach((step) => {
                const card = document.createElement('div');
                card.style.cssText = "display: flex; flex-direction: column; align-items: center; background: #030712; border: 1.5px solid rgba(56, 189, 248, 0.35); border-radius: 10px; padding: 12px 16px; min-width: 145px; box-shadow: 0 4px 20px rgba(0,0,0,0.6);";

                const stepHeader = document.createElement('div');
                stepHeader.style.cssText = "font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 4px; text-align: center;";
                stepHeader.innerText = step.label;

                const badge = document.createElement('div');
                badge.style.cssText = "font-size: 12px; font-family: monospace; font-weight: bold; color: #ec4899; margin-bottom: 8px;";
                badge.innerText = `State: ${step.stateLabel}`;

                const canvas = document.createElement('canvas');
                canvas.width = 130;
                canvas.height = 130;
                canvas.style.cssText = "width: 130px; height: 130px; border-radius: 6px; background: #000000;";

                card.appendChild(stepHeader);
                card.appendChild(badge);
                card.appendChild(canvas);
                stepsRow.appendChild(card);

                // Render Bloch sphere
                setTimeout(() => {
                    drawBlochSphereCanvas(canvas, step);
                }, 10);
            });
        }

        // Show modal with animation
        modal.style.display = 'flex';
        sounds.playGateOpen();

        // Handle proceed
        const continueBtn = document.getElementById('act-modal-continue-btn');
        let proceedHandled = false;

        const handleProceed = () => {
            if (proceedHandled) return;
            proceedHandled = true;
            modal.style.display = 'none';
            window.removeEventListener('keydown', keyHandler);

            // Execute the world unlock and dialogue
            this.handlePuzzleUnlocked(puzzleId);
            this.showDialogue("Lumi", explanation);
        };

        const keyHandler = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                handleProceed();
            }
        };

        if (continueBtn) {
            continueBtn.onclick = handleProceed;
            continueBtn.focus();
        }
        window.addEventListener('keydown', keyHandler);
    }

    updateHUD() {
        if (!this.activePuzzle) return;
        document.getElementById('hud-chapter-tag').innerText = `Chapter ${this.activePuzzle.chapter}: ${this.activePuzzle.chapterTitle}`;
        document.getElementById('hud-district-title').innerText = this.activePuzzle.title;
        document.getElementById('hud-objective-desc').innerText = this.activePuzzle.objective;

        document.getElementById('hud-state-label').innerText = this.sim.state.label;
        let p0 = this.sim.state.prob0;
        let p1 = this.sim.state.prob1;
        document.getElementById('hud-p0-val').innerText = `${(p0 * 100).toFixed(0)}%`;
        document.getElementById('hud-p1-val').innerText = `${(p1 * 100).toFixed(0)}%`;
        document.getElementById('hud-meter-0').style.width = `${p0 * 100}%`;
        document.getElementById('hud-meter-1').style.width = `${p1 * 100}%`;
        document.getElementById('hud-phase-val').innerText = `${this.sim.state.relativePhaseDegrees.toFixed(0)}°`;
        document.getElementById('hud-circuit-text').innerText = this.sim.toCircuitString();

        // Update Lantern 3D visuals
        if (this.lanternLight && this.lanternOrb) {
            let blended = new THREE.Color(0x22d3ee).lerp(new THREE.Color(0xf59e0b), p1);
            this.lanternLight.color = blended;
            this.lanternOrb.material.color = blended;
            this.lanternOrb.material.emissive = blended;
        }

        this.updateTutorialGuide();
    }

    updateTutorialGuide() {
        let badgeEl = document.getElementById('action-step-badge');
        let counterEl = document.getElementById('action-step-counter');
        let textEl = document.getElementById('action-step-text');
        let hintEl = document.getElementById('action-step-hint');
        if (hintEl) {
            hintEl.style.display = 'none';
            hintEl.innerHTML = '';
        }
        if (!badgeEl || !textEl) return;

        let pid = this.activePuzzle ? this.activePuzzle.id : 'ch1_p1';
        let ch = this.activePuzzle ? this.activePuzzle.chapter : 1;

        if (counterEl) counterEl.innerText = 'Ch.' + ch + ' — ' + (this.activePuzzle ? this.activePuzzle.title : '');

        // If puzzle console is currently OPEN — show targeted step instructions
        if (this.isUIOpen && this.activePuzzle) {
            let p = this.activePuzzle;
            let isSolved = this.sim.state.isEquivalentTo(p.target);

            if (isSolved) {
                badgeEl.innerText = 'READY TO OPEN!';
                textEl.innerHTML = '✅ <b>The lantern matches what the barrier needs!</b> Now click <b>"⚡ ACTIVATE CITY MACHINE"</b> to open the physical barrier in the map.';
                hintEl.innerHTML = '🔓 After activating, the barrier (door/bridge/gate) will open with a sound and smoke effect.';
                return;
            }

            // Per-puzzle open-console instructions
            if (pid === 'ch1_p1') {
                badgeEl.innerText = 'STEP: SET STATE';
                textEl.innerHTML = '👉 The barrier needs <b>Blue (0)</b>. Click <b>"🔵 Set to Blue (0 / Reset)"</b> button, then click <b>"⚡ ACTIVATE CITY MACHINE"</b>.';
                hintEl.innerHTML = '💡 Blue (0) = 100% Blue Light. See the Blue gauge — it should reach 100%.';
            } else if (pid === 'ch1_p2') {
                badgeEl.innerText = 'STEP: SET STATE';
                textEl.innerHTML = '👉 The barrier needs <b>Yellow (1)</b>. Click <b>"🟡 Set to Yellow (1 / On)"</b>, then click <b>"⚡ ACTIVATE CITY MACHINE"</b>.';
                hintEl.innerHTML = '💡 Yellow (1) = 100% Yellow Light. The Yellow gauge must reach 100%.';
            } else if (pid === 'ch2_p1') {
                badgeEl.innerText = 'STEP: FLIP SWITCH';
                textEl.innerHTML = '👉 The lift needs <b>Yellow (1)</b>. Your lantern is at Blue (0). Click <b>[X] FLIP SWITCH</b> once to flip Blue to Yellow, then click <b>ACTIVATE</b>.';
                hintEl.innerHTML = '💡 [X] Flip Switch works like a light switch — it flips the lantern from Blue (0) to Yellow (1) or back.';
            } else if (pid === 'ch2_p2') {
                badgeEl.innerText = 'STEP: FLIP TWICE';
                textEl.innerHTML = '👉 You start at Yellow (1). Click <b>[X] FLIP SWITCH</b> once — this returns you to Blue (0). Flipping twice = back to start!';
                hintEl.innerHTML = '💡 Quantum switches are reversible. Clicking [X] twice always brings you back to where you started.';
            } else if (pid === 'ch3_p1') {
                badgeEl.innerText = 'STEP: BLEND';
                textEl.innerHTML = '👉 The bridge needs a <b>50/50 mix</b>. Click <b>[H] BLENDER</b> once — this creates exactly 50% Blue + 50% Yellow at the same time!';
                hintEl.innerHTML = '💡 After [H]: check both gauges — they should BOTH show 50%. This is called "Superposition".';
            } else if (pid === 'ch3_p2') {
                badgeEl.innerText = 'STEP: BLEND AGAIN';
                textEl.innerHTML = '👉 Click <b>[H] BLENDER</b> a second time. The two 50% beams recombine cleanly back to 100% Blue (0)!';
                hintEl.innerHTML = '💡 Blending twice reverses itself — the waves cancel each other and the lantern returns to pure Blue.';
            } else if (pid === 'ch4_p1') {
                badgeEl.innerText = 'STEP: FLIP WAVE';
                textEl.innerHTML = '👉 Click <b>[Z] MIRROR</b>. This flips the wave\'s vibration direction (phase) WITHOUT changing the Blue/Yellow brightness at all.';
                hintEl.innerHTML = '💡 After [Z]: Blue gauge stays 50%, Yellow gauge stays 50%, but the "Wave Vibration" angle flips to 180°.';
            } else if (pid === 'ch4_p2') {
                badgeEl.innerText = 'STEP: WAVE TRICK';
                textEl.innerHTML = '👉 Apply <b>[H]</b> → then <b>[Z]</b> → then <b>[H]</b>. This converts Blue (0) to Yellow (1) without using [X]!';
                hintEl.innerHTML = '💡 H creates a 50/50 mix, Z flips its polarity, then H recombines the waves into all Yellow!';
            } else if (pid === 'ch5_p1') {
                badgeEl.innerText = 'ORDER MATTERS';
                textEl.innerHTML = '👉 Click <b>[X] FLIP SWITCH</b> first, then <b>[H] BLENDER</b>. Order matters — this makes the Mirrored Blend.';
                hintEl.innerHTML = '💡 Like putting on socks then shoes! Doing it in the wrong order gives a different result.';
            } else if (pid === 'ch5_p2') {
                badgeEl.innerText = 'ORDER MATTERS';
                textEl.innerHTML = '👉 Click <b>[H] BLENDER</b> first, then <b>[X] FLIP SWITCH</b>. This order gives the In-Sync Blend — different from the last puzzle!';
                hintEl.innerHTML = '💡 Compare: [X] then [H] gave Mirrored Blend. [H] then [X] gives In-Sync Blend. Same tools, different order = different result!';
            } else if (pid === 'ch6_p1') {
                badgeEl.innerText = 'UNDO VAULT LOCK';
                textEl.innerHTML = '👉 The vault is locked with [H]→[Z]→[X]. Undo it BACKWARDS: click <b>[X]</b> → then <b>[Z]</b> → then <b>[H]</b>.';
                hintEl.innerHTML = '💡 Always undo in reverse order — undo the LAST thing first! Or click "↩ Undo Last Gate" three times.';
            } else if (pid === 'ch7_p1') {
                badgeEl.innerText = 'OBSERVE COLLAPSE';
                textEl.innerHTML = '👉 Click <b>[H] BLENDER</b> to create a 50/50 mix. Then use the Measurement Station nearby to scan the qubit.';
                hintEl.innerHTML = '💡 Scanning (measuring) snaps the 50/50 wave into one definite outcome — and it cannot be undone after!';
            } else if (pid === 'ch8_final') {
                badgeEl.innerText = 'FINAL PUZZLE!';
                textEl.innerHTML = '👉 Apply the harmonic key: <b>[H]</b> → <b>[Z]</b> → <b>[H]</b>. This converts Blue (0) into Yellow (1) to reignite the Echo Core!';
                hintEl.innerHTML = '💡 You learned this wave trick in Chapter 4! H-Z-H turns 0 into 1 using wave interference.';
            } else {
                badgeEl.innerText = 'CALIBRATE';
                textEl.innerHTML = '👉 Apply tools to reach <b>' + p.target.label + '</b>, then click <b>ACTIVATE</b>.';
                hintEl.innerHTML = '💡 ' + (p.hints && p.hints[0] ? p.hints[0] : 'Use the Reveal Hint button for step-by-step help.');
            }
        } else {
            // Outside console — show navigation instructions
            if (pid === 'ch1_p1') {
                if (this.nearbyInteractable && this.nearbyInteractable.userData && this.nearbyInteractable.userData.puzzleId === 'ch1_p1') {
                    badgeEl.innerText = 'INTERACT NOW';
                    textEl.innerHTML = '👉 Press <b>[E]</b> or click <b>"INTERACT"</b> to open Terminal Alpha!';
                    hintEl.innerHTML = '⚡ You are right next to Terminal Alpha!';
                } else {
                    badgeEl.innerText = 'START HERE';
                    textEl.innerHTML = '👉 Walk <b>LEFT</b> to <b>Terminal Alpha</b> — the glowing blue pillar with ◀ on the sign.';
                    hintEl.innerHTML = '🎮 Press <b>[A]</b> to walk left. Press <b>[E]</b> to interact when you get there.';
                }
            } else if (pid === 'ch1_p2') {
                if (this.nearbyInteractable && this.nearbyInteractable.userData && this.nearbyInteractable.userData.puzzleId === 'ch1_p2') {
                    badgeEl.innerText = 'INTERACT NOW';
                    textEl.innerHTML = '👉 Press <b>[E]</b> or click <b>"INTERACT"</b> to open Terminal Beta!';
                    hintEl.innerHTML = '⚡ You are right next to Terminal Beta!';
                } else {
                    badgeEl.innerText = 'RESCUE LUMI';
                    textEl.innerHTML = '👉 Walk <b>RIGHT</b> to <b>Terminal Beta</b> — the yellow glowing pillar with ▶ on the sign.';
                    hintEl.innerHTML = '🎮 Press <b>[D]</b> to walk right. Terminal Beta will open the gate and free drone Lumi!';
                }
            } else if (pid === 'ch2_p1') {
                if (this.nearbyInteractable && this.nearbyInteractable.userData && this.nearbyInteractable.userData.puzzleId === 'ch2_p1') {
                    badgeEl.innerText = 'INTERACT NOW';
                    textEl.innerHTML = '👉 Press <b>[E]</b> or click <b>"INTERACT"</b> to open the Lift Console!';
                    hintEl.innerHTML = '⚡ You are right next to the Hydraulic Lift!';
                } else {
                    badgeEl.innerText = 'FIND LIFT';
                    textEl.innerHTML = '👉 Walk forward to the <b>Hydraulic Lift</b> — press [E] to open its console.';
                    hintEl.innerHTML = '⚡ Flip to Yellow (1) with [X] to send the lift UP. Then ride it to the upper terrace!';
                }
            } else if (pid === 'ch2_p2') {
                if (this.nearbyInteractable && this.nearbyInteractable.userData && this.nearbyInteractable.userData.puzzleId === 'ch2_p2') {
                    badgeEl.innerText = 'INTERACT NOW';
                    textEl.innerHTML = '👉 Press <b>[E]</b> or click <b>"INTERACT"</b> to open the Upper Gate Console!';
                    hintEl.innerHTML = '⚡ You are right next to the Upper Security Gate!';
                } else {
                    badgeEl.innerText = 'UPPER GATE';
                    textEl.innerHTML = '👉 Ride the lift up, then walk to the <b>Upper Security Gate</b> console.';
                    hintEl.innerHTML = '⚡ Lantern is Yellow (1). Gate needs Blue (0) — click [X] to flip back!';
                }
            } else if (pid === 'ch3_p1' || pid === 'ch3_p2') {
                badgeEl.innerText = 'DISTRICT 3';
                textEl.innerHTML = '👉 Walk through to <b>District 3 — Twin-Light Garden</b> and find the purple console!';
                hintEl.innerHTML = '⚡ Press [E] when the console glows to open it.';
            } else {
                badgeEl.innerText = 'EXPLORE';
                textEl.innerHTML = '👉 Navigate to: <b>' + (this.activePuzzle ? this.activePuzzle.title : 'next terminal') + '</b>';
                hintEl.innerHTML = '🎯 Barrier to unlock: <b>' + (this.activePuzzle ? (this.activePuzzle.machineName || this.activePuzzle.title) : '') + '</b>';
            }
        }
    }

    showToast(msg) {
        let toast = document.getElementById('banner-toast');
        toast.innerHTML = msg;
        toast.style.display = 'block';
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => { toast.style.display = 'none'; }, 4000);
    }

    showDialogue(speaker, text) {
        let box = document.getElementById('dialogue-box');
        let spkEl = document.getElementById('dialogue-speaker');
        let txtEl = document.getElementById('dialogue-text');
        let poppersBtn = document.getElementById('dialogue-poppers-btn');

        spkEl.className = `dialogue-speaker speaker-${speaker.toLowerCase()}`;
        spkEl.innerText = speaker;
        txtEl.innerText = text;
        box.style.display = 'block';

        // Check if this is the Grand Chapter 8 Victory dialogue (User Attachment 2)
        if (text && (text.includes("🏆 YOU DID IT!") || text.includes("The Echo Core is stable!"))) {
            if (poppersBtn) poppersBtn.style.display = 'inline-block';
            this.launchPartyPoppers(16000);

            // Keep continuous inward cascade going as long as the victory dialogue or modal is open
            if (this.victoryTicker) clearInterval(this.victoryTicker);
            this.victoryTicker = setInterval(() => {
                let dBox = document.getElementById('dialogue-box');
                let vicModal = document.getElementById('victory-celebration-modal');
                let isDiagVisible = dBox && dBox.style.display !== 'none';
                let isModalVisible = vicModal && vicModal.style.display !== 'none';
                if (isDiagVisible || isModalVisible) {
                    this.spawn3DInwardPartyPoppers(2600);
                    if (confetti && confetti.isActive) {
                        confetti.inwardRingBlast(45);
                    }
                } else {
                    clearInterval(this.victoryTicker);
                    this.victoryTicker = null;
                }
            }, 1800);
        } else {
            if (poppersBtn) poppersBtn.style.display = 'none';
        }
    }

    advanceDialogue() {
        let box = document.getElementById('dialogue-box');
        let txtEl = document.getElementById('dialogue-text');
        let wasVictory = txtEl && (txtEl.innerText.includes("🏆 YOU DID IT!") || txtEl.innerText.includes("The Echo Core is stable!"));

        box.style.display = 'none';
        sounds.playClick();

        if (wasVictory) {
            this.showVictoryModal();
        }
    }

    launchPartyPoppers(durationMs = 12000) {
        confetti.start(durationMs);
        this.spawn3DInwardPartyPoppers(durationMs);
    }

    // Party Poppers erupt in 3D along the Great Harmonic Rings and cascade INWARD toward the pinnacle
    spawn3DInwardPartyPoppers(durationMs = 12000) {
        if (!this.confetti3DParticles) this.confetti3DParticles = [];
        if (!this._confetti3DRibbonGeo) {
            this._confetti3DRibbonGeo = new THREE.PlaneGeometry(0.55, 1.45);
        }
        if (!this._confetti3DSquareGeo) {
            this._confetti3DSquareGeo = new THREE.PlaneGeometry(0.65, 0.65);
        }
        if (!this._confetti3DStarGeo) {
            this._confetti3DStarGeo = new THREE.PlaneGeometry(0.42, 0.42);
        }

        const colors = [
            0xf59e0b, 0xfbbf24, 0xffd700, // Golden radiance
            0xec4899, 0xf43f5e, 0xff1493, // Radiant magenta/pink
            0x06b6d4, 0x22d3ee, 0x38bdf8, // Electric cyan
            0x22c55e, 0x10b981, 0x4ade80, // Emerald green
            0xa855f7, 0xc084fc,           // Royal purple
            0xffffff, 0xf8fafc            // Bright diamond white
        ];

        let emitInwardWave = (count = 60) => {
            // Echo Core Pinnacle & Harmonic Ring Coordinates
            // Ring 0: Center (0, 20.0, 240), Radius 13.0, Tube Radius 0.45 (Visible directly framing Mira)
            // Ring 1: Center (0, 23.5, 240), Radius 14.6, Tube Radius 0.45
            for (let i = 0; i < count; i++) {
                let theta = Math.random() * Math.PI * 2;
                let pickRing = Math.random() < 0.72 ? 0 : 1;
                let ringRadius = pickRing === 0 ? 13.0 : 14.6;
                let ringY = pickRing === 0 ? 20.0 : 23.5;

                // Erupt directly along the glowing cyan circular harmonic ring
                let startX = Math.cos(theta) * ringRadius;
                let startZ = 240 + Math.sin(theta) * ringRadius;
                let startY = ringY + (Math.random() - 0.5) * 0.9;

                let color = colors[Math.floor(Math.random() * colors.length)];
                let geoRoll = Math.random();
                let geo = geoRoll < 0.45 ? this._confetti3DRibbonGeo : (geoRoll < 0.80 ? this._confetti3DSquareGeo : this._confetti3DStarGeo);

                let mat = new THREE.MeshBasicMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 1.0,
                    depthWrite: false
                });

                let mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(startX, startY, startZ);
                mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                this.scene.add(mesh);

                // Target: Pinnacle platform center around Mira (0, 16.0, 242)
                let targetX = (Math.random() - 0.5) * 3.6;
                let targetZ = 242 + (Math.random() - 0.5) * 3.6;
                let toX = targetX - startX;
                let toZ = targetZ - startZ;
                let horizDist = Math.hypot(toX, toZ) || 1;

                // Inward velocity towards center + upward pop that arches down
                let inwardSpeed = 4.2 + Math.random() * 4.0;
                let vx = (toX / horizDist) * inwardSpeed + (Math.random() - 0.5) * 1.2;
                let vz = (toZ / horizDist) * inwardSpeed + (Math.random() - 0.5) * 1.2;
                let vy = 1.6 + Math.random() * 2.8; // Initial upward arc from ring

                this.confetti3DParticles.push({
                    mesh: mesh,
                    vx: vx,
                    vy: vy,
                    vz: vz,
                    vRotX: (Math.random() - 0.5) * 0.32,
                    vRotY: (Math.random() - 0.5) * 0.32,
                    vRotZ: (Math.random() - 0.5) * 0.32,
                    age: 0,
                    maxAge: 6.5 + Math.random() * 3.0,
                    isLanded: false
                });
            }
        };

        // Immediate massive 3D inward eruption from the ring!
        emitInwardWave(100);
        setTimeout(() => emitInwardWave(80), 200);
        setTimeout(() => emitInwardWave(60), 450);

        // Continuous cascading inward waves across duration
        let waveCount = Math.floor(durationMs / 380);
        for (let w = 1; w <= waveCount; w++) {
            setTimeout(() => {
                emitInwardWave(36);
            }, w * 380);
        }
    }

    showVictoryModal() {
        let vicModal = document.getElementById('victory-celebration-modal');
        if (vicModal) {
            vicModal.style.display = 'flex';
            this.launchPartyPoppers(16000);
        }
    }

    // -------------------------------------------------------------
    // Layman Level Jump Action
    // -------------------------------------------------------------
    jump() {
        // Plain English: Mira can jump if she is touching solid ground, is alive, and not in a puzzle modal
        if (!this.isGrounded || this.isDead || this.isUIOpen) return;

        // Push Mira up into the air (high, satisfying leap with plenty of power to clear any ledge)
        this.playerVelocityY = 12.0; // Upward jump speed
        this.isGrounded = false;

        // Play jump sound effect
        sounds.playJump();

        // Briefly glow the on-screen jump button
        let btn = document.getElementById('hud-jump-btn');
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 180);
        }
    }

    // -------------------------------------------------------------
    // Layman Level Death and Respawn System
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // Layman Level Safe Checkpoints per District (No Edge Spawning)
    // -------------------------------------------------------------
    getSafeDistrictSpawn() {
        let ch = this.activePuzzle ? this.activePuzzle.chapter : 1;
        switch (ch) {
            case 1: return new THREE.Vector3(0, 0.75, 2.0);    // Harbor Center
            case 2: return new THREE.Vector3(0, 2.75, 42.0);   // Switchworks Plaza
            case 3: return new THREE.Vector3(28, 4.75, 75.0);  // Twin-Light Garden
            case 4: return new THREE.Vector3(55, 7.75, 115.0); // Phase Observatory
            case 5: return new THREE.Vector3(15, 10.25, 145.0);// Echo Bridge
            case 6: return new THREE.Vector3(-45, 11.25, 160.0);// Reversal Vault
            case 7: return new THREE.Vector3(-15, 13.25, 198.0);// Measurement Station
            case 8: return new THREE.Vector3(0, 16.0, 235.0);  // Pinnacle Core
            default: return new THREE.Vector3(0, 0.75, 2.0);
        }
    }

    // -------------------------------------------------------------
    // Layman Level Death and Respawn System
    // -------------------------------------------------------------
    handlePlayerDeath() {
        // Prevent triggering repeatedly while already falling or respawning
        if (this.isDead) return;
        this.isDead = true;
        this.playerVelocityY = 0;
        this.moveDirection = { forward: false, backward: false, left: false, right: false, sprint: false };

        // Play falling defeat sound
        sounds.playDeath();

        // Show friendly death overlay message
        let overlay = document.getElementById('death-overlay');
        if (overlay) overlay.classList.add('active');

        this.showToast("💥 Oops! You jumped outside the platform! Respawning...");

        // Wait 1.2 seconds, then respawn Mira safely in the center of the district
        setTimeout(() => {
            let respawnLocation = this.getSafeDistrictSpawn();
            this.playerPos.copy(respawnLocation);
            this.playerVelocityY = 0;
            this.isGrounded = true;

            // Hide death screen
            if (overlay) overlay.classList.remove('active');

            // Play respawn chime
            sounds.playRespawn();
            this.showToast("✨ Respawned safely! Press [J] to Jump when needed.");

            this.isDead = false;
        }, 1200);
    }

    respawnAtCheckpoint() {
        this.handlePlayerDeath();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate harmonic rings on central tower
        if (this.harmonicRings) {
            this.harmonicRings.forEach((r, idx) => {
                r.rotation.z += 0.005 * (idx % 2 === 0 ? 1 : -1);
            });
        }

        // -------------------------------------------------------------
        // Sky Star Particles with Minimal Speed Drift
        // -------------------------------------------------------------
        this.animTime = (this.animTime || 0) + 0.016;

        if (this.skyGroup) {
            // Majestic celestial rotation of distant sky dome with increased, graceful drift
            this.skyGroup.rotation.y += 0.0006;
            this.skyGroup.rotation.x = Math.sin(this.animTime * 0.06) * 0.006;
        }

        // Soft twinkling shimmer on stars
        if (this.starFieldMat) {
            this.starFieldMat.opacity = 0.82 + Math.sin(this.animTime * 2.0) * 0.12;
        }

        // Increased speed movement for atmospheric floating stardust
        if (this.stardustGeo && this.stardustPositions && this.stardustVels) {
            let pos = this.stardustPositions;
            let vels = this.stardustVels;
            let count = pos.length / 3;
            for (let i = 0; i < count; i++) {
                let ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
                pos[ix] += vels[ix] * 0.95;
                pos[iy] += vels[iy] * 0.95 + Math.sin(this.animTime * 1.4 + i) * 0.006;
                pos[iz] += vels[iz] * 0.95;

                // Seamless boundary wrap-around in the sky/air
                if (pos[iy] > 105) pos[iy] = 10;
                if (pos[iy] < 8) pos[iy] = 100;
                if (pos[ix] > 160) pos[ix] = -160;
                if (pos[ix] < -160) pos[ix] = 160;
                if (pos[iz] > 290) pos[iz] = -40;
                if (pos[iz] < -40) pos[iz] = 290;
            }
            this.stardustGeo.attributes.position.needsUpdate = true;
        }

        // Live tutorial HUD updates
        this.updateTutorialGuide();

        // -------------------------------------------------------------
        // Dynamic World Machines: Real Mechanical City Security Gates (All Districts)
        // -------------------------------------------------------------
        if (this.mechanicalGates) {
            let ch = this.activePuzzle ? (this.activePuzzle.chapter || 1) : 1;
            let pid = this.activePuzzle ? (this.activePuzzle.id || '') : '';

            for (let gate of this.mechanicalGates) {
                // Keep unlocked district gates permanently open
                if (gate.id === 'd1' && (this.d1GateOpen || this.d1GateOpenPermanently || ch > 1)) {
                    gate.isOpen = true;
                }
                if (gate.id === 'd2' && (this.d2GateOpenPermanently || ch > 2)) {
                    gate.isOpen = true;
                }
                if (gate.id === 'd3' && (this.d3GateOpenPermanently || ch >= 4)) {
                    gate.isOpen = true;
                }
                if (gate.id === 'd4' && (this.d4GateOpenPermanently || ch > 4)) {
                    gate.isOpen = true;
                }
                if (gate.id === 'd5' && (this.d5GateOpenPermanently || ch > 5)) {
                    gate.isOpen = true;
                }
                if (gate.id === 'd6' && (this.d6GateOpenPermanently || ch > 6)) {
                    gate.isOpen = true;
                }
                if (gate.id === 'd7' && (this.d7GateOpenPermanently || ch > 7)) {
                    gate.isOpen = true;
                }

                // Detect Gate Open/Close Trigger Edge for Sound & Smoke
                if (gate.isOpen && !gate.prevOpen) {
                    gate.prevOpen = true;
                    // Play slow majestic mechanical gate unlatch, steam hiss, motor rumble & cushion sound
                    sounds.playGateOpen();
                    // Slow billowing smoke from multiple vents over several seconds!
                    this.spawnSlowBillowingSmoke(gate.x, gate.y + gate.height * 0.45, gate.z, 3600);
                    this.spawnSlowBillowingSmoke(gate.x - gate.width * 0.30, gate.y + 0.35, gate.z, 3000);
                    this.spawnSlowBillowingSmoke(gate.x + gate.width * 0.30, gate.y + 0.35, gate.z, 3000);
                } else if (!gate.isOpen && gate.prevOpen) {
                    gate.prevOpen = false;
                    sounds.playGateClose();
                }

                let targetGateProgress = gate.isOpen ? 1.0 : 0.0;
                let isMoving = Math.abs(targetGateProgress - (gate.openProgress || 0)) > 0.005;
                // Slow, majestic, heavy mechanical gate slide
                gate.openProgress = (gate.openProgress || 0) + (targetGateProgress - (gate.openProgress || 0)) * 0.024;

                // Continuous gentle steam puffs along the track while the gate doors are sliding open
                if (gate.isOpen && isMoving && Math.random() < 0.25) {
                    let seamX = gate.x + (Math.random() < 0.5 ? -1 : 1) * (gate.doorBaseX + gate.openProgress * gate.doorTravel * 0.7);
                    this.spawnGateSmoke(seamX, gate.y + 0.35, gate.z, 2, 0.4, 0.4);
                }

                // Rotate overhead mechanical gears smoothly while doors slide
                if (gate.gears && isMoving) {
                    let gearDir = gate.isOpen ? 1 : -1;
                    gate.gears.forEach((gear, idx) => {
                        gear.rotation.z += 0.055 * gearDir * (idx % 2 === 0 ? 1 : -1);
                    });
                }

                if (gate.doorLeft) {
                    // Slide left heavy steel door outward into stone pillar pocket
                    gate.doorLeft.position.x = -gate.doorBaseX - gate.openProgress * gate.doorTravel;
                }
                if (gate.doorRight) {
                    // Slide right heavy steel door outward into stone pillar pocket
                    gate.doorRight.position.x = gate.doorBaseX + gate.openProgress * gate.doorTravel;
                }
                if (gate.lockLight) {
                    if (gate.openProgress > 0.45) {
                        gate.lockLight.material.color.setHex(0x22c55e);
                        gate.lockLight.material.emissive.setHex(0x22c55e);
                    } else {
                        gate.lockLight.material.color.setHex(0xef4444);
                        gate.lockLight.material.emissive.setHex(0xef4444);
                    }
                }
                // Dynamic collision: open gate permits walking through
                if (gate.barrier) {
                    if (gate.openProgress > 0.65) {
                        gate.barrier.minX = 0;
                        gate.barrier.maxX = 0;
                        gate.barrier.active = false;
                    } else {
                        gate.barrier.minX = gate.x - gate.width / 2;
                        gate.barrier.maxX = gate.x + gate.width / 2;
                        gate.barrier.active = true;
                    }
                }
            }
        }

        // Billowing Smoke & Steam Particles Update Loop (Slow, lingering, graceful)
        if (this.smokeParticles && this.smokeParticles.length > 0) {
            for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
                let p = this.smokeParticles[i];
                p.mesh.position.x += p.vx * 0.016;
                p.mesh.position.y += p.vy * 0.016;
                p.mesh.position.z += p.vz * 0.016;
                p.vy *= 0.992; // Very gentle air resistance for slow float
                p.age += 0.016;
                let prog = p.age / p.maxAge;
                if (prog >= 1.0) {
                    this.scene.remove(p.mesh);
                    if (p.mesh.material) p.mesh.material.dispose();
                    this.smokeParticles.splice(i, 1);
                } else {
                    // Gradual expansion over 4-6 seconds
                    p.mesh.scale.setScalar(p.baseScale * (0.6 + prog * 3.8));
                    // Slow fade in (0 -> 28%), sustained density (28% -> 55%), slow fade out (55% -> 100%)
                    let alpha = 1.0;
                    if (prog < 0.28) {
                        alpha = prog / 0.28;
                    } else if (prog > 0.55) {
                        alpha = Math.max(0, 1.0 - (prog - 0.55) / 0.45);
                    }
                    p.mesh.material.opacity = alpha * p.targetOpacity;
                }
            }
        }

        // 3D Inward Confetti Ribbons Update Loop (Cascades from Harmonic Rings inward to Pinnacle)
        if (this.confetti3DParticles && this.confetti3DParticles.length > 0) {
            for (let i = this.confetti3DParticles.length - 1; i >= 0; i--) {
                let p = this.confetti3DParticles[i];
                if (!p.isLanded) {
                    p.vy -= 4.2 * 0.016; // Realistic gravity arcing down towards the platform
                    p.vx *= 0.988;
                    p.vz *= 0.988;
                    p.mesh.position.x += p.vx * 0.016;
                    p.mesh.position.y += p.vy * 0.016;
                    p.mesh.position.z += p.vz * 0.016;
                    p.mesh.rotation.x += p.vRotX;
                    p.mesh.rotation.y += p.vRotY;
                    p.mesh.rotation.z += p.vRotZ;

                    // Landing on Pinnacle Floor (platform surface Y = 15.90)
                    if (p.mesh.position.y <= 15.92) {
                        p.mesh.position.y = 15.92;
                        p.isLanded = true;
                        p.vy = 0;
                        p.vx *= 0.25;
                        p.vz *= 0.25;
                        p.mesh.rotation.x = Math.PI / 2;
                    }
                } else {
                    p.mesh.position.x += p.vx * 0.016;
                    p.mesh.position.z += p.vz * 0.016;
                    p.vx *= 0.92;
                    p.vz *= 0.92;
                }

                p.age += 0.016;
                let prog = p.age / p.maxAge;
                if (prog >= 1.0) {
                    this.scene.remove(p.mesh);
                    if (p.mesh.material) p.mesh.material.dispose();
                    this.confetti3DParticles.splice(i, 1);
                } else {
                    let alpha = prog > 0.70 ? Math.max(0, 1.0 - (prog - 0.70) / 0.30) : 1.0;
                    if (p.mesh.material) p.mesh.material.opacity = alpha;
                }
            }
        }

        // -------------------------------------------------------------
        // Dynamic World Machines (Switchworks Hydraulic Lift)
        // -------------------------------------------------------------
        if (this.d2Lift && this.d2LiftPlatform && this.d2LiftTargetY !== undefined) {
            // Proximity lift helper: if player is down on the plaza near the lift bay (Z: 48..57, X: 6..22, Y < 3.4)
            // and lift is up, lower it down so player can easily board!
            let playerNearLiftBase = (this.playerPos.x >= 6 && this.playerPos.x <= 22 &&
                                      this.playerPos.z >= 48 && this.playerPos.z <= 57 &&
                                      this.playerPos.y < 3.4);
            let onLift = (this.playerPos.x >= this.d2LiftPlatform.minX && this.playerPos.x <= this.d2LiftPlatform.maxX &&
                          this.playerPos.z >= this.d2LiftPlatform.minZ && this.playerPos.z <= this.d2LiftPlatform.maxZ);

            if (this.d2LiftElevated) {
                if (playerNearLiftBase && !onLift && this.d2Lift.position.y > 2.8) {
                    this.d2LiftTargetY = 2.50; // Descend to pick player up
                } else if (onLift || this.playerPos.y > 3.5) {
                    this.d2LiftTargetY = 4.15; // Ascend smoothly with player
                }
            }

            let dy = (this.d2LiftTargetY - this.d2Lift.position.y) * 0.025; // Smooth elevator movement
            if (Math.abs(dy) > 0.0003) {
                let prevTopY = this.d2LiftPlatform.topY;
                this.d2Lift.position.y += dy;
                this.d2LiftPlatform.y = this.d2Lift.position.y;
                this.d2LiftPlatform.topY = this.d2Lift.position.y + this.d2LiftPlatform.h / 2;

                // Release gentle slow steam puffs from hydraulic platform edge while moving
                if (Math.random() < 0.22) {
                    let px = 14 + (Math.random() - 0.5) * 11;
                    let pz = 54 + (Math.random() - 0.5) * 5;
                    this.spawnGateSmoke(px, this.d2Lift.position.y - 0.2, pz, 2, 0.4, 0.4);
                }

                // If Mira is standing on the moving lift, smoothly carry her up or down!
                if (onLift && this.isGrounded && Math.abs(this.playerPos.y - prevTopY) < 0.55) {
                    this.playerPos.y = this.d2LiftPlatform.topY;
                }
            }
        }

        // -------------------------------------------------------------
        // Layman Level Player Movement & Physics (Walking, Jumping, Steps, Falling)
        // -------------------------------------------------------------
        if (!this.isUIOpen && !this.isDead) {
            let dt = 0.016; // 60 FPS delta time

            // Calculate movement direction relative to camera angle (Left is Left, Right is Right!)
            let forwardX = -Math.sin(this.cameraYaw);
            let forwardZ = Math.cos(this.cameraYaw);
            // In Three.js looking down +Z from -Z, screen Right is in the -X direction
            let rightX = -Math.cos(this.cameraYaw);
            let rightZ = -Math.sin(this.cameraYaw);

            let dirX = 0, dirZ = 0;
            if (this.moveDirection.forward) { dirX += forwardX; dirZ += forwardZ; }
            if (this.moveDirection.backward) { dirX -= forwardX; dirZ -= forwardZ; }
            if (this.moveDirection.right) { dirX += rightX; dirZ += rightZ; }
            if (this.moveDirection.left) { dirX -= rightX; dirZ -= rightZ; }

            let len = Math.hypot(dirX, dirZ);
            let speed = this.moveDirection.sprint ? this.moveSpeed * 1.6 : this.moveSpeed;

            let nextX = this.playerPos.x;
            let nextZ = this.playerPos.z;

            if (len > 0.001) {
                dirX /= len;
                dirZ /= len;
                nextX += dirX * speed * dt;
                nextZ += dirZ * speed * dt;
                if (this.mira) this.mira.rotation.y = Math.atan2(dirX, dirZ);

                // Swing legs only when grounded
                if (this.isGrounded) {
                    let swing = Math.sin(Date.now() * 0.014) * 0.45;
                    if (this.leftLeg) this.leftLeg.rotation.x = swing;
                    if (this.rightLeg) this.rightLeg.rotation.x = -swing;
                    // Arms swing opposite to legs for natural gait
                    if (this.leftArm)  this.leftArm.rotation.x  = -swing * 0.55;
                    if (this.rightArm) this.rightArm.rotation.x =  swing * 0.55;
                    // Subtle head bob
                    if (this.miraHead) this.miraHead.position.y = 1.50 + Math.abs(Math.sin(Date.now() * 0.014)) * 0.025;
                }
            } else {
                if (this.isGrounded) {
                    if (this.leftLeg) this.leftLeg.rotation.x = 0;
                    if (this.rightLeg) this.rightLeg.rotation.x = 0;
                    if (this.leftArm)  this.leftArm.rotation.x = 0;
                    if (this.rightArm) this.rightArm.rotation.x = 0;
                    if (this.miraHead) this.miraHead.position.y = 1.50; // idle — reset head
                }
            }

            // ─────────────────────────────────────────────────────────────
            // 1. GATE BARRIERS (Physical barriers at locked mechanical gates)
            // Stops player from passing through gates while allowing sideways slide.
            // ─────────────────────────────────────────────────────────────
            const PR = 0.30; // player body collision radius
            const MAX_STEP = 0.45; // max vertical height player can auto-step up

            if (this.barriers) {
                for (let b of this.barriers) {
                    if (b.active) {
                        // Check if within gate barrier X bounds
                        if (nextX + PR > b.minX && nextX - PR < b.maxX) {
                            if (this.playerPos.z + PR <= b.minZ + 0.05 && nextZ + PR > b.minZ) {
                                nextZ = b.minZ - PR; // Block Northward penetration
                            } else if (this.playerPos.z - PR >= b.maxZ - 0.05 && nextZ - PR < b.maxZ) {
                                nextZ = b.maxZ + PR; // Block Southward penetration
                            } else if (nextZ + PR > b.minZ && nextZ - PR < b.maxZ) {
                                // Deep penetration safeguard
                                if (Math.abs((nextZ + PR) - b.minZ) < Math.abs(b.maxZ - (nextZ - PR))) {
                                    nextZ = b.minZ - PR;
                                } else {
                                    nextZ = b.maxZ + PR;
                                }
                            }
                        }
                        // Check if within gate barrier Z bounds
                        if (nextZ + PR > b.minZ && nextZ - PR < b.maxZ) {
                            if (this.playerPos.x + PR <= b.minX + 0.05 && nextX + PR > b.minX) {
                                nextX = b.minX - PR; // Block Eastward penetration
                            } else if (this.playerPos.x - PR >= b.maxX - 0.05 && nextX - PR < b.maxX) {
                                nextX = b.maxX + PR; // Block Westward penetration
                            }
                        }
                    }
                }
            }

            // ─────────────────────────────────────────────────────────────
            // 2. WALL COLLISION — Real Human Wall Interaction
            // Directional face detection so moving against walls produces smooth
            // realistic sliding along the wall surface instead of clipping through.
            // ─────────────────────────────────────────────────────────────
            const isWallPlat = (plat) => {
                // If platform top is lower than or at player feet -> walkable floor below, not a wall!
                if (plat.topY <= this.playerPos.y + 0.12) return false;
                // Height difference from player feet to platform top
                let heightDiff = plat.topY - this.playerPos.y;
                // If small step that can be auto-stepped onto while grounded
                if (heightDiff <= MAX_STEP && this.isGrounded) return false;
                // JUMP / MANTLE CLEARANCE: If in air and moving toward a ledge within reach,
                // do NOT push the player away horizontally! Allow forward flight over the ledge!
                if (!this.isGrounded && heightDiff <= 1.5 && this.playerVelocityY > -3.0) return false;
                // If ceiling / overhead structure high above player's head
                let platBottom = plat.y !== undefined ? plat.y - (plat.h || 1.5) / 2 : plat.topY - (plat.h || 1.5);
                if (platBottom > this.playerPos.y + 1.8) return false;
                return true;
            };

            // Test X-axis movement against walls:
            let resolvedX = nextX;
            if (this.platforms) {
                for (let plat of this.platforms) {
                    // Check if player's current Z overlaps this platform
                    if (this.playerPos.z + PR > plat.minZ && this.playerPos.z - PR < plat.maxZ) {
                        if (isWallPlat(plat)) {
                            // Approaching West face (walking East)
                            if (this.playerPos.x + PR <= plat.minX + 0.05 && resolvedX + PR > plat.minX) {
                                resolvedX = plat.minX - PR;
                            }
                            // Approaching East face (walking West)
                            else if (this.playerPos.x - PR >= plat.maxX - 0.05 && resolvedX - PR < plat.maxX) {
                                resolvedX = plat.maxX + PR;
                            }
                            // Penetration recovery
                            else if (resolvedX + PR > plat.minX && resolvedX - PR < plat.maxX) {
                                let pushL = Math.abs((resolvedX + PR) - plat.minX);
                                let pushR = Math.abs(plat.maxX - (resolvedX - PR));
                                if (pushL < pushR) resolvedX = plat.minX - PR;
                                else resolvedX = plat.maxX + PR;
                            }
                        }
                    }
                }
            }

            // Test Z-axis movement against walls (using resolvedX):
            let resolvedZ = nextZ;
            if (this.platforms) {
                for (let plat of this.platforms) {
                    // Check if player's resolved X overlaps this platform
                    if (resolvedX + PR > plat.minX && resolvedX - PR < plat.maxX) {
                        if (isWallPlat(plat)) {
                            // Approaching South face (walking North)
                            if (this.playerPos.z + PR <= plat.minZ + 0.05 && resolvedZ + PR > plat.minZ) {
                                resolvedZ = plat.minZ - PR;
                            }
                            // Approaching North face (walking South)
                            else if (this.playerPos.z - PR >= plat.maxZ - 0.05 && resolvedZ - PR < plat.maxZ) {
                                resolvedZ = plat.maxZ + PR;
                            }
                            // Penetration recovery
                            else if (resolvedZ + PR > plat.minZ && resolvedZ - PR < plat.maxZ) {
                                let pushF = Math.abs((resolvedZ + PR) - plat.minZ);
                                let pushB = Math.abs(plat.maxZ - (resolvedZ - PR));
                                if (pushF < pushB) resolvedZ = plat.minZ - PR;
                                else resolvedZ = plat.maxZ + PR;
                            }
                        }
                    }
                }
            }

            // ── AUTO-STEP & MANTLE (Smoothly climb stairs, curbs & ledges) ─────────
            if (this.platforms) {
                for (let plat of this.platforms) {
                    if (resolvedX + PR > plat.minX && resolvedX - PR < plat.maxX &&
                        resolvedZ + PR > plat.minZ && resolvedZ - PR < plat.maxZ) {
                        let heightDiff = plat.topY - this.playerPos.y;
                        if (heightDiff > 0.02 && heightDiff <= (this.isGrounded ? MAX_STEP : 1.40)) {
                            this.playerPos.y = plat.topY;
                            this.playerVelocityY = 0;
                            this.isGrounded = true;
                        }
                    }
                }
            }

            this.playerPos.x = resolvedX;
            this.playerPos.z = resolvedZ;

            // Apply gravity whenever in the air (jumping or falling)
            if (!this.isGrounded) {
                this.playerVelocityY -= 22.0 * dt; // Gravity pull downward
                this.playerPos.y += this.playerVelocityY * dt;

                // Jump pose for legs
                if (this.leftLeg) this.leftLeg.rotation.x = -0.3;
                if (this.rightLeg) this.rightLeg.rotation.x = 0.3;
            }

            // Layman level: Find solid platform directly under Mira's feet
            let groundBelowY = -999;
            if (this.platforms) {
                for (let plat of this.platforms) {
                    if (this.playerPos.x >= plat.minX && this.playerPos.x <= plat.maxX &&
                        this.playerPos.z >= plat.minZ && this.playerPos.z <= plat.maxZ) {
                        // Platform must be at or below Mira's feet (with generous landing tolerance)
                        if (plat.topY <= this.playerPos.y + 0.38) {
                            if (plat.topY > groundBelowY) {
                                groundBelowY = plat.topY;
                            }
                        }
                    }
                }
            }

            if (groundBelowY > -900) {
                // There IS solid ground underneath Mira!
                if (this.playerPos.y <= groundBelowY + 0.25 && this.playerVelocityY <= 0) {
                    // Mira has landed on solid ground or a step!
                    this.playerPos.y = groundBelowY;
                    this.playerVelocityY = 0;
                    this.isGrounded = true;
                } else if (this.playerPos.y > groundBelowY + 0.25) {
                    // Mira is in the air above the platform
                    this.isGrounded = false;
                }
            } else {
                // There is NO platform beneath Mira! She has jumped or walked outside into the void!
                this.isGrounded = false;

                // When she falls below the platforms, trigger clean quantum respawn
                if (this.playerPos.y < -1.5 && !this.isDead) {
                    this.handlePlayerDeath();
                }
            }
        }

        // Update Mira Position
        if (this.mira) {
            this.mira.position.copy(this.playerPos);
        }

        // Lumi Drone companion follows smoothly
        if (this.lumi) {
            let targetLumiPos = this.playerPos.clone().add(new THREE.Vector3(-0.8, 1.6 + Math.sin(Date.now() * 0.003) * 0.15, 0.4));
            this.lumi.position.lerp(targetLumiPos, 0.08);
            this.lumi.rotation.y += 0.02;
        }

        // Camera follow BEHIND the player looking into +Z towards the city!
        let camOffset = new THREE.Vector3(
            Math.sin(this.cameraYaw) * this.cameraDist * Math.cos(this.cameraPitch),
            Math.sin(this.cameraPitch) * this.cameraDist + 1.25,
            -Math.cos(this.cameraYaw) * this.cameraDist * Math.cos(this.cameraPitch)
        );
        this.camera.position.copy(this.playerPos).add(camOffset);
        this.camera.lookAt(this.playerPos.x, this.playerPos.y + 0.85, this.playerPos.z);

        // Check Interactables
        this.checkInteractables();

        this.renderer.render(this.scene, this.camera);
    }

    checkInteractables() {
        if (!this.interactables) return;
        let prompt = document.getElementById('interact-prompt');
        let onScreenBtn = document.getElementById('hud-interact-btn');
        let closest = null;
        let minDist = 3.6; // reach distance to terminal

        for (let obj of this.interactables) {
            let d = obj.position.distanceTo(this.playerPos);
            if (d < minDist) {
                minDist = d;
                closest = obj;
            }
        }

        this.nearbyInteractable = closest;
        if (closest && !this.isUIOpen) {
            let label = closest.userData.label || 'Interact';
            prompt.style.display = 'block';
            prompt.innerHTML = `<b>[E] ${label}</b> <small style="display:block; font-size:11px; color:#22d3ee; margin-top:2px;">(Click or press E)</small>`;
            if (onScreenBtn) {
                onScreenBtn.classList.add('highlight');
                let lbl = document.getElementById('action-btn-label');
                if (lbl) lbl.innerText = label;
            }
        } else {
            prompt.style.display = 'none';
            if (onScreenBtn) {
                onScreenBtn.classList.remove('highlight');
                let lbl = document.getElementById('action-btn-label');
                if (lbl) lbl.innerText = 'INTERACT (Move Closer)';
            }
        }

        // -----------------------------------------------------------------------
        // GATE KNOWLEDGE: When Mira approaches a CLOSED mechanical gate, Lumi
        // explains what the gate is and how to open it in plain English.
        // -----------------------------------------------------------------------
        this.checkGateProximityKnowledge();
    }

    // Gate Knowledge definitions: each closed gate has a unique Lumi explanation.
    _getGateKnowledge(gateId) {
        const gateInfo = {
            'd1': {
                name: 'City Security Gate',
                how: 'This is a SECURITY GATE — it blocks the road to protect the city from intruders. It will NOT open by force. To open it: ① Walk left to Terminal Alpha → set your lantern to Blue (0). ② Walk right to Terminal Beta → set it to Yellow (1). When both terminals match the required colors, the gate unlocks automatically!'
            },
            'd2': {
                name: 'Upper Security Gate',
                how: 'This is the UPPER SECURITY GATE — a checkpoint between districts. It only opens when your lantern is set to Blue (0). Use the console nearby to flip your lantern back to Blue. The gate checks the lantern color electronically — it will slide open the moment the correct state is set!'
            },
            'd3': {
                name: 'Twin-Light Bridge Gate',
                how: 'This gate is the TWIN-LIGHT BRIDGE barrier. The bridge itself is unstable and will only hold when your lantern is in a 50/50 blend (superposition). Press [H] at the Bridge Console nearby to enter the blend state. The gate senses the mixed signal and unlocks!'
            },
            'd6': {
                name: "Dr. Ishan's Vault Blast Door",
                how: "This is a BLAST DOOR — an extremely heavy security door protecting Dr. Ishan's Vault. The lock has been scrambled. You must undo the scramble by reversing the combination in the correct order: press [H], then [Z], then [X] at the archive console. That reversal pattern unlocks it!"
            },
            'd7': {
                name: 'Auditor Scanner Barrier',
                how: 'This is the AUDITOR SCANNER BARRIER — it measures your quantum state and opens only after taking a reading. Walk to the Measurement Station (red platform) and press [E] to run the scan. Once the scanner reads your lantern state, the barrier automatically deactivates!'
            }
        };
        return gateInfo[gateId] || null;
    }

    checkGateProximityKnowledge() {
        if (!this.mechanicalGates) return;
        // Only show gate help once per gate (debounced, resets if player walks away)
        const GATE_HELP_RADIUS = 5.5; // units
        if (!this._gateHelpShown) this._gateHelpShown = {};

        for (let gate of this.mechanicalGates) {
            if (gate.isOpen) continue; // Gate already open — no need to explain
            let dx = this.playerPos.x - gate.x;
            let dz = this.playerPos.z - gate.z;
            let dist = Math.hypot(dx, dz);

            if (dist < GATE_HELP_RADIUS) {
                if (!this._gateHelpShown[gate.id]) {
                    this._gateHelpShown[gate.id] = true;
                    let info = this._getGateKnowledge(gate.id);
                    if (info && !this.isUIOpen) {
                        // Flash the banner toast with the gate name
                        this.showToast(`🚧 ${info.name} — LOCKED! Lumi is explaining how to open it...`);
                        // Show Lumi dialogue with the explanation after a brief pause
                        setTimeout(() => {
                            if (!this.isUIOpen) {
                                this.showDialogue('Lumi', `🔒 GATE AHEAD: ${info.how}`);
                            }
                        }, 1200);
                    }
                }
            } else {
                // Player walked away — allow re-trigger if they come back (reset only if well away)
                if (dist > GATE_HELP_RADIUS + 4.0) {
                    delete this._gateHelpShown[gate.id];
                }
            }
        }
    }
}

// Start Game
window.onload = () => {
    window.game = new Game();
};
