/* Embedded CMJ recording: quiet playback only after an explicit click. */
(() => {
  'use strict';
  const audio = document.getElementById('background-music');
  const button = document.getElementById('music-control');
  const status = document.getElementById('music-status');
  if (!audio || !button || !status) return;
  let pending = false, intent = 0;
  audio.volume = .18;
  function reflect() {
    const playing = !audio.paused;
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    button.textContent = playing ? 'Ⅱ  Pause music' : '♪  Play music';
    button.setAttribute('aria-busy', String(pending));
  }
  button.addEventListener('click', async () => {
    const attempt = ++intent;
    status.textContent = '';
    if (pending || !audio.paused) {
      pending = false;
      audio.pause();
      reflect();
      return;
    }
    pending = true;
    reflect();
    try {
      await audio.play();
      if (attempt !== intent) return;
    } catch (error) {
      if (attempt !== intent) return;
      status.textContent = 'Music could not play. Please try again.';
    } finally {
      if (attempt === intent) { pending = false; reflect(); }
    }
  });
  for (const event of ['play', 'pause', 'ended']) audio.addEventListener(event, reflect);
  audio.addEventListener('error', () => {
    ++intent;
    pending = false;
    audio.pause();
    status.textContent = 'Music is unavailable. Please try again later.';
    reflect();
  });
  window.addEventListener('pagehide', () => { ++intent; pending = false; audio.pause(); reflect(); });
  reflect();
})();
