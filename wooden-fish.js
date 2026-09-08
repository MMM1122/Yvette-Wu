/* 木鱼互动、敲击音效、动画和植物生长彩蛋。 */

function WoodenFish() {
  const [count, setCount] = useState(0);
  const [sound, setSound] = useState(true);
  const [pulses, setPulses] = useState([]);
  const [soundError, setSoundError] = useState(false);
  const instrument = useRef(null),
    picture = useRef(null),
    animation = useRef(null),
    serial = useRef(0),
    lastTap = useRef(-Infinity);
  const mallet = useRef(null),
    malletAnimation = useRef(null);
  const growth = count >= 50 ? 3 : count >= 30 ? 2 : count >= 10 ? 1 : 0;
  const growthText = ['Every little tap helps something grow.', 'A little leaf. A little beginning.', 'Taking root, reaching out.', 'A little patience. A little bloom.'][growth];
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => {
      if (mq.matches) {
        animation.current?.cancel();
        malletAnimation.current?.cancel();
        setPulses([]);
      }
    };
    mq.addEventListener('change', stop);
    return () => {
      mq.removeEventListener('change', stop);
      malletAnimation.current?.cancel();
    };
  }, []);
  useEffect(() => () => {
    if (animation.current) animation.current.cancel();
    if (instrument.current) instrument.current.ctx.close().catch(() => {});
  }, []);
  const knock = (delay = 0) => {
    try {
      if (!instrument.current) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) {
          setSoundError(true);
          return;
        }
        const ctx = new Audio();
        const gain = ctx.createGain();
        gain.gain.value = .25;
        const limiter = ctx.createDynamicsCompressor();
        limiter.threshold.value = -12;
        limiter.ratio.value = 8;
        gain.connect(limiter);
        limiter.connect(ctx.destination);
        instrument.current = {
          ctx,
          gain
        };
      }
      const {
        ctx,
        gain
      } = instrument.current;
      if (ctx.state === 'suspended') ctx.resume().catch(() => setSoundError(true));
      const start = ctx.currentTime + .005 + delay;
      [[490, .62, .18], [817, .27, .105], [1372, .11, .065]].forEach(([frequency, volume, decay]) => {
        const oscillator = ctx.createOscillator(),
          envelope = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * .965, start + decay);
        envelope.gain.setValueAtTime(.0001, start);
        envelope.gain.exponentialRampToValueAtTime(volume, start + .002);
        envelope.gain.exponentialRampToValueAtTime(.0001, start + decay);
        oscillator.connect(envelope);
        envelope.connect(gain);
        oscillator.start(start);
        oscillator.stop(start + decay + .02);
        oscillator.onended = () => {
          oscillator.disconnect();
          envelope.disconnect();
        };
      });
    } catch (_) {
      setSoundError(true);
    }
  };
  const tap = () => {
    const now = performance.now();
    if (now - lastTap.current < 130) return;
    lastTap.current = now;
    setCount(v => v + 1);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sound) knock(reduced ? 0 : .065);
    if (!reduced) {
      const id = ++serial.current;
      setPulses(old => [...old.slice(-3), id]);
      if (mallet.current?.animate) {
        malletAnimation.current?.cancel();
        malletAnimation.current = mallet.current.animate([{
          transform: 'rotate(-12deg) translateY(-6px)'
        }, {
          transform: 'rotate(-27deg) translateY(9px)',
          offset: .18
        }, {
          transform: 'rotate(4deg) translateY(-8px)',
          offset: .6
        }, {
          transform: 'rotate(0deg) translateY(0)'
        }], {
          duration: 360,
          easing: 'cubic-bezier(.25,.6,.3,1)'
        });
      }
      if (picture.current && picture.current.animate) {
        if (animation.current) animation.current.cancel();
        animation.current = picture.current.animate([{
          transform: 'translateY(0) rotate(0deg) scale(1)'
        }, {
          transform: 'translateY(6px) rotate(-2deg) scale(.96)',
          offset: .18
        }, {
          transform: 'translateY(-3px) rotate(1deg) scale(1.015)',
          offset: .55
        }, {
          transform: 'translateY(0) rotate(0deg) scale(1)'
        }], {
          duration: 325,
          delay: 65,
          easing: 'cubic-bezier(.2,.8,.3,1)'
        });
      }
    }
  };
  return h("section", {
    id: "little-pause",
    className: "little-pause",
    "aria-labelledby": "pause-title"
  }, h("div", {
    className: "pause-copy"
  }, h("p", {
    className: "pause-eyebrow"
  }, "Before you go · 木鱼"), h("h2", {
    id: "pause-title"
  }, "A little pause."), h("p", {
    className: "pause-description"
  }, "A wooden fish, a gentle knock, a moment to yourself. Go on — give it a tap."), h("p", {
    className: "pause-signoff"
  }, "Thanks for spending a little time in my corner of the world.")), h("div", {
    className: "muyu-playground"
  }, h("div", {
    className: "muyu-stage"
  }, h("button", {
    type: "button",
    className: "muyu-button",
    onClick: tap,
    "aria-label": "Tap the wooden fish",
    "aria-describedby": "muyu-instructions"
  }, h("img", {
    ref: picture,
    src: WOODEN_FISH,
    alt: "Carved walnut wooden fish percussion block",
    width: 1254,
    height: 1254,
    loading: "lazy",
    draggable: false
  })), h("img", {
    className: "muyu-mallet",
    ref: mallet,
    src: MALLET,
    alt: "",
    "aria-hidden": "true",
    width: 1254,
    height: 1254,
    loading: "lazy",
    draggable: false
  }), h("div", {
    className: "muyu-feedback",
    "aria-hidden": "true"
  }, pulses.map(id => h("span", {
    key: id,
    className: "muyu-pulse",
    onAnimationEnd: () => setPulses(old => old.filter(v => v !== id))
  }, h("span", {
    className: "muyu-ring"
  }), h("span", {
    className: "muyu-plus"
  }, h("span", {
    lang: "zh-Hans"
  }, "Offer +1"), h("small", {
    lang: "en"
  }, "Merit +1")))))), h("div", {
    className: "muyu-controls"
  }, h("output", {
    className: "muyu-count",
    "aria-live": "polite",
    "aria-atomic": "true"
  }, h("strong", null, count), " ", count === 1 ? "gentle tap" : "gentle taps"), h("button", {
    type: "button",
    className: "muyu-sound",
    "aria-pressed": sound,
    "aria-label": sound ? "Mute wooden fish sound" : "Enable wooden fish sound",
    onClick: () => setSound(v => !v)
  }, h("span", {
    "aria-hidden": "true"
  }, sound ? "♪" : "♩"), sound ? "Sound on" : "Sound off")), count > 0 && h("p", {
    className: "muyu-merit-static"
  }, h("span", {
    lang: "zh-Hans"
  }, "Offer +1"), " · ", h("span", {
    lang: "en"
  }, "Merit +1")), h("div", {
    className: "muyu-garden",
    "data-growth": growth
  }, h("div", {
    className: "garden-art",
    "aria-hidden": "true"
  }, h("img", {
    src: BOTANICAL,
    alt: "",
    width: 1024,
    height: 1536,
    loading: "lazy",
    draggable: false
  })), h("p", {
    className: "garden-caption",
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true"
  }, growthText)), h("p", {
    id: "muyu-instructions",
    className: "muyu-instructions"
  }, "Click or tap · Keyboard: Tab, then Space or Enter"), soundError && h("p", {
    className: "muyu-instructions",
    role: "status"
  }, "Sound is unavailable in this browser. You can still tap.")));
}
