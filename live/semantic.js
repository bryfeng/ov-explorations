/* Open Value · semantic-layer figures. Loaded after beam.js; registers FIG.sem0–sem3 on the shared registry.
   Vocabulary is the beam family's: a layer is a frame holding its own order; the record is the beam.
   Here the frame is opened: rules (fixed), its own order (ticked line), state (a root that rolls). */
(function () {
  const F = window.__beam; if (!F) return;
  const { el, text, defs, beam, sysGlyph, readerGlyph, fallPath, C, reduced, FIG, mountAll } = F;
  const HASH = () => Array.from({ length: 4 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const bez = (p0, p1, t) => { const my = (p0[1] + p1[1]) / 2, u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*p0[0] + 3*u*t*t*p1[0] + t*t*t*p1[0], u*u*u*p0[1] + 3*u*u*t*my + 3*u*t*t*my + t*t*t*p1[1]]; };
  const EV = [['payment.settled', '4800 CHF · acct_7f3a → acct_02be'], ['title.transferred', 'vehicle ZH-482113 · owner_19c4 → owner_a8e0'], ['invoice.paid', '1 250.00 EUR · inv_88c1'], ['reversal', 'of payment.settled#7f3a02be · R10']];

  /* An opened layer: frame with three bands. Returns handles for animation. */
  function layer(svg, id, x, y, w, h, o = {}) {
    const g = el('g', {}, svg);
    el('rect', { x: x - w / 2 - 8, y: y - h / 2 - 8, width: w + 16, height: h + 16, rx: 20, fill: C.acc, 'fill-opacity': C.ringOp < 1 ? .03 : .05, filter: `url(#soft${id})` }, g);
    el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 14, fill: 'none', stroke: C.fg2, 'stroke-opacity': .8 * C.ringOp, 'stroke-width': 1.2 }, g);
    const lx = x - w / 2 + 16, rx = x + w / 2 - 16, rows = [y - h / 2 + h * .25, y, y + h / 2 - h * .25];
    const lab = o.labels !== false;
    if (lab) ['rules', 'order', 'state'].forEach((t, i) => text(g, lx, rows[i] + 4, t, { anchor: 'start', cls: 'lab sm', fill: C.mute }));
    const ox = lab ? lx + 52 : lx;
    // rules: a fixed row of marks
    const rules = el('g', {}, g); const nR = Math.floor((rx - ox) / 18);
    for (let k = 0; k < nR; k++) el('rect', { x: ox + k * 18, y: rows[0] - 4, width: 10, height: 8, rx: 2, fill: 'none', stroke: C.fg2, 'stroke-opacity': .45, 'stroke-width': 1 }, rules);
    // order: its own ticked line
    el('line', { x1: ox, x2: rx, y1: rows[1], y2: rows[1], stroke: C.fg2, 'stroke-opacity': .8, 'stroke-width': 1.3 }, g);
    const order = el('g', {}, g); const ticks = [];
    const n0 = o.ticks == null ? 4 : o.ticks;
    for (let k = 0; k < n0; k++) { const tx = ox + 4 + k * 14; ticks.push(tx); el('line', { x1: tx, x2: tx, y1: rows[1] - 4, y2: rows[1] + 4, stroke: C.fg2, 'stroke-opacity': .8 }, order); }
    const head = el('circle', { cx: ox + 4 + n0 * 14 - 14, cy: rows[1], r: 2.4, fill: C.accSoft }, g);
    // state: a root that rolls
    const root = text(g, ox, rows[2] + 4, 'root ' + HASH() + HASH(), { anchor: 'start', cls: 'lab data', fill: C.fg2 });
    return { g, x, y, w, h, ox, rx, rows, rules, order, ticks, head, root, nextX: () => ox + 4 + ticks.length * 14,
      addTick(op = 1) { const tx = this.nextX(); if (tx > rx - 6) { this.order.innerHTML = ''; this.ticks.length = 0; return this.addTick(op); } this.ticks.push(tx);
        const t = el('line', { x1: tx, x2: tx, y1: rows[1] - 4, y2: rows[1] + 4, stroke: C.fg2, 'stroke-opacity': op }, this.order); this.head.setAttribute('cx', tx); return t; },
      roll() { this.root.textContent = 'root ' + HASH() + HASH(); },
      pulseRules(ok) { [...this.rules.children].forEach((r, k) => { r.setAttribute('stroke', ok ? C.accSoft : C.fg2); r.setAttribute('stroke-opacity', ok ? 1 : .45); setTimeout(() => { r.setAttribute('stroke', C.fg2); r.setAttribute('stroke-opacity', .45); }, 500 + k * 40); }); } };
  }
  function dataLines(svg, x, y, ev, cls = 'lab data') {
    const g = el('g', {}, svg); ev.forEach((t, r) => text(g, x, y + r * 16, t, { anchor: 'start', cls, fill: r ? C.fg2 : C.fg }));
    return g;
  }
  function spark(svg, id) { const s = el('g', { opacity: 0 }, svg); el('circle', { r: 5, fill: C.accSoft, opacity: .6, filter: `url(#soft${id})` }, s); el('circle', { r: 2, fill: C.bg === '#14161A' ? '#fff' : C.acc }, s); return s; }
  function ring(svg) { return el('circle', { r: 3.5, fill: C.bg, stroke: C.fg2, 'stroke-width': 1.2, opacity: 0 }, svg); }
  function tickAt(svg, x, y, op = 1, tag) { const g = el('g', {}, svg); el('line', { x1: x, x2: x, y1: y - 10, y2: y + 10, stroke: C.light, 'stroke-width': 2, 'stroke-opacity': op }, g); if (tag != null) text(g, x, y + 24, String(tag), { cls: 'lab sm', fill: C.mute }); return g; }
  function flash(svg, id, x, y) { const f = el('circle', { cx: x, cy: y, r: 10, fill: C.light, opacity: .7, filter: `url(#soft${id})` }, svg); return f; }

  /* ---------- sem0: inside a layer. A proposal passes the rules, extends the layer's own order, rolls its state, and only a fingerprint leaves. ---------- */
  FIG.sem0 = (svg, W) => {
    const narrow = W < 560, H = narrow ? 520 : 460; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, lw = Math.min(460, W - 40), lh = 150, ly = narrow ? 200 : 170, yB = H - 70;
    beam(svg, id, yB, -40, W + 40, null, [], null);
    const order = el('g', {}, svg), traffic = el('g', {}, svg);
    const L = layer(svg, id, cx, ly, lw, lh);
    el('path', { d: `M${cx} ${ly + lh / 2} V${yB}`, stroke: C.fg2, 'stroke-opacity': .15 }, svg);
    if (reduced) { dataLines(svg, cx - lw / 2, ly - lh / 2 - 36, EV[0]); for (let k = 0; k < 7; k++) tickAt(order, cx - 90 + k * 26, yB); return; }
    const step = 26; let headX = cx - step * 3; const ticks = [];
    let job = null, nextJob = 400, nextRead = 5200; const rings = [];
    function frame(now) {
      if (!svg.isConnected) return;
      if (!job && now > nextJob) job = { t0: now, ev: EV[Math.floor(Math.random() * EV.length)], d: null, sp: null, to: null, tk: null, ph: 0 };
      if (job) { const t = now - job.t0;
        if (!job.d) job.d = dataLines(svg, cx - lw / 2, ly - lh / 2 - 36, job.ev);
        if (t > 900 && job.ph === 0) { job.ph = 1; L.pulseRules(true); }                       // validated under its rules
        if (t > 1500 && job.ph === 1) { job.ph = 2; job.d.remove(); L.addTick(); L.roll(); }    // its own order grows; state derived
        if (t > 2100 && job.ph === 2) { job.ph = 3; job.sp = spark(traffic, id); job.to = headX; headX += step; }
        if (job.ph === 3) { const u = Math.min(1, (t - 2100) / 1800); const [x, y] = bez([cx, ly + lh / 2], [job.to, yB], ease(u)); job.sp.setAttribute('transform', `translate(${x},${y})`); job.sp.setAttribute('opacity', u < .1 ? u * 10 : 1);
          if (u >= 1) { job.sp.remove(); job.tk = tickAt(order, job.to, yB, .5); job.fl = flash(order, id, job.to, yB); ticks.push({ x: job.to, g: job.tk, born: now, fl: job.fl }); job.ph = 4; } }
        if (job.ph === 4 && t > 4700) { job = null; nextJob = now + 600; }                      // finality: the tick hardens
      }
      ticks.forEach(tk => { const a = (now - tk.born) / 1400; if (tk.fl) { if (a >= .6) { tk.fl.remove(); tk.fl = null; } else tk.fl.setAttribute('opacity', .7 * (1 - a / .6)); }
        tk.g.firstChild.setAttribute('stroke-opacity', Math.min(1, .5 + a * .5)); });
      if (now > nextRead && ticks.length > 2) { nextRead = now + 3600; const tk = ticks[Math.floor(Math.random() * (ticks.length - 1))]; const r = ring(traffic); rings.push({ r, from: [tk.x, yB], to: [cx + lw / 2 - 30, ly + lh / 2], t0: now }); tk.g.firstChild.setAttribute('stroke-width', 3.2); setTimeout(() => tk.g.firstChild.setAttribute('stroke-width', 2), 600); }
      for (let k = rings.length - 1; k >= 0; k--) { const rg = rings[k]; const u = (now - rg.t0) / 2200; if (u >= 1) { rg.r.remove(); rings.splice(k, 1); continue; } const [x, y] = bez(rg.from, rg.to, ease(u)); rg.r.setAttribute('cx', x); rg.r.setAttribute('cy', y); rg.r.setAttribute('opacity', u < .1 ? u * 10 : u > .85 ? (1 - u) / .15 : 1); }
      if (headX > cx + step * 4) { const dx = .3; headX -= dx; ticks.forEach(tk => { tk.x -= dx; tk.g.setAttribute('transform', `translate(${tk.x - +tk.g.firstChild.getAttribute('x1')},0)`); }); if (job && job.to != null) job.to -= dx; }
      while (ticks.length > 16) ticks.shift().g.remove();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  /* ---------- sem1: many layers, one order. Entries interleave; a layer that follows takes only its own. ---------- */
  FIG.sem1 = (svg, W) => {
    const narrow = W < 560, H = narrow ? 480 : 440; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, n = narrow ? 3 : 5, gap = Math.min(190, (W - 140) / (n - 1));
    const sx = Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * gap), yS = 70, yB = Math.round(H * .66);
    beam(svg, id, yB, -40, W + 40, null, [], null);
    const order = el('g', {}, svg), traffic = el('g', {}, svg);
    const G = sx.map((x, i) => { const g = sysGlyph(svg, id, x, yS, i, { w: 56, h: 42 }); el('path', { d: `M${x} ${yS + 21} V${yB}`, stroke: C.fg2, 'stroke-opacity': .12 }, svg); return g; });
    const step = 24; let headX = cx - step * 6; const ticks = [];
    if (reduced) { for (let k = 0; k < 13; k++) tickAt(order, cx - 150 + k * 25, yB, 1, 1 + (k * 7) % n); return; }
    let nextPost = 300, follow = null, nextFollow = 6500; const sparks = [];
    function frame(now) {
      if (!svg.isConnected) return;
      if (now > nextPost && !follow) { const i = Math.floor(Math.random() * n); const sp = spark(traffic, id); const to = headX; headX += step; sparks.push({ sp, i, from: [sx[i], yS + 21], to: [to, yB], t0: now }); G[i].head.setAttribute('r', 4); setTimeout(() => G[i].head.setAttribute('r', 2.2), 400); nextPost = now + 700 + Math.random() * 700; }
      for (let k = sparks.length - 1; k >= 0; k--) { const s = sparks[k]; const u = (now - s.t0) / 1600; if (u >= 1) { s.sp.remove(); const g = tickAt(order, s.to[0], yB, 1, s.i + 1); ticks.push({ x: s.to[0], g, i: s.i }); sparks.splice(k, 1); continue; } const [x, y] = bez(s.from, s.to, ease(u)); s.sp.setAttribute('transform', `translate(${x},${y})`); s.sp.setAttribute('opacity', u < .1 ? u * 10 : 1); }
      if (!follow && now > nextFollow && ticks.length > 6) { const i = Math.floor(Math.random() * n); follow = { i, t0: now, x0: ticks[0].x, x1: ticks[ticks.length - 1].x, sw: el('line', { x1: ticks[0].x, x2: ticks[0].x, y1: yB - 16, y2: yB + 16, stroke: C.accSoft, 'stroke-width': 1.2 }, traffic), taken: new Set(), rings: [] };
        ticks.forEach(tk => { if (tk.i !== i) tk.g.setAttribute('opacity', .3); }); }
      if (follow) { const u = (now - follow.t0) / 3200; const x = follow.x0 + (follow.x1 - follow.x0) * Math.min(1, u); follow.sw.setAttribute('x1', x); follow.sw.setAttribute('x2', x);
        ticks.forEach(tk => { if (tk.i === follow.i && tk.x <= x && !follow.taken.has(tk)) { follow.taken.add(tk); const r = ring(traffic); follow.rings.push({ r, from: [tk.x, yB], to: [sx[follow.i], yS + 21], t0: now }); tk.g.firstChild.setAttribute('stroke-width', 3.4); } });
        for (let k = follow.rings.length - 1; k >= 0; k--) { const rg = follow.rings[k]; const v = (now - rg.t0) / 1500; if (v >= 1) { rg.r.remove(); follow.rings.splice(k, 1); const fi = follow.i; G[fi].head.setAttribute('r', 4); setTimeout(() => G[fi].head.setAttribute('r', 2.2), 300); continue; } const [px, py] = bez(rg.from, rg.to, ease(v)); rg.r.setAttribute('cx', px); rg.r.setAttribute('cy', py); rg.r.setAttribute('opacity', v < .1 ? v * 10 : v > .85 ? (1 - v) / .15 : 1); }
        if (u > 1.2 && follow.rings.length === 0) { follow.sw.remove(); ticks.forEach(tk => { tk.g.setAttribute('opacity', 1); tk.g.firstChild.setAttribute('stroke-width', 2); }); follow = null; nextFollow = now + 5000; requestAnimationFrame(frame); return; } }
      if (headX > cx + step * 7 && !follow) { const dx = .3; headX -= dx; ticks.forEach(tk => { tk.x -= dx; tk.g.setAttribute('transform', `translate(${tk.x - +tk.g.firstChild.getAttribute('x1')},0)`); }); sparks.forEach(s => s.to[0] -= dx); }
      while (ticks.length > 22) ticks.shift().g.remove();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  /* ---------- sem2: a rule reads across. The registry delivers only against a payment the bank recorded first; a proposal that fails is never posted. ---------- */
  FIG.sem2 = (svg, W) => {
    const narrow = W < 640, H = narrow ? 560 : 470; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, lw = narrow ? Math.min(300, W - 40) : Math.min(360, W * .4), lh = 130;
    const bx = narrow ? cx : cx - lw / 2 - 70, rxx = narrow ? cx : cx + lw / 2 + 70, by = narrow ? 110 : 150, ry = narrow ? 300 : 150, yB = H - 70;
    beam(svg, id, yB, -40, W + 40, null, [], null);
    const order = el('g', {}, svg), traffic = el('g', {}, svg);
    const B = layer(svg, id, bx, by, lw, lh, { ticks: 3 }), R = layer(svg, id, rxx, ry, lw, lh, { ticks: 2 });
    sysGlyph(svg, id, bx - lw / 2 - 34, by - lh / 2 + 18, 0, { icon: 'bank', w: 40, h: 30, op: .8 });
    sysGlyph(svg, id, rxx + lw / 2 + 34, ry - lh / 2 + 18, 1, { icon: 'registry', w: 40, h: 30, op: .8 });
    el('path', { d: `M${bx} ${by + lh / 2} V${yB}`, stroke: C.fg2, 'stroke-opacity': .12 }, svg);
    el('path', { d: `M${rxx} ${ry + lh / 2} V${yB}`, stroke: C.fg2, 'stroke-opacity': .12 }, svg);
    const step = 76; let headX = cx - step * 1.5; const ticks = [];
    if (reduced) { tickAt(order, cx - 60, yB, 1, 'h(pay)'); tickAt(order, cx + 24, yB, 1, 'h(deliver)'); return; }
    // script: 0 bank posts payment → tick P · 1 registry proposes delivery, probe finds P → posts tick D · 2 registry proposes delivery against an unrecorded payment, probe finds nothing → proposal fades, nothing posted · loop
    let t0 = performance.now(), ph = 0, st = {};
    function post(from, to, label, onLand) { const sp = spark(traffic, id); const x = headX; headX += step; st.sp = { sp, from, to: [x, yB], t0: performance.now(), label, onLand }; }
    function frame(now) {
      if (!svg.isConnected) return; const t = now - t0;
      if (st.sp) { const s = st.sp; const u = (now - s.t0) / 1500; if (u >= 1) { s.sp.remove(); const g = tickAt(order, s.to[0], yB, 1, s.label); ticks.push({ x: s.to[0], g, label: s.label }); const fl = flash(order, id, s.to[0], yB); setTimeout(() => fl.remove(), 800); s.onLand && s.onLand(); st.sp = null; } else { const [x, y] = bez(s.from, s.to, ease(u)); s.sp.setAttribute('transform', `translate(${x},${y})`); s.sp.setAttribute('opacity', u < .1 ? u * 10 : 1); } }
      if (st.probe) { const p = st.probe; const u = (now - p.t0) / p.dur; if (u >= 1) { p.r.remove(); st.probe = null; p.done(); } else { const seg = p.path(Math.min(1, u)); p.r.setAttribute('cx', seg[0]); p.r.setAttribute('cy', seg[1]); p.r.setAttribute('opacity', 1); } }
      if (ph === 0 && t > 500) { ph = 1; st.d = dataLines(svg, bx - lw / 2, by - lh / 2 - 36, ['payment.settled', '250 000 USD · trade T-7']); }
      if (ph === 1 && t > 1400) { ph = 2; B.pulseRules(true); }
      if (ph === 2 && t > 2000) { ph = 3; st.d.remove(); B.addTick(); B.roll(); post([bx, by + lh / 2], null, 'h(pay)', () => { ph = 4; t0 = performance.now(); }); }
      if (ph === 4 && t > 900) { ph = 5; st.d = dataLines(svg, rxx - lw / 2, ry - lh / 2 - 36, ['deliver', 'bond XS123 · 100 · against h(pay)']); }
      if (ph === 5 && t > 1700) { ph = 6; // the registry's rule probes the record for h(pay)
        const P = ticks.find(k => k.label === 'h(pay)'); if (!P) { ph = 0; t0 = now; requestAnimationFrame(frame); return; } const r = ring(traffic); const a = [rxx - lw / 2 + 60, ry + lh / 2], b = [rxx, yB], c = [P.x, yB];
        st.probe = { r, t0: now, dur: 2200, path: u => u < .5 ? bez(a, b, ease(u * 2)) : [b[0] + (c[0] - b[0]) * ease((u - .5) * 2), yB], done: () => { P.g.firstChild.setAttribute('stroke-width', 3.6); setTimeout(() => P.g.firstChild.setAttribute('stroke-width', 2), 700); R.pulseRules(true); ph = 7; t0 = performance.now(); } }; }
      if (ph === 7 && t > 700) { ph = 8; st.d.remove(); R.addTick(); R.roll(); post([rxx, ry + lh / 2], null, 'h(deliver)', () => { ph = 9; t0 = performance.now(); }); }
      if (ph === 9 && t > 1600) { ph = 10; st.d = dataLines(svg, rxx - lw / 2, ry - lh / 2 - 36, ['deliver', 'bond XS123 · 100 · against h(?)']); }
      if (ph === 10 && t > 2400) { ph = 11; const r = ring(traffic); const a = [rxx - lw / 2 + 60, ry + lh / 2], b = [rxx, yB], c = [headX + 40, yB];
        st.probe = { r, t0: now, dur: 2600, path: u => u < .4 ? bez(a, b, ease(u / .4)) : u < .75 ? [b[0] + (c[0] - b[0]) * ease((u - .4) / .35), yB] : [c[0] + (b[0] - c[0]) * ease((u - .75) / .25), yB], done: () => { R.pulseRules(false); [...R.rules.children].forEach(q => { q.setAttribute('stroke-opacity', .15); setTimeout(() => q.setAttribute('stroke-opacity', .45), 900); }); ph = 12; t0 = performance.now(); } }; }
      if (ph === 12) { const u = Math.min(1, t / 900); st.d.setAttribute('opacity', 1 - u); if (u >= 1) { st.d.remove(); ph = 13; t0 = now; } }   // never posted
      if (ph === 13 && t > 2200) { ph = 0; t0 = now; ticks.forEach(k => k.g.setAttribute('opacity', .35)); if (headX > cx + step * 2) { ticks.splice(0).forEach(k => k.g.remove()); headX = cx - step * 1.5; } }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  /* ---------- sem3: anyone can replay. Two independent readers replay one layer's entries under the same rules and reach the same root. ---------- */
  FIG.sem3 = (svg, W) => {
    const narrow = W < 600, H = narrow ? 520 : 440; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, yB = 110, lw = narrow ? Math.min(260, W - 40) : Math.min(320, W * .36), lh = 120;
    const ax = narrow ? cx : cx - lw / 2 - 60, bxx = narrow ? cx : cx + lw / 2 + 60, ay = narrow ? 260 : 280, byy = narrow ? 420 : 280;
    beam(svg, id, yB, -40, W + 40, null, [], null);
    const n = narrow ? 9 : 13, x0 = cx - (n - 1) * 13, owner = Array.from({ length: n }, (_, k) => (k * 5) % 3);   // layer 2's entries are the ones marked 2
    const T = owner.map((o, k) => ({ x: x0 + k * 26, o, g: tickAt(svg, x0 + k * 26, yB, o === 2 ? 1 : .35, o + 1) }));
    const A = layer(svg, id, ax, ay, lw, lh, { ticks: 0 }), B = layer(svg, id, bxx, byy, lw, lh, { ticks: 0 });
    readerGlyph(svg, id, ax - lw / 2 - 34, ay - lh / 2 + 18, { icon: 'search', w: 40, h: 30 }); readerGlyph(svg, id, bxx + lw / 2 + 34, byy - lh / 2 + 18, { icon: 'search', w: 40, h: 30 });
    const seed = HASH() + HASH();
    if (reduced) { A.root.textContent = 'root ' + seed; B.root.textContent = 'root ' + seed; T.forEach(t => { if (t.o === 2) { A.addTick(); B.addTick(); } }); return; }
    const traffic = el('g', {}, svg); let t0 = performance.now(), ph = 0; let rings = [];
    const mine = T.filter(t => t.o === 2); let idx = 0;
    const roots = mine.map(() => HASH() + HASH()); roots[roots.length - 1] = seed;
    function frame(now) {
      if (!svg.isConnected) return; const t = now - t0;
      if (ph === 0 && t > 600) { ph = 1; idx = 0; A.order.innerHTML = ''; B.order.innerHTML = ''; A.ticks.length = 0; B.ticks.length = 0; A.root.textContent = 'root ' + HASH() + HASH(); B.root.textContent = 'root ' + HASH() + HASH(); t0 = now; }
      if (ph === 1 && t > 300 && idx < mine.length && rings.length === 0) { const tk = mine[idx]; tk.g.firstChild.setAttribute('stroke-width', 3.4); setTimeout(() => tk.g.firstChild.setAttribute('stroke-width', 2), 500);
        [[A, ax, ay], [B, bxx, byy]].forEach(([L, lx, ly], j) => { const r = ring(traffic); rings.push({ r, L, from: [tk.x, yB], to: [lx, ly - lh / 2], t0: now + j * 120, k: idx }); }); idx++; }
      for (let k = rings.length - 1; k >= 0; k--) { const rg = rings[k]; const u = (now - rg.t0) / 1300; if (u < 0) continue; if (u >= 1) { rg.r.remove(); rg.L.pulseRules(true); rg.L.addTick(); rg.L.root.textContent = 'root ' + roots[rg.k]; rings.splice(k, 1); continue; } const [x, y] = bez(rg.from, rg.to, ease(u)); rg.r.setAttribute('cx', x); rg.r.setAttribute('cy', y); rg.r.setAttribute('opacity', u < .1 ? u * 10 : 1); }
      if (ph === 1 && idx >= mine.length && rings.length === 0) { ph = 2; t0 = now; [A, B].forEach(L => { L.root.setAttribute('fill', C.accSoft); }); }
      if (ph === 2 && t > 3200) { ph = 0; t0 = now; [A, B].forEach(L => L.root.setAttribute('fill', C.fg2)); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  mountAll();
})();
