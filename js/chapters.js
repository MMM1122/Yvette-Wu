/* Chapter layers that emerge on scroll; preserves natural scrolling 
and reduced-motion reading mode. */

function chapterMotion() {
  const sections = Array.from(document.querySelectorAll('main > section:not(.hero)'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const properties = ['--chapter-y', '--chapter-scale', '--chapter-opacity'];
  let geometry = [],
    frame = 0,
    printing = false,
    suspended = false;
  const clamp = n => Math.max(0, Math.min(1, n));
  sections.forEach(section => section.classList.add('chapter-layer'));
  function reset(section) {
    properties.forEach(name => section.style.removeProperty(name));
    section.style.removeProperty('transform-origin');
    section.classList.remove('chapter-in-motion');
  }
  function layoutTop(element) {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  }
  function measure() {
    geometry = sections.map(section => ({
      section,
      top: layoutTop(section),
      height: section.offsetHeight
    }));
    schedule();
  }
  function draw() {
    frame = 0;
    if (printing || suspended || reduced.matches || document.hidden) {
      sections.forEach(reset);
      return;
    }
    const height = window.innerHeight,
      scroll = window.scrollY;
    const small = window.innerWidth < 680;
    for (const item of geometry) {
      const {
        section
      } = item;
      const top = item.top - scroll,
        bottom = top + item.height;
      if (section.contains(document.activeElement) || bottom <= 0 || top >= height + 120) {
        reset(section);
        continue;
      }
      const entering = clamp((top - height * .30) / (height * .70));
      const leaving = clamp((height * .30 - bottom) / (height * .30));
      const amount = Math.max(entering, leaving);
      if (amount < .002) {
        reset(section);
        continue;
      }
      const eased = entering * entering * (3 - 2 * entering);
      const scale = 1 - eased * (small ? .035 : .065) - leaving * .025;
      const y = eased * (small ? 32 : 64) - leaving * 12;
      const opacity = 1 - eased * .22 - leaving * .10;
      section.style.setProperty('--chapter-y', y.toFixed(2) + 'px');
      section.style.setProperty('--chapter-scale', scale.toFixed(4));
      section.style.setProperty('--chapter-opacity', opacity.toFixed(3));
      section.style.setProperty('transform-origin', entering > 0 ? '50% 0%' : '50% 100%');
      section.classList.add('chapter-in-motion');
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reduced.matches || printing || suspended || document.hidden) sections.forEach(reset);else measure();
  }
  function onFocus(event) {
    const section = event.target.closest && event.target.closest('.chapter-layer');
    if (section) reset(section);
    schedule();
  }
  function onNavigation(event) {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href]');
    let local = false;
    if (anchor) {
      try {
        const url = new URL(anchor.href, window.location.href);
        const current = window.location;
        local = !!url.hash && url.origin === current.origin && url.pathname === current.pathname && url.search === current.search;
      } catch (_) {}
    }
    if (local || event.target.closest('.tl-bar')) sections.forEach(reset);
  }
  const beforePrint = () => {
    printing = true;
    sync();
  };
  const afterPrint = () => {
    printing = false;
    sync();
  };
  const pageHide = () => {
    suspended = true;
    sync();
  };
  const pageShow = () => {
    suspended = false;
    sync();
  };
  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
  sections.forEach(section => resizeObserver && resizeObserver.observe(section));
  const main = document.querySelector('main');
  if (main && resizeObserver) resizeObserver.observe(main);
  window.addEventListener('scroll', schedule, {
    passive: true
  });
  window.addEventListener('resize', measure, {
    passive: true
  });
  window.addEventListener('hashchange', measure);
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);
  window.addEventListener('pagehide', pageHide);
  window.addEventListener('pageshow', pageShow);
  document.addEventListener('click', onNavigation, true);
  document.addEventListener('focusin', onFocus);
  document.addEventListener('focusout', schedule);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('load', measure, true);
  document.addEventListener('toggle', measure, true);
  reduced.addEventListener('change', sync);
  measure();
  return () => {
    cancelAnimationFrame(frame);
    resizeObserver && resizeObserver.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', measure);
    window.removeEventListener('hashchange', measure);
    window.removeEventListener('beforeprint', beforePrint);
    window.removeEventListener('afterprint', afterPrint);
    window.removeEventListener('pagehide', pageHide);
    window.removeEventListener('pageshow', pageShow);
    document.removeEventListener('click', onNavigation, true);
    document.removeEventListener('focusin', onFocus);
    document.removeEventListener('focusout', schedule);
    document.removeEventListener('visibilitychange', sync);
    document.removeEventListener('load', measure, true);
    document.removeEventListener('toggle', measure, true);
    reduced.removeEventListener('change', sync);
    sections.forEach(section => {
      reset(section);
      section.classList.remove('chapter-layer');
    });
  };
}
