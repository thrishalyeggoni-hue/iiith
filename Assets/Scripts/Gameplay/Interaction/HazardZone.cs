using UnityEngine;
using QuantumEcho.Gameplay.Player;

namespace QuantumEcho.Gameplay.Interaction
{
    public class HazardZone : MonoBehaviour
    {
        private void OnTriggerEnter(Collider other)
        {
            var controller = other.GetComponent<ThirdPersonController>();
            if (controller != null)
            {
                controller.RespawnAtSafePosition();
            }
        }
    }
}
