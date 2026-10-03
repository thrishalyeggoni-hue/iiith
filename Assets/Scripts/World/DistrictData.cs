using System;
using UnityEngine;

namespace QuantumEcho.World
{
    [Serializable]
    public class DistrictInfo
    {
        public int Number;
        public string Name;
        public Vector3 CenterPosition;
        public Color AmbientColor;
        public string PrimaryConcept;

        public DistrictInfo(int number, string name, Vector3 center, Color ambient, string concept)
        {
            Number = number;
            Name = name;
            CenterPosition = center;
            AmbientColor = ambient;
            PrimaryConcept = concept;
        }
    }

    public static class DistrictCatalog
    {
        public static readonly DistrictInfo[] AllDistricts = new DistrictInfo[]
        {
            new DistrictInfo(1, "Arrival Harbor", new Vector3(0, 0, 0), new Color(0.2f, 0.45f, 0.75f), "Basis States |0⟩ and |1⟩"),
            new DistrictInfo(2, "Switchworks", new Vector3(0, 2, 38), new Color(0.85f, 0.55f, 0.2f), "Pauli-X Bit Flip & Self-Inversion"),
            new DistrictInfo(3, "The Twin-Light Garden", new Vector3(28, 4, 75), new Color(0.2f, 0.85f, 0.55f), "Superposition & Hadamard H"),
            new DistrictInfo(4, "Phase Observatory", new Vector3(55, 7, 110), new Color(0.6f, 0.3f, 0.9f), "Pauli-Z Gate & Relative Phase"),
            new DistrictInfo(5, "Echo Bridge", new Vector3(25, 9, 145), new Color(0.3f, 0.7f, 0.95f), "Gate Order Non-Commutativity"),
            new DistrictInfo(6, "The Reversal Vault", new Vector3(-45, 10, 155), new Color(0.85f, 0.75f, 0.35f), "Unitary Inverses (ABC)⁻¹ = C⁻¹B⁻¹A⁻¹"),
            new DistrictInfo(7, "Measurement Station", new Vector3(-15, 12, 195), new Color(0.9f, 0.25f, 0.3f), "Non-Unitary Collapse & Born Rule"),
            new DistrictInfo(8, "The Echo Core", new Vector3(0, 15, 240), new Color(0.4f, 0.9f, 1.0f), "Final Synthesis & Network Restoration")
        };
    }
}
