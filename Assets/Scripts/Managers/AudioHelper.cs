using System;
using UnityEngine;

namespace QuantumEcho.Managers
{
    /// <summary>
    /// Generates clear, procedural audio clips at runtime without needing external audio files.
    /// Provides auditory feedback for gate operations, state collapse, success chimes, and ambient resonance.
    /// </summary>
    public class AudioHelper : MonoBehaviour
    {
        private AudioSource _sfxSource;
        private AudioSource _ambientSource;

        private AudioClip _gateApplyClip;
        private AudioClip _successChimeClip;
        private AudioClip _measurementCollapseClip;
        private AudioClip _clickClip;
        private AudioClip _errorClip;

        private void Awake()
        {
            _sfxSource = gameObject.AddComponent<AudioSource>();
            _sfxSource.playOnAwake = false;

            _ambientSource = gameObject.AddComponent<AudioSource>();
            _ambientSource.loop = true;
            _ambientSource.playOnAwake = false;
            _ambientSource.volume = 0.25f;

            GenerateClips();
        }

        private void Start()
        {
            PlayAmbientDrone();
        }

        private void GenerateClips()
        {
            _gateApplyClip = CreateTone(440f, 0.15f, ToneType.SineHarmonic);
            _successChimeClip = CreateArpeggio(new float[] { 523.25f, 659.25f, 783.99f, 1046.50f }, 0.45f);
            _measurementCollapseClip = CreateTone(220f, 0.25f, ToneType.NoiseBurst);
            _clickClip = CreateTone(880f, 0.04f, ToneType.Blip);
            _errorClip = CreateTone(140f, 0.2f, ToneType.Sawtooth);
        }

        public void PlayGateApply() => PlayOneShot(_gateApplyClip, 0.7f);
        public void PlaySuccessChime() => PlayOneShot(_successChimeClip, 0.85f);
        public void PlayMeasurementCollapse() => PlayOneShot(_measurementCollapseClip, 0.9f);
        public void PlayButtonClick() => PlayOneShot(_clickClip, 0.5f);
        public void PlayError() => PlayOneShot(_errorClip, 0.6f);

        private void PlayOneShot(AudioClip clip, float volume = 1.0f)
        {
            if (clip != null && _sfxSource != null)
                _sfxSource.PlayOneShot(clip, volume);
        }

        private void PlayAmbientDrone()
        {
            AudioClip ambient = CreateAmbientLoop(110f, 4.0f);
            if (_ambientSource != null && ambient != null)
            {
                _ambientSource.clip = ambient;
                _ambientSource.Play();
            }
        }

        private enum ToneType { SineHarmonic, NoiseBurst, Blip, Sawtooth }

        private AudioClip CreateTone(float frequency, float duration, ToneType type)
        {
            int sampleRate = 44100;
            int samples = (int)(sampleRate * duration);
            float[] data = new float[samples];

            for (int i = 0; i < samples; i++)
            {
                float t = (float)i / sampleRate;
                float env = 1f - ((float)i / samples); // Linear decay

                switch (type)
                {
                    case ToneType.SineHarmonic:
                        float val = Mathf.Sin(2f * Mathf.PI * frequency * t) * 0.7f +
                                    Mathf.Sin(2f * Mathf.PI * frequency * 2f * t) * 0.3f;
                        data[i] = val * env;
                        break;

                    case ToneType.NoiseBurst:
                        float noise = (UnityEngine.Random.value * 2f - 1f) * 0.4f;
                        float sine = Mathf.Sin(2f * Mathf.PI * frequency * t) * 0.6f;
                        data[i] = (noise + sine) * env;
                        break;

                    case ToneType.Blip:
                        data[i] = Mathf.Sin(2f * Mathf.PI * frequency * t) * Mathf.Exp(-t * 40f);
                        break;

                    case ToneType.Sawtooth:
                        float saw = (2f * (t * frequency - Mathf.Floor(t * frequency + 0.5f)));
                        data[i] = saw * env * 0.5f;
                        break;
                }
            }

            AudioClip clip = AudioClip.Create($"Tone_{type}", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }

        private AudioClip CreateArpeggio(float[] notes, float duration)
        {
            int sampleRate = 44100;
            int samples = (int)(sampleRate * duration);
            float[] data = new float[samples];
            int noteCount = notes.Length;
            int noteSamples = samples / noteCount;

            for (int n = 0; n < noteCount; n++)
            {
                float freq = notes[n];
                int start = n * noteSamples;
                int end = (n == noteCount - 1) ? samples : start + noteSamples;

                for (int i = start; i < end; i++)
                {
                    float t = (float)(i - start) / sampleRate;
                    float env = 1f - ((float)(i - start) / (end - start));
                    float s = Mathf.Sin(2f * Mathf.PI * freq * t);
                    data[i] = s * env * 0.7f;
                }
            }

            AudioClip clip = AudioClip.Create("Arpeggio", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }

        private AudioClip CreateAmbientLoop(float baseFreq, float duration)
        {
            int sampleRate = 44100;
            int samples = (int)(sampleRate * duration);
            float[] data = new float[samples];

            for (int i = 0; i < samples; i++)
            {
                float t = (float)i / sampleRate;
                float s1 = Mathf.Sin(2f * Mathf.PI * baseFreq * t) * 0.4f;
                float s2 = Mathf.Sin(2f * Mathf.PI * (baseFreq * 1.5f) * t) * 0.25f;
                float s3 = Mathf.Sin(2f * Mathf.PI * (baseFreq * 2.0f) * t) * 0.15f;
                data[i] = (s1 + s2 + s3);
            }

            AudioClip clip = AudioClip.Create("AmbientLoop", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }
    }
}
