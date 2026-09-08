/* 项目卡片的悬浮光线和轻微倾斜；连接章节动效。 */

function LifeMotion() {
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const cards = Array.from(document.querySelectorAll('.project'));
    const disposers = [];
    const attach = () => {
      disposers.splice(0).forEach(fn => fn());
      if (!mq.matches) return;
      cards.forEach(card => {
        let frame = 0,
          point = null;
        const reset = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          point = null;
          card.removeAttribute('data-tilting');
          ['--tilt-x', '--tilt-y', '--glow-x', '--glow-y'].forEach(key => card.style.removeProperty(key));
        };
        const move = e => {
          if (e.pointerType !== 'mouse') return;
          point = {
            x: e.clientX,
            y: e.clientY
          };
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            if (!point) return;
            const rect = card.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const x = Math.max(0, Math.min(1, (point.x - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (point.y - rect.top) / rect.height));
            card.style.setProperty('--tilt-x', ((.5 - y) * 2).toFixed(2) + 'deg');
            card.style.setProperty('--tilt-y', ((x - .5) * 2).toFixed(2) + 'deg');
            card.style.setProperty('--glow-x', x * 100 + '%');
            card.style.setProperty('--glow-y', y * 100 + '%');
            card.dataset.tilting = 'true';
          });
        };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', reset);
        card.addEventListener('pointercancel', reset);
        window.addEventListener('blur', reset);
        disposers.push(() => {
          reset();
          card.removeEventListener('pointermove', move);
          card.removeEventListener('pointerleave', reset);
          card.removeEventListener('pointercancel', reset);
          window.removeEventListener('blur', reset);
        });
      });
    };
    attach();
    mq.addEventListener('change', attach);
    return () => {
      mq.removeEventListener('change', attach);
      disposers.splice(0).forEach(fn => fn());
    };
  }, []);
  useEffect(chapterMotion, []);
  return null;
}
