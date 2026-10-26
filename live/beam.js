/* Open Value · beam figures. Live SVG, laid out for the element's real width, animated with SMIL.
   One motif: the record is a beam of light. Sparks = fingerprints. Rings = systems (above) and readers (below).
   Dashed core = proposed. Nothing here is a deployment. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const THEMES = {
    dark:  { fg: '#E9EBEE', fg2: '#C3C8CF', mute: '#9AA1AB', dim: '#3A3F48', acc: '#6E82FF', accSoft: '#9DAAFF', light: '#DCE2FF', core: '#DCE2FF', bg: '#14161A', hazeOp: [.30, .09], glowOps: [[64, .07], [36, .12], [18, .22], [9, .4], [4, .75]], ringOp: 1 },
    light: { fg: '#14171C', fg2: '#2E3540', mute: '#55606E', dim: '#B9C0CA', acc: '#1F3AFF', accSoft: '#1F3AFF', light: '#1F3AFF', core: '#1F3AFF', bg: '#DEE3EA', hazeOp: [.10, .03], glowOps: [[56, .03], [30, .05], [14, .09], [7, .18], [3, .45]], ringOp: .8 }
  };
  const C = THEMES[document.documentElement.dataset.theme] || THEMES.dark;
  const ICON = {
    bank: '<path d="M4 15 L20 5 L36 15 Z"/><path d="M6 34 H34 M5 37 H35"/><path d="M10 18 V31 M17 18 V31 M23 18 V31 M30 18 V31"/>',
    registry: '<rect x="8" y="12" width="22" height="24" rx="2"/><path d="M12 8 H32 a2 2 0 0 1 2 2 V32"/><path d="M13 19 H25 M13 24 H25 M13 29 H21"/>',
    card: '<rect x="5" y="10" width="30" height="20" rx="3"/><path d="M5 16 H35 M10 25 H18"/>',
    identity: '<circle cx="20" cy="14" r="6"/><path d="M9 34 C9 26 14 23 20 23 C26 23 31 26 31 34"/><path d="M30 8 L33 11 L38 5"/>',
    agent: '<rect x="9" y="11" width="22" height="20" rx="3"/><path d="M20 4 V11 M14 31 V36 M26 31 V36 M3 21 H9 M31 21 H37"/>',
    search: '<circle cx="17" cy="17" r="10"/><path d="M24.5 24.5 L35 35"/>',
    shield: '<path d="M20 4 L34 9 V19 C34 28 28 33 20 36 C12 33 6 28 6 19 V9 Z"/><path d="M14 20 L18 24 L26 15"/>',
    person: '<circle cx="20" cy="13" r="6"/><path d="M8 35 C8 26 13 22 20 22 C27 22 32 26 32 35"/>'
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;

  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function text(p, x, y, t, o = {}) {
    const e = el('text', { x, y, 'text-anchor': o.anchor || 'middle', class: o.cls || 'lab', fill: o.fill || C.mute }, p);
    e.textContent = t; return e;
  }
  function defs(svg) {
    const d = el('defs', {}, svg);
    d.innerHTML = `
      <radialGradient id="haze${uid}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.acc}" stop-opacity="${C.hazeOp[0]}"/><stop offset=".5" stop-color="${C.acc}" stop-opacity="${C.hazeOp[1]}"/><stop offset="1" stop-color="${C.acc}" stop-opacity="0"/></radialGradient>
      <filter id="soft${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`;
    return uid;
  }

  /* --- primitives --- */
  function beam(svg, id, y, x0, x1, marks, lit, label) {
    const g = el('g', {}, svg);
    const mid = `m${id}_${Math.round(y)}`;
    const d = el('defs', {}, g);
    d.innerHTML = `<linearGradient id="g${mid}" gradientUnits="userSpaceOnUse" x1="${x0}" x2="${x1}" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff" stop-opacity="1"/><stop offset=".82" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="${mid}"><rect x="${x0 - 80}" y="${y - 120}" width="${x1 - x0 + 160}" height="240" fill="url(#g${mid})"/></mask>`;
    const m = el('g', { mask: `url(#${mid})` }, g);
    el('ellipse', { cx: (x0 + x1) / 2, cy: y, rx: (x1 - x0) / 2, ry: 70, fill: `url(#haze${id})` }, m);
    C.glowOps.forEach(([w, op]) =>
      el('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: C.accSoft, 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round' }, m));
    el('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: C.core, 'stroke-width': 2, 'stroke-dasharray': '26 10', class: 'core' }, m);
    if (marks) el('path', { d: marks.map(x => `M${x} ${y - 5}V${y + 5}`).join(''), stroke: C.light, 'stroke-opacity': .35, 'stroke-width': 1 }, g);
    (lit || []).forEach((lx, i) => {
      const halo = el('circle', { cx: lx, cy: y, r: 9, fill: C.light, opacity: .5, filter: `url(#soft${id})` }, g);
      el('circle', { cx: lx, cy: y, r: 3.2, fill: C.bg === '#14161A' ? '#fff' : C.acc }, g);
      el('animate', { attributeName: 'opacity', values: '.35;.7;.35', dur: '4s', begin: `${i * .6}s`, repeatCount: 'indefinite' }, halo);
    });
    if (label) text(g, label.x, y + 30, label.t, { fill: C.accSoft });
    return g;
  }
  function ring(svg, id, x, y, r, icon, op = .7) {
    const g = el('g', {}, svg);
    el('circle', { cx: x, cy: y, r: r + 10, fill: C.acc, 'fill-opacity': C.ringOp < 1 ? .035 : .06, filter: `url(#soft${id})` }, g);
    el('circle', { cx: x, cy: y, r, fill: 'none', stroke: C.fg2, 'stroke-opacity': op * C.ringOp, 'stroke-width': 1.2 }, g);
    if (icon) {
      const sc = r / 34 * .75;
      const ig = el('g', { transform: `translate(${x - 20 * sc},${y - 20 * sc}) scale(${sc})`, fill: 'none', stroke: C.fg2, 'stroke-opacity': op, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      ig.innerHTML = ICON[icon];
    }
    return g;
  }
  /* --- glyphs. A system: a frame holding its own ticked sequence (its own order). A reader: the same frame holding a hollow position. --- */
  function sysGlyph(svg, id, x, y, i, o = {}) {
    const w = o.w || 50, h = o.h || 38, op = (o.op || .8) * C.ringOp;
    const g = el('g', {}, svg);
    el('rect', { x: x - w / 2 - 8, y: y - h / 2 - 8, width: w + 16, height: h + 16, rx: 16, fill: C.acc, 'fill-opacity': C.ringOp < 1 ? .035 : .06, filter: `url(#soft${id})` }, g);
    el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 10, fill: 'none', stroke: C.fg2, 'stroke-opacity': op, 'stroke-width': 1.2 }, g);
    if (o.icon) {
      const sc = .55; const ig = el('g', { transform: `translate(${x - 20 * sc},${y - 20 * sc}) scale(${sc})`, fill: 'none', stroke: C.fg2, 'stroke-opacity': op, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      ig.innerHTML = ICON[o.icon]; return g;
    }
    const lw = w - 18, n = 3 + (i % 3);
    el('line', { x1: x - lw / 2, x2: x + lw / 2, y1: y, y2: y, stroke: C.fg2, 'stroke-opacity': op, 'stroke-width': 1.3 }, g);
    for (let k = 0; k < n; k++) { const tx = x - lw / 2 + 3 + k * ((lw - 6) / (n - 1)); el('line', { x1: tx, x2: tx, y1: y - 3.5, y2: y + 3.5, stroke: C.fg2, 'stroke-opacity': op * .8 }, g); }
    const head = el('circle', { cx: x + lw / 2 - 3, cy: y, r: 2.2, fill: C.accSoft, class: 'head' }, g);
    g.head = head; g.headX = x + lw / 2 - 3;
    return g;
  }
  function readerGlyph(svg, id, x, y, o = {}) {
    const w = o.w || 50, h = o.h || 38, op = (o.op || .5) * C.ringOp;
    const g = el('g', {}, svg);
    el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 10, fill: 'none', stroke: C.fg2, 'stroke-opacity': op, 'stroke-width': 1.2 }, g);
    if (o.icon) { const sc = .55; const ig = el('g', { transform: `translate(${x - 20 * sc},${y - 20 * sc}) scale(${sc})`, fill: 'none', stroke: C.fg2, 'stroke-opacity': op + .2, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); ig.innerHTML = ICON[o.icon]; return g; }
    el('circle', { cx: x, cy: y, r: 4.5, fill: 'none', stroke: C.fg2, 'stroke-opacity': op + .2, 'stroke-width': 1.3 }, g);
    return g;
  }
  function fallPath(x0, y0, x1, y1) { const my = (y0 + y1) / 2; return `M${x0} ${y0} C${x0} ${my} ${x1} ${my} ${x1} ${y1}`; }
  function fall(svg, id, x0, y0, x1, y1, o = {}) {
    const g = el('g', {}, svg);
    const d = fallPath(x0, y0, x1, y1);
    el('path', { d, fill: 'none', stroke: C.fg2, 'stroke-opacity': o.op || .35, 'stroke-width': 1 }, g);
    if (o.spark !== false) {
      const s = el('g', { opacity: 0 }, g);
      el('circle', { r: 5, fill: C.accSoft, opacity: .6, filter: `url(#soft${id})` }, s);
      el('circle', { r: 2, fill: C.bg === '#14161A' ? '#fff' : C.acc }, s);
      const am = el('animateMotion', { dur: o.dur || '3.2s', begin: o.begin || '0s', repeatCount: o.once ? '1' : 'indefinite', fill: 'freeze', path: d, keyPoints: '0;1', keyTimes: '0;1', calcMode: 'spline', keySplines: '.4 0 .6 1' }, s);
      el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;.1;.85;1', dur: o.dur || '3.2s', begin: o.begin || '0s', repeatCount: o.once ? '1' : 'indefinite' }, s);
    }
    if (o.ringUp) {
      const s = el('circle', { r: 3.5, fill: C.bg, stroke: C.fg2, 'stroke-width': 1.2, opacity: 0 }, g);
      el('animateMotion', { dur: '4s', begin: o.begin || '0s', repeatCount: 'indefinite', path: d, keyPoints: '1;0', keyTimes: '0;1', calcMode: 'spline', keySplines: '.4 0 .6 1' }, s);
      el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;.1;.85;1', dur: '4s', begin: o.begin || '0s', repeatCount: 'indefinite' }, s);
    }
    return g;
  }
  function pill(svg, x, y, t) {
    const w = t.length * 7 + 34;
    el('rect', { x: x - w / 2, y: y - 13, width: w, height: 26, rx: 13, fill: 'none', stroke: C.fg2, 'stroke-opacity': .3 }, svg);
    text(svg, x, y + 4, t, { cls: 'lab sm' });
  }
  function numdot(svg, x, y, n, delay) {
    const g = el('g', {}, svg);
    const c = el('circle', { cx: x, cy: y, r: 11, fill: C.light }, g);
    text(g, x, y + 4, String(n), { fill: C.bg, cls: 'num' });
    if (delay != null) el('animate', { attributeName: 'fill', values: `${C.dim};${C.light};${C.light};${C.dim}`, keyTimes: '0;.08;.3;.4', dur: '8s', begin: `${delay}s`, repeatCount: 'indefinite' }, c);
    return g;
  }
  function card(svg, x, y, w, h, lines) {
    el('rect', { x, y, width: w, height: h, rx: 6, fill: C.fg, 'fill-opacity': .03, stroke: C.fg2, 'stroke-opacity': .35 }, svg);
    lines.forEach(([k, t], i) => text(svg, x + 14, y + 21 + i * 19, t, { anchor: 'start', cls: k === 'h' ? 'body' : 'lab sm', fill: k === 'h' ? C.fg : k === 'acc' ? C.accSoft : C.mute }));
  }

  /* --- figures. Each receives (svg, W) and lays out for that width. --- */
  const FIG = {};

  FIG.hero = (svg, W) => {
    const narrow = W < 440, H = narrow ? 440 : 520; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    const n = narrow ? 4 : 5, gap = Math.min(100, (W - 110) / (n - 1)), cx = W / 2;
    const sx = Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * gap);
    const yS = 62, yB = Math.round(H * .55), yR = H - 64;
    // beam without fixed marks; the order is drawn by writes
    const bg = beam(svg, id, yB, -40, W + 40, null, [], null);
    const order = el('g', {}, svg);           // persistent ticks: the record
    const traffic = el('g', {}, svg);         // moving sparks and rings
    const systems = sx.map((x, i) => sysGlyph(svg, id, x, yS, i));
    const rx = narrow ? [cx - 84, cx, cx + 84] : [cx - 110, cx, cx + 110];
    const readers = rx.map(x => readerGlyph(svg, id, x, yR));
    sx.forEach(x => el('path', { d: fallPath(x, yS + 20, x, yB), fill: 'none', stroke: C.fg2, 'stroke-opacity': .18, 'stroke-width': 1 }, svg));
    rx.forEach(x => el('path', { d: fallPath(x, yB, x, yR - 20), fill: 'none', stroke: C.fg2, 'stroke-opacity': .12, 'stroke-width': 1 }, svg));
    if (reduced) { // static: a few ticks on the beam
      for (let k = 0; k < 9; k++) el('line', { x1: cx - 120 + k * 30, x2: cx - 120 + k * 30, y1: yB - 5, y2: yB + 5, stroke: C.light, 'stroke-opacity': .5 }, order);
      return;
    }
    // --- state ---
    const ticks = [];                    // {x, el}
    const step = 22;                     // spacing of positions in the order
    let headX = cx - step * 4;           // next free position; the order grows to the right
    const sparks = [], rings = [];
    const bez = (p0, p1, t) => { const my = (p0[1] + p1[1]) / 2; const u = 1 - t; // cubic with vertical handles
      const x = u*u*u*p0[0] + 3*u*u*t*p0[0] + 3*u*t*t*p1[0] + t*t*t*p1[0];
      const y = u*u*u*p0[1] + 3*u*u*t*my + 3*u*t*t*my + t*t*t*p1[1]; return [x, y]; };
    const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
    function write(i) {
      const to = headX; headX += step;
      const g = el('g', {}, traffic);
      el('circle', { r: 5, fill: C.accSoft, opacity: .6, filter: `url(#soft${id})` }, g);
      el('circle', { r: 2, fill: C.bg === '#14161A' ? '#fff' : C.acc }, g);
      sparks.push({ g, from: [sx[i], yS + 20], to: [to, yB], t0: performance.now(), dur: 2600, sys: i });
      const h = systems[i].head; h.setAttribute('r', 4); setTimeout(() => h.setAttribute('r', 2.2), 500);
    }
    function land(sp) {
      sp.g.remove();
      const x = sp.to[0];
      const tk = el('line', { x1: x, x2: x, y1: yB - 10, y2: yB + 10, stroke: C.light, 'stroke-opacity': 1, 'stroke-width': 2 }, order);
      const flash = el('circle', { cx: x, cy: yB, r: 10, fill: C.light, opacity: .7, filter: `url(#soft${id})` }, order);
      ticks.push({ x, el: tk, flash, born: performance.now() });
      while (ticks.length > 40) { const o = ticks.shift(); o.el.remove(); }
    }
    function read() {
      if (ticks.length < 3) return;
      const tk = ticks[Math.floor(Math.random() * (ticks.length - 1))];
      const r = Math.floor(Math.random() * rx.length);
      const g = el('circle', { r: 3.5, fill: C.bg, stroke: C.fg2, 'stroke-width': 1.2 }, traffic);
      rings.push({ g, from: [tk.x, yB], to: [rx[r], yR - 20], t0: performance.now(), dur: 3000, tick: tk });
      tk.el.setAttribute('stroke-width', 3.2); setTimeout(() => tk.el.setAttribute('stroke-width', 2), 600);
    }
    let nextWrite = 0, nextRead = 2500, shift = 0;
    function frame(now) {
      if (!svg.isConnected) return;
      if (now > nextWrite) { write(Math.floor(Math.random() * n)); nextWrite = now + 900 + Math.random() * 1400; }
      if (now > nextRead) { read(); nextRead = now + 2200 + Math.random() * 2600; }
      for (let k = sparks.length - 1; k >= 0; k--) { const sp = sparks[k]; const t = (now - sp.t0) / sp.dur;
        if (t >= 1) { land(sp); sparks.splice(k, 1); continue; }
        const [x, y] = bez(sp.from, sp.to, ease(t)); sp.g.setAttribute('transform', `translate(${x},${y})`); sp.g.setAttribute('opacity', t < .1 ? t * 10 : 1); }
      for (let k = rings.length - 1; k >= 0; k--) { const rg = rings[k]; const t = (now - rg.t0) / rg.dur;
        if (t >= 1) { rg.g.remove(); rings.splice(k, 1); continue; }
        const [x, y] = bez(rg.from, rg.to, ease(t)); rg.g.setAttribute('cx', x); rg.g.setAttribute('cy', y); rg.g.setAttribute('opacity', t > .85 ? (1 - t) / .15 : 1); }
      // ticks settle: flash fades, then the whole order drifts left so the head stays in frame
      ticks.forEach(tk => { const a = (now - tk.born) / 900; if (tk.flash) { if (a >= 1) { tk.flash.remove(); tk.flash = null; } else tk.flash.setAttribute('opacity', .7 * (1 - a)); }
        tk.el.setAttribute('stroke-opacity', Math.max(.6, 1 - a * .4)); });
      if (headX > cx + step * 5) { const dx = .35; headX -= dx; ticks.forEach(tk => { tk.x -= dx; tk.el.setAttribute('x1', tk.x); tk.el.setAttribute('x2', tk.x); if (tk.flash) tk.flash.setAttribute('cx', tk.x); });
        sparks.forEach(sp => sp.to[0] -= dx); rings.forEach(rg => rg.from[0] -= dx); }
      ticks.forEach(tk => { if (tk.x < cx - step * 9) tk.el.setAttribute('stroke-opacity', Math.max(0, (tk.x - (cx - step * 11)) / (step * 2) * .6)); });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  FIG.why = (svg, W) => {
    const narrow = W < 640, H = narrow ? 620 : 380; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    // left: today. pairs reconcile one at a time: a thread lights, two points leave each end, meet, the thread dims.
    const lcx = narrow ? W / 2 : W * .25, lcy = narrow ? 150 : 190, R = narrow ? 95 : Math.min(110, W * .11);
    const pts = Array.from({ length: 5 }, (_, i) => [lcx + R * Math.cos((-90 + i * 72) * Math.PI / 180), lcy + R * Math.sin((-90 + i * 72) * Math.PI / 180)]);
    const pairs = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pairs.push([i, j]);
    const period = pairs.length * 1.3;
    pairs.forEach(([i, j], k) => {
      const [x0, y0] = pts[i], [x1, y1] = pts[j], mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      const p = el('path', { d: `M${x0} ${y0} L${x1} ${y1}`, fill: 'none', stroke: C.fg2, 'stroke-opacity': .18, 'stroke-width': 1 }, svg);
      if (reduced) return;
      const b = `${k * 1.3}s`;
      el('animate', { attributeName: 'stroke-opacity', values: '.18;.7;.7;.18', keyTimes: '0;.15;.8;1', dur: '1.3s', begin: b + `;${b.replace('s','')}s+${period}s`, repeatCount: 'indefinite', calcMode: 'linear' }, p).setAttribute('begin', `${k * 1.3}s`);
      // SMIL repeat for the whole cycle: use a wrapper animate with dur=period and keyTimes window
      p.firstChild && p.removeChild(p.firstChild);
      const win = (k * 1.3) / period, w1 = Math.min(1, win + 1.2 / period);
      el('animate', { attributeName: 'stroke-opacity', values: `.18;.18;.75;.75;.18;.18`, keyTimes: `0;${win.toFixed(4)};${(win + .02).toFixed(4)};${(w1 - .02).toFixed(4)};${w1.toFixed(4)};1`, dur: `${period}s`, repeatCount: 'indefinite' }, p);
      [[x0, y0], [x1, y1]].forEach(([ax, ay]) => {
        const d = el('circle', { r: 2.6, fill: C.fg2, opacity: 0 }, svg);
        el('animate', { attributeName: 'cx', values: `${ax};${ax};${mx};${mx};${ax}`, keyTimes: `0;${win.toFixed(4)};${(win + .9 / period).toFixed(4)};${w1.toFixed(4)};1`, dur: `${period}s`, repeatCount: 'indefinite' }, d);
        el('animate', { attributeName: 'cy', values: `${ay};${ay};${my};${my};${ay}`, keyTimes: `0;${win.toFixed(4)};${(win + .9 / period).toFixed(4)};${w1.toFixed(4)};1`, dur: `${period}s`, repeatCount: 'indefinite' }, d);
        el('animate', { attributeName: 'opacity', values: `0;0;1;1;0;0`, keyTimes: `0;${win.toFixed(4)};${(win + .05 / period).toFixed(4)};${(w1 - .05 / period).toFixed(4)};${w1.toFixed(4)};1`, dur: `${period}s`, repeatCount: 'indefinite' }, d);
      });
    });
    pts.forEach(([x, y], i) => sysGlyph(svg, id, x, y, i, { w: 40, h: 30, op: .7 }));
    text(svg, lcx, lcy - R - 40, 'today');
    // right: with a shared record. each system writes once.
    const rcx = narrow ? W / 2 : W * .72, top = narrow ? 360 : 60, yB = narrow ? 520 : 250, gap = narrow ? 62 : Math.min(80, W * .08);
    const rx = Array.from({ length: 5 }, (_, i) => rcx + (i - 2) * gap);
    rx.forEach((x, i) => { fall(svg, id, x, top + 16, x, yB, { begin: `${i * .5}s`, dur: '2.8s' }); sysGlyph(svg, id, x, top, i, { w: 40, h: 30, op: .7 }); });
    const marks = []; for (let x = rcx - gap * 2.6; x <= rcx + gap * 2.6; x += 26) marks.push(x);
    beam(svg, id, yB, rcx - gap * 3.2, rcx + gap * 3.2, marks, rx, null);
    text(svg, rcx, top - 40, 'with a shared record', { fill: C.accSoft });
    if (!narrow) el('line', { x1: W / 2, x2: W / 2, y1: 30, y2: H - 30, stroke: C.fg2, 'stroke-opacity': .12 }, svg);
  };

  FIG.record = (svg, W) => {
    const H = 400; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, vw = Math.min(320, W - 80), vx = cx - vw / 2;
    el('rect', { x: vx, y: 40, width: vw, height: 150, rx: 22, fill: C.fg, 'fill-opacity': .025, stroke: C.fg2, 'stroke-opacity': .35, 'stroke-width': 1.2 }, svg);
    // its own order, large: many ticks, the newest lit; content stays as faint structure beneath
    const lw = vw - 60; el('line', { x1: cx - lw / 2, x2: cx + lw / 2, y1: 95, y2: 95, stroke: C.fg2, 'stroke-opacity': .7, 'stroke-width': 1.3 }, svg);
    for (let k = 0; k < 9; k++) { const tx = cx - lw / 2 + 4 + k * ((lw - 8) / 8); el('line', { x1: tx, x2: tx, y1: 90, y2: 100, stroke: C.fg2, 'stroke-opacity': .55 }, svg); }
    el('circle', { cx: cx + lw / 2 - 4, cy: 95, r: 3, fill: C.accSoft }, svg);
    const cols = Math.floor((vw - 40) / 42);
    for (let i = 0; i < cols; i++) el('rect', { x: vx + 24 + i * 42, y: 125, width: 28, height: 40, rx: 4, fill: 'none', stroke: C.fg2, 'stroke-opacity': .18 }, svg);
    const yB = 300;
    fall(svg, id, cx, 190, cx, yB, { dur: '3.6s', begin: '0s' });
    text(svg, cx + 18, 252, 'h(e)', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [cx], null);
  };

  FIG.who = (svg, W) => {
    const narrow = W < 640, H = narrow ? 520 : 440; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    const xs = narrow ? 96 : W * .2, xr = narrow ? W - 96 : W * .8, yT = 54, yB = narrow ? 420 : 330;
    sysGlyph(svg, id, xs, yT, 0, { icon: 'bank', w: 56, h: 44, op: .85 }); text(svg, xs, yT + 50, 'system');
    readerGlyph(svg, id, xr, yT, { icon: 'search', w: 56, h: 44, op: .6 }); text(svg, xr, yT + 50, 'reader');
    text(svg, xr, yT + 66, narrow ? 'auditor · regulator' : 'auditor · regulator · counterparty · the system later', { cls: 'lab sm' });
    // 3 obtain
    el('path', { d: `M${xr - 34} ${yT} H${xs + 36}`, stroke: C.fg2, 'stroke-opacity': .45, 'stroke-width': 1 }, svg);
    el('path', { d: `M${xs + 44} ${yT - 6} L${xs + 36} ${yT} L${xs + 44} ${yT + 6}`, fill: 'none', stroke: C.fg2, 'stroke-opacity': .45 }, svg);
    numdot(svg, (xs + xr) / 2, yT, 3, 4);
    text(svg, (xs + xr) / 2, yT - 24, narrow ? 'obtains the event · recomputes h(e)' : 'obtains the disclosed event · recomputes h(e)', { fill: C.fg2, cls: narrow ? 'lab sm' : 'lab' });
    // card
    const cw = narrow ? 200 : 230; card(svg, (xs + xr) / 2 - cw / 2, narrow ? 140 : 128, cw, 60, [['h', 'event e · its rules'], ['s', 'position #n · stored here']]);
    // open band
    const ob0 = narrow ? 230 : 220, ob1 = ob0 + 56, ym = narrow ? 340 : (yT + yB) / 2;
    el('rect', { x: 24, y: ob0, width: W - 48, height: 56, rx: 28, fill: C.fg, 'fill-opacity': .03, stroke: C.fg2, 'stroke-opacity': .25, 'stroke-dasharray': '2 5' }, svg);
    text(svg, W / 2, ob0 + 32, 'open');
    // 1 down, 2 back, 4 check
    fall(svg, id, xs - 14, yT + 30, xs - 14, yB, { dur: '3s', begin: '0s' }); numdot(svg, xs - 46, ym, 1, 0); text(svg, xs - 46, ym + 24, narrow ? 'h(e)' : 'h(e) only', { cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xs + 18, yB, xs + 18, yT + 30, { spark: false, ringUp: false, op: .35 });
    const rp = el('circle', { r: 3.5, fill: C.bg, stroke: C.fg2, 'stroke-width': 1.2, opacity: 0 }, svg);
    el('animateMotion', { dur: '3s', begin: '2s', repeatCount: 'indefinite', path: fallPath(xs + 18, yB, xs + 18, yT + 30) }, rp);
    el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;.1;.85;1', dur: '3s', begin: '2s', repeatCount: 'indefinite' }, rp);
    numdot(svg, xs + 50, ym + 30, 2, 2); text(svg, xs + 50, ym + 54, 'position', { cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xr, yT + 30, xr, yB, { spark: false, op: .3 }); numdot(svg, xr + 46, ym, 4, 6); text(svg, xr + 46, ym + 24, narrow ? 'checks' : 'checks at #n', { cls: 'lab sm', fill: C.fg2 });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [xs - 14], null);
    text(svg, xs - 14, yB + 24, '#n', { cls: 'lab sm', fill: C.fg2 });
  };

  FIG.example = (svg, W) => {
    const narrow = W < 640, H = narrow ? 460 : 400; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    const xb = narrow ? 60 : W * .18, xg = narrow ? W / 2 : W * .5, xa = narrow ? W - 60 : W * .82, yT = 54, yB = narrow ? 330 : 290;
    sysGlyph(svg, id, xb, yT, 0, { icon: 'bank', w: 54, h: 42, op: .85 }); text(svg, xb, yT + 48, narrow ? 'bank' : 'bank · cash leg');
    sysGlyph(svg, id, xg, yT, 1, { icon: 'registry', w: 54, h: 42, op: .85 }); text(svg, xg, yT + 48, narrow ? 'registry' : 'registry · asset leg');
    readerGlyph(svg, id, xa, yT, { icon: 'search', w: 54, h: 42, op: .6 }); text(svg, xa, yT + 48, 'auditor'); text(svg, xa, yT + 64, 'months later', { cls: 'lab sm' });
    if (!narrow) { card(svg, xb + 44, yT - 24, 170, 50, [['s', 'cash leg · settled'], ['acc', 'position #n · kept']]); card(svg, xg + 44, yT - 24, 176, 50, [['s', 'asset leg · moved'], ['acc', 'position #n+k · kept']]); }
    fall(svg, id, xb - 12, yT + 28, xb - 12, yB, { dur: '3s', begin: '0s' }); text(svg, xb - 24, (yT + yB) / 2, 'h(cash)', { anchor: 'end', cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xg - 12, yT + 28, xg - 12, yB, { dur: '3s', begin: '1.2s' }); text(svg, xg - 24, (yT + yB) / 2, 'h(asset)', { anchor: 'end', cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xa, yT + 28, xa, yB, { spark: false, op: .3 }); text(svg, xa + 14, (yT + yB) / 2, 'checks order', { anchor: 'start', cls: 'lab sm', fill: C.fg2 });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [xb - 12, xg - 12], null);
    text(svg, xb - 12, yB + 24 + 26, 'cash · #n', { cls: 'lab sm', fill: C.fg2 }); text(svg, xg - 12, yB + 24 + 26, 'asset · #n+k', { cls: 'lab sm', fill: C.fg2 });
  };

  FIG.questions = (svg, W) => {
    const narrow = W < 640, H = narrow ? 420 : 380; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, yT = 70, yB = narrow ? 290 : 260, gap = narrow ? 56 : Math.min(90, W * .09);
    const xs = [cx - gap * 2.5, cx - gap * 1.5, cx - gap * .5, cx + gap * .5];
    xs.forEach((x, i) => { fall(svg, id, x, yT + 22, x, yB, { spark: false, op: .3 }); sysGlyph(svg, id, x, yT, i, { w: narrow ? 36 : 46, h: narrow ? 28 : 36, op: .7 }); });
    const xo = cx + gap * 2.2; fall(svg, id, xo, yT + 22, xo, yB, { spark: false, op: .3 }); readerGlyph(svg, id, xo, yT, { w: narrow ? 36 : 46, h: narrow ? 28 : 36, op: .6 }); text(svg, xo, yT + (narrow ? 38 : 48), 'outsider', { cls: 'lab sm' });
    numdot(svg, cx - gap * 2, yT - 40, 2); text(svg, cx - gap * 2 + 18, yT - 36, 'identity', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    numdot(svg, cx, yT - 40, 6); text(svg, cx + 18, yT - 36, 'behaviour', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    numdot(svg, xo - 10, yT - 40, 5); text(svg, xo + 8, yT - 36, 'proof', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [], null);
    [[cx - gap * 1.8, 1, 'ordering'], [cx, 3, 'availability'], [cx + gap * 1.8, 4, 'longevity']].forEach(([x, n, t]) => { numdot(svg, x, yB, n); text(svg, x, yB + 56, t, { fill: C.fg2, cls: 'lab sm' }); });
  };

  function mount(node) {
    const kind = node.dataset.fig; if (!FIG[kind]) return;
    const render = () => {
      const W = Math.max(320, Math.round(node.getBoundingClientRect().width)) || 800;
      node.innerHTML = ''; const svg = el('svg', { xmlns: NS, width: '100%', role: 'img', 'aria-label': node.dataset.label || '' }, node);
      FIG[kind](svg, W);
      if (reduced) svg.pauseAnimations();
    };
    render();
    let w = node.getBoundingClientRect().width;
    new ResizeObserver(() => { const nw = node.getBoundingClientRect().width; if (Math.abs(nw - w) > 24) { w = nw; render(); } }).observe(node);
  }
  document.querySelectorAll('[data-fig]').forEach(mount);
})();
