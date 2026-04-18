(function () {
  const state = {
    loadedMods: [],
    enabledMods: new Set(),
    failedMods: []
  };

  function log(prefix, msg, ...args) {
    console.log(`[Eagler Mod Loader:${prefix}] ${msg}`, ...args);
  }

  function emit(event, detail = {}) {
    window.dispatchEvent(new CustomEvent(`eagler:${event}`, { detail }));
  }

  async function loadMod(mod) {
    try {
      log('load', `Loading mod: ${mod.name} (${mod.entry})`);
      const module = await import(mod.entry);
      const api = {
        on(event, handler) {
          window.addEventListener(`eagler:${event}`, handler);
        },
        emit,
        getClientFrame() {
          return document.getElementById('eagler-frame');
        }
      };

      if (typeof module.onLoad === 'function') {
        module.onLoad(api);
      }

      state.loadedMods.push({ ...mod, module });
      state.enabledMods.add(mod.name);
      emit('modLoaded', { name: mod.name });
      log('ok', `Mod enabled: ${mod.name}`);
    } catch (error) {
      state.failedMods.push({ mod, error: String(error) });
      emit('modFailed', { name: mod.name, error: String(error) });
      log('error', `Failed to load ${mod.name}`, error);
    }
  }

  async function loadManifest(manifestUrl = '../mods/mods.json') {
    const res = await fetch(manifestUrl);
    if (!res.ok) {
      throw new Error(`Could not fetch ${manifestUrl} (${res.status})`);
    }

    const manifest = await res.json();
    if (!Array.isArray(manifest.mods)) {
      throw new Error('Manifest must include a "mods" array');
    }

    for (const mod of manifest.mods) {
      if (mod.enabled !== false) {
        await loadMod(mod);
      }
    }

    emit('modsReady', {
      loaded: [...state.enabledMods],
      failed: state.failedMods
    });

    return state;
  }

  window.EaglerModLoader = {
    state,
    loadManifest,
    emit
  };
})();
