# Eaglercraft Mod Client (Java-Style 1.12.2)

This repository contains a **1.12.2-focused starter web client** for running an Eaglercraft build with a simple mod loading system.

## What this includes

- `src/client.html` - Java-edition-inspired browser shell targeting **Eaglercraft 1.12.2**
- `src/mod-loader.js` - lightweight mod loader with event hooks and version checks
- `mods/mods.json` - mod manifest with `minecraftVersion: "1.12.2"`
- `mods/example-hud.js` - sample HUD mod with live FPS counter

## Setup

1. Put your Eaglercraft **1.12.2** files in:
   - `assets/eaglercraft-1.12.2/index.html`
2. Serve the repository with a local web server (ES module imports require HTTP):

```bash
python3 -m http.server 8080
```

3. Open:
   - `http://localhost:8080/src/client.html`

## Add mods

1. Create a module file in `mods/`, for example `mods/my-mod.js`
2. Export an `onLoad(api)` function
3. Register it in `mods/mods.json`
4. Keep `minecraftVersion` set to `1.12.2` (or update both manifest and client requirement together)

Example mod shape:

```js
export function onLoad(api) {
  api.on('modsReady', () => {
    console.log('My mod is ready');
  });
}
```

## Notes

- This is a **starter framework**, not a full game fork.
- The client now enforces manifest version compatibility for `1.12.2` by default.
