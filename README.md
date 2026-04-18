# Eaglercraft Mod Client (Starter)

This repository now contains a **starter web client** for running an Eaglercraft build with a simple mod loading system.

## What this includes

- `src/client.html` - browser client shell with an iframe for your Eaglercraft build
- `src/mod-loader.js` - lightweight mod loader with event hooks
- `mods/mods.json` - mod manifest
- `mods/example-hud.js` - sample HUD mod with live FPS counter

## Setup

1. Put your own Eaglercraft files in:
   - `assets/eaglercraft/index.html`
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

Example mod shape:

```js
export function onLoad(api) {
  api.on('modsReady', () => {
    console.log('My mod is ready');
  });
}
```

## Notes

- This is a **starter framework**, not a full custom game fork.
- Compatibility depends on your Eaglercraft build and what browser APIs are available.
