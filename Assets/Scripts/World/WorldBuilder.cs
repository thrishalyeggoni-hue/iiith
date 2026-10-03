using System;
using UnityEngine;
using QuantumEcho.Gameplay.Player;
using QuantumEcho.Gameplay.Interaction;
using QuantumEcho.Gameplay.Puzzles;
using QuantumEcho.Managers;
using QuantumEcho.UI;

namespace QuantumEcho.World
{
    /// <summary>
    /// Programmatically generates the entire city of Aster across all 8 districts:
    /// walkways, central pinnacle tower, puzzle consoles, coherence relays, measurement barriers,
    /// character, drone companion, lighting, hazard planes, and UI controllers.
    /// </summary>
    public class WorldBuilder : MonoBehaviour
    {
        [Header("Generation Settings")]
        public bool BuildOnStart = true;
        public bool ClearExistingBeforeBuild = true;

        private void Start()
        {
            if (BuildOnStart)
            {
                // Only build if scene does not already have an active city root
                if (GameObject.Find("City_Of_Aster") == null)
                {
                    GenerateCompleteCity();
                }
            }
        }

        [ContextMenu("Generate Complete City")]
        public void GenerateCompleteCity()
        {
            if (ClearExistingBeforeBuild)
            {
                var existing = GameObject.Find("City_Of_Aster");
                if (existing != null) DestroyImmediate(existing);
            }

            GameObject cityRoot = new GameObject("City_Of_Aster");

            // 1. Build Environment Materials
            Material floorStoneMat = ProceduralMeshGenerator.CreateColorMaterial("Mat_CityStone", new Color(0.25f, 0.28f, 0.33f));
            Material wallMat = ProceduralMeshGenerator.CreateColorMaterial("Mat_CityWalls", new Color(0.18f, 0.2f, 0.24f));
            Material canalMat = ProceduralMeshGenerator.CreateColorMaterial("Mat_QuantumCanal", new Color(0.08f, 0.15f, 0.3f));
            Material energyBarrierMat = ProceduralMeshGenerator.CreateEmissionMaterial("Mat_EnergyBarrier", new Color(0.95f, 0.25f, 0.35f), 2.2f);
            Material towerMat = ProceduralMeshGenerator.CreateColorMaterial("Mat_CoreTower", new Color(0.12f, 0.16f, 0.22f));
            Material towerRingMat = ProceduralMeshGenerator.CreateEmissionMaterial("Mat_TowerRings", new Color(0.2f, 0.85f, 1.0f), 2.5f);

            // 2. Hazard Fall Floor
            var hazard = GameObject.CreatePrimitive(PrimitiveType.Cube);
            hazard.name = "Global_HazardFloor";
            hazard.transform.SetParent(cityRoot.transform, false);
            hazard.transform.position = new Vector3(0, -8.0f, 100);
            hazard.transform.localScale = new Vector3(400, 2, 500);
            hazard.GetComponent<Renderer>().material = canalMat;
            var hBox = hazard.GetComponent<BoxCollider>();
            hBox.isTrigger = true;
            hazard.AddComponent<HazardZone>();

            // 3. Central Spire: The Echo Core Tower (Visible across multiple districts!)
            var centralTower = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            centralTower.name = "CentralTower_EchoCore";
            centralTower.transform.SetParent(cityRoot.transform, false);
            centralTower.transform.position = new Vector3(0, 45, 240);
            centralTower.transform.localScale = new Vector3(14, 45, 14);
            centralTower.GetComponent<Renderer>().material = towerMat;

            // Tower Spire Peak
            var towerPeak = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            towerPeak.name = "TowerSpire";
            towerPeak.transform.SetParent(centralTower.transform, false);
            towerPeak.transform.localPosition = new Vector3(0, 1.2f, 0);
            towerPeak.transform.localScale = new Vector3(0.5f, 0.8f, 0.5f);
            towerPeak.GetComponent<Renderer>().material = towerRingMat;

            // Harmonic Rings around tower
            for (int r = 0; r < 6; r++)
            {
                var ring = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                ring.name = $"HarmonicRing_{r + 1}";
                ring.transform.SetParent(centralTower.transform, false);
                ring.transform.localPosition = new Vector3(0, -0.6f + (r * 0.25f), 0);
                ring.transform.localScale = new Vector3(1.35f + (r * 0.05f), 0.04f, 1.35f + (r * 0.05f));
                ring.GetComponent<Renderer>().material = towerRingMat;
            }

            // 4. District 1: Arrival Harbor
            CreatePlatform(cityRoot.transform, "D1_ArrivalHarbor_Plaza", new Vector3(0, 0, 0), new Vector3(24, 1.5f, 28), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D1_Checkpoint", new Vector3(0, 1.0f, -6));
            CreateConsole(cityRoot.transform, "Console_Ch1_P1", "ch1_p1", new Vector3(-5.5f, 0.75f, 6));
            CreateConsole(cityRoot.transform, "Console_Ch1_P2", "ch1_p2", new Vector3(5.5f, 0.75f, 6));

            // Harbor Gate
            var harborGate = CreateBarrier(cityRoot.transform, "D1_HarborGate_Barrier", new Vector3(0, 2.5f, 14), new Vector3(8, 5, 1), energyBarrierMat);

            // Connect Console Ch1_P2 to unlock harbor gate
            var p2Console = GameObject.Find("Console_Ch1_P2")?.GetComponent<PuzzleConsole>();
            if (p2Console != null) p2Console.WorldObjectToUnlock = harborGate;

            // 5. District 2: Switchworks
            CreatePlatform(cityRoot.transform, "D1_to_D2_Walkway", new Vector3(0, 0.5f, 24), new Vector3(6, 1.2f, 18), floorStoneMat);
            CreatePlatform(cityRoot.transform, "D2_Switchworks_Plaza", new Vector3(0, 2.0f, 42), new Vector3(26, 1.5f, 24), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D2_Checkpoint", new Vector3(0, 3.0f, 32));
            CreateConsole(cityRoot.transform, "Console_Ch2_P1", "ch2_p1", new Vector3(-6, 2.75f, 42));
            CreateConsole(cityRoot.transform, "Console_Ch2_P2", "ch2_p2", new Vector3(6, 2.75f, 42));

            // Hydraulic Lift / Bridge to District 3
            var d2Bridge = CreatePlatform(cityRoot.transform, "D2_to_D3_Bridge", new Vector3(14, 2.5f, 54), new Vector3(16, 1.2f, 6), floorStoneMat);
            var p1Console = GameObject.Find("Console_Ch2_P1")?.GetComponent<PuzzleConsole>();
            if (p1Console != null) p1Console.WorldObjectToUnlock = d2Bridge;

            // 6. District 3: The Twin-Light Garden
            CreatePlatform(cityRoot.transform, "D3_Garden_Plaza", new Vector3(28, 4.0f, 75), new Vector3(28, 1.5f, 30), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D3_Checkpoint", new Vector3(28, 5.0f, 63));
            CreateConsole(cityRoot.transform, "Console_Ch3_P1", "ch3_p1", new Vector3(22, 4.75f, 75));
            CreateConsole(cityRoot.transform, "Console_Ch3_P2", "ch3_p2", new Vector3(34, 4.75f, 75));

            // Coherence Relay Gate
            var gardenGate = CreateBarrier(cityRoot.transform, "D3_GardenGate_Barrier", new Vector3(40, 5.5f, 88), new Vector3(8, 5, 1), energyBarrierMat);
            CreateCoherenceRelay(cityRoot.transform, "D3_CoherenceRelay", new Vector3(38, 4.75f, 86), "|+⟩", gardenGate);

            // 7. District 4: Phase Observatory
            CreatePlatform(cityRoot.transform, "D3_to_D4_Stairs", new Vector3(48, 5.5f, 98), new Vector3(8, 1.2f, 18), floorStoneMat);
            CreatePlatform(cityRoot.transform, "D4_Observatory_Plaza", new Vector3(55, 7.0f, 115), new Vector3(26, 1.5f, 26), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D4_Checkpoint", new Vector3(55, 8.0f, 105));
            CreateConsole(cityRoot.transform, "Console_Ch4_P1", "ch4_p1", new Vector3(50, 7.75f, 115));
            CreateConsole(cityRoot.transform, "Console_Ch4_P2", "ch4_p2", new Vector3(60, 7.75f, 115));

            // Central Observatory Beacon Telescope
            var beaconTelescope = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            beaconTelescope.name = "ObservatoryBeacon";
            beaconTelescope.transform.SetParent(cityRoot.transform, false);
            beaconTelescope.transform.position = new Vector3(55, 11.5f, 122);
            beaconTelescope.transform.rotation = Quaternion.Euler(40, 0, 0);
            beaconTelescope.transform.localScale = new Vector3(1.8f, 5.0f, 1.8f);
            beaconTelescope.GetComponent<Renderer>().material = towerMat;

            // 8. District 5: Echo Bridge
            CreatePlatform(cityRoot.transform, "D5_EchoBridge_Span1", new Vector3(35, 8.5f, 135), new Vector3(18, 1.2f, 6), floorStoneMat);
            CreatePlatform(cityRoot.transform, "D5_BridgePylon_Plaza", new Vector3(15, 9.5f, 145), new Vector3(20, 1.5f, 20), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D5_Checkpoint", new Vector3(20, 10.5f, 140));
            CreateConsole(cityRoot.transform, "Console_Ch5_P1", "ch5_p1", new Vector3(10, 10.25f, 145));
            CreateConsole(cityRoot.transform, "Console_Ch5_P2", "ch5_p2", new Vector3(20, 10.25f, 145));

            var bridgeSpan2 = CreatePlatform(cityRoot.transform, "D5_EchoBridge_Span2", new Vector3(-15, 10.0f, 150), new Vector3(22, 1.2f, 6), floorStoneMat);
            var p5Console = GameObject.Find("Console_Ch5_P2")?.GetComponent<PuzzleConsole>();
            if (p5Console != null) p5Console.WorldObjectToUnlock = bridgeSpan2;

            // 9. District 6: The Reversal Vault
            CreatePlatform(cityRoot.transform, "D6_ReversalVault_Plaza", new Vector3(-45, 10.5f, 158), new Vector3(26, 1.5f, 28), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D6_Checkpoint", new Vector3(-40, 11.5f, 150));
            CreateConsole(cityRoot.transform, "Console_Ch6_P1", "ch6_p1", new Vector3(-45, 11.25f, 160));

            // Vault Door
            var vaultDoor = CreateBarrier(cityRoot.transform, "D6_VaultDoor", new Vector3(-35, 12.0f, 175), new Vector3(8, 6, 1), energyBarrierMat);
            var p6Console = GameObject.Find("Console_Ch6_P1")?.GetComponent<PuzzleConsole>();
            if (p6Console != null) p6Console.WorldObjectToUnlock = vaultDoor;

            // 10. District 7: Measurement Station
            CreatePlatform(cityRoot.transform, "D6_to_D7_Walkway", new Vector3(-25, 11.5f, 182), new Vector3(8, 1.2f, 18), floorStoneMat);
            CreatePlatform(cityRoot.transform, "D7_MeasurementStation_Plaza", new Vector3(-15, 12.5f, 198), new Vector3(28, 1.5f, 26), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D7_Checkpoint", new Vector3(-15, 13.5f, 190));

            var measurementBarrier = CreateBarrier(cityRoot.transform, "D7_AuditorBarrier", new Vector3(0, 14.5f, 215), new Vector3(12, 6, 1), energyBarrierMat);
            CreateMeasurementStation(cityRoot.transform, "D7_MeasurementStation", new Vector3(-15, 13.25f, 202), measurementBarrier);

            // 11. District 8: The Echo Core Pinnacle
            CreatePlatform(cityRoot.transform, "D8_EchoCore_GrandPlaza", new Vector3(0, 15.0f, 235), new Vector3(34, 1.8f, 32), floorStoneMat);
            CreateCheckpoint(cityRoot.transform, "D8_Checkpoint", new Vector3(0, 16.0f, 222));
            CreateConsole(cityRoot.transform, "Console_Ch8_Final", "ch8_final", new Vector3(0, 16.0f, 236));

            // 12. Lighting Setup
            CreateAtmosphericLighting(cityRoot.transform);

            // 13. Player & Camera Setup
            SetupPlayerAndCamera(cityRoot.transform);

            Debug.Log("[WorldBuilder] Successfully generated the complete 8-district Floating City of Aster!");
        }

        private GameObject CreatePlatform(Transform parent, string name, Vector3 pos, Vector3 size, Material mat)
        {
            var plat = GameObject.CreatePrimitive(PrimitiveType.Cube);
            plat.name = name;
            plat.transform.SetParent(parent, false);
            plat.transform.position = pos;
            plat.transform.localScale = size;
            plat.GetComponent<Renderer>().material = mat;
            return plat;
        }

        private GameObject CreateBarrier(Transform parent, string name, Vector3 pos, Vector3 size, Material mat)
        {
            var barrier = GameObject.CreatePrimitive(PrimitiveType.Cube);
            barrier.name = name;
            barrier.transform.SetParent(parent, false);
            barrier.transform.position = pos;
            barrier.transform.localScale = size;
            barrier.GetComponent<Renderer>().material = mat;
            return barrier;
        }

        private void CreateConsole(Transform parent, string objectName, string puzzleId, Vector3 pos)
        {
            var consoleObj = ProceduralMeshGenerator.CreateQuantumConsoleModel(parent);
            consoleObj.name = objectName;
            consoleObj.transform.position = pos;

            var consoleScript = consoleObj.AddComponent<PuzzleConsole>();
            consoleScript.PuzzleId = puzzleId;

            // Add trigger interaction collider
            var boxCol = consoleObj.AddComponent<BoxCollider>();
            boxCol.isTrigger = true;
            boxCol.center = new Vector3(0, 1.0f, 0);
            boxCol.size = new Vector3(2.5f, 2.5f, 2.5f);
        }

        private void CreateCoherenceRelay(Transform parent, string name, Vector3 pos, string requiredState, GameObject barrier)
        {
            var relayObj = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            relayObj.name = name;
            relayObj.transform.SetParent(parent, false);
            relayObj.transform.position = pos;
            relayObj.transform.localScale = new Vector3(1.0f, 1.6f, 1.0f);

            var col = relayObj.GetComponent<Collider>();
            col.isTrigger = true;

            var relayScript = relayObj.AddComponent<CoherenceRelay>();
            relayScript.RequiredStateName = requiredState;
            relayScript.BarrierToOpen = barrier;
            relayScript.RelayCoreRenderer = relayObj.GetComponent<Renderer>();

            var light = relayObj.AddComponent<Light>();
            light.type = LightType.Point;
            light.color = new Color(0.2f, 0.9f, 1.0f);
            light.range = 5.0f;
            light.intensity = 1.5f;
            relayScript.RelayGlowLight = light;
        }

        private void CreateMeasurementStation(Transform parent, string name, Vector3 pos, GameObject barrier)
        {
            var stationObj = ProceduralMeshGenerator.CreateQuantumConsoleModel(parent);
            stationObj.name = name;
            stationObj.transform.position = pos;

            var stationScript = stationObj.AddComponent<MeasurementStation>();
            stationScript.BarrierToDeactivate = barrier;

            var boxCol = stationObj.AddComponent<BoxCollider>();
            boxCol.isTrigger = true;
            boxCol.center = new Vector3(0, 1.0f, 0);
            boxCol.size = new Vector3(3.0f, 3.0f, 3.0f);
        }

        private void CreateCheckpoint(Transform parent, string name, Vector3 pos)
        {
            var cp = new GameObject(name);
            cp.transform.SetParent(parent, false);
            cp.transform.position = pos;

            var box = cp.AddComponent<BoxCollider>();
            box.isTrigger = true;
            box.size = new Vector3(12, 4, 8);

            var cpScript = cp.AddComponent<CheckpointTrigger>();
            cpScript.CheckpointName = name;
        }

        private void CreateAtmosphericLighting(Transform parent)
        {
            var lightObj = new GameObject("DirectionalLight_Sun");
            lightObj.transform.SetParent(parent, false);
            lightObj.transform.rotation = Quaternion.Euler(45, -30, 0);

            var light = lightObj.AddComponent<Light>();
            light.type = LightType.Directional;
            light.color = new Color(1.0f, 0.96f, 0.9f);
            light.intensity = 1.15f;

            // Ambient sky tone
            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
            RenderSettings.ambientLight = new Color(0.18f, 0.22f, 0.32f);
        }

        private void SetupPlayerAndCamera(Transform parent)
        {
            // Spawn player at Arrival Harbor start
            Vector3 startPos = new Vector3(0, 1.5f, -8.0f);

            var player = new GameObject("Mira_Player");
            player.transform.SetParent(parent, false);
            player.transform.position = startPos;

            var charController = player.AddComponent<CharacterController>();
            charController.center = new Vector3(0, 1.0f, 0);
            charController.height = 2.0f;
            charController.radius = 0.4f;

            var miraVisual = ProceduralMeshGenerator.CreateMiraCharacter(player.transform);
            miraVisual.transform.localPosition = Vector3.zero;

            var lantern = ProceduralMeshGenerator.CreateEchoLanternObject(player.transform);
            lantern.transform.localPosition = new Vector3(0.38f, 0.85f, 0.45f);

            var playerScript = player.AddComponent<ThirdPersonController>();
            playerScript.VisualRoot = miraVisual.transform.Find("VisualRoot");
            playerScript.LeftLeg = playerScript.VisualRoot.Find("LeftLeg");
            playerScript.RightLeg = playerScript.VisualRoot.Find("RightLeg");
            playerScript.LanternHoldPoint = playerScript.VisualRoot.Find("LanternHoldPoint");

            var lanternScript = lantern.AddComponent<EchoLantern>();
            lanternScript.MainLight = lantern.GetComponent<Light>();
            lanternScript.CentralOrbRenderer = lantern.transform.Find("CentralOrb")?.GetComponent<Renderer>();
            lanternScript.Branch0Transform = lantern.transform.Find("Branch0_Cyan");
            lanternScript.Branch1Transform = lantern.transform.Find("Branch1_Amber");
            lanternScript.PhaseRingTransform = lantern.transform.Find("PhaseRing");

            var interactor = player.AddComponent<InteractionController>();

            // Spawn companion drone Lumi hovering near Mira
            var lumi = ProceduralMeshGenerator.CreateLumiDrone(player.transform);
            lumi.transform.localPosition = new Vector3(-0.65f, 1.7f, 0.2f);

            // Camera Setup
            var camObj = Camera.main != null ? Camera.main.gameObject : new GameObject("MainCamera");
            camObj.tag = "MainCamera";
            camObj.transform.SetParent(parent, false);

            var camScript = camObj.GetComponent<ThirdPersonCamera>() ?? camObj.AddComponent<ThirdPersonCamera>();
            camScript.Target = player.transform;
            camScript.Distance = 4.2f;

            // Wire up GameManager references
            var gm = FindObjectOfType<GameManager>();
            if (gm != null)
            {
                gm.Player = playerScript;
                gm.CameraController = camScript;
                gm.Lantern = lanternScript;
                gm.Interactor = interactor;
            }
        }
    }
}
