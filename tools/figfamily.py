"""Figure family F0–F5 for the Open Value landing sequence, in the boards' language.
1200×750 engineering-print canvas. One fixed geometry: systems row (cy=176), open middle
(y 300–372), the record (y 420–500) drawn as one ordered baseline, readers row (cy=610).
Everything that is proposed is dashed accent; everything that exists today is solid ink.
"""
import os, math

PAPER, INK, ACC, SLATE = '#F2F0EA', '#1A1A1A', '#E0442F', '#6B6862'
MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace"
SANS = "Inter, 'Helvetica Neue', Arial, sans-serif"

ICONS = {
 'bank':    '<path d="M4 15 L20 5 L36 15 Z"/><path d="M6 34 H34 M5 37 H35"/><path d="M10 18 V31 M17 18 V31 M23 18 V31 M30 18 V31"/>',
 'registry':'<rect x="8" y="12" width="22" height="24" rx="2"/><path d="M12 8 H32 a2 2 0 0 1 2 2 V32"/><path d="M13 19 H25 M13 24 H25 M13 29 H21"/>',
 'card':    '<rect x="5" y="10" width="30" height="20" rx="3"/><path d="M5 16 H35 M10 25 H18"/>',
 'telco':   '<path d="M20 17 V36 M13 36 L20 19 L27 36"/><circle cx="20" cy="14" r="2.5"/><path d="M14 9 a9 9 0 0 0 0 10 M26 9 a9 9 0 0 1 0 10 M10 5 a14 14 0 0 0 0 18 M30 5 a14 14 0 0 1 0 18"/>',
 'search':  '<circle cx="17" cy="17" r="10"/><path d="M24.5 24.5 L35 35"/>',
 'shield':  '<path d="M20 4 L34 9 V19 C34 28 28 33 20 36 C12 33 6 28 6 19 V9 Z"/><path d="M14 20 L18 24 L26 15"/>',
 'person':  '<circle cx="20" cy="13" r="6"/><path d="M8 35 C8 26 13 22 20 22 C27 22 32 26 32 35"/>',
 'agent':   '<rect x="9" y="11" width="22" height="20" rx="3"/><path d="M20 4 V11 M14 31 V36 M26 31 V36 M3 21 H9 M31 21 H37"/><circle cx="15" cy="20" r="1.8" fill="#1A1A1A"/><circle cx="25" cy="20" r="1.8" fill="#1A1A1A"/>',
 'identity':'<circle cx="20" cy="14" r="6"/><path d="M9 34 C9 26 14 23 20 23 C26 23 31 26 31 34"/><path d="M30 8 L33 11 L38 5"/>',
 'airline': '<path d="M20 4 L22 16 L36 22 V26 L22 22 L21 31 L26 34 V36 L20 34 L14 36 V34 L19 31 L18 22 L4 26 V22 L18 16 Z"/>',
 'car':     '<path d="M6 24 L10 14 H30 L34 24 V32 H6 Z"/><circle cx="12" cy="32" r="3"/><circle cx="28" cy="32" r="3"/><path d="M8 24 H32"/>',
}

def esc(s): return s.replace('&','&amp;').replace('<','&lt;')

def node(x, y, kind=None, r=34, dashed=False):
    st = f'stroke="{ACC}" stroke-dasharray="6 5"' if dashed else f'stroke="{INK}"'
    s = f'<circle cx="{x}" cy="{y}" r="{r}" fill="{PAPER}" {st} stroke-width="1.6"/>'
    if kind:
        sc = r/34*0.75
        s += (f'<g transform="translate({x-20*sc},{y-20*sc}) scale({sc:.4f})" fill="none" stroke="{INK}" '
              f'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">{ICONS[kind]}</g>')
    return s

def label(x, y, t, size=11, color=SLATE, anchor='middle', mono=True, weight=400, track='.14em'):
    fam = MONO if mono else SANS
    tr = f'letter-spacing:{track};text-transform:uppercase;' if mono else ''
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="font-family:{fam};font-size:{size}px;'
            f'font-weight:{weight};{tr}fill:{color}">{esc(t)}</text>')

def note(x, y, t, size=14, color=INK, anchor='start'):
    return label(x, y, t, size, color, anchor, mono=False)

def curve(x0, y0, x1, y1, dot=None, op=.45, w=1.3, color=INK, dashed=False, arrow=None):
    """vertical S-curve from (x0,y0) to (x1,y1). dot: 'acc' or 'ring' at the midpoint."""
    my = (y0+y1)/2
    d = f'M{x0} {y0} C{x0} {my} {x1} {my} {x1} {y1}'
    da = ' stroke-dasharray="5 5"' if dashed else ''
    s = f'<path d="{d}" fill="none" stroke="{color}" stroke-opacity="{op}" stroke-width="{w}"{da}/>'
    if arrow:
        ax, ay = (x1, y1) if arrow=='end' else (x0, y0)
        dirn = 1 if arrow=='end' else -1
        s += f'<path d="M{ax-5} {ay-7*dirn} L{ax} {ay} L{ax+5} {ay-7*dirn}" fill="none" stroke="{color}" stroke-opacity="{op}" stroke-width="{w}"/>'
    if dot=='acc':
        mx = (x0+x1)/2; s += f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="4.5" fill="{ACC}"/>'
    if dot=='ring':
        mx = (x0+x1)/2; s += f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="4" fill="{PAPER}" stroke="{INK}" stroke-width="1.5"/>'
    return s

def open_band(x0=200, x1=1080, y0=300, y1=372, text='open · shared conventions may form here · one layer or several', lx=None):
    lx = lx or (x0+x1)/2
    s = f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="36" fill="{INK}" fill-opacity=".035"/>'
    s += f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="36" fill="none" stroke="{INK}" stroke-opacity=".35" stroke-width="1" stroke-dasharray="2 5"/>'
    s += label(lx, (y0+y1)/2+4, text)
    return s

def record(x0=200, x1=1080, y0=420, y1=500, title='the record · proposed', ticks=None, accents=(), sublabel=None):
    """Dashed accent pill with one ordered baseline inside."""
    s = f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="40" fill="none" stroke="{ACC}" stroke-width="1.6" stroke-dasharray="7 5"/>'
    by = y0 + (y1-y0)*0.62
    s += label(x0+40, y0+26, title, color=ACC, anchor='start')
    if sublabel: s += label(x1-40, y0+26, sublabel, anchor='end')
    s += f'<path d="M{x0+40} {by} H{x1-40}" stroke="{INK}" stroke-width="1.2"/>'
    if ticks is None: ticks = [x0+40+i*40 for i in range(1, int((x1-x0-80)/40))]
    s += f'<path d="{"".join(f"M{t} {by-4}V{by+4}" for t in ticks)}" stroke="{INK}" stroke-opacity=".4" stroke-width="1"/>'
    for ax, al in accents:
        s += f'<circle cx="{ax}" cy="{by}" r="5" fill="{ACC}"/>'
        if al: s += label(ax, by+22, al, color=INK, track='.06em')
    return s, by

def card(x, y, w, h, lines, dashed_right=None):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>'
    for i, (kind, t) in enumerate(lines):
        yy = y + 22 + i*20
        if kind == 'h': s += note(x+16, yy, t, 14, INK)
        elif kind == 'acc': s += label(x+16, yy, t, 11, ACC, 'start', track='.1em')
        else: s += label(x+16, yy, t, 11, SLATE, 'start', track='.1em')
    return s

def pill(x, y, t, w=None, color=SLATE):
    w = w or (len(t)*7.4+34)
    return (f'<rect x="{x-w/2}" y="{y-13}" width="{w}" height="26" rx="13" fill="{PAPER}" stroke="{color}" stroke-opacity=".5" stroke-width="1"/>'
            + label(x, y+4, t, 10.5, color, track='.1em'))

def numdot(x, y, n):
    return f'<circle cx="{x}" cy="{y}" r="11" fill="{INK}"/>' + label(x, y+4, str(n), 11, PAPER, track='0')

def frame(body, foot):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">'
            f'<rect width="1200" height="750" fill="{PAPER}"/>'
            f'<line x1="56" x2="1144" y1="80" y2="80" stroke="{INK}" stroke-opacity=".15"/>'
            + body +
            f'<line x1="56" x2="1144" y1="690" y2="690" stroke="{INK}" stroke-opacity=".15"/>'
            + label(56, 716, foot, 10, SLATE, 'start') + '</svg>')

def head(title, sub):
    return note(56, 50, title, 26, INK) .replace('font-weight:400','font-weight:600').replace('style="','style="letter-spacing:-.02em;') + note(56, 110, sub, 15, SLATE)

SYS = [(300,'bank','bank'),(450,'registry','registry'),(600,'card','payment network'),(750,'identity','identity system'),(900,'agent','agent platform')]
RDR = [(420,'search','auditor'),(600,'shield','regulator'),(780,'person','counterparty')]

# ---------- F0 position ----------
def f0():
    b = head('Position of the record', 'Systems keep meaning above. A proposed record below holds order only. What may sit between them is open.')
    b += label(56, 176, 'systems', color=INK, anchor='start') + label(56, 194, 'keep their own rules', anchor='start')
    land = [460,530,600,670,740]
    for (x,k,l),lx in zip(SYS,land):
        b += curve(x, 250, lx, 300, dot='acc')
        b += node(x, 176, k) + label(x, 236, l)
    b += open_band()
    for (x,k,l),lx in zip(SYS,land): b += curve(lx, 372, lx, 420, op=.3)
    rec, by = record(accents=[(lx, None) for lx in land], sublabel='orders fingerprints · meant to keep them available')
    b += rec
    b += label(56, 440, 'the record', color=ACC, anchor='start') + label(56, 458, 'proposed', anchor='start')
    rland = [520,600,680]
    for (x,k,l),lx in zip(RDR,rland):
        b += curve(lx, 500, x, 576, dot='ring', op=.3)
        b += node(x, 610, k) + label(x, 670, l)
    b += label(56, 610, 'readers', color=INK, anchor='start') + label(56, 628, 'check on their own terms', anchor='start')
    b += f'<circle cx="{900}" cy="{604}" r="4.5" fill="{ACC}"/>' + label(912, 608, 'fingerprint of an event', 10, SLATE, 'start', track='.08em')
    b += label(912, 624, 'content never moves', 10, SLATE, 'start', track='.08em')
    b += f'<circle cx="{900}" cy="{644}" r="4" fill="{PAPER}" stroke="{INK}" stroke-width="1.5"/>' + label(912, 648, 'position, checked later', 10, SLATE, 'start', track='.08em')
    return frame(b, 'F0 · position of the record · solid = exists today · dashed = proposed, under research')

# ---------- F1 today, pair by pair ----------
def f1():
    b = head('Why a shared record is needed', 'Today, order across systems is established pair by pair. Each pair repeats the same work.')
    # left: one event two systems
    b += node(260, 236, 'bank') + label(260, 296, 'system 1')
    b += node(560, 236, 'registry') + label(560, 296, 'system 2')
    b += card(170, 330, 180, 84, [('h','event e'),('s','its order · #12'),('s','its rules')])
    b += card(470, 330, 180, 84, [('h','event e'),('s','its order · #7'),('s','its rules')])
    b += f'<path d="M358 372 H462" stroke="{INK}" stroke-opacity=".45" stroke-width="1.3"/>'
    b += f'<path d="M366 366 L358 372 L366 378 M454 366 L462 372 L454 378" fill="none" stroke="{INK}" stroke-opacity=".45" stroke-width="1.3"/>'
    b += label(410, 352, 'reconcile', color=INK) + note(410, 450, 'fetch both, compare, agree on an order — once per pair', 13, SLATE, 'middle')
    b += label(410, 170, 'one event · two records · two positions', color=INK)
    # right: pairs
    cx, cy, R = 920, 330, 120
    pts = [(cx+R*math.cos(math.radians(-90+i*72)), cy+R*math.sin(math.radians(-90+i*72))) for i in range(5)]
    for i in range(5):
        for j in range(i+1,5):
            b += f'<path d="M{pts[i][0]:.1f} {pts[i][1]:.1f} L{pts[j][0]:.1f} {pts[j][1]:.1f}" stroke="{INK}" stroke-opacity=".3" stroke-width="1.1"/>'
    for (x,y) in pts: b += node(x, y, r=14)
    b += label(cx, 170, 'five systems · ten pairs', color=INK)
    b += note(cx, 500, '50 systems · 1,225 pairs', 15, INK, 'middle')
    b += label(cx, 524, 'pairs = n(n−1)/2 · arithmetic, not a measurement')
    b += f'<line x1="700" x2="700" y1="150" y2="540" stroke="{INK}" stroke-opacity=".15"/>'
    b += note(600, 620, 'A shared record of order would let each system do that work once, against one reference, instead of once per counterparty.', 15, INK, 'middle')
    b += note(600, 646, 'Validation and interpretation do not move. Only the work of agreeing on order does.', 14, SLATE, 'middle')
    return frame(b, 'F1 · why a shared record is needed · today · counts are arithmetic')

# ---------- F2 what the record holds ----------
def f2():
    b = head('What the record holds', 'Only a fingerprint goes down. Content, validation and meaning stay in the system.')
    b += node(260, 176, 'bank') + label(260, 236, 'a system')
    b += card(330, 134, 300, 104, [('h','event e'),('s','content · amounts · parties'),('s','validated under its rules'),('s','state derived here')])
    b += note(660, 176, 'The event stays in the system.', 14, SLATE)
    b += note(660, 196, 'What a fingerprint reveals is the system’s choice.', 14, SLATE)
    b += curve(480, 240, 560, 300, dot='acc')
    b += label(540, 268, 'h(e) · fingerprint only', color=INK, anchor='start', track='.1em')
    b += open_band(text='open')
    b += curve(560, 372, 560, 420, op=.3)
    rec, by = record(accents=[(560,'h(e)')], sublabel='one order · not time')
    b += rec
    for i,(t) in enumerate(['not executed','not validated','not interpreted']):
        b += pill(300+i*300, 560, t)
    b += note(600, 630, 'State is always derived from events, above the record, by each system under its own rules.', 15, INK, 'middle')
    b += note(600, 656, 'Order is not time. A record is not proof.', 14, SLATE, 'middle')
    return frame(b, 'F2 · what the record holds · event–state dissociation')

# ---------- F3 who does what ----------
def f3():
    b = head('Who does what', 'Fingerprints go down. A position comes back. Readers check later, on their own terms.')
    b += node(300, 176, 'bank') + label(300, 236, 'system')
    b += card(390, 244, 230, 64, [('h','event e · its rules'),('s','position #n · stored here')])
    b += node(900, 176, 'search') + label(900, 236, 'reader')
    b += label(900, 254, 'auditor · regulator · counterparty · the system later', 10, SLATE)
    # 3: reader obtains event
    b += f'<path d="M866 176 H342" stroke="{INK}" stroke-opacity=".45" stroke-width="1.3"/><path d="M350 170 L342 176 L350 182" fill="none" stroke="{INK}" stroke-opacity=".45" stroke-width="1.3"/>'
    b += numdot(600, 176, 3) + label(600, 152, 'obtains the disclosed event · recomputes h(e)', color=INK)
    b += label(600, 204, 'through whatever access exists today', 10)
    b += open_band(text='open')
    # 1 down, 2 back
    b += curve(282, 250, 282, 420, dot='acc', arrow='end') + numdot(240, 300, 1) + label(240, 324, 'h(e) only', color=INK)
    b += curve(340, 420, 340, 250, dot='ring', arrow='end') + numdot(340, 390, 2) + label(340, 414, 'position', color=INK)
    b += curve(900, 268, 900, 420, op=.3, arrow='end') + numdot(950, 300, 4) + label(950, 324, 'checks h(e) at #n', color=INK)
    rec, by = record(accents=[(282,'#n')])
    b += rec
    for i,(t) in enumerate(['content never crosses down','no rule flows up','a reversal is a new event, not an edit']):
        b += pill(300+i*300, 560, t)
    b += note(600, 630, 'The system stores the position next to its own record. That is the integration footprint as proposed.', 15, INK, 'middle')
    b += note(600, 656, 'Disclosure and retention stay with the system, under its existing law. The record adds no new channel.', 14, SLATE, 'middle')
    return frame(b, 'F3 · who does what · numbers are sequence · proposed')

# ---------- F4 example ----------
def f4():
    b = head('One example · cash leg and asset leg', 'Two legs of one trade, in two systems. An auditor later shows cash before asset in one order. Illustrative.')
    b += node(300, 176, 'bank') + label(300, 236, 'bank · cash leg')
    b += node(620, 176, 'registry') + label(620, 236, 'registry · asset leg')
    b += node(940, 176, 'search') + label(940, 236, 'auditor')
    b += label(940, 254, 'has both disclosed records, months later', 10)
    b += card(360, 148, 190, 56, [('s','cash leg · settled'),('acc','position #n · kept')])
    b += card(680, 148, 190, 56, [('s','asset leg · moved'),('acc','position #n+k · kept')])
    b += open_band(text='open', lx=820)
    b += curve(282, 250, 282, 420, dot='acc', arrow='end') + label(252, 280, 'h(cash)', color=INK, anchor='end')
    b += curve(340, 420, 340, 250, dot='ring', arrow='end')
    b += curve(602, 250, 602, 420, dot='acc', arrow='end') + label(572, 280, 'h(asset)', color=INK, anchor='end')
    b += curve(660, 420, 660, 250, dot='ring', arrow='end')
    b += curve(940, 268, 940, 420, op=.3, arrow='end') + label(970, 280, 'checks order', color=INK, anchor='start')
    rec, by = record(accents=[(282,'cash · #n'),(602,'asset · #n+k')], sublabel='sequence, not time')
    b += rec
    for i,(t) in enumerate(['neither system adopts the other’s rules','inclusion is not validity','the order is not clock time']):
        b += pill(300+i*300, 560, t)
    b += note(600, 630, 'The same shape applies to a vehicle’s history across insurers and registries, to an ACH reversal recorded after the original,', 14, SLATE, 'middle')
    b += note(600, 652, 'and to value moving between an airline and a telco. All illustrative; none is a deployment.', 14, SLATE, 'middle')
    return frame(b, 'F4 · one example · illustrative · names are placeholders')

# ---------- F5 open questions ----------
def f5():
    b = head('Where the open questions sit', 'The ordering service is proposed, not built. Six questions are open; each sits at a part of the figure.')
    xs = [300,450,600,750]
    for x in xs:
        b += curve(x, 252, x, 300, op=.3)
        b += node(x, 176, r=30)
    b += label(525, 240, 'systems · each with its own rules')
    b += numdot(372, 128, 2) + label(392, 132, 'identity', color=INK, anchor='start')
    b += numdot(672, 128, 6) + label(692, 132, 'behaviour', color=INK, anchor='start')
    b += node(960, 176, 'search', r=30) + label(960, 236, 'outsider') + curve(960, 250, 960, 420, op=.3)
    b += numdot(980, 128, 5) + label(1000, 132, 'proof', color=INK, anchor='start')
    b += open_band(text='open · one layer or several')
    for x in xs: b += curve(x, 372, x, 420, op=.3)
    rec, by = record()
    b += rec
    b += numdot(320, by, 1) + numdot(600, by, 3) + numdot(880, by, 4)
    b += label(320, 540, 'ordering', color=INK) + label(320, 558, 'who decides · no coin to stake')
    b += label(600, 540, 'availability', color=INK) + label(600, 558, 'kept where · by whom')
    b += label(880, 540, 'longevity', color=INK) + label(880, 558, 'kept how long · unpaid')
    b += label(600, 600, '2 identity · one actor pretending to be a million    6 behaviour · nothing to lose    5 proof · a before b across unrelated applications', 10, SLATE, track='.06em')
    b += note(600, 644, 'A shared record is necessary for independent systems to agree on order. It is not sufficient.', 15, INK, 'middle')
    b += note(600, 668, 'Tokenless and permissionless operation are objectives of question 1, not results.', 13, SLATE, 'middle')
    return frame(b, 'F5 · where the open questions sit · 1 ordering · 2 identity · 3 availability · 4 longevity · 5 proof · 6 behaviour')

FIGS = {'F0-position':f0,'F1-why-a-shared-record':f1,'F2-what-the-record-holds':f2,'F3-who-does-what':f3,'F4-example-two-legs':f4,'F5-open-questions':f5}

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), '..', 'assets')
    for n, f in FIGS.items():
        open(os.path.join(out, n+'.svg'), 'w').write(f())
    print('wrote', list(FIGS))
