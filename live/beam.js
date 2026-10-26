/* Open Value · beam figures. Live SVG, laid out for the element's real width, animated with SMIL.
   One motif: the record is a beam of light. Sparks = fingerprints. Rings = systems (above) and readers (below).
   Dashed core = proposed. Nothing here is a deployment. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const C = { fg: '#E9EBEE', fg2: '#C3C8CF', mute: '#9AA1AB', dim: '#3A3F48', acc: '#6E82FF', accSoft: '#9DAAFF', light: '#DCE2FF', bg: '#14161A' };
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
      <radialGradient id="haze${uid}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.acc}" stop-opacity=".30"/><stop offset=".5" stop-color="${C.acc}" stop-opacity=".09"/><stop offset="1" stop-color="${C.acc}" stop-opacity="0"/></radialGradient>
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
    [[64, .07], [36, .12], [18, .22], [9, .4], [4, .75]].forEach(([w, op]) =>
      el('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: C.accSoft, 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round' }, m));
    el('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: C.light, 'stroke-width': 2, 'stroke-dasharray': '26 10', class: 'core' }, m);
    if (marks) el('path', { d: marks.map(x => `M${x} ${y - 5}V${y + 5}`).join(''), stroke: C.light, 'stroke-opacity': .35, 'stroke-width': 1 }, g);
    (lit || []).forEach((lx, i) => {
      const halo = el('circle', { cx: lx, cy: y, r: 9, fill: C.light, opacity: .5, filter: `url(#soft${id})` }, g);
      el('circle', { cx: lx, cy: y, r: 3.2, fill: '#fff' }, g);
      el('animate', { attributeName: 'opacity', values: '.35;.7;.35', dur: '4s', begin: `${i * .6}s`, repeatCount: 'indefinite' }, halo);
    });
    if (label) text(g, label.x, y + 30, label.t, { fill: C.accSoft });
    return g;
  }
  function ring(svg, id, x, y, r, icon, op = .7) {
    const g = el('g', {}, svg);
    el('circle', { cx: x, cy: y, r: r + 10, fill: C.acc, 'fill-opacity': .06, filter: `url(#soft${id})` }, g);
    el('circle', { cx: x, cy: y, r, fill: 'none', stroke: C.fg2, 'stroke-opacity': op, 'stroke-width': 1.2 }, g);
    if (icon) {
      const sc = r / 34 * .75;
      const ig = el('g', { transform: `translate(${x - 20 * sc},${y - 20 * sc}) scale(${sc})`, fill: 'none', stroke: C.fg2, 'stroke-opacity': op, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      ig.innerHTML = ICON[icon];
    }
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
      el('circle', { r: 2, fill: '#fff' }, s);
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
    const narrow = W < 440, H = narrow ? 420 : 520; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    const n = narrow ? 4 : 5, gap = Math.min(96, (W - 120) / (n - 1)), cx = W / 2;
    const sx = Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * gap);
    const land = sx.map(x => cx + (x - cx) * .72);
    const yS = 60, yB = Math.round(H * .55), yR = H - 70;
    const icons = ['bank', 'registry', 'card', 'identity', 'agent'];
    sx.forEach((x, i) => { fall(svg, id, x, yS + 26, land[i], yB, { begin: `${i * .7}s`, dur: '3.4s' }); ring(svg, id, x, yS, 24, narrow ? null : icons[i], .6); });
    text(svg, cx, yS - 40, 'systems · each keeps its own rules');
    const marks = []; for (let x = 60; x < W - 60; x += 35) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, land, { x: cx, t: 'the record · proposed' });
    const rx = narrow ? [cx - 90, cx, cx + 90] : [cx - 110, cx, cx + 110];
    rx.forEach((x, i) => { fall(svg, id, land[Math.round((land.length - 1) * i / 2)], yB, x, yR - 22, { spark: false, op: .25, ringUp: true, begin: `${1 + i * 1.3}s` }); ring(svg, id, x, yR, 20, null, .4); });
    text(svg, cx, H - 12, 'readers · check on their own terms');
  };

  FIG.why = (svg, W) => {
    const narrow = W < 640, H = narrow ? 620 : 380; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    // left: tangle
    const lcx = narrow ? W / 2 : W * .25, lcy = narrow ? 150 : 190, R = narrow ? 95 : Math.min(110, W * .11);
    const pts = Array.from({ length: 5 }, (_, i) => [lcx + R * Math.cos((-90 + i * 72) * Math.PI / 180), lcy + R * Math.sin((-90 + i * 72) * Math.PI / 180)]);
    let seed = 7; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - .5; };
    let k = 0;
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[j], jx = rnd() * 56, jy = rnd() * 56;
      const p = el('path', { d: `M${x0} ${y0} Q${(x0 + x1) / 2 + jx} ${(y0 + y1) / 2 + jy} ${x1} ${y1}`, fill: 'none', stroke: C.fg2, 'stroke-opacity': .28, 'stroke-width': 1 }, svg);
      el('animate', { attributeName: 'stroke-opacity', values: '.18;.4;.18', dur: '6s', begin: `${(k++) * .5}s`, repeatCount: 'indefinite' }, p);
    }
    pts.forEach(([x, y]) => ring(svg, id, x, y, 16, null, .55));
    text(svg, lcx, lcy - R - 36, 'today');
    text(svg, lcx, lcy + R + 44, 'five systems · ten pairs', { cls: 'lab sm' });
    // right: beam
    const rcx = narrow ? W / 2 : W * .72, top = narrow ? 360 : 60, yB = narrow ? 520 : 250, gap = narrow ? 62 : Math.min(80, W * .08);
    const rx = Array.from({ length: 5 }, (_, i) => rcx + (i - 2) * gap);
    rx.forEach((x, i) => { fall(svg, id, x, top + 16, x, yB, { begin: `${i * .5}s`, dur: '2.8s' }); ring(svg, id, x, top, 16, null, .55); });
    const marks = []; for (let x = rcx - gap * 2.6; x <= rcx + gap * 2.6; x += 26) marks.push(x);
    beam(svg, id, yB, rcx - gap * 3.2, rcx + gap * 3.2, marks, rx, { x: rcx, t: 'with one shared record · proposed' });
    text(svg, rcx, top - 36, 'one reference', { fill: C.accSoft });
    text(svg, rcx, yB + 56, 'five systems · five threads · once', { cls: 'lab sm' });
    if (!narrow) el('line', { x1: W / 2, x2: W / 2, y1: 30, y2: H - 30, stroke: C.fg2, 'stroke-opacity': .12 }, svg);
  };

  FIG.record = (svg, W) => {
    const H = 400; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, vw = Math.min(320, W - 80), vx = cx - vw / 2;
    el('rect', { x: vx, y: 40, width: vw, height: 150, rx: 22, fill: C.fg, 'fill-opacity': .025, stroke: C.fg2, 'stroke-opacity': .35, 'stroke-width': 1.2 }, svg);
    const cols = Math.floor((vw - 40) / 42);
    for (let i = 0; i < cols * 2; i++) el('rect', { x: vx + 24 + (i % cols) * 42, y: 72 + Math.floor(i / cols) * 50, width: 28, height: 30, rx: 4, fill: 'none', stroke: C.fg2, 'stroke-opacity': .22 }, svg);
    text(svg, cx, 26, 'a system · content · rules · state · meaning', { cls: 'lab sm' });
    const yB = 300;
    fall(svg, id, cx, 190, cx, yB, { dur: '3.6s', begin: '0s' });
    text(svg, cx + 18, 252, 'h(e) · a fingerprint, nothing else', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [cx], { x: cx, t: 'the record · proposed · one order' });
    text(svg, cx, yB + 60, 'not executed · not validated · not interpreted', { cls: 'lab sm' });
  };

  FIG.who = (svg, W) => {
    const narrow = W < 640, H = narrow ? 520 : 440; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    const xs = narrow ? 96 : W * .2, xr = narrow ? W - 96 : W * .8, yT = 54, yB = narrow ? 420 : 330;
    ring(svg, id, xs, yT, 30, 'bank', .85); text(svg, xs, yT + 50, 'system');
    ring(svg, id, xr, yT, 30, 'search', .85); text(svg, xr, yT + 50, 'reader');
    text(svg, xr, yT + 66, narrow ? 'auditor · regulator' : 'auditor · regulator · counterparty · the system later', { cls: 'lab sm' });
    // 3 obtain
    el('path', { d: `M${xr - 34} ${yT} H${xs + 36}`, stroke: C.fg2, 'stroke-opacity': .45, 'stroke-width': 1 }, svg);
    el('path', { d: `M${xs + 44} ${yT - 6} L${xs + 36} ${yT} L${xs + 44} ${yT + 6}`, fill: 'none', stroke: C.fg2, 'stroke-opacity': .45 }, svg);
    numdot(svg, (xs + xr) / 2, yT, 3, 4);
    text(svg, (xs + xr) / 2, yT - 24, narrow ? 'obtains the event · recomputes h(e)' : 'obtains the disclosed event · recomputes h(e)', { fill: C.fg2, cls: narrow ? 'lab sm' : 'lab' });
    if (!narrow) text(svg, (xs + xr) / 2, yT + 26, 'through whatever access exists today', { cls: 'lab sm' });
    // card
    const cw = narrow ? 200 : 230; card(svg, (xs + xr) / 2 - cw / 2, narrow ? 140 : 128, cw, 60, [['h', 'event e · its rules'], ['s', 'position #n · stored here']]);
    // open band
    const ob0 = narrow ? 230 : 220, ob1 = ob0 + 56, ym = narrow ? 340 : (yT + yB) / 2;
    el('rect', { x: 24, y: ob0, width: W - 48, height: 56, rx: 28, fill: C.fg, 'fill-opacity': .03, stroke: C.fg2, 'stroke-opacity': .25, 'stroke-dasharray': '2 5' }, svg);
    text(svg, W / 2, ob0 + 32, 'open · conventions may form here');
    // 1 down, 2 back, 4 check
    fall(svg, id, xs - 14, yT + 30, xs - 14, yB, { dur: '3s', begin: '0s' }); numdot(svg, xs - 46, ym, 1, 0); text(svg, xs - 46, ym + 24, narrow ? 'h(e)' : 'h(e) only', { cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xs + 18, yB, xs + 18, yT + 30, { spark: false, ringUp: false, op: .35 });
    const rp = el('circle', { r: 3.5, fill: C.bg, stroke: C.fg2, 'stroke-width': 1.2, opacity: 0 }, svg);
    el('animateMotion', { dur: '3s', begin: '2s', repeatCount: 'indefinite', path: fallPath(xs + 18, yB, xs + 18, yT + 30) }, rp);
    el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;.1;.85;1', dur: '3s', begin: '2s', repeatCount: 'indefinite' }, rp);
    numdot(svg, xs + 50, ym + 30, 2, 2); text(svg, xs + 50, ym + 54, 'position', { cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xr, yT + 30, xr, yB, { spark: false, op: .3 }); numdot(svg, xr + 46, ym, 4, 6); text(svg, xr + 46, ym + 24, narrow ? 'checks' : 'checks at #n', { cls: 'lab sm', fill: C.fg2 });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [xs - 14], { x: W / 2, t: 'the record · proposed' });
    text(svg, xs - 14, yB + 24, '#n', { cls: 'lab sm', fill: C.fg2 });
  };

  FIG.example = (svg, W) => {
    const narrow = W < 640, H = narrow ? 460 : 400; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg);
    const xb = narrow ? 60 : W * .18, xg = narrow ? W / 2 : W * .5, xa = narrow ? W - 60 : W * .82, yT = 54, yB = narrow ? 330 : 290;
    ring(svg, id, xb, yT, 28, 'bank', .85); text(svg, xb, yT + 48, narrow ? 'bank' : 'bank · cash leg');
    ring(svg, id, xg, yT, 28, 'registry', .85); text(svg, xg, yT + 48, narrow ? 'registry' : 'registry · asset leg');
    ring(svg, id, xa, yT, 28, 'search', .85); text(svg, xa, yT + 48, 'auditor'); text(svg, xa, yT + 64, 'months later', { cls: 'lab sm' });
    if (!narrow) { card(svg, xb + 44, yT - 24, 170, 50, [['s', 'cash leg · settled'], ['acc', 'position #n · kept']]); card(svg, xg + 44, yT - 24, 176, 50, [['s', 'asset leg · moved'], ['acc', 'position #n+k · kept']]); }
    fall(svg, id, xb - 12, yT + 28, xb - 12, yB, { dur: '3s', begin: '0s' }); text(svg, xb - 24, (yT + yB) / 2, 'h(cash)', { anchor: 'end', cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xg - 12, yT + 28, xg - 12, yB, { dur: '3s', begin: '1.2s' }); text(svg, xg - 24, (yT + yB) / 2, 'h(asset)', { anchor: 'end', cls: 'lab sm', fill: C.fg2 });
    fall(svg, id, xa, yT + 28, xa, yB, { spark: false, op: .3 }); text(svg, xa + 14, (yT + yB) / 2, 'checks order', { anchor: 'start', cls: 'lab sm', fill: C.fg2 });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [xb - 12, xg - 12], { x: W / 2, t: 'the record · proposed · sequence, not time' });
    text(svg, xb - 12, yB + 24 + 26, 'cash · #n', { cls: 'lab sm', fill: C.fg2 }); text(svg, xg - 12, yB + 24 + 26, 'asset · #n+k', { cls: 'lab sm', fill: C.fg2 });
  };

  FIG.questions = (svg, W) => {
    const narrow = W < 640, H = narrow ? 420 : 380; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const id = defs(svg), cx = W / 2, yT = 70, yB = narrow ? 290 : 260, gap = narrow ? 56 : Math.min(90, W * .09);
    const xs = [cx - gap * 2.5, cx - gap * 1.5, cx - gap * .5, cx + gap * .5];
    xs.forEach(x => { fall(svg, id, x, yT + 26, x, yB, { spark: false, op: .3 }); ring(svg, id, x, yT, narrow ? 18 : 26, null, .7); });
    text(svg, cx - gap, yT + (narrow ? 38 : 48), 'systems · each with its own rules', { cls: 'lab sm' });
    const xo = cx + gap * 2.2; fall(svg, id, xo, yT + 26, xo, yB, { spark: false, op: .3 }); ring(svg, id, xo, yT, narrow ? 18 : 26, 'search', .7); text(svg, xo, yT + (narrow ? 38 : 48), 'outsider', { cls: 'lab sm' });
    numdot(svg, cx - gap * 2, yT - 40, 2); text(svg, cx - gap * 2 + 18, yT - 36, 'identity', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    numdot(svg, cx, yT - 40, 6); text(svg, cx + 18, yT - 36, 'behaviour', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    numdot(svg, xo - 10, yT - 40, 5); text(svg, xo + 8, yT - 36, 'proof', { anchor: 'start', fill: C.fg2, cls: 'lab sm' });
    const marks = []; for (let x = 40; x < W - 40; x += 30) marks.push(x);
    beam(svg, id, yB, -40, W + 40, marks, [], { x: cx, t: 'the record · proposed' });
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
