using System;
using System.Threading.Tasks;
using Prototir;
using UnityEngine;

public sealed class PrototirExample : MonoBehaviour
{
    private int score;
    private string status = "Starting…";
    private bool busy;

    private async void Start()
    {
        // This IMGUI-only scene has no camera in its hierarchy. A solid backdrop also keeps the
        // native pairing overlay free of Unity's "No cameras rendering" message.
        if (FindFirstObjectByType<Camera>() == null)
        {
            var camera = new GameObject("Example backdrop").AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.059f, 0.059f, 0.067f);
        }
#if UNITY_EDITOR
        PrototirSdk.MockAiHandler = options =>
            Task.FromResult($"Editor mock: explore the signal hidden beyond the next door.");
#endif
        PrototirSdk.Ready();
        try
        {
            var saved = await PrototirSdk.StorageGetAsync("example.score");
            int.TryParse(saved, out score);
            status = $"Ready · restored score {score}";
        }
        catch (Exception exception)
        {
            status = $"Ready · storage unavailable: {exception.Message}";
        }
    }

    private void OnGUI()
    {
        var width = Mathf.Min(560f, Screen.width - 40f);
        var height = Mathf.Min(580f, Screen.height - 40f);
        var area = new Rect((Screen.width - width) / 2f, (Screen.height - height) / 2f, width, height);
        GUILayout.BeginArea(area, GUI.skin.box);
        GUILayout.Space(20);
        GUILayout.Label("PROTOTIR UNITY EXAMPLE");
        GUILayout.Label("SDK capability playground", TitleStyle());
        GUILayout.Space(12);
        GUILayout.Label($"Score: {score}", ScoreStyle());
        GUI.enabled = !busy;
        if (GUILayout.Button("Add 10 points", GUILayout.Height(52))) _ = AddPointsAsync();
        if (GUILayout.Button("Generate a quest hook", GUILayout.Height(52))) _ = GenerateQuestAsync();
#if !UNITY_WEBGL || UNITY_EDITOR
        if (GUILayout.Button(PrototirSdk.IsPaired ? "Connection" : "Pair this build", GUILayout.Height(52)))
            OpenPairing();
#endif
        GUI.enabled = true;
        GUILayout.Space(16);
        GUILayout.Label(status, GUI.skin.textArea, GUILayout.ExpandHeight(true));
        GUILayout.EndArea();
    }

#if !UNITY_WEBGL || UNITY_EDITOR
    private void OpenPairing()
    {
        // Hide the playground while the SDK overlay is open, then bring it back on dismissal.
        enabled = false;
        var screen = Prototir.Native.PrototirPairingScreen.Show();
        screen.Closed += () => { if (this != null) enabled = true; };
    }
#endif

    private async Task AddPointsAsync()
    {
        busy = true;
        score += 10;
        PrototirSdk.Score(score);
        PrototirSdk.Event("points_added", new ScoreEvent { amount = 10, score = score });
        try
        {
            await PrototirSdk.StorageSetAsync("example.score", score.ToString());
            status = $"Saved score {score}";
        }
        catch (Exception exception)
        {
            status = $"Score {score} · save unavailable: {exception.Message}";
        }
        finally
        {
            busy = false;
        }
    }

    private async Task GenerateQuestAsync()
    {
        busy = true;
        status = "Generating…";
        try
        {
            status = await PrototirSdk.AiGenerateAsync(new PrototirAiOptions
            {
                Prompt = "Write one short, family-friendly quest hook for a tiny adventure game.",
                MaxTokens = 60
            });
            PrototirSdk.Event("quest_generated");
        }
        catch (Exception exception)
        {
            status = $"AI unavailable: {exception.Message}";
        }
        finally
        {
            busy = false;
        }
    }

    private static GUIStyle TitleStyle() => new GUIStyle(GUI.skin.label)
    {
        fontSize = Mathf.Clamp(Screen.width / 18, 26, 52),
        fontStyle = FontStyle.Bold,
        wordWrap = true
    };

    private static GUIStyle ScoreStyle() => new GUIStyle(GUI.skin.label)
    {
        fontSize = 28,
        fontStyle = FontStyle.Bold
    };

    [Serializable]
    private sealed class ScoreEvent
    {
        public int amount;
        public int score;
    }
}
