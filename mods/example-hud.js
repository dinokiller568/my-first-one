export function onLoad(api) {
  const hud = document.createElement('div');
  hud.textContent = 'FPS: --';

  Object.assign(hud.style, {
    position: 'fixed',
    top: '12px',
    right: '12px',
    padding: '8px 10px',
    background: 'rgba(0,0,0,0.75)',
    color: '#7CFFB2',
    font: '12px monospace',
    border: '1px solid #2f2f2f',
    borderRadius: '8px',
    zIndex: 99999,
    minWidth: '72px',
    textAlign: 'center'
  });

  document.body.appendChild(hud);

  let frameCount = 0;
  let lastSecond = performance.now();
  let rafId = 0;

  function tick(now) {
    frameCount += 1;

    const elapsed = now - lastSecond;
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount * 1000) / elapsed);
      hud.textContent = `FPS: ${fps}`;
      frameCount = 0;
      lastSecond = now;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  api.on('modUnload', () => {
    cancelAnimationFrame(rafId);
    hud.remove();
  });
}
