
document.addEventListener('DOMContentLoaded', () => {
  const rows = Array.from(document.querySelectorAll('.row .cards'));
  const states = [];

  rows.forEach(cardsEl => {

    const originals = Array.from(cardsEl.querySelectorAll('.card.original'));
    if (originals.length === 0) {

      const firstSet = Array.from(cardsEl.querySelectorAll('.card')).slice(0, 8);
      originals.push(...firstSet);
    }

    const ensureClones = () => {
      const visible = cardsEl.clientWidth;
      let totalWidth = cardsEl.scrollWidth;
      while (totalWidth < visible * 2) {
        originals.forEach(ch => cardsEl.appendChild(ch.cloneNode(true)));
        totalWidth = cardsEl.scrollWidth;
      }
    };

    ensureClones();


    const isRight = cardsEl.closest('.row').classList.contains('row-right');
    const direction = isRight ? -1 : 1;
    const baseSpeed = 40 + Math.random() * 40;
    const state = {
      el: cardsEl,
      direction,
      baseSpeed,
      speedFactor: 1,
      paused: false,
      dragging: false,
      startX: 0,
      startScroll: 0,
      lastTime: performance.now()
    };


    const half = Math.floor(cardsEl.scrollWidth / 2);
    cardsEl.scrollLeft = Math.max(0, Math.floor(half - cardsEl.clientWidth / 2));


    cardsEl.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      cardsEl.setPointerCapture(ev.pointerId);
      state.dragging = true;
      state.paused = true;
      cardsEl.classList.add('dragging');
      state.startX = ev.clientX;
      state.startScroll = cardsEl.scrollLeft;
    });

    cardsEl.addEventListener('pointermove', (ev) => {
      if (!state.dragging) return;
      const dx = ev.clientX - state.startX;

      cardsEl.scrollLeft = state.startScroll - dx;

      const halfWrap = cardsEl.scrollWidth / 2;
      if (cardsEl.scrollLeft >= halfWrap) cardsEl.scrollLeft -= halfWrap;
      if (cardsEl.scrollLeft < 0) cardsEl.scrollLeft += halfWrap;
    });

    const endDrag = (ev) => {
      if (!state.dragging) return;
      state.dragging = false;
      state.paused = false;
      cardsEl.classList.remove('dragging');
      try { if (ev && ev.pointerId) cardsEl.releasePointerCapture(ev.pointerId); } catch (e) {}
    };
    cardsEl.addEventListener('pointerup', endDrag);
    cardsEl.addEventListener('pointercancel', endDrag);


    cardsEl.addEventListener('pointerenter', () => state.speedFactor = 0.18);
    cardsEl.addEventListener('pointerleave', () => state.speedFactor = 1);


    const ro = new ResizeObserver(() => {
      ensureClones();

      const halfNow = Math.floor(cardsEl.scrollWidth / 2);
      cardsEl.scrollLeft = Math.max(0, Math.floor(halfNow - cardsEl.clientWidth / 2));
    });
    ro.observe(cardsEl);

    states.push(state);
  });


  document.addEventListener('visibilitychange', () => {
    states.forEach(s => s.paused = document.hidden);
  });

  function frame(now) {
    states.forEach(state => {
      if (state.paused || state.dragging) {
        state.lastTime = now;
        return;
      }
      const dt = Math.min(50, now - state.lastTime) / 1000;
      state.lastTime = now;
      const delta = state.direction * state.baseSpeed * state.speedFactor * dt;
      const el = state.el;
      el.scrollLeft += delta;


      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      if (el.scrollLeft < 0) el.scrollLeft += half;
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
});