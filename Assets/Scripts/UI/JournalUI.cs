using System;
using System.Collections.Generic;
using UnityEngine;
using QuantumEcho.Managers;

namespace QuantumEcho.UI
{
    [Serializable]
    public class JournalEntry
    {
        public string Title;
        public string Category;
        [TextArea(5, 12)] public string Content;

        public JournalEntry(string title, string category, string content)
        {
            Title = title;
            Category = category;
            Content = content;
        }
    }

    /// <summary>
    /// Educational Codex & Journal explaining quantum computing principles in depth.
    /// Accessible anytime via [J] hotkey.
    /// </summary>
    public class JournalUI : MonoBehaviour
    {
        private List<JournalEntry> _entries = new List<JournalEntry>();
        private int _selectedIndex = 0;
        private Vector2 _scrollPos;
        private bool _isOpen = false;

        private void Awake()
        {
            PopulateEntries();
        }

        public void Open()
        {
            _isOpen = true;
            gameObject.SetActive(true);
        }

        public void Close()
        {
            _isOpen = false;
            gameObject.SetActive(false);
        }

        private void PopulateEntries()
        {
            _entries.Add(new JournalEntry(
                "1. Basis States |0⟩ and |1⟩",
                "Fundamentals",
                "A classical bit is strictly either 0 or 1 at any moment.\n\n" +
                "In quantum computing, |0⟩ and |1⟩ (written using Dirac ket notation) form the orthonormal computational basis. When a qubit is prepared in pure state |0⟩, a measurement will reveal 0 with 100% certainty. Similarly, state |1⟩ yields 1 deterministically.\n\n" +
                "Preparation is a deliberate physical initialization process that sets a qubit into a known state. It is not an undo or inverse gate."
            ));

            _entries.Add(new JournalEntry(
                "2. Superposition and Amplitudes",
                "Fundamentals",
                "A qubit can exist in a linear combination of basis states:\n" +
                "|ψ⟩ = α|0⟩ + β|1⟩\n\n" +
                "Here α and β are complex probability amplitudes. They are NOT classical probabilities.\n\n" +
                "Crucially, superposition does NOT mean the qubit secretly picked 0 or 1 and hid it from us. The system is genuinely in an indeterminate quantum state until measured or interacted with."
            ));

            _entries.Add(new JournalEntry(
                "3. Amplitudes vs Probabilities (Born Rule)",
                "Measurement",
                "To find the probability of obtaining an outcome upon measurement in the computational basis, we take the absolute square of its complex amplitude (the Born Rule):\n\n" +
                "P(0) = |α|² = (Re(α))² + (Im(α))²\n" +
                "P(1) = |β|² = (Re(β))² + (Im(β))²\n\n" +
                "Because total probability must equal 100%, every physical state must be normalized:\n" +
                "|α|² + |β|² = 1."
            ));

            _entries.Add(new JournalEntry(
                "4. Relative Phase vs Global Phase",
                "Phase & Interference",
                "Consider two states:\n" +
                "|+⟩ = (|0⟩ + |1⟩)/√2\n" +
                "|−⟩ = (|0⟩ - |1⟩)/√2\n\n" +
                "Both states have identical measurement probabilities: P(0) = 50%, P(1) = 50%. A simple probability meter cannot distinguish them!\n\n" +
                "However, in |−⟩, the amplitude of |1⟩ has a negative sign: a relative phase of π (180°).\n" +
                "When we apply a Hadamard gate to convert phase differences into basis amplitudes:\n" +
                "H|+⟩ = |0⟩ (Constructive interference at 0)\n" +
                "H|−⟩ = |1⟩ (Destructive interference at 0, constructive at 1)\n\n" +
                "In contrast, multiplying the ENTIRE state by a phase factor e^(iγ)|ψ⟩ is a Global Phase, which is physically unobservable and does not affect any measurement or interference."
            ));

            _entries.Add(new JournalEntry(
                "5. The Core Gates: X, Z, and H",
                "Operations",
                "• Pauli-X (Bit Flip): Swaps amplitudes of |0⟩ and |1⟩. Analogous to classical NOT. Matrix: [[0, 1], [1, 0]].\n\n" +
                "• Pauli-Z (Phase Flip): Multiplies |1⟩ by -1, leaving |0⟩ unchanged. Matrix: [[1, 0], [0, -1]]. Notice Z|0⟩ = |0⟩, and Z|1⟩ = -|1⟩.\n\n" +
                "• Hadamard (H): Creates equal superposition from basis states. Matrix: (1/√2) * [[1, 1], [1, -1]].\n" +
                "H|0⟩ = |+⟩, H|1⟩ = |−⟩.\n\n" +
                "All three core gates are Hermitian and self-inverse: X² = I, Z² = I, H² = I."
            ));

            _entries.Add(new JournalEntry(
                "6. Gate Order Matters (Non-Commutativity)",
                "Operations",
                "In classical algebra, 2 × 3 = 3 × 2. In quantum circuits, matrix multiplication is generally non-commutative (AB ≠ BA).\n\n" +
                "Starting at |0⟩:\n" +
                "• Apply X, then H: X|0⟩ = |1⟩ → H|1⟩ = |−⟩.\n" +
                "• Apply H, then X: H|0⟩ = |+⟩ → X|+⟩ = |+⟩.\n\n" +
                "States |−⟩ and |+⟩ are orthogonal! The order of gates determines the exact trajectory on the Bloch sphere."
            ));

            _entries.Add(new JournalEntry(
                "7. Unitary Evolution and Reversibility",
                "Operations",
                "All closed quantum operations are described by Unitary matrices (U†U = I). Unitary evolution preserves vector lengths (|α|² + |β|² = 1) and inner products.\n\n" +
                "Because U is unitary, its inverse is its conjugate transpose: U⁻¹ = U†.\n" +
                "To reverse a sequence of gates (A B C), you must apply their inverses in reverse order:\n" +
                "(A B C)⁻¹ = C⁻¹ B⁻¹ A⁻¹.\n\n" +
                "As long as a quantum system undergoes unitary evolution and its gate history is known, its operations can be completely and deterministically retraced!"
            ));

            _entries.Add(new JournalEntry(
                "8. The Bloch Sphere",
                "Geometry",
                "Every pure single-qubit state can be mapped to a point on the surface of a unit sphere called the Bloch Sphere:\n\n" +
                "x = 2 Re(α* β)\n" +
                "y = 2 Im(α* β)\n" +
                "z = |α|² - |β|²\n\n" +
                "• North Pole (+Z): |0⟩\n" +
                "• South Pole (-Z): |1⟩\n" +
                "• Equator (+X): |+⟩\n" +
                "• Equator (-X): |−⟩\n" +
                "• Equator (+Y): |+i⟩\n\n" +
                "Hadamard Rotation: On the Bloch sphere, the Hadamard gate acts as a 180° rotation around the diagonal axis (X+Z)/√2 halfway between X and Z."
            ));

            _entries.Add(new JournalEntry(
                "9. Measurement: The Limit of Reversal",
                "The Auditor's Mistake",
                "The Auditor made a catastrophic mistake: it believed measurement could be treated like any other maintenance checkpoint.\n\n" +
                "Unitary gates are reversible. Measurement is fundamentally NOT:\n" +
                "When a qubit in superposition (|0⟩+|1⟩)/√2 is measured, it collapses into either |0⟩ or |1⟩ with 50% probability according to the Born Rule.\n\n" +
                "From the single measured outcome (e.g. '0'), you cannot mathematically reconstruct whether the pre-measurement state was |0⟩, |+⟩, or an arbitrary superposition. The relative phase and pre-measurement coherence were irrevocably destroyed.\n\n" +
                "This is why the city lost its records: measurements cannot be run in reverse. Infrastructure can only be rebuilt from known preparation instructions, not magical unwinding of collapsed measurements."
            ));
        }

        private void OnGUI()
        {
            if (!_isOpen) return;

            GUI.skin.box.fontSize = 13;
            GUI.skin.button.fontSize = 13;
            GUI.skin.label.fontSize = 13;

            // Dim backdrop
            GUI.color = new Color(0.04f, 0.08f, 0.16f, 0.95f);
            GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Texture2D.whiteTexture);
            GUI.color = Color.white;

            float width = Mathf.Min(Screen.width - 60f, 920f);
            float height = Mathf.Min(Screen.height - 50f, 620f);
            Rect panelRect = new Rect((Screen.width - width) * 0.5f, (Screen.height - height) * 0.5f, width, height);

            GUILayout.BeginArea(panelRect, GUI.skin.box);

            // Header
            GUILayout.BeginHorizontal();
            GUILayout.Label("<b><size=18>ASTER CODEX — QUANTUM MECHANICS JOURNAL</size></b>");
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("✕ Close [Esc/J]", GUILayout.Width(130), GUILayout.Height(28)))
            {
                GameManager.Instance?.CloseJournal();
            }
            GUILayout.EndHorizontal();
            GUILayout.Space(6);

            GUILayout.BeginHorizontal();

            // Left List (Entries)
            GUILayout.BeginVertical(GUI.skin.box, GUILayout.Width(width * 0.35f));
            GUILayout.Label("<b>TOPICS</b>");
            for (int i = 0; i < _entries.Count; i++)
            {
                bool isSel = (i == _selectedIndex);
                GUI.color = isSel ? new Color(0.3f, 0.9f, 1.0f) : Color.white;
                if (GUILayout.Button(_entries[i].Title, GUILayout.Height(30)))
                {
                    _selectedIndex = i;
                    GameManager.Instance?.Audio?.PlayButtonClick();
                }
            }
            GUI.color = Color.white;
            GUILayout.EndVertical();

            // Right View (Content)
            GUILayout.BeginVertical(GUI.skin.box, GUILayout.Width(width * 0.62f));
            if (_selectedIndex >= 0 && _selectedIndex < _entries.Count)
            {
                var entry = _entries[_selectedIndex];
                GUILayout.Label($"<b><size=16>{entry.Title}</size></b>");
                GUILayout.Label($"<i>Category: {entry.Category}</i>");
                GUILayout.Space(8);

                _scrollPos = GUILayout.BeginScrollView(_scrollPos);
                GUILayout.Label($"<size=13>{entry.Content}</size>");
                GUILayout.EndScrollView();
            }
            GUILayout.EndVertical();

            GUILayout.EndHorizontal();
            GUILayout.EndArea();
        }
    }
}
