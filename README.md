# Prototir Unity examples

A small Unity 6 project demonstrating the official
[Prototir Unity SDK](https://github.com/prototir/unity-sdk). The scene reports readiness, events,
scores, persistent storage, and a managed AI request while remaining playable in the Unity Editor
through the SDK's local mocks.

## Open the project

1. Install Unity 6 with Web Build Support.
2. Clone this repository.
3. Open the repository folder as a Unity project.
4. Wait for Package Manager to install `com.prototir.sdk` from the pinned SDK commit.
5. Open **Prototir > Project Setup** and resolve every blocking issue.
6. Open `Assets/Scenes/Main.unity` and enter Play mode.

The example configures a local managed-AI mock in the Editor. A Web build uses the real Prototir
player and requires managed AI to be enabled for the uploaded prototype.

For a native build, press **Pair this build** in the example scene. The SDK displays a code and QR
over the game; scan and approve it to connect the build. The playground returns when you close the
pairing screen. In the Editor, set `Assets/Resources/PrototirSettings.asset` to a prototype slug
before pairing. A downloaded build receives its slug from Prototir during upload.

## Build and upload

1. Switch to the Web platform.
2. Use **Prototir > Project Setup > Fix all available**.
3. Make a non-development build into a clean `Build` directory. For automation, run
   `Unity -batchmode -quit -projectPath . -buildTarget WebGL -executeMethod PrototirExamples.BuildWeb.Build`.
4. ZIP the contents of `Build`, not the directory itself.
5. Upload the ZIP to Prototir and test resize, fullscreen, focus, storage, and console diagnostics.

The SDK writes `prototir.json` into the export automatically. This project also includes
`Assets/Prototir/prototir.json` so its public metadata and managed-AI requirement are explicit.

Run the lightweight repository check with Node.js 20 or newer:

```bash
node tools/check.mjs
```

See the [Unity creator guide](https://prototir.com/docs/creators?runtime=unity#setup) for the full
supported profile.
