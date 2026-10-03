using System;
using UnityEngine;

namespace QuantumEcho.World
{
    /// <summary>
    /// Generates stylized low-poly 3D meshes for characters, drones, consoles, and district architecture
    /// completely in code without requiring any external FBX or OBJ files.
    /// </summary>
    public static class ProceduralMeshGenerator
    {
        public static GameObject CreateMiraCharacter(Transform parent = null)
        {
            GameObject mira = new GameObject("Mira_Character");
            if (parent != null) mira.transform.SetParent(parent, false);

            var visualRoot = new GameObject("VisualRoot");
            visualRoot.transform.SetParent(mira.transform, false);

            // 1. Torso & Tunic
            var torso = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            torso.name = "Torso";
            torso.transform.SetParent(visualRoot.transform, false);
            torso.transform.localPosition = new Vector3(0, 1.05f, 0);
            torso.transform.localScale = new Vector3(0.42f, 0.45f, 0.32f);
            var col = torso.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // 2. Head
            var head = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            head.name = "Head";
            head.transform.SetParent(visualRoot.transform, false);
            head.transform.localPosition = new Vector3(0, 1.62f, 0);
            head.transform.localScale = new Vector3(0.32f, 0.35f, 0.32f);
            col = head.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // Stylized Hair / Hood
            var hood = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            hood.name = "Hood";
            hood.transform.SetParent(head.transform, false);
            hood.transform.localPosition = new Vector3(0, 0.08f, -0.06f);
            hood.transform.localScale = new Vector3(1.1f, 1.05f, 1.15f);
            col = hood.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // 3. Legs
            var leftLeg = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            leftLeg.name = "LeftLeg";
            leftLeg.transform.SetParent(visualRoot.transform, false);
            leftLeg.transform.localPosition = new Vector3(-0.16f, 0.45f, 0);
            leftLeg.transform.localScale = new Vector3(0.14f, 0.45f, 0.14f);
            col = leftLeg.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            var rightLeg = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            rightLeg.name = "RightLeg";
            rightLeg.transform.SetParent(visualRoot.transform, false);
            rightLeg.transform.localPosition = new Vector3(0.16f, 0.45f, 0);
            rightLeg.transform.localScale = new Vector3(0.14f, 0.45f, 0.14f);
            col = rightLeg.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // 4. Arms & Lantern Hold
            var rightArm = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            rightArm.name = "RightArm";
            rightArm.transform.SetParent(visualRoot.transform, false);
            rightArm.transform.localPosition = new Vector3(0.32f, 1.0f, 0.2f);
            rightArm.transform.localRotation = Quaternion.Euler(45, 0, -15);
            rightArm.transform.localScale = new Vector3(0.1f, 0.3f, 0.1f);
            col = rightArm.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            var lanternPoint = new GameObject("LanternHoldPoint");
            lanternPoint.transform.SetParent(visualRoot.transform, false);
            lanternPoint.transform.localPosition = new Vector3(0.38f, 0.85f, 0.45f);

            // Assign materials
            Material tunicMat = CreateColorMaterial("Mat_MiraTunic", new Color(0.15f, 0.35f, 0.55f));
            Material skinMat = CreateColorMaterial("Mat_MiraSkin", new Color(0.92f, 0.76f, 0.65f));
            Material hoodMat = CreateColorMaterial("Mat_MiraHood", new Color(0.1f, 0.2f, 0.35f));
            Material bootMat = CreateColorMaterial("Mat_MiraBoots", new Color(0.12f, 0.12f, 0.14f));

            torso.GetComponent<Renderer>().material = tunicMat;
            head.GetComponent<Renderer>().material = skinMat;
            hood.GetComponent<Renderer>().material = hoodMat;
            leftLeg.GetComponent<Renderer>().material = bootMat;
            rightLeg.GetComponent<Renderer>().material = bootMat;
            rightArm.GetComponent<Renderer>().material = tunicMat;

            return mira;
        }

        public static GameObject CreateLumiDrone(Transform parent = null)
        {
            GameObject lumi = new GameObject("Lumi_GuideDrone");
            if (parent != null) lumi.transform.SetParent(parent, false);

            var body = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            body.name = "DroneCore";
            body.transform.SetParent(lumi.transform, false);
            body.transform.localScale = new Vector3(0.35f, 0.4f, 0.35f);
            var col = body.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            var eye = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            eye.name = "SensorEye";
            eye.transform.SetParent(body.transform, false);
            eye.transform.localPosition = new Vector3(0, 0, 0.4f);
            eye.transform.localScale = new Vector3(0.45f, 0.45f, 0.35f);
            col = eye.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // Mini wings
            var leftWing = GameObject.CreatePrimitive(PrimitiveType.Cube);
            leftWing.name = "LeftWing";
            leftWing.transform.SetParent(body.transform, false);
            leftWing.transform.localPosition = new Vector3(-0.45f, 0.05f, 0);
            leftWing.transform.localRotation = Quaternion.Euler(0, 0, 20);
            leftWing.transform.localScale = new Vector3(0.5f, 0.05f, 0.25f);
            col = leftWing.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            var rightWing = GameObject.CreatePrimitive(PrimitiveType.Cube);
            rightWing.name = "RightWing";
            rightWing.transform.SetParent(body.transform, false);
            rightWing.transform.localPosition = new Vector3(0.45f, 0.05f, 0);
            rightWing.transform.localRotation = Quaternion.Euler(0, 0, -20);
            rightWing.transform.localScale = new Vector3(0.5f, 0.05f, 0.25f);
            col = rightWing.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            Material droneBodyMat = CreateColorMaterial("Mat_LumiBody", new Color(0.85f, 0.88f, 0.92f));
            Material eyeMat = CreateEmissionMaterial("Mat_LumiEye", new Color(1.0f, 0.75f, 0.2f), 2.0f);

            body.GetComponent<Renderer>().material = droneBodyMat;
            eye.GetComponent<Renderer>().material = eyeMat;
            leftWing.GetComponent<Renderer>().material = droneBodyMat;
            rightWing.GetComponent<Renderer>().material = droneBodyMat;

            var droneLight = lumi.AddComponent<Light>();
            droneLight.type = LightType.Point;
            droneLight.color = new Color(1.0f, 0.85f, 0.3f);
            droneLight.range = 4.5f;
            droneLight.intensity = 1.4f;

            return lumi;
        }

        public static GameObject CreateEchoLanternObject(Transform parent = null)
        {
            GameObject lantern = new GameObject("EchoLantern");
            if (parent != null) lantern.transform.SetParent(parent, false);

            // Cage frame
            var frame = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            frame.name = "LanternFrame";
            frame.transform.SetParent(lantern.transform, false);
            frame.transform.localScale = new Vector3(0.18f, 0.22f, 0.18f);
            var col = frame.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // Central Qubit Orb
            var orb = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            orb.name = "CentralOrb";
            orb.transform.SetParent(lantern.transform, false);
            orb.transform.localScale = new Vector3(0.16f, 0.16f, 0.16f);
            col = orb.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // Superposition Branch 0 (Cyan |0⟩)
            var branch0 = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            branch0.name = "Branch0_Cyan";
            branch0.transform.SetParent(lantern.transform, false);
            branch0.transform.localPosition = new Vector3(-0.2f, 0, 0);
            branch0.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
            col = branch0.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // Superposition Branch 1 (Amber |1⟩)
            var branch1 = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            branch1.name = "Branch1_Amber";
            branch1.transform.SetParent(lantern.transform, false);
            branch1.transform.localPosition = new Vector3(0.2f, 0, 0);
            branch1.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
            col = branch1.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            // Phase Ring
            var phaseRing = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            phaseRing.name = "PhaseRing";
            phaseRing.transform.SetParent(lantern.transform, false);
            phaseRing.transform.localScale = new Vector3(0.38f, 0.015f, 0.38f);
            col = phaseRing.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            Material brassMat = CreateColorMaterial("Mat_LanternBrass", new Color(0.55f, 0.45f, 0.25f));
            Material orbMat = CreateEmissionMaterial("Mat_OrbEmission", new Color(0.2f, 0.8f, 1.0f), 2.5f);
            Material b0Mat = CreateEmissionMaterial("Mat_Branch0", new Color(0.15f, 0.75f, 1.0f), 3.0f);
            Material b1Mat = CreateEmissionMaterial("Mat_Branch1", new Color(1.0f, 0.65f, 0.15f), 3.0f);
            Material ringMat = CreateEmissionMaterial("Mat_PhaseRing", new Color(0.85f, 0.25f, 0.95f), 1.8f);

            frame.GetComponent<Renderer>().material = brassMat;
            orb.GetComponent<Renderer>().material = orbMat;
            branch0.GetComponent<Renderer>().material = b0Mat;
            branch1.GetComponent<Renderer>().material = b1Mat;
            phaseRing.GetComponent<Renderer>().material = ringMat;

            var mainLight = lantern.AddComponent<Light>();
            mainLight.type = LightType.Point;
            mainLight.range = 7.0f;
            mainLight.intensity = 1.8f;

            return lantern;
        }

        public static GameObject CreateQuantumConsoleModel(Transform parent = null)
        {
            GameObject console = new GameObject("QuantumConsole_Model");
            if (parent != null) console.transform.SetParent(parent, false);

            // Base pedestal
            var pedestal = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            pedestal.name = "Pedestal";
            pedestal.transform.SetParent(console.transform, false);
            pedestal.transform.localPosition = new Vector3(0, 0.5f, 0);
            pedestal.transform.localScale = new Vector3(0.7f, 0.5f, 0.7f);

            // Slanted terminal screen
            var screen = GameObject.CreatePrimitive(PrimitiveType.Cube);
            screen.name = "TerminalScreen";
            screen.transform.SetParent(console.transform, false);
            screen.transform.localPosition = new Vector3(0, 1.15f, 0.12f);
            screen.transform.localRotation = Quaternion.Euler(30, 0, 0);
            screen.transform.localScale = new Vector3(0.85f, 0.08f, 0.55f);

            // Glowing holo crystal on top
            var crystal = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            crystal.name = "HoloCrystal";
            crystal.transform.SetParent(console.transform, false);
            crystal.transform.localPosition = new Vector3(0, 1.5f, 0.12f);
            crystal.transform.localScale = new Vector3(0.22f, 0.32f, 0.22f);
            var col = crystal.GetComponent<Collider>();
            if (col != null) UnityEngine.Object.Destroy(col);

            Material baseMat = CreateColorMaterial("Mat_ConsoleMetal", new Color(0.18f, 0.22f, 0.28f));
            Material screenMat = CreateEmissionMaterial("Mat_ConsoleScreen", new Color(0.1f, 0.75f, 0.9f), 1.2f);
            Material crystalMat = CreateEmissionMaterial("Mat_ConsoleCrystal", new Color(0.3f, 0.9f, 1.0f), 2.5f);

            pedestal.GetComponent<Renderer>().material = baseMat;
            screen.GetComponent<Renderer>().material = screenMat;
            crystal.GetComponent<Renderer>().material = crystalMat;

            var consoleLight = console.AddComponent<Light>();
            consoleLight.type = LightType.Point;
            consoleLight.color = new Color(0.2f, 0.8f, 1.0f);
            consoleLight.range = 4.0f;
            consoleLight.intensity = 1.2f;

            return console;
        }

        public static Material CreateColorMaterial(string name, Color color)
        {
            Shader shader = Shader.Find("Universal Render Pipeline/Lit") ??
                            Shader.Find("Standard") ??
                            Shader.Find("Diffuse");
            Material mat = new Material(shader) { name = name, color = color };
            return mat;
        }

        public static Material CreateEmissionMaterial(string name, Color color, float intensity = 1.5f)
        {
            Shader shader = Shader.Find("Universal Render Pipeline/Lit") ??
                            Shader.Find("Standard") ??
                            Shader.Find("Diffuse");
            Material mat = new Material(shader) { name = name, color = color };
            mat.EnableKeyword("_EMISSION");
            if (mat.HasProperty("_EmissionColor"))
                mat.SetColor("_EmissionColor", color * intensity);
            return mat;
        }
    }
}
