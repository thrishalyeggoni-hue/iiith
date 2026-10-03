using UnityEngine;
using QuantumEcho.Gameplay.Player;

namespace QuantumEcho.Gameplay.Interaction
{
    public class CheckpointTrigger : MonoBehaviour
    {
        public string CheckpointName = "District Checkpoint";
        public Transform RespawnPoint;

        private void OnTriggerEnter(Collider other)
        {
            var controller = other.GetComponent<ThirdPersonController>();
            if (controller != null)
            {
                Vector3 targetPos = RespawnPoint != null ? RespawnPoint.position : transform.position;
                Quaternion targetRot = RespawnPoint != null ? RespawnPoint.rotation : transform.rotation;
                controller.SetSafeCheckpoint(targetPos, targetRot);
            }
        }
    }
}
