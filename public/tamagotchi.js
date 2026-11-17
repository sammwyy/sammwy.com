(() => {
  const root = document.querySelector("[data-tama]");
  if (!root) return;

  const KEY = "sammwy.tama.v1";
  const HOUR = 3600000;
  const STEP = 10 * 60000;
  const MAX_CATCHUP = 30 * 24 * HOUR;
  const RATE = { hunger: 0.5, happy: 0.35, dirty: 0.25, poop: 1 / 3 };

  const tama = root.querySelector(".tama");
  const msg = root.querySelector("[data-msg]");
  const age = root.querySelector("[data-age]");
  const status = root.querySelector("[data-status]");
  const hearts = {
    hunger: root.querySelectorAll('[data-hearts="hunger"] use'),
    happy: root.querySelectorAll('[data-hearts="happy"] use'),
  };

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const asleep = (t) => {
    const h = new Date(t).getHours();
    return h >= 23 || h < 7;
  };

  const fresh = () => {
    const now = Date.now();
    return { born: now, t: now, hunger: 3, happy: 3, poop: 0, poopT: 0, action: null, until: 0 };
  };

  const load = () => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s.born === "number") return s;
    } catch {}
    return fresh();
  };

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  };

  const state = load();

  const simulate = (now) => {
    let t = Math.max(state.t, now - MAX_CATCHUP);
    while (t < now) {
      const dt = Math.min(STEP, now - t);
      const h = dt / HOUR;
      const k = asleep(t) ? 0.3 : 1;
      state.hunger = clamp(state.hunger - RATE.hunger * h * k, 0, 4);
      state.happy = clamp(state.happy - (RATE.happy + RATE.dirty * state.poop) * h * k, 0, 4);
      if (!asleep(t)) {
        state.poopT += RATE.poop * h;
        while (state.poopT >= 1) {
          state.poopT -= 1;
          state.poop = Math.min(3, state.poop + 1);
        }
      }
      t += dt;
    }
    state.t = now;
  };

  const mood = (now) => {
    if (state.action && now < state.until) return state.action;
    if (asleep(now)) return "sleep";
    if (state.hunger <= 0 || state.poop >= 3) return "sick";
    if (state.hunger < 1) return "hungry";
    if (state.happy >= 3.5) return "happy";
    if (state.happy < 1) return "bored";
    return "idle";
  };

  const LABEL = {
    eat: ["MUNCH", "eating"],
    play: ["YAY!", "playing"],
    clean: ["CLEAN", "fresh"],
    nope: ["FULL", "too full"],
    sleep: ["", "sleeping"],
    sick: ["SICK", "sick, needs care"],
    hungry: ["FOOD?", "hungry"],
    bored: ["...", "bored"],
    happy: ["", "happy"],
    idle: ["", "ok"],
  };

  const ageLabel = (now) => {
    const ms = now - state.born;
    const d = Math.floor(ms / (24 * HOUR));
    if (d >= 1) return `${d} day${d === 1 ? "" : "s"}`;
    const h = Math.floor(ms / HOUR);
    return h >= 1 ? `${h}h` : `${Math.max(1, Math.floor(ms / 60000))}m`;
  };

  const render = () => {
    const now = Date.now();
    simulate(now);
    const m = mood(now);
    tama.dataset.mood = m;
    tama.dataset.poop = String(state.poop);
    msg.textContent = LABEL[m][0];
    status.textContent = LABEL[m][1];
    age.textContent = ageLabel(now);
    for (const key of ["hunger", "happy"]) {
      const full = Math.round(state[key]);
      hearts[key].forEach((u, i) => u.setAttribute("href", i < full ? "#px-heart" : "#px-heart-o"));
    }
    save();
  };

  const act = (name) => {
    const now = Date.now();
    simulate(now);
    let action = name;
    if (name === "feed") {
      if (state.hunger >= 3.9) {
        state.happy = clamp(state.happy - 0.5, 0, 4);
        action = "nope";
      } else {
        state.hunger = clamp(state.hunger + 1, 0, 4);
        action = "eat";
      }
    } else if (name === "play") {
      state.happy = clamp(state.happy + 1, 0, 4);
      state.hunger = clamp(state.hunger - 0.3, 0, 4);
    } else if (name === "clean") {
      state.poop = 0;
      state.poopT = 0;
      state.happy = clamp(state.happy + 0.25, 0, 4);
    }
    state.action = action;
    state.until = now + 2500;
    render();
  };

  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => act(b.dataset.act)));
  render();
  clearInterval(window.__tamaTimer);
  window.__tamaTimer = setInterval(() => (document.contains(root) ? render() : clearInterval(window.__tamaTimer)), 5000);
  if (window.__tamaVis) document.removeEventListener("visibilitychange", window.__tamaVis);
  window.__tamaVis = () => document.visibilityState === "visible" && document.contains(root) && render();
  document.addEventListener("visibilitychange", window.__tamaVis);
})();
