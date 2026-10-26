"""Beam family B0–B5. Dark atmosphere, one motif: the record is a beam of light.
B0 hero, B1 why, B2 the record are emblems (motif carries the meaning, labels minimal).
B3–B5 reuse the explanatory geometry from figfamily, re-themed dark, with the beam as the record.
"""
import os, math, random, sys
sys.path.insert(0, os.path.dirname(__file__))
import figfamily as F

BG, BG2 = '#14161A', '#0E0F12'
FG, FG2, MUTE, DIM = '#E9EBEE', '#C3C8CF', '#9AA1AB', '#3A3F48'
ACC, ACC_SOFT, LIGHT = '#6E82FF', '#9DAAFF', '#DCE2FF'
MONO, SANS = F.MONO, F.SANS
random.seed(7)

def label(x, y, t, size=11, color=MUTE, anchor='middle', track='.14em'):
    return F.label(x, y, t, size, color, anchor, True, 400, track)
def note(x, y, t, size=14, color=FG2, anchor='start', weight=400):
    return F.label(x, y, t, size, color, anchor, False, weight)

DEFS = f'''<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="{BG2}"/></linearGradient>
<radialGradient id="haze" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="{ACC}" stop-opacity=".30"/><stop offset=".5" stop-color="{ACC}" stop-opacity=".09"/><stop offset="1" stop-color="{ACC}" stop-opacity="0"/></radialGradient>
<linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".12" stop-color="#fff" stop-opacity="1"/><stop offset=".88" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="fadem"><rect width="1200" height="750" fill="url(#fade)"/></mask>
<filter id="glow" x="-20%" y="-600%" width="140%" height="1300%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="glow2" x="-20%" y="-1200%" width="140%" height="2500%"><feGaussianBlur stdDeviation="34"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer></filter>
</defs>'''

def ground(haze_cx=600, haze_cy=440, haze_rx=700, haze_ry=220):
    return (f'<rect width="1200" height="750" fill="url(#bg)"/>'
            f'<ellipse cx="{haze_cx}" cy="{haze_cy}" rx="{haze_rx}" ry="{haze_ry}" fill="url(#haze)"/>')

def grain():
    return '<rect width="1200" height="750" filter="url(#grain)" opacity=".9" style="mix-blend-mode:overlay"/>'

def beam(y=470, x0=0, x1=1200, core=1.6, dashed=True, marks=None, lit=(), label_text=None, label_x=None):
    """The record as a beam. Dashed core = proposed. marks: x positions of faint slots; lit: x positions that glow."""
    da = ' stroke-dasharray="26 10"' if dashed else ''
    mid = f'm{x0}_{x1}_{y}'
    s = (f'<defs><linearGradient id="g{mid}" gradientUnits="userSpaceOnUse" x1="{x0}" x2="{x1}" y1="0" y2="0">'
         f'<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff" stop-opacity="1"/>'
         f'<stop offset=".82" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
         f'<mask id="{mid}"><rect x="{x0-80}" y="{y-120}" width="{x1-x0+160}" height="240" fill="url(#g{mid})"/></mask></defs>')
    s += f'<g mask="url(#{mid})">'
    s += f'<ellipse cx="{(x0+x1)/2}" cy="{y}" rx="{(x1-x0)/2}" ry="70" fill="url(#haze)"/>'
    for w, op in ((64,.07),(36,.12),(18,.22),(9,.4),(4,.75)):
        s += f'<line x1="{x0}" x2="{x1}" y1="{y}" y2="{y}" stroke="{ACC_SOFT}" stroke-opacity="{op}" stroke-width="{w}" stroke-linecap="round"/>'
    s += f'<line x1="{x0}" x2="{x1}" y1="{y}" y2="{y}" stroke="{LIGHT}" stroke-width="{core+.4}"{da}/>'
    s += '</g>'
    if marks:
        s += f'<path d="{"".join(f"M{m} {y-5}V{y+5}" for m in marks)}" stroke="{LIGHT}" stroke-opacity=".35" stroke-width="1"/>'
    for lx in lit:
        s += f'<circle cx="{lx}" cy="{y}" r="9" fill="{LIGHT}" opacity=".5" filter="url(#soft)"/><circle cx="{lx}" cy="{y}" r="3.2" fill="#fff"/>'
    if label_text:
        s += label(label_x or 600, y+30, label_text, 11, ACC_SOFT)
    return s

def ring(x, y, r=26, op=.6, kind=None):
    s = f'<circle cx="{x}" cy="{y}" r="{r+10}" fill="{ACC}" fill-opacity=".06" filter="url(#soft)"/>'
    s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="{FG2}" stroke-opacity="{op}" stroke-width="1.2"/>'
    if kind:
        sc = r/34*0.75
        s += (f'<g transform="translate({x-20*sc},{y-20*sc}) scale({sc:.4f})" fill="none" stroke="{FG2}" stroke-opacity="{op}" '
              f'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{F.ICONS[kind].replace("#1A1A1A", FG2)}</g>')
    return s

def fall(x0, y0, x1, y1, op=.35, spark=True):
    my = (y0+y1)/2
    s = f'<path d="M{x0} {y0} C{x0} {my} {x1} {my} {x1} {y1}" fill="none" stroke="{FG2}" stroke-opacity="{op}" stroke-width="1"/>'
    if spark:
        t = .62; mx = x0 + (x1-x0)*t; mty = y0 + (y1-y0)*t
        s += f'<circle cx="{mx:.0f}" cy="{mty:.0f}" r="5" fill="{ACC_SOFT}" opacity=".6" filter="url(#soft)"/><circle cx="{mx:.0f}" cy="{mty:.0f}" r="2" fill="#fff"/>'
    return s

def chrome(foot):
    s = note(56, 42, 'Open Value', 13, FG, 'start', 600)
    for i, t in enumerate(['Thesis', 'How it works', 'Questions']):
        s += note(1144 - (2-i)*100, 42, t, 12, MUTE, 'end')
    s += label(56, 716, foot, 10, DIM, 'start')
    return s

def frame(body, foot):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">{DEFS}'
            + body + grain() + chrome(foot) + '</svg>')

# ---------- B0 hero ----------
def b0():
    b = ground(760, 470, 620, 200)
    sysx = [740, 830, 920, 1010, 1100]; land = [790, 855, 920, 985, 1050]
    for x, lx in zip(sysx, land):
        b += fall(x, 232, lx, 470)
        b += ring(x, 206, 24, .5)
    b += beam(470, x0=430, x1=1260, marks=[600+i*35 for i in range(17)], lit=land, label_text='the record · proposed', label_x=920)
    for x, lx in zip([810, 920, 1030], [855, 920, 985]):
        b += fall(lx, 470, x, 640, .25, spark=False)
        b += f'<circle cx="{x}" cy="{660}" r="22" fill="none" stroke="{FG2}" stroke-opacity=".35" stroke-width="1.1"/>'
    b += label(920, 170, 'systems · each keeps its own rules', 10, MUTE)
    b += label(920, 712, 'readers · check on their own terms', 10, MUTE)
    # claim
    b += label(56, 150, 'open research', 11, ACC_SOFT, 'start')
    lines = [('A neutral, content-blind', FG), ('root of trust.', FG)]
    for i, (t, c) in enumerate(lines):
        b += f'<text x="56" y="{230+i*64}" style="font-family:{SANS};font-size:58px;font-weight:500;letter-spacing:-.03em;fill:{c}">{t}</text>'
    b += note(56, 360, 'Independent systems can share one record of what happened and in', 18, FG2)
    b += note(56, 386, "what order, without adopting each other's rules.", 18, FG2)
    b += note(56, 500, 'The record sits underneath; everything that carries meaning', 15, MUTE)
    b += note(56, 522, 'stays above it, in the systems themselves.', 15, MUTE)
    b += f'<rect x="56" y="566" width="150" height="42" rx="3" fill="{FG}"/>' + label(131, 592, 'read the thesis', 11, BG)
    b += f'<rect x="222" y="566" width="200" height="42" rx="3" fill="none" stroke="{FG2}" stroke-opacity=".5"/>' + label(322, 592, 'submit a pre-proposal', 11, FG2)
    return frame(b, 'B0 · hero · beam · the record as one line of light · dashed core = proposed')

# ---------- B1 why ----------
def b1():
    b = ground(860, 470, 420, 180)
    # left: tangle
    cx, cy, R = 300, 330, 130
    pts = [(cx+R*math.cos(math.radians(-90+i*72)), cy+R*math.sin(math.radians(-90+i*72))) for i in range(5)]
    for i in range(5):
        for j in range(i+1, 5):
            (x0,y0),(x1,y1) = pts[i], pts[j]
            jx, jy = random.uniform(-28,28), random.uniform(-28,28)
            b += f'<path d="M{x0:.0f} {y0:.0f} Q{(x0+x1)/2+jx:.0f} {(y0+y1)/2+jy:.0f} {x1:.0f} {y1:.0f}" fill="none" stroke="{FG2}" stroke-opacity=".28" stroke-width="1"/>'
            b += f'<circle cx="{(x0+x1)/2+jx/2:.0f}" cy="{(y0+y1)/2+jy/2:.0f}" r="2" fill="{FG2}" opacity=".35"/>'
    for (x,y) in pts: b += ring(x, y, 18, .55)
    b += label(300, 150, 'today', 11, MUTE) + label(300, 540, 'five systems · ten pairs · every pair reconciles on its own', 10, MUTE)
    # right: beam
    rx = [720, 810, 900, 990, 1080]
    for x in rx:
        b += fall(x, 232, x, 470)
        b += ring(x, 206, 18, .55)
    b += beam(470, x0=620, marks=[660+i*30 for i in range(17)], lit=rx, label_text='with one shared record · proposed', label_x=900)
    b += label(900, 150, 'one reference', 11, ACC_SOFT) + label(900, 540, 'five systems · five threads · the work of agreeing on order, once', 10, MUTE)
    b += f'<line x1="600" x2="600" y1="150" y2="560" stroke="{FG2}" stroke-opacity=".12"/>'
    b += note(56, 630, 'Why a shared record is needed', 22, FG, 'start', 500)
    b += note(56, 660, 'Order across systems is agreed pair by pair, and pairs grow faster than systems. A shared record lets each system do that work once.', 14, FG2)
    b += note(56, 682, 'Validation and meaning do not move. Only the work of agreeing on order does.', 14, MUTE)
    return frame(b, 'B1 · why · tangle to beam · counts are arithmetic · n(n−1)/2')

# ---------- B2 the record ----------
def b2():
    b = ground(600, 470, 700, 200)
    # the system: a large dim vessel holding content
    b += f'<rect x="440" y="130" width="320" height="170" rx="24" fill="{FG}" fill-opacity=".025" stroke="{FG2}" stroke-opacity=".35" stroke-width="1.2"/>'
    for i in range(14):
        x = 470 + (i%7)*42; y = 170 + (i//7)*50
        b += f'<rect x="{x}" y="{y}" width="28" height="30" rx="4" fill="none" stroke="{FG2}" stroke-opacity=".22"/>'
    b += label(600, 112, 'a system · content · rules · state · meaning', 10, MUTE)
    # one spark falls
    b += f'<path d="M600 300 V470" stroke="{FG2}" stroke-opacity=".3" stroke-width="1"/>'
    b += f'<circle cx="600" cy="392" r="7" fill="{ACC_SOFT}" opacity=".7" filter="url(#soft)"/><circle cx="600" cy="392" r="2.4" fill="#fff"/>'
    b += label(622, 396, 'h(e) · a fingerprint, nothing else', 10, FG2, 'start')
    b += beam(470, marks=[150+i*30 for i in range(31)], lit=[600], label_text='the record · proposed · one order', label_x=600)
    b += label(600, 530, 'not executed · not validated · not interpreted', 10, MUTE)
    b += note(56, 630, 'What the record holds', 22, FG, 'start', 500)
    b += note(56, 660, 'Only a fingerprint goes down. The record puts fingerprints in one order and is meant to keep them available.', 14, FG2)
    b += note(56, 682, 'Content, validation and meaning stay in the system. Order is not time. A record is not proof.', 14, MUTE)
    return frame(b, 'B2 · the record · one spark, one beam · event–state dissociation')

# ---------- B3–B5: re-themed explanatory figures ----------
def dark_record(x0=200, x1=1080, y0=420, y1=500, title='the record · proposed', ticks=None, accents=(), sublabel=None):
    by = 470
    s = beam(by, x0=x0-40, x1=x1+40, marks=ticks or [x0+40+i*40 for i in range(1, int((x1-x0-80)/40))], lit=[ax for ax,_ in accents])
    s += label(x0+40, by-26, title, 11, ACC_SOFT, 'start')
    if sublabel: s += label(x1-40, by-26, sublabel, 11, MUTE, 'end')
    for ax, al in accents:
        if al: s += label(ax, by+24, al, 11, FG2, track='.06em')
    return s, by

def dark_open_band(x0=200, x1=1080, y0=300, y1=372, text='open · shared conventions may form here · one layer or several', lx=None):
    lx = lx or (x0+x1)/2
    return (f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="36" fill="{FG}" fill-opacity=".03" stroke="{FG2}" stroke-opacity=".25" stroke-width="1" stroke-dasharray="2 5"/>'
            + label(lx, (y0+y1)/2+4, text, 11, MUTE))

def dark_node(x, y, kind=None, r=34, dashed=False):
    return ring(x, y, r, .85, kind)

def dark_curve(x0, y0, x1, y1, dot=None, op=.45, w=1.3, color=None, dashed=False, arrow=None):
    my=(y0+y1)/2
    s = f'<path d="M{x0} {y0} C{x0} {my} {x1} {my} {x1} {y1}" fill="none" stroke="{FG2}" stroke-opacity="{op*.8}" stroke-width="1"/>'
    if arrow:
        ax, ay = (x1, y1) if arrow=='end' else (x0, y0); d = 1 if arrow=='end' else -1
        s += f'<path d="M{ax-5} {ay-7*d} L{ax} {ay} L{ax+5} {ay-7*d}" fill="none" stroke="{FG2}" stroke-opacity="{op}" stroke-width="1"/>'
    mx=(x0+x1)/2
    if dot=='acc': s += f'<circle cx="{mx:.0f}" cy="{my:.0f}" r="5" fill="{ACC_SOFT}" opacity=".6" filter="url(#soft)"/><circle cx="{mx:.0f}" cy="{my:.0f}" r="2" fill="#fff"/>'
    if dot=='ring': s += f'<circle cx="{mx:.0f}" cy="{my:.0f}" r="3.5" fill="{BG}" stroke="{FG2}" stroke-width="1.2"/>'
    return s

def dark_card(x, y, w, h, lines, dashed_right=None):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{FG}" fill-opacity=".03" stroke="{FG2}" stroke-opacity=".35" stroke-width="1"/>'
    for i, (kind, t) in enumerate(lines):
        yy = y + 22 + i*20
        if kind=='h': s += note(x+16, yy, t, 14, FG)
        elif kind=='acc': s += label(x+16, yy, t, 11, ACC_SOFT, 'start', '.1em')
        else: s += label(x+16, yy, t, 11, MUTE, 'start', '.1em')
    return s

def dark_pill(x, y, t, w=None, color=None):
    w = w or (len(t)*7.4+34)
    return (f'<rect x="{x-w/2}" y="{y-13}" width="{w}" height="26" rx="13" fill="none" stroke="{FG2}" stroke-opacity=".3"/>' + label(x, y+4, t, 10.5, MUTE, track='.1em'))

def dark_numdot(x, y, n):
    return f'<circle cx="{x}" cy="{y}" r="11" fill="{LIGHT}"/>' + label(x, y+4, str(n), 11, BG, track='0')

def dark_frame(body, foot):
    return frame(ground(640, 470, 700, 160) + body, foot)

def dark_head(title, sub):
    return note(56, 92, title, 22, FG, 'start', 500)

def retheme():
    F.PAPER, F.INK, F.ACC, F.SLATE = BG, FG, ACC_SOFT, MUTE
    F.record, F.open_band, F.node, F.curve, F.card, F.pill, F.numdot, F.frame, F.head = (
        dark_record, dark_open_band, dark_node, dark_curve, dark_card, dark_pill, dark_numdot, dark_frame, dark_head)

def b3():
    retheme(); return F.f3().replace('F3 · who does what', 'B3 · who does what · dark')
def b4():
    retheme(); return F.f4().replace('F4 · one example', 'B4 · one example · dark')
def b5():
    retheme(); return F.f5().replace('F5 · where the open questions sit', 'B5 · open questions · dark')

FIGS = {'B0-hero-beam': b0, 'B1-why-tangle-to-beam': b1, 'B2-the-record-one-spark': b2, 'B3-who-does-what-dark': b3, 'B4-example-dark': b4, 'B5-open-questions-dark': b5}

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), '..', 'assets')
    for n, f in FIGS.items():
        open(os.path.join(out, n+'.svg'), 'w').write(f())
    print('wrote', list(FIGS))
