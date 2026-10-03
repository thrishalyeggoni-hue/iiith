using System;
using UnityEngine;
using QuantumEcho.Quantum;

namespace QuantumEcho.Gameplay.Player
{
    /// <summary>
    /// Visual and gameplay representation of the carried Echo Lantern containing the active qubit.
    /// Renders quantum state amplitudes as light branches and phase rings.
    /// </summary>
    public class EchoLantern : MonoBehaviour
    {
        [Header("Lantern Lights & Meshes")]
        public Light MainLight;
        public Light Branch0Light;
        public Light Branch1Light;
        public Renderer CentralOrbRenderer;
        public Transform Branch0Transform;
        public Transform Branch1Transform;
        public Transform PhaseRingTransform;

        [Header("Colors")]
        public Color State0Color = new Color(0.15f, 0.75f, 1.0f); // Cyan
        public Color State1Color = new Color(1.0f, 0.65f, 0.15f); // Amber / Gold
        public Color PhaseIndicatorColor = new Color(0.85f, 0.25f, 0.95f); // Violet

        private Material _orbMaterial;
        private QuantumState _lastState;

        private void Awake()
        {
            if (CentralOrbRenderer != null)
            {
                _orbMaterial = CentralOrbRenderer.material;
            }
        }

        private void Update()
        {
            // Subtle idle floating / breathing animation for branches
            float bob0 = Mathf.Sin(Time.time * 2.5f) * 0.04f;
            float bob1 = Mathf.Cos(Time.time * 2.5f) * 0.04f;

            if (Branch0Transform != null)
                Branch0Transform.localPosition = new Vector3(-0.25f, bob0, 0f);

            if (Branch1Transform != null)
                Branch1Transform.localPosition = new Vector3(0.25f, bob1, 0f);

            if (PhaseRingTransform != null && _lastState != null)
            {
                // Rotate phase ring according to relative phase angle
                float phaseDeg = (float)_lastState.RelativePhaseDegrees;
                PhaseRingTransform.localRotation = Quaternion.Euler(0, phaseDeg + (Time.time * 30f), 0);
            }
        }

        public void UpdateVisuals(QuantumState state)
        {
            if (state == null) return;
            _lastState = state;

            float p0 = (float)state.Probability0;
            float p1 = (float)state.Probability1;

            // Interpolate light colors based on basis probabilities
            Color blendedColor = (State0Color * p0) + (State1Color * p1);
            if (MainLight != null)
            {
                MainLight.color = blendedColor;
                MainLight.intensity = 1.8f;
            }

            if (Branch0Light != null)
            {
                Branch0Light.color = State0Color;
                Branch0Light.intensity = p0 * 2.0f;
                Branch0Light.enabled = p0 > 0.02f;
            }

            if (Branch1Light != null)
            {
                Branch1Light.color = State1Color;
                Branch1Light.intensity = p1 * 2.0f;
                Branch1Light.enabled = p1 > 0.02f;
            }

            if (Branch0Transform != null)
            {
                float scale0 = Mathf.Max(0.1f, Mathf.Sqrt(p0));
                Branch0Transform.localScale = Vector3.one * scale0;
                Branch0Transform.gameObject.SetActive(p0 > 0.02f);
            }

            if (Branch1Transform != null)
            {
                float scale1 = Mathf.Max(0.1f, Mathf.Sqrt(p1));
                Branch1Transform.localScale = Vector3.one * scale1;
                Branch1Transform.gameObject.SetActive(p1 > 0.02f);
            }

            if (CentralOrbRenderer != null && _orbMaterial != null)
            {
                _orbMaterial.color = blendedColor;
                if (_orbMaterial.HasProperty("_EmissionColor"))
                {
                    _orbMaterial.SetColor("_EmissionColor", blendedColor * 1.5f);
                    _orbMaterial.EnableKeyword("_EMISSION");
                }
            }

            // Phase ring active when in superposition and relative phase exists
            if (PhaseRingTransform != null)
            {
                bool hasSuperposition = p0 > 0.05f && p1 > 0.05f;
                PhaseRingTransform.gameObject.SetActive(hasSuperposition);
            }
        }
    }
}
