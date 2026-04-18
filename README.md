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

## Design specification

- `docs/EaglerFine-Design-Spec-v12.2.js` - single-file comprehensive specification (human-readable structure + machine-readable JavaScript object + built-in validation test).

### Browser test page

- Open `src/spec-viewer.html` to preview the spec object and run the built-in self-test in-browser.
- Local URLs after starting a server: `http://localhost:8080/src/spec-viewer.html` or `http://localhost:8080/src/spec-viewer.htm`
