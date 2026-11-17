(() => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  const bufs = {};
  let last = null;

  ["hover", "select", "close", "open"].forEach((name) =>
    fetch(`/sfx/${name}.mp3`)
      .then((r) => r.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buf) => (bufs[name] = buf))
      .catch(() => {}),
  );

  const play = (name, volume = 1) => {
    if (!bufs[name]) return;
    if (ctx.state === "suspended") ctx.resume();
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = volume;
    src.buffer = bufs[name];
    src.connect(gain).connect(ctx.destination);
    src.start();
  };

  let quietUntil = 0;
  const quiet = (ms) => (quietUntil = Math.max(quietUntil, performance.now() + ms));

  window.sfx = { play, quiet };

  const target = (e) => e.target.closest && e.target.closest("a, label, button, .pbtns span");

  addEventListener("pointerdown", () => ctx.state === "suspended" && ctx.resume(), { capture: true });
  addEventListener("pointerover", (e) => {
    const el = target(e);
    if (el === last) return;
    last = el;
    if (!el || e.pointerType !== "mouse" || performance.now() < quietUntil) return;
    play("hover", 0.6);
  });
  addEventListener("click", (e) => {
    const el = target(e);
    if (!el) return;
    quiet(400);
    play(el.querySelector("[data-sfx=close]") ? "close" : "select");
  }, { capture: true });
})();
