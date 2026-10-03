import re

# ========================
# STEP 1: Replace entire gate-guide-modal with new version
# that has a gate LIST view and a DETAIL view (truth table + circuit)
# ========================

NEW_MODAL = '''    <div id="gate-guide-modal" class="modal-overlay" style="display:none; z-index: 9500;">
        <div class="modal-window" style="width: min(920px, 96vw); max-height: 94vh; overflow: hidden; padding: 0; display: flex; flex-direction: column;">

            <!-- ===== LIST VIEW ===== -->
            <div id="gg-list-view" style="display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 24px;">
                <div class="modal-header" style="margin-bottom: 18px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 26px;">🚧</span>
                        <div>
                            <div class="modal-title">City Gate &amp; Mechanics Guide</div>
                            <div style="font-size: 12px; color: #f59e0b; letter-spacing: 0.5px;">Click any gate below to see its Truth Table, Formula &amp; Step-by-step walkthrough!</div>
                        </div>
                    </div>
                    <button class="close-btn" onclick="document.getElementById('gate-guide-modal').style.display='none'">✕ [G]</button>
                </div>

                <!-- Tool strip -->
                <div style="display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 18px;">
                    <div style="background:#0f172a; border:1px solid #3b82f688; border-radius:8px; padding:10px 12px;">
                        <div style="font-weight:700; color:#60a5fa; font-size:13px; margin-bottom:3px;">[X] Light Switch</div>
                        <div style="font-size:12px; color:#94a3b8;">Flips Blue↔Yellow. 0→1, 1→0.</div>
                    </div>
                    <div style="background:#0f172a; border:1px solid #c084fc88; border-radius:8px; padding:10px 12px;">
                        <div style="font-weight:700; color:#c084fc; font-size:13px; margin-bottom:3px;">[H] Blender</div>
                        <div style="font-size:12px; color:#94a3b8;">Makes 50/50 mix. Blend twice = back to start.</div>
                    </div>
                    <div style="background:#0f172a; border:1px solid #22c55e88; border-radius:8px; padding:10px 12px;">
                        <div style="font-weight:700; color:#4ade80; font-size:13px; margin-bottom:3px;">[Z] Wave Mirror</div>
                        <div style="font-size:12px; color:#94a3b8;">Flips wave polarity. Invisible on pure color.</div>
                    </div>
                </div>

                <!-- Gate cards -->
                <div style="font-size:13px; font-weight:700; color:#f59e0b; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">🚪 Click a Gate to View its Truth Table</div>
                <div style="display:flex; flex-direction:column; gap:8px;">

                    <div onclick="showGateDetail(0)" style="cursor:pointer; background:#0f1929; border:1px solid #ef4444aa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#1e0a0a'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">🔴</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#ef4444; font-size:13px;">GATE 1 — District 1 City Gate (D1→D2)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Arrival Harbor → Switchworks &nbsp;|&nbsp; Two terminals, Blue + Yellow</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                    <div onclick="showGateDetail(1)" style="cursor:pointer; background:#0f1929; border:1px solid #3b82f6aa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#0a0f1a'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">🔵</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#3b82f6; font-size:13px;">GATE 2 — Hydraulic Lift &amp; Upper Gate (D2→D3)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Switchworks → Twin-Light Garden &nbsp;|&nbsp; Flip up, Flip back</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                    <div onclick="showGateDetail(2)" style="cursor:pointer; background:#0f1929; border:1px solid #c084fcaa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#150a1f'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">🟣</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#c084fc; font-size:13px;">GATE 3 — Twin-Light Bridge &amp; Garden Gate (D3→D4)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Twin-Light Garden → Phase Observatory &nbsp;|&nbsp; Blend to 50/50</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                    <div onclick="showGateDetail(3)" style="cursor:pointer; background:#0f1929; border:1px solid #22d3eeaa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#031520'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">🔭</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#22d3ee; font-size:13px;">GATE 4 — Phase Observatory Harmonic Beacon (D4→D5)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Phase Observatory → Echo Bridge &nbsp;|&nbsp; H→Z→H trick</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                    <div onclick="showGateDetail(4)" style="cursor:pointer; background:#0f1929; border:1px solid #818cf8aa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#0c0c20'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">🌉</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#818cf8; font-size:13px;">GATE 5 — Echo Bridge Relay Pylons (D5→D6)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Echo Bridge → Reversal Vault &nbsp;|&nbsp; Order matters! XH ≠ HX</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                    <div onclick="showGateDetail(5)" style="cursor:pointer; background:#0f1929; border:1px solid #f59e0baa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#1a0f02'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">🔒</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#f59e0b; font-size:13px;">GATE 6 — Dr. Ishan\'s Vault Blast Door (D6→D7)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Reversal Vault → Measurement Station &nbsp;|&nbsp; Reverse H-Z-X lock</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                    <div onclick="showGateDetail(6)" style="cursor:pointer; background:#0f1929; border:1px solid #ef4444aa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#1e0a0a'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">🔴</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#ef4444; font-size:13px;">GATE 7 — Auditor Measurement Scanner (D7→D8)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Measurement Station → Echo Core &nbsp;|&nbsp; Observe the blend, wave collapses!</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                    <div onclick="showGateDetail(7)" style="cursor:pointer; background:#0f1929; border:1px solid #eab308aa; border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:16px; transition:background 0.2s;" onmouseover="this.style.background='#1a1402'" onmouseout="this.style.background='#0f1929'">
                        <div style="font-size:28px;">👑</div>
                        <div style="flex:1">
                            <div style="font-weight:700; color:#eab308; font-size:13px;">GATE 8 — The Great Echo Core Pinnacle (D8 Final)</div>
                            <div style="font-size:13px; color:#cbd5e1;">Echo Core Pinnacle &nbsp;|&nbsp; H→Z→H master synthesis</div>
                        </div>
                        <div style="color:#64748b; font-size:20px;">▶</div>
                    </div>

                </div>
            </div>

            <!-- ===== DETAIL VIEW (Truth Table Black Screen) ===== -->
            <div id="gg-detail-view" style="display:none; flex-direction:column; height:100%; background:#050a10; overflow-y:auto;">

                <!-- Back header -->
                <div style="display:flex; align-items:center; gap:12px; padding:16px 20px; border-bottom:1px solid #1e293b; position:sticky; top:0; background:#050a10; z-index:10;">
                    <button onclick="hideGateDetail()" style="background:#1e293b; border:1px solid #334155; color:#94a3b8; padding:7px 14px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; transition:background 0.2s;" onmouseover="this.style.background=\'#334155\'" onmouseout="this.style.background=\'#1e293b\'">
                        ◀ Back to Gate List
                    </button>
                    <div id="gg-detail-title" style="font-size:16px; font-weight:700; color:#f1f5f9;"></div>
                </div>

                <!-- Content injected by JS -->
                <div id="gg-detail-content" style="padding:24px; flex:1;"></div>
            </div>

        </div>
    </div>

    <script>
    // ============================================================
    // GATE DETAIL DATA: truth tables + circuit diagrams for all 8 gates
    // ============================================================
    const GATE_DETAILS = [
        // GATE 1
        {
            emoji: "🔴",
            color: "#ef4444",
            title: "GATE 1 — District 1 City Gate",
            subtitle: "D1 Arrival Harbor → D2 Switchworks",
            concept: "Pure States: Blue (0) & Yellow (1)",
            conceptDesc: "Your lantern has two pure colors: Blue (0) and Yellow (1). Each terminal reads exactly one color. This is the most basic quantum fact.",
            formula: "|0⟩  and  |1⟩",
            circuitSvg: `<svg width="100%" height="90" viewBox="0 0 500 90" style="font-family:monospace">
  <text x="20" y="30" fill="#94a3b8" font-size="13">Terminal Alpha</text>
  <line x1="20" y1="50" x2="160" y2="50" stroke="#3b82f6" stroke-width="2"/>
  <rect x="160" y="35" width="60" height="30" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2" rx="4"/>
  <text x="190" y="55" fill="#3b82f6" font-size="12" text-anchor="middle">|0⟩</text>
  <line x1="220" y1="50" x2="360" y2="50" stroke="#22c55e" stroke-width="2"/>
  <text x="370" y="55" fill="#22c55e" font-size="14">✔ OPEN</text>
  <text x="20" y="80" fill="#94a3b8" font-size="13">Terminal Beta</text>
  <line x1="20" y1="70" x2="160" y2="70" stroke="#f59e0b" stroke-width="2"/>
  <rect x="160" y="55" width="60" height="30" fill="#3d2a00" stroke="#f59e0b" stroke-width="2" rx="4"/>
  <text x="190" y="75" fill="#f59e0b" font-size="12" text-anchor="middle">|1⟩</text>
</svg>`,
            truthTable: [
                { input: "0", ops: "Set Prep 0",   output: "0 (Blue)",  match: "Alpha ✔" },
                { input: "1", ops: "Set Prep 1",   output: "1 (Yellow)", match: "Beta ✔" },
            ],
            steps: [
                { icon:"①", text:"Walk to Terminal Alpha (left console) — Press [E]", color:"#3b82f6" },
                { icon:"②", text:'Click "🔵 Set to Blue (0)" → Click "⚡ ACTIVATE"', color:"#3b82f6" },
                { icon:"③", text:"Walk to Terminal Beta (right console) — Press [E]", color:"#f59e0b" },
                { icon:"④", text:'Click "[X] Flip" → Yellow (1) → Click "⚡ ACTIVATE"', color:"#f59e0b" },
                { icon:"🔗", text:"Gate slides open! Glowing ramp appears — walk up into D2!", color:"#22c55e" },
            ],
        },
        // GATE 2
        {
            emoji: "🔵",
            color: "#3b82f6",
            title: "GATE 2 — Hydraulic Lift & Upper Gate",
            subtitle: "D2 Switchworks → D3 Twin-Light Garden",
            concept: "[X] Bit-Flip Gate: The Light Switch",
            conceptDesc: "X flips Blue to Yellow and Yellow back to Blue. Flip it twice = same as doing nothing (reversible!). X² = Identity.",
            formula: "X|0⟩ = |1⟩     X|1⟩ = |0⟩     X² = I",
            circuitSvg: `<svg width="100%" height="60" viewBox="0 0 500 60">
  <line x1="20" y1="35" x2="120" y2="35" stroke="#3b82f6" stroke-width="2"/>
  <text x="30" y="28" fill="#3b82f6" font-size="12">|0⟩</text>
  <rect x="120" y="20" width="40" height="30" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
  <text x="140" y="40" fill="#60a5fa" font-size="14" text-anchor="middle">X</text>
  <line x1="160" y1="35" x2="260" y2="35" stroke="#f59e0b" stroke-width="2"/>
  <text x="170" y="28" fill="#f59e0b" font-size="12">|1⟩ LIFT UP</text>
  <rect x="260" y="20" width="40" height="30" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="4"/>
  <text x="280" y="40" fill="#60a5fa" font-size="14" text-anchor="middle">X</text>
  <line x1="300" y1="35" x2="400" y2="35" stroke="#3b82f6" stroke-width="2"/>
  <text x="310" y="28" fill="#3b82f6" font-size="12">|0⟩ GATE OPEN</text>
  <text x="430" y="40" fill="#22c55e" font-size="14">✔</text>
</svg>`,
            truthTable: [
                { input: "0", ops: "X",  output: "1 (Yellow)", match: "Lift ↑ ✔" },
                { input: "1", ops: "X",  output: "0 (Blue)",   match: "Upper Gate ✔" },
            ],
            steps: [
                { icon:"①", text:"At Lift Console (ground floor) — Press [E]", color:"#f59e0b" },
                { icon:"②", text:'Click "[X] Flip" → Yellow (1) → "⚡ ACTIVATE" → Lift rises!', color:"#f59e0b" },
                { icon:"③", text:"Ride lift up OR walk the illuminated side staircase", color:"#94a3b8" },
                { icon:"④", text:"At Upper Gate Console (upper terrace) — Press [E]", color:"#3b82f6" },
                { icon:"⑤", text:'Click "[X] Flip" → Blue (0) → "⚡ ACTIVATE"', color:"#3b82f6" },
                { icon:"🔗", text:"Upper Gate opens! Walk into District 3!", color:"#22c55e" },
            ],
        },
        // GATE 3
        {
            emoji: "🟣",
            color: "#c084fc",
            title: "GATE 3 — Twin-Light Bridge & Garden Gate",
            subtitle: "D3 Twin-Light Garden → D4 Phase Observatory",
            concept: "[H] Hadamard Gate: The Quantum Blender",
            conceptDesc: "H creates a perfect 50/50 superposition. Applying H twice returns you exactly to the start. H|0⟩=|+⟩, H|+⟩=|0⟩.",
            formula: "H|0⟩ = |+⟩ = (|0⟩+|1⟩)/√2     H|+⟩ = |0⟩     H²=I",
            circuitSvg: `<svg width="100%" height="60" viewBox="0 0 500 60">
  <line x1="20" y1="35" x2="120" y2="35" stroke="#3b82f6" stroke-width="2"/>
  <text x="30" y="28" fill="#3b82f6" font-size="12">|0⟩</text>
  <rect x="120" y="20" width="40" height="30" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
  <text x="140" y="40" fill="#c084fc" font-size="14" text-anchor="middle">H</text>
  <line x1="160" y1="35" x2="280" y2="35" stroke="#9333ea" stroke-width="2"/>
  <text x="165" y="28" fill="#c084fc" font-size="12">|+⟩ = 50/50 blend</text>
  <text x="300" y="40" fill="#22c55e" font-size="14">Bridge ✔</text>
  <line x1="20" y1="55" x2="120" y2="55" stroke="#9333ea" stroke-width="2"/>
  <rect x="120" y="42" width="40" height="22" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
  <text x="140" y="57" fill="#c084fc" font-size="14" text-anchor="middle">H</text>
  <line x1="160" y1="55" x2="260" y2="55" stroke="#3b82f6" stroke-width="2"/>
  <text x="265" y="59" fill="#3b82f6" font-size="12">|0⟩ back</text>
</svg>`,
            truthTable: [
                { input: "0",   ops: "H",   output: "|+⟩ = 50/50 Blue+Yellow", match: "Bridge solid ✔" },
                { input: "|+⟩", ops: "H",   output: "0 (Blue)",               match: "Garden Gate ✔" },
            ],
            steps: [
                { icon:"①", text:"At Bridge Console (left of garden) — Press [E]", color:"#c084fc" },
                { icon:"②", text:'Click "[H] Blender" → lantern glows purple (50/50 mix)', color:"#c084fc" },
                { icon:"③", text:'Click "⚡ ACTIVATE" → Bridge solidifies & gate unlocks!', color:"#22c55e" },
                { icon:"④", text:"At Garden Gate Console — Press [E]", color:"#f59e0b" },
                { icon:"⑤", text:'Click "[H] Blender" again → un-blends back to Blue (0)', color:"#f59e0b" },
                { icon:"🔗", text:"Walk up the glowing ramp into District 4!", color:"#22c55e" },
            ],
        },
        // GATE 4
        {
            emoji: "🔭",
            color: "#22d3ee",
            title: "GATE 4 — Phase Observatory Harmonic Beacon",
            subtitle: "D4 Phase Observatory → D5 Echo Bridge",
            concept: "The H→Z→H Trick: Flip Without [X]!",
            conceptDesc: "The Flip Switch [X] is broken here! But H·Z·H = X — three gates compose into the exact same effect as flipping. Like taking a detour that arrives at the same destination.",
            formula: "H·Z·H = X      so      H→Z→H|0⟩ = |1⟩",
            circuitSvg: `<svg width="100%" height="60" viewBox="0 0 560 60">
  <line x1="10" y1="35" x2="80" y2="35" stroke="#3b82f6" stroke-width="2"/>
  <text x="15" y="28" fill="#3b82f6" font-size="12">|0⟩</text>
  <rect x="80" y="20" width="34" height="30" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
  <text x="97" y="40" fill="#c084fc" font-size="13" text-anchor="middle">H</text>
  <line x1="114" y1="35" x2="174" y2="35" stroke="#9333ea" stroke-width="2"/>
  <text x="118" y="28" fill="#9333ea" font-size="11">|+⟩</text>
  <rect x="174" y="20" width="34" height="30" fill="#1e293b" stroke="#4ade80" stroke-width="2" rx="4"/>
  <text x="191" y="40" fill="#4ade80" font-size="13" text-anchor="middle">Z</text>
  <line x1="208" y1="35" x2="268" y2="35" stroke="#9333ea" stroke-width="2"/>
  <text x="212" y="28" fill="#9333ea" font-size="11">|−⟩</text>
  <rect x="268" y="20" width="34" height="30" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
  <text x="285" y="40" fill="#c084fc" font-size="13" text-anchor="middle">H</text>
  <line x1="302" y1="35" x2="400" y2="35" stroke="#f59e0b" stroke-width="2"/>
  <text x="308" y="28" fill="#f59e0b" font-size="12">|1⟩ = Yellow!</text>
  <text x="415" y="40" fill="#22c55e" font-size="14">✔ Open!</text>
</svg>`,
            truthTable: [
                { input: "0", ops: "H",    output: "|+⟩ 50/50",  match: "Step 1" },
                { input: "|+⟩", ops: "Z", output: "|−⟩ mirrored", match: "Step 2" },
                { input: "|−⟩", ops: "H", output: "1 (Yellow!)", match: "Beacon ✔" },
            ],
            steps: [
                { icon:"①", text:"Walk up the ramp to Lens Console (LEFT) — Press [E]", color:"#c084fc" },
                { icon:"②", text:'Click "[H] Blender" then "[Z] Mirror" → Click "⚡ ACTIVATE"', color:"#4ade80" },
                { icon:"③", text:"Walk to Beacon Console (RIGHT side) — Press [E]", color:"#22d3ee" },
                { icon:"④", text:'Click "[H]" → "[Z]" → "[H]" in sequence', color:"#22d3ee" },
                { icon:"⑤", text:'Click "⚡ ACTIVATE" → lantern becomes Yellow without [X]!', color:"#f59e0b" },
                { icon:"🔗", text:"Harmonic Beacon clears! Walk across ramp to District 5!", color:"#22c55e" },
            ],
        },
        // GATE 5
        {
            emoji: "🌉",
            color: "#818cf8",
            title: "GATE 5 — Echo Bridge Relay Pylons",
            subtitle: "D5 Echo Bridge → D6 Reversal Vault",
            concept: "Order Matters! XH ≠ HX",
            conceptDesc: "In quantum, applying X then H gives a different result from H then X. Like making a sandwich: bread+butter ≠ butter+bread. Two pylons use different orders to extend the bridge.",
            formula: "X·H|0⟩ = |−⟩    H·X|0⟩ = |+⟩    XH ≠ HX !",
            circuitSvg: `<svg width="100%" height="80" viewBox="0 0 520 80">
  <text x="10" y="25" fill="#818cf8" font-size="12">Left Pylon (X→H):</text>
  <line x1="10" y1="40" x2="100" y2="40" stroke="#3b82f6" stroke-width="2"/>
  <rect x="100" y="26" width="32" height="28" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="3"/>
  <text x="116" y="45" fill="#60a5fa" font-size="13" text-anchor="middle">X</text>
  <line x1="132" y1="40" x2="192" y2="40" stroke="#f59e0b" stroke-width="2"/>
  <rect x="192" y="26" width="32" height="28" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="3"/>
  <text x="208" y="45" fill="#c084fc" font-size="13" text-anchor="middle">H</text>
  <line x1="224" y1="40" x2="310" y2="40" stroke="#9333ea" stroke-width="2"/>
  <text x="315" y="44" fill="#818cf8" font-size="12">|−⟩ mirrored blend</text>
  <text x="10" y="70" fill="#818cf8" font-size="12">Right Pylon (H→X):</text>
  <line x1="10" y1="80" x2="100" y2="80" stroke="#3b82f6" stroke-width="2"/>
  <rect x="100" y="66" width="32" height="28" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="3"/>
  <text x="116" y="85" fill="#c084fc" font-size="13" text-anchor="middle">H</text>
  <line x1="132" y1="80" x2="192" y2="80" stroke="#9333ea" stroke-width="2"/>
  <rect x="192" y="66" width="32" height="28" fill="#1e293b" stroke="#60a5fa" stroke-width="2" rx="3"/>
  <text x="208" y="85" fill="#60a5fa" font-size="13" text-anchor="middle">X</text>
  <line x1="224" y1="80" x2="310" y2="80" stroke="#9333ea" stroke-width="2"/>
  <text x="315" y="84" fill="#818cf8" font-size="12">|+⟩ even blend</text>
</svg>`,
            truthTable: [
                { input: "0", ops: "X → H", output: "|−⟩ mirrored mix", match: "Left Pylon ✔" },
                { input: "0", ops: "H → X", output: "|+⟩ even mix",     match: "Right Pylon ✔" },
            ],
            steps: [
                { icon:"①", text:"At Left Pylon Console — Press [E]", color:"#60a5fa" },
                { icon:"②", text:'Click "[X] Flip" FIRST → then "[H] Blend" → "⚡ ACTIVATE"', color:"#60a5fa" },
                { icon:"③", text:"At Right Pylon Console — Press [E]", color:"#c084fc" },
                { icon:"④", text:'Click "[H] Blend" FIRST → then "[X] Flip" → "⚡ ACTIVATE"', color:"#c084fc" },
                { icon:"🔗", text:"Echo Bridge powers on! Walk across to Dr. Ishan's Vault!", color:"#22c55e" },
            ],
        },
        // GATE 6
        {
            emoji: "🔒",
            color: "#f59e0b",
            title: "GATE 6 — Dr. Ishan's Vault Blast Door",
            subtitle: "D6 Reversal Vault → D7 Measurement Station",
            concept: "Quantum Reversal: Undo steps in REVERSE order",
            conceptDesc: "The vault was scrambled by running X → Z → H. Every quantum operation is reversible. To undo it, run the inverse steps backwards: H⁻¹ → Z⁻¹ → X⁻¹. Since X, Z, H are self-inverse: just run X → Z → H in reverse = H → Z → X.",
            formula: "Lock: X→Z→H    Unlock: H→Z→X    (reverse each step)",
            circuitSvg: `<svg width="100%" height="80" viewBox="0 0 520 80">
  <text x="10" y="18" fill="#f59e0b" font-size="12">Lock (how vault was scrambled):</text>
  <line x1="10" y1="35" x2="80" y2="35" stroke="#3b82f6" stroke-width="2"/>
  <rect x="80" y="22" width="30" height="26" fill="#1e293b" stroke="#ef4444" stroke-width="2" rx="3"/>
  <text x="95" y="40" fill="#ef4444" font-size="13" text-anchor="middle">X</text>
  <line x1="110" y1="35" x2="160" y2="35" stroke="#999" stroke-width="2"/>
  <rect x="160" y="22" width="30" height="26" fill="#1e293b" stroke="#ef4444" stroke-width="2" rx="3"/>
  <text x="175" y="40" fill="#ef4444" font-size="13" text-anchor="middle">Z</text>
  <line x1="190" y1="35" x2="240" y2="35" stroke="#999" stroke-width="2"/>
  <rect x="240" y="22" width="30" height="26" fill="#1e293b" stroke="#ef4444" stroke-width="2" rx="3"/>
  <text x="255" y="40" fill="#ef4444" font-size="13" text-anchor="middle">H</text>
  <line x1="270" y1="35" x2="320" y2="35" stroke="#f87171" stroke-width="2"/>
  <text x="325" y="40" fill="#f87171" font-size="12">SCRAMBLED 🔒</text>

  <text x="10" y="58" fill="#22c55e" font-size="12">Unlock (your steps — reverse order):</text>
  <line x1="10" y1="75" x2="80" y2="75" stroke="#f87171" stroke-width="2"/>
  <rect x="80" y="62" width="30" height="26" fill="#0f1e0f" stroke="#22c55e" stroke-width="2" rx="3"/>
  <text x="95" y="80" fill="#22c55e" font-size="13" text-anchor="middle">H</text>
  <line x1="110" y1="75" x2="160" y2="75" stroke="#999" stroke-width="2"/>
  <rect x="160" y="62" width="30" height="26" fill="#0f1e0f" stroke="#22c55e" stroke-width="2" rx="3"/>
  <text x="175" y="80" fill="#22c55e" font-size="13" text-anchor="middle">Z</text>
  <line x1="190" y1="75" x2="240" y2="75" stroke="#999" stroke-width="2"/>
  <rect x="240" y="62" width="30" height="26" fill="#0f1e0f" stroke="#22c55e" stroke-width="2" rx="3"/>
  <text x="255" y="80" fill="#22c55e" font-size="13" text-anchor="middle">X</text>
  <line x1="270" y1="75" x2="320" y2="75" stroke="#3b82f6" stroke-width="2"/>
  <text x="325" y="80" fill="#22c55e" font-size="12">|0⟩ OPEN ✔</text>
</svg>`,
            truthTable: [
                { input: "0", ops: "H",     output: "|+⟩", match: "1st reverse step" },
                { input: "|+⟩", ops: "Z",   output: "|−⟩", match: "2nd reverse step" },
                { input: "|−⟩", ops: "X",   output: "0 (Blue)", match: "Vault Unlocked ✔" },
            ],
            steps: [
                { icon:"①", text:"At Archive Lock Console — Press [E]", color:"#f59e0b" },
                { icon:"②", text:'Click "[H] Blender" — 1st reverse step', color:"#c084fc" },
                { icon:"③", text:'Click "[Z] Mirror" — 2nd reverse step', color:"#4ade80" },
                { icon:"④", text:'Click "[X] Flip" — 3rd reverse step', color:"#60a5fa" },
                { icon:"⑤", text:'Click "⚡ ACTIVATE" → lock reversal confirmed!', color:"#22c55e" },
                { icon:"🔗", text:"Blast door retracts! Walk up ramp to District 7!", color:"#22c55e" },
            ],
        },
        // GATE 7
        {
            emoji: "🔴",
            color: "#ef4444",
            title: "GATE 7 — Auditor Measurement Scanner",
            subtitle: "D7 Measurement Station → D8 Echo Core Pinnacle",
            concept: "Quantum Measurement: Observation Collapses the Wave!",
            conceptDesc: "While in 50/50 superposition, the lantern is BOTH Blue and Yellow simultaneously. The moment a scanner OBSERVES it, it randomly picks one — and can never go back. This is called wave function collapse.",
            formula: "Measure |+⟩ → Blue (0) with 50% prob  OR  Yellow (1) with 50% prob",
            circuitSvg: `<svg width="100%" height="70" viewBox="0 0 520 70">
  <line x1="10" y1="40" x2="100" y2="40" stroke="#3b82f6" stroke-width="2"/>
  <rect x="100" y="26" width="32" height="28" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="3"/>
  <text x="116" y="45" fill="#c084fc" font-size="13" text-anchor="middle">H</text>
  <line x1="132" y1="40" x2="210" y2="40" stroke="#9333ea" stroke-width="2"/>
  <text x="138" y="33" fill="#9333ea" font-size="12">|+⟩ blend</text>
  <rect x="210" y="22" width="60" height="36" fill="#1a0a0a" stroke="#ef4444" stroke-width="2" rx="4"/>
  <text x="225" y="38" fill="#ef4444" font-size="10">SCANNER</text>
  <text x="225" y="52" fill="#ef4444" font-size="10">👁️ OBSERVE</text>
  <line x1="270" y1="33" x2="360" y2="18" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="365" y="22" fill="#3b82f6" font-size="12">|0⟩ 50%</text>
  <line x1="270" y1="47" x2="360" y2="62" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="365" y="66" fill="#f59e0b" font-size="12">|1⟩ 50%</text>
  <text x="100" y="70" fill="#ef4444" font-size="11">↳ Wave collapses! Cannot undo after measuring!</text>
</svg>`,
            truthTable: [
                { input: "|+⟩", ops: "Measure", output: "0 (Blue) — 50% chance",   match: "Barrier drops ✔" },
                { input: "|+⟩", ops: "Measure", output: "1 (Yellow) — 50% chance", match: "Barrier drops ✔" },
            ],
            steps: [
                { icon:"①", text:"Walk onto the glowing red Measurement Station platform", color:"#ef4444" },
                { icon:"②", text:"Press [E] to open the Auditor Lab scanner panel", color:"#ef4444" },
                { icon:"③", text:'Click "[H] Blender" to create a 50/50 blend first', color:"#c084fc" },
                { icon:"④", text:'Click "🔬 Single-Shot Measurement" — scanner observes the lantern!', color:"#f59e0b" },
                { icon:"⑤", text:"Wave collapses! Scanner accepts either outcome — gate unlocks either way.", color:"#94a3b8" },
                { icon:"🔗", text:"Scanner barrier drops! Grand ramp to the Echo Core opens!", color:"#22c55e" },
            ],
        },
        // GATE 8
        {
            emoji: "👑",
            color: "#eab308",
            title: "GATE 8 — The Great Echo Core Pinnacle",
            subtitle: "D8 — Final Synthesis (Save the City!)",
            concept: "Master Synthesis: H→Z→H = X (without the switch!)",
            conceptDesc: "The Echo Core requires the exact same quantum trick as Gate 4 (H·Z·H=X) to reignite the city's harmonic resonance. Start at Blue (0), run the three-step sequence, arrive at Yellow (1) — the city is saved!",
            formula: "H→Z→H|0⟩ = |1⟩     Same as X but using only H & Z",
            circuitSvg: `<svg width="100%" height="60" viewBox="0 0 560 60">
  <line x1="10" y1="35" x2="80" y2="35" stroke="#3b82f6" stroke-width="2"/>
  <text x="15" y="28" fill="#3b82f6" font-size="12">|0⟩</text>
  <rect x="80" y="20" width="34" height="30" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
  <text x="97" y="40" fill="#c084fc" font-size="13" text-anchor="middle">H</text>
  <line x1="114" y1="35" x2="174" y2="35" stroke="#9333ea" stroke-width="2"/>
  <text x="118" y="28" fill="#9333ea" font-size="11">|+⟩</text>
  <rect x="174" y="20" width="34" height="30" fill="#1e293b" stroke="#4ade80" stroke-width="2" rx="4"/>
  <text x="191" y="40" fill="#4ade80" font-size="13" text-anchor="middle">Z</text>
  <line x1="208" y1="35" x2="268" y2="35" stroke="#9333ea" stroke-width="2"/>
  <text x="212" y="28" fill="#9333ea" font-size="11">|−⟩</text>
  <rect x="268" y="20" width="34" height="30" fill="#1e293b" stroke="#c084fc" stroke-width="2" rx="4"/>
  <text x="285" y="40" fill="#c084fc" font-size="13" text-anchor="middle">H</text>
  <line x1="302" y1="35" x2="400" y2="35" stroke="#eab308" stroke-width="2"/>
  <text x="308" y="28" fill="#eab308" font-size="12">|1⟩ CITY SAVED!</text>
  <text x="425" y="40" fill="#22c55e" font-size="18">🏆</text>
</svg>`,
            truthTable: [
                { input: "0",   ops: "H",  output: "|+⟩ 50/50",  match: "Step 1 ✔" },
                { input: "|+⟩", ops: "Z",  output: "|−⟩ mirrored", match: "Step 2 ✔" },
                { input: "|−⟩", ops: "H",  output: "1 (Yellow)",   match: "🏆 CITY SAVED!" },
            ],
            steps: [
                { icon:"①", text:"Climb the grand illuminated ramp to the highest rooftop", color:"#eab308" },
                { icon:"②", text:"Press [E] at the Echo Core Master Console", color:"#eab308" },
                { icon:"③", text:'Click "[H] Blender" — creates 50/50 blend', color:"#c084fc" },
                { icon:"④", text:'Click "[Z] Mirror" — flips wave polarity', color:"#4ade80" },
                { icon:"⑤", text:'Click "[H] Blender" again — waves recombine into Yellow (1)!', color:"#c084fc" },
                { icon:"⚡", text:'Click "⚡ ACTIVATE" — Echo Core reignites! Aster is saved! 🎉', color:"#22c55e" },
            ],
        },
    ];

    function showGateDetail(idx) {
        const d = GATE_DETAILS[idx];
        document.getElementById('gg-list-view').style.display = 'none';
        const dv = document.getElementById('gg-detail-view');
        dv.style.display = 'flex';
        document.getElementById('gg-detail-title').innerHTML =
            `<span style="color:${d.color}">${d.emoji} ${d.title}</span>`;

        // Build truth table rows
        let ttRows = d.truthTable.map(r =>
            `<tr>
                <td style="padding:8px 14px; color:#60a5fa; font-family:monospace; font-size:14px;">${r.input}</td>
                <td style="padding:8px 14px; text-align:center">
                    ${r.ops.split('→').map(op => op.trim()).map(op =>
                        `<span style="display:inline-block; background:#1e293b; border:1px solid #475569; border-radius:4px; padding:2px 8px; margin:0 2px; color:#c084fc; font-weight:700; font-size:13px;">${op}</span>`
                    ).join('<span style="color:#64748b; margin:0 3px">→</span>')}
                </td>
                <td style="padding:8px 14px; color:#f59e0b; font-family:monospace; font-size:14px;">${r.output}</td>
                <td style="padding:8px 14px; color:#22c55e; font-size:13px;">${r.match}</td>
            </tr>`
        ).join('');

        // Build steps
        let stepsHtml = d.steps.map(s =>
            `<div style="display:flex; gap:12px; align-items:flex-start; margin-bottom:10px;">
                <span style="font-size:18px; min-width:28px;">${s.icon}</span>
                <div style="font-size:14px; color:${s.color}; line-height:1.5;">${s.text}</div>
            </div>`
        ).join('');

        document.getElementById('gg-detail-content').innerHTML = `
            <!-- Subtitle -->
            <div style="color:#64748b; font-size:13px; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #1e293b;">
                ${d.subtitle}
            </div>

            <!-- Concept callout -->
            <div style="background:#0a0f1a; border:1px solid ${d.color}44; border-left:4px solid ${d.color}; border-radius:8px; padding:14px 18px; margin-bottom:20px;">
                <div style="font-weight:700; color:${d.color}; font-size:14px; margin-bottom:6px;">🧠 The Quantum Concept</div>
                <div style="font-size:14px; color:#cbd5e1; line-height:1.6;">${d.conceptDesc}</div>
            </div>

            <!-- Formula box (black, monospace) -->
            <div style="background:#000; border:1px solid #334155; border-radius:8px; padding:16px; margin-bottom:20px; font-family:monospace; font-size:16px; color:#22d3ee; text-align:center; letter-spacing:1px;">
                ${d.formula}
            </div>

            <!-- Circuit diagram -->
            <div style="background:#080d14; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:20px;">
                <div style="font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">⚡ Quantum Circuit Diagram</div>
                ${d.circuitSvg}
            </div>

            <!-- Truth table -->
            <div style="margin-bottom:20px;">
                <div style="font-size:13px; font-weight:700; color:#f59e0b; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">📊 Truth Table</div>
                <div style="overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; background:#080d14; border-radius:8px; overflow:hidden;">
                        <thead>
                            <tr style="background:#0f172a;">
                                <th style="padding:10px 14px; text-align:left; color:#475569; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Input State</th>
                                <th style="padding:10px 14px; text-align:center; color:#475569; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Operation(s)</th>
                                <th style="padding:10px 14px; text-align:left; color:#475569; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Output State</th>
                                <th style="padding:10px 14px; text-align:left; color:#475569; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Gate Effect</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ttRows}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Steps -->
            <div style="background:#0a0f1a; border:1px solid #1e293b; border-radius:8px; padding:18px;">
                <div style="font-size:13px; font-weight:700; color:#22c55e; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px;">✅ Step-by-Step: How to Open This Gate</div>
                ${stepsHtml}
            </div>
        `;
    }

    function hideGateDetail() {
        document.getElementById('gg-detail-view').style.display = 'none';
        document.getElementById('gg-list-view').style.display = 'flex';
        document.getElementById('gg-list-view').style.flexDirection = 'column';
    }
    </script>

'''

with open("/Users/thrishalyeggoni/quantum/web/index.html", "r", encoding="utf-8") as f:
    content = f.read()

start_marker = '<div id="gate-guide-modal"'
end_marker = '<div id="help-modal"'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + NEW_MODAL + content[end_idx:]
    with open("/Users/thrishalyeggoni/quantum/web/index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Gate guide with truth tables and circuits written to index.html!")
else:
    print(f"ERROR: Markers not found. start={start_idx} end={end_idx}")
