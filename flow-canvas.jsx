// flow-canvas.jsx - canvas-first ViperOne experience with Go Live transition.
(function () {
  const { useEffect, useLayoutEffect, useRef, useState } = React;

  const DATA = {
    guard: 'Michael Carter',
    site: 'North Gate Commercial Plaza',
    address: '1450 Gateway Blvd, North District',
    client: 'US Security Svc',
    shift: '08:00 - 16:00',
    distance: '0.6 mi',
  };

  const MSGS = [
    { from: 'them', text: "Morning Michael - you're on North Gate today, 08:00 start. Confirm when you arrive.", time: '07:40' },
    { from: 'me', text: 'Copy. En route now, ETA 07:55.', time: '07:46' },
    { from: 'them', text: 'Great. Gate code is in the post orders. Radio me if any issues.', time: '07:47' },
    { from: 'me', text: 'Arrived on site. Clocking in.', time: '08:01' },
  ];

  const INCIDENTS = [
    { category: 'Maintenance', title: 'Unsecured door at Loading Dock', severity: 'High', status: 'In Progress', time: '08:12', evidence: 2 },
    { category: 'Security Issue', title: 'Suspicious vehicle in Lot A', severity: 'Medium', status: 'Acknowledged', time: '07:58', evidence: 1 },
    { category: 'Maintenance', title: 'Lighting outage - east wall', severity: 'Low', status: 'Resolved', time: 'Yesterday', evidence: 0 },
  ];

  const PATROL = { done: 4, total: 8, next: 'Service Corridor' };
  const DONE_PATROL = { done: 8, total: 8, next: 'Complete' };
  const COUNTS = { tasks: 2, incidents: 2, messages: 2 };

  const NOOP = () => {};
  const A = {
    go() {},
    setRole() {},
    setStatus() {},
    toast() {},
    reset() {},
    back: 'shift',
  };

  function injectFlowStyles() {
    if (document.getElementById('vf-styles')) return;
    const style = document.createElement('style');
    style.id = 'vf-styles';
    style.textContent = `
      html, body { background: #0a0f18; }
      body { overflow: hidden; }
      #root { min-height: 100vh; }
      .vf-root { min-height: 100vh; background: #0a0f18; color: #0f172a; }
      .vf-canvas-shell { position: fixed; inset: 0; overflow: hidden; background: #efeee9; }
      .vf-canvas-shell[data-live="true"] { pointer-events: none; }
      .vf-topbar { position: fixed; z-index: 30; top: 18px; left: 20px; right: 20px; display: flex; align-items: center; gap: 14px; pointer-events: none; }
      .vf-brand { pointer-events: auto; display: flex; align-items: center; gap: 10px; padding: 10px 13px; border-radius: 14px; background: rgba(255,255,255,.78); border: 1px solid rgba(15,23,42,.09); box-shadow: 0 12px 32px rgba(15,23,42,.12); backdrop-filter: blur(16px); }
      .vf-brand-title { font-family: var(--font-title); font-weight: 800; font-size: 14px; color: #121826; line-height: 1; }
      .vf-brand-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
      .vf-go-live { pointer-events: auto; margin-left: auto; height: 46px; padding: 0 18px; border: 0; border-radius: 14px; cursor: pointer; font-family: var(--font-title); font-weight: 800; font-size: 14px; color: #fff; background: #16a34a; box-shadow: 0 14px 34px rgba(22,163,74,.32); display: inline-flex; align-items: center; gap: 9px; transition: transform .15s ease, filter .15s ease; }
      .vf-go-live:hover { filter: brightness(1.04); }
      .vf-go-live:active { transform: scale(.98); }
      .vf-zoom-controls { pointer-events: auto; position: fixed; z-index: 31; right: 20px; bottom: 20px; display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 14px; background: rgba(255,255,255,.84); border: 1px solid rgba(15,23,42,.1); box-shadow: 0 14px 34px rgba(15,23,42,.15); backdrop-filter: blur(16px); }
      .vf-zoom-controls button { width: 36px; height: 34px; border: 0; border-radius: 10px; cursor: pointer; background: #f1f5f9; color: #0f172a; font-family: var(--font-title); font-weight: 800; font-size: 15px; }
      .vf-zoom-controls button:hover { background: #e2e8f0; }
      .vf-zoom-value { min-width: 48px; text-align: center; font-family: var(--font-mono); font-size: 12px; font-weight: 800; color: #475569; }
      .vf-phone { position: relative; width: 360px; height: 760px; background: var(--shell); overflow: hidden; display: flex; flex-direction: column; font-size: 15.5px; }
      .vf-phone .app { flex: 1 1 auto; min-height: 0; }
      .vf-phone .scroll { overflow: hidden; }
      .vf-map-viewport { position: absolute; inset: 0; overflow: auto; padding: 88px 0 80px; background: #efeee9; }
      .vf-map-world-wrap { width: calc(1980px * var(--vf-zoom, 1)); height: calc(5480px * var(--vf-zoom, 1)); position: relative; }
      .vf-map-world { position: relative; width: 1980px; height: 5480px; transform: scale(var(--vf-zoom, 1)); transform-origin: top left; background-image: linear-gradient(rgba(15,23,42,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.055) 1px, transparent 1px); background-size: 120px 120px; }
      .vf-map-title { position: absolute; left: 64px; top: 26px; font-family: var(--font-title); font-size: 30px; font-weight: 800; color: #3c352d; }
      .vf-map-subtitle { position: absolute; left: 64px; top: 66px; font-size: 15px; color: #756d63; }
      .vf-lane-title { position: absolute; font-family: var(--font-title); font-size: 22px; font-weight: 800; color: #3c352d; }
      .vf-lane-sub { position: absolute; font-size: 13px; color: #756d63; }
      .vf-node { position: absolute; z-index: 2; }
      .vf-node-label { display: inline-flex; align-items: center; gap: 8px; height: 28px; padding: 0 2px; font-family: var(--font-title); font-size: 15px; font-weight: 800; color: #62594f; }
      .vf-node-label::before { content: ""; width: 8px; height: 8px; border-radius: 999px; background: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,.13); }
      .vf-node[data-tone="ok"] .vf-node-label::before { background: #16a34a; box-shadow: 0 0 0 4px rgba(22,163,74,.13); }
      .vf-node[data-tone="warn"] .vf-node-label::before { background: #f59e0b; box-shadow: 0 0 0 4px rgba(245,158,11,.16); }
      .vf-node[data-tone="danger"] .vf-node-label::before { background: #dc2626; box-shadow: 0 0 0 4px rgba(220,38,38,.13); }
      .vf-node-card { margin-top: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(15,23,42,.08), 0 20px 46px rgba(15,23,42,.13); border: 1px solid rgba(15,23,42,.08); background: #fff; }
      .vf-hub-callout { position: absolute; z-index: 3; width: 260px; padding: 14px 16px; border-radius: 14px; background: #fff; border: 1px solid rgba(15,23,42,.1); box-shadow: 0 14px 36px rgba(15,23,42,.11); color: #475569; font-size: 13px; line-height: 1.45; }
      .vf-hub-callout strong { display: block; font-family: var(--font-title); color: #0f172a; margin-bottom: 4px; }
      .vf-map-wire-layer { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 1; }
      .vf-map-marker-layer { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 5; }
      .vf-map-wire { fill: none; stroke: #2563eb; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; opacity: .82; }
      .vf-map-wire[data-tone="ok"] { stroke: #16a34a; }
      .vf-map-wire[data-tone="warn"] { stroke: #f59e0b; }
      .vf-map-wire[data-tone="danger"] { stroke: #dc2626; }
      .vf-map-wire-dot, .vf-map-wire-target { fill: #fff; stroke: currentColor; stroke-width: 3; filter: drop-shadow(0 3px 7px rgba(15,23,42,.24)); }
      .vf-map-wire-label-box { fill: rgba(255,255,255,.96); stroke: rgba(15,23,42,.14); stroke-width: 1; filter: drop-shadow(0 6px 12px rgba(15,23,42,.16)); }
      .vf-map-wire-label { font-family: var(--font-title); font-size: 13px; font-weight: 800; fill: #1e293b; dominant-baseline: middle; }
      .vf-note { position: absolute; width: 210px; padding: 13px 14px; border-radius: 12px; background: #fff; border: 1px solid rgba(15,23,42,.1); box-shadow: 0 14px 32px rgba(15,23,42,.1); font-family: var(--font-body); font-size: 13px; line-height: 1.45; color: #475569; }
      .vf-note strong { display: block; font-family: var(--font-title); color: #0f172a; font-size: 13px; margin-bottom: 4px; }
      .vf-wire-layer { position: absolute; inset: 0; overflow: visible; pointer-events: none; z-index: 1; }
      .vf-wire { fill: none; stroke: #2563eb; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; opacity: .72; }
      .vf-wire[data-tone="ok"] { stroke: #16a34a; }
      .vf-wire[data-tone="warn"] { stroke: #f59e0b; }
      .vf-wire[data-tone="danger"] { stroke: #dc2626; }
      .vf-wire-dot { fill: #fff; stroke: currentColor; stroke-width: 2.5; }
      .vf-wire-label { font-family: var(--font-title); font-size: 13px; font-weight: 800; fill: #1e293b; paint-order: stroke; stroke: rgba(255,255,255,.92); stroke-width: 5px; stroke-linejoin: round; }
      .vf-live-stage { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; padding: 24px; background: radial-gradient(1200px 600px at 50% -10%, #122036 0%, transparent 60%), #070C16; opacity: 0; pointer-events: none; transform: scale(.98); transition: opacity .45s ease, transform .45s ease; }
      .vf-root[data-mode="live"] .vf-live-stage, .vf-root[data-mode="transitioning"] .vf-live-stage { opacity: 1; transform: none; pointer-events: auto; }
      .vf-root[data-mode="transitioning"] .vf-canvas-shell { animation: vfCanvasOut 1.35s cubic-bezier(.2,.8,.2,1) forwards; }
      .vf-root[data-mode="transitioning"] [data-dc-slot],
      .vf-root[data-mode="transitioning"] .vf-node { animation: vfArtboardGather 1.1s cubic-bezier(.2,.8,.2,1) forwards; animation-delay: calc(var(--vf-order, 0) * 22ms); }
      [data-dc-slot="landing"] { --vf-order: 0; }
      [data-dc-slot="signin"] { --vf-order: 1; }
      [data-dc-slot="home"] { --vf-order: 2; }
      [data-dc-slot="schedule"] { --vf-order: 3; }
      [data-dc-slot="clockin"] { --vf-order: 4; }
      [data-dc-slot="shift"] { --vf-order: 5; }
      [data-dc-slot="patrol"] { --vf-order: 6; }
      [data-dc-slot="visitor"] { --vf-order: 7; }
      [data-dc-slot="dar"] { --vf-order: 8; }
      [data-dc-slot="reports"] { --vf-order: 9; }
      [data-dc-slot="incident-form"] { --vf-order: 10; }
      [data-dc-slot="messages"] { --vf-order: 11; }
      [data-dc-slot="sos"] { --vf-order: 12; }
      [data-dc-slot="clockout"] { --vf-order: 13; }
      [data-dc-slot="sup-home"] { --vf-order: 14; }
      [data-dc-slot="sup-schedule"] { --vf-order: 15; }
      [data-dc-slot="sup-reports"] { --vf-order: 16; }
      [data-dc-slot="client-home"] { --vf-order: 17; }
      [data-dc-slot="blue"] { --vf-order: 18; }
      [data-dc-slot="navy"] { --vf-order: 19; }
      [data-dc-slot="night"] { --vf-order: 20; }
      .vf-root[data-mode="transitioning"] .vf-wire-layer,
      .vf-root[data-mode="transitioning"] .dc-sectionhead,
      .vf-root[data-mode="transitioning"] .dc-header,
      .vf-root[data-mode="transitioning"] .vf-note,
      .vf-root[data-mode="transitioning"] .vf-map-wire-layer,
      .vf-root[data-mode="transitioning"] .vf-map-title,
      .vf-root[data-mode="transitioning"] .vf-map-subtitle,
      .vf-root[data-mode="transitioning"] .vf-lane-title,
      .vf-root[data-mode="transitioning"] .vf-lane-sub,
      .vf-root[data-mode="transitioning"] .vf-hub-callout,
      .vf-root[data-mode="transitioning"] .vf-topbar { animation: vfFadeOut .45s ease forwards; }
      @keyframes vfFadeOut { to { opacity: 0; transform: translateY(-8px); } }
      @keyframes vfArtboardGather { to { transform: translate3d(0, -18px, 0) scale(.88); opacity: .88; filter: saturate(.65); } }
      @keyframes vfCanvasOut { 0% { opacity: 1; filter: blur(0); } 62% { opacity: .88; filter: blur(2px); } 100% { opacity: 0; filter: blur(10px); transform: scale(.9); } }
      @media (max-width: 720px) {
        .vf-topbar { top: 10px; left: 10px; right: 10px; }
        .vf-brand-sub { display: none; }
        .vf-go-live { height: 42px; padding: 0 14px; }
      }
    `;
    document.head.appendChild(style);
  }

  function StatusBar() {
    return (
      <div className="statusbar">
        <span>08:02</span>
        <span className="sb-icons">
          <window.Icon name="signal" size={16} fill color="var(--on-shell)" stroke={0} />
          <window.Icon name="wifi" size={15} color="var(--on-shell)" stroke={2.2} />
          <window.Icon name="battery" size={20} color="var(--on-shell)" stroke={1.8} />
        </span>
      </div>
    );
  }

  function Frame({ children, login, accent = 'blue', night = false, navActive, order = 0 }) {
    return (
      <div className="vf-phone" data-mode={night ? 'night' : 'day'} data-accent={accent} data-radius="rounded" style={{ '--vf-order': order }}>
        {!login && <StatusBar />}
        <div className="app">
          {login && <div style={{ height: 44 }} />}
          {children}
        </div>
        {navActive && (
          <window.BottomNavigation
            active={navActive}
            onNav={NOOP}
            onSos={NOOP}
            badges={{ reports: 2, messages: 2 }}
          />
        )}
      </div>
    );
  }

  function Note({ title, text, left, top }) {
    return (
      <div className="vf-note" style={{ left, top }}>
        <strong>{title}</strong>
        {text}
      </div>
    );
  }

  function FlowWireLayer({ sectionId, wires }) {
    const [paths, setPaths] = useState([]);
    const lastPaths = useRef('');

    useLayoutEffect(() => {
      let frame = 0;
      let alive = true;
      const measure = () => {
        if (!alive) return;
        const section = document.querySelector(`[data-dc-section="${sectionId}"]`);
        if (!section) {
          frame = requestAnimationFrame(measure);
          return;
        }
        const sr = section.getBoundingClientRect();
        const scale = sr.width / (section.offsetWidth || sr.width || 1);
        const next = wires.map((wire) => {
          const from = section.querySelector(`[data-dc-slot="${wire.from}"]`);
          const to = section.querySelector(`[data-dc-slot="${wire.to}"]`);
          if (!from || !to) return null;
          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          const x1 = (a.right - sr.left) / scale;
          const y1 = (a.top + a.height * (wire.fromY || .5) - sr.top) / scale;
          const x2 = (b.left - sr.left) / scale;
          const y2 = (b.top + b.height * (wire.toY || .5) - sr.top) / scale;
          const dx = Math.max(70, Math.min(180, (x2 - x1) * .45));
          return {
            ...wire,
            d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
            x1,
            y1,
            x2,
            y2,
            lx: (x1 + x2) / 2,
            ly: (y1 + y2) / 2 - 12,
          };
        }).filter(Boolean);
        const key = JSON.stringify(next.map((p) => [p.from, p.to, p.d, p.label]));
        if (key !== lastPaths.current) {
          lastPaths.current = key;
          setPaths(next);
        }
        frame = requestAnimationFrame(measure);
      };
      frame = requestAnimationFrame(measure);
      return () => { alive = false; cancelAnimationFrame(frame); };
    }, [sectionId, JSON.stringify(wires)]);

    return (
      <svg className="vf-wire-layer">
        {paths.map((p) => (
          <g key={`${p.from}-${p.to}-${p.label}`} style={{ color: p.tone === 'ok' ? '#16a34a' : p.tone === 'warn' ? '#f59e0b' : p.tone === 'danger' ? '#dc2626' : '#2563eb' }}>
            <path className="vf-wire" data-tone={p.tone || 'info'} d={p.d} />
            <circle className="vf-wire-dot" cx={p.x1} cy={p.y1} r="5" />
            <circle className="vf-wire-dot" cx={p.x2} cy={p.y2} r="5" />
            {p.label && <text className="vf-wire-label" x={p.lx} y={p.ly} textAnchor="middle">{p.label}</text>}
          </g>
        ))}
      </svg>
    );
  }

  function FlowNode({ id, label, x, y, tone = 'info', order = 0, children }) {
    return (
      <div className="vf-node" data-node={id} data-tone={tone} style={{ left: x, top: y, '--vf-order': order }}>
        <div className="vf-node-label">{label}</div>
        <div className="vf-node-card">{children}</div>
      </div>
    );
  }

  function FlowMapWireLayer({ wires }) {
    const [paths, setPaths] = useState([]);
    const lastPaths = useRef('');

    useLayoutEffect(() => {
      let frame = 0;
      let alive = true;
      const measure = () => {
        if (!alive) return;
        const world = document.querySelector('.vf-map-world');
        if (!world) {
          frame = requestAnimationFrame(measure);
          return;
        }
        const wr = world.getBoundingClientRect();
        const scale = wr.width / (world.offsetWidth || wr.width || 1);
        const point = (rect, side, xRatio, yRatio) => {
          const x = xRatio != null
            ? rect.left + rect.width * xRatio
            : side === 'left'
              ? rect.left
              : side === 'center'
                ? rect.left + rect.width / 2
                : rect.right;
          const y = rect.top + rect.height * (yRatio == null ? .5 : yRatio);
          return { x: (x - wr.left) / scale, y: (y - wr.top) / scale };
        };
        const edgePoint = (rect, side, xRatio, yRatio) => {
          const x = side === 'left'
            ? rect.left
            : side === 'center'
              ? rect.left + rect.width / 2
              : side === 'top' || side === 'bottom'
                ? rect.left + rect.width * (xRatio == null ? .5 : xRatio)
                : rect.right;
          const y = side === 'top'
            ? rect.top
            : side === 'bottom'
              ? rect.bottom
              : rect.top + rect.height * (yRatio == null ? .5 : yRatio);
          return { x: (x - wr.left) / scale, y: (y - wr.top) / scale };
        };
        const next = wires.map((wire) => {
          const from = world.querySelector(`[data-node="${wire.from}"]`);
          const to = world.querySelector(`[data-node="${wire.to}"]`);
          if (!from || !to) return null;
          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          const fromSide = wire.fromSide || 'right';
          const toSide = wire.toSide || 'left';
          const sourceDot = point(a, fromSide, wire.fromX, wire.fromY);
          const targetDot = point(b, toSide, wire.toX, wire.toY);
          const startEdge = edgePoint(a, wire.fromExitSide || fromSide, wire.fromX, wire.fromY);
          const endEdge = edgePoint(b, wire.toEnterSide || toSide, wire.toX, wire.toY);
          const x1 = startEdge.x;
          const y1 = startEdge.y;
          const x2 = endEdge.x;
          const y2 = endEdge.y;
          const midX = wire.midX != null ? wire.midX : x1 + (x2 - x1) * .5;
          const corner = 10;
          const turn1 = y2 > y1 ? y1 + corner : y1 - corner;
          const turn2 = y2 > y1 ? y2 - corner : y2 + corner;
          return {
            ...wire,
            d: Math.abs(y2 - y1) < 24
              ? `M ${x1} ${y1} L ${x2} ${y2}`
              : `M ${x1} ${y1} L ${midX - corner} ${y1} Q ${midX} ${y1} ${midX} ${turn1} L ${midX} ${turn2} Q ${midX} ${y2} ${midX + corner} ${y2} L ${x2} ${y2}`,
            x1,
            y1,
            x2,
            y2,
            sx: sourceDot.x,
            sy: sourceDot.y,
            tx: targetDot.x,
            ty: targetDot.y,
            lx: wire.labelX != null ? wire.labelX : (Math.abs(y2 - y1) < 24 ? (x1 + x2) / 2 : midX),
            ly: wire.labelY != null ? wire.labelY : (Math.abs(y2 - y1) < 24 ? y1 - 10 : y2 - 12),
            labelW: Math.max(58, Math.min(190, String(wire.label || '').length * 7.2 + 22)),
          };
        }).filter(Boolean);
        const key = JSON.stringify(next.map((p) => [p.from, p.to, p.d, p.label]));
        if (key !== lastPaths.current) {
          lastPaths.current = key;
          setPaths(next);
        }
        frame = requestAnimationFrame(measure);
      };
      frame = requestAnimationFrame(measure);
      return () => { alive = false; cancelAnimationFrame(frame); };
    }, [JSON.stringify(wires)]);

    return (
      <React.Fragment>
      <svg className="vf-map-wire-layer">
        <defs>
          {[
            ['info', '#2563eb'],
            ['ok', '#16a34a'],
            ['warn', '#f59e0b'],
            ['danger', '#dc2626'],
          ].map(([tone, color]) => (
            <marker key={tone} id={`vf-arrow-${tone}`} markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
              <path d="M2 2 L10 6 L2 10 Z" fill={color} />
            </marker>
          ))}
        </defs>
        {paths.map((p) => (
          <g key={`${p.from}-${p.to}-${p.label || ''}`} style={{ color: p.tone === 'ok' ? '#16a34a' : p.tone === 'warn' ? '#f59e0b' : p.tone === 'danger' ? '#dc2626' : '#2563eb' }}>
            <path className="vf-map-wire" data-tone={p.tone || 'info'} d={p.d} markerEnd={`url(#vf-arrow-${p.tone || 'info'})`} />
          </g>
        ))}
      </svg>
      <svg className="vf-map-marker-layer">
        {paths.map((p) => (
          <g key={`${p.from}-${p.to}-${p.label || ''}-markers`} style={{ color: p.tone === 'ok' ? '#16a34a' : p.tone === 'warn' ? '#f59e0b' : p.tone === 'danger' ? '#dc2626' : '#2563eb' }}>
            <circle className="vf-map-wire-dot" cx={p.sx} cy={p.sy} r="5" />
            {p.label && (
              <g>
                <rect className="vf-map-wire-label-box" x={p.lx - p.labelW / 2} y={p.ly - 13} width={p.labelW} height="26" rx="8" />
                <text className="vf-map-wire-label" x={p.lx} y={p.ly + 1} textAnchor="middle">{p.label}</text>
              </g>
            )}
          </g>
        ))}
      </svg>
      </React.Fragment>
    );
  }

  function ClockInFlowPreview() {
    return (
      <div className="scroll screen-in">
        <window.AppHeader eyebrow="Compliance" title="GPS Verification" onBack={NOOP} />
        <div style={{ padding: '4px 16px 24px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <window.MapView height={230} inside dark={false} radius="0" accuracy={5} />
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 999,
                  background: 'rgba(8,14,26,.72)', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  <window.Icon name="signal" size={13} color="var(--ok)" />+/-5 m
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 999,
                  background: 'rgba(8,14,26,.72)', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  <window.Icon name="clock" size={13} color="var(--ink-faint)" />08:02
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 15,
              background: 'color-mix(in srgb, var(--ok) 12%, var(--card))' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flex: '0 0 40px', display: 'grid', placeItems: 'center',
                background: 'var(--ok)', color: '#fff' }}>
                <window.Icon name="checkCircle" size={22} stroke={2.4} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="t-h3" style={{ color: 'var(--ok)' }}>Inside approved location</div>
                <div style={{ color: 'var(--ink-dim)', fontSize: 12.5, marginTop: 2 }}>Within the 75 m geofence at North Gate</div>
              </div>
            </div>
          </div>

          <window.Section title="Clock-In Photo" style={{ marginTop: 18 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ height: 118, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center',
                background: 'color-mix(in srgb, var(--ok) 12%, var(--card-2))', border: '1px solid color-mix(in srgb, var(--ok) 35%, transparent)' }}>
                <div style={{ textAlign: 'center', color: 'var(--ok)' }}>
                  <window.Icon name="checkCircle" size={32} color="var(--ok)" />
                  <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6, fontFamily: 'var(--font-title)' }}>Photo captured</div>
                </div>
              </div>
            </div>
          </window.Section>

          <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
            {['GPS verified', 'Photo captured'].map((label) => (
              <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 13px', borderRadius: 'var(--r-sm)',
                background: 'color-mix(in srgb, var(--ok) 12%, var(--card))', border: '1px solid color-mix(in srgb, var(--ok) 35%, transparent)' }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--ok)' }}>
                  <window.Icon name="check" size={13} stroke={3} color="#fff" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--ink)' }}>{label}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-block btn-lg btn-ok" style={{ marginTop: 18 }}>
            <window.Icon name="clock" size={20} />Clock In Now
          </button>
        </div>
      </div>
    );
  }

  function FlowCanvas({ onGoLive }) {
    const [zoom, setZoom] = useState(.82);
    const setClampedZoom = (next) => setZoom(Math.max(.45, Math.min(1.25, next)));
    const wires = [
      { from: 'landing', to: 'signin', label: 'Open', fromX: .88, fromY: .82, toX: .06, toY: .5 },

      { from: 'guard-home', to: 'schedule', fromX: .88, fromY: .87, fromExitSide: 'right', toX: .05, toY: .5 },
      { from: 'guard-home', to: 'clockin', label: 'Clock In', fromX: .5, fromY: .44, fromExitSide: 'right', toX: .05, toY: .5, tone: 'ok', midX: 410 },

      { from: 'active-shift', to: 'patrol', fromX: .28, fromY: .97, fromExitSide: 'bottom', toX: .05, toY: .5, midX: 430 },
      { from: 'active-shift', to: 'incident-list', fromX: .76, fromY: .97, fromExitSide: 'bottom', toX: .05, toY: .5, tone: 'warn', midX: 390 },
      { from: 'incident-list', to: 'incident-form', label: 'New', fromX: .94, fromY: .17, toX: .05, toY: .5, tone: 'warn' },
      { from: 'active-shift', to: 'messages', fromX: .92, fromY: .97, fromExitSide: 'bottom', toX: .05, toY: .5, midX: 360 },
      { from: 'active-shift', to: 'sos', fromX: .5, fromY: .9, fromExitSide: 'bottom', toX: .05, toY: .5, tone: 'danger', midX: 330 },
      { from: 'active-shift', to: 'clockout', fromX: .52, fromY: .22, toX: .05, toY: .5, tone: 'ok' },
      { from: 'active-shift', to: 'visitor-log', fromX: .28, fromY: .78, fromExitSide: 'right', toX: .05, toY: .5 },
      { from: 'active-shift', to: 'dar', fromX: .52, fromY: .78, fromExitSide: 'right', toX: .05, toY: .5, tone: 'ok' },

      { from: 'supervisor-home', to: 'supervisor-schedule', fromX: .85, fromY: .74, toX: .05, toY: .5 },
      { from: 'supervisor-home', to: 'supervisor-reports', fromX: .72, fromY: .5, toX: .05, toY: .5, tone: 'warn' },
      { from: 'supervisor-reports', to: 'client-home', label: 'Client view', fromX: .9, fromY: .48, toX: .05, toY: .5 },
    ];

    return (
      <div className="vf-canvas-shell">
        <div className="vf-topbar">
          <div className="vf-brand">
            <window.ViperMark size={28} />
            <div>
              <div className="vf-brand-title">ViperOne Flow Map</div>
              <div className="vf-brand-sub">Connected product screens before launch</div>
            </div>
          </div>
          <button className="vf-go-live" onClick={onGoLive}>
            <window.Icon name="bolt" size={18} stroke={2.6} />
            Go Live
          </button>
        </div>
        <div className="vf-zoom-controls">
          <button aria-label="Zoom out" onClick={() => setClampedZoom(zoom - .12)}>-</button>
          <div className="vf-zoom-value">{Math.round(zoom * 100)}%</div>
          <button aria-label="Zoom in" onClick={() => setClampedZoom(zoom + .12)}>+</button>
          <button aria-label="Reset zoom" onClick={() => setClampedZoom(.82)}>1:1</button>
        </div>

        <div className="vf-map-viewport" onWheel={(e) => {
          if (!e.ctrlKey && !e.metaKey) return;
          e.preventDefault();
          setClampedZoom(zoom + (e.deltaY > 0 ? -.06 : .06));
        }}>
          <div className="vf-map-world-wrap" style={{ '--vf-zoom': zoom }}>
          <div className="vf-map-world">
            <div className="vf-map-title">ViperOne App Flow</div>
            <div className="vf-map-subtitle">Hub screens stay on the left. Their buttons, bottom navigation, and action destinations branch vertically on the right.</div>
            <div className="vf-lane-title" style={{ left: 72, top: 900 }}>Guard Home Hub</div>
            <div className="vf-lane-sub" style={{ left: 72, top: 930 }}>The home screen owns the bottom navigation and schedule/clock-in branch.</div>
            <div className="vf-lane-title" style={{ left: 72, top: 2220 }}>Active Shift Hub</div>
            <div className="vf-lane-sub" style={{ left: 72, top: 2250 }}>Once clocked in, field-operation buttons branch to their own screens.</div>
            <div className="vf-lane-title" style={{ left: 72, top: 4380 }}>Supervisor / Client Branch</div>
            <div className="vf-lane-sub" style={{ left: 72, top: 4410 }}>Role-specific dashboards remain separate from guard execution.</div>

            <FlowMapWireLayer wires={wires} />

            <FlowNode id="landing" label="01 - Landing" x={72} y={120} order={0}>
              <Frame login><window.LandingScreen A={A} /></Frame>
            </FlowNode>
            <FlowNode id="signin" label="02 - Sign In / Role Split" x={560} y={120} order={1}>
              <Frame login><window.SignInScreen A={A} role="guard" /></Frame>
            </FlowNode>
            <div className="vf-hub-callout" style={{ left: 1020, top: 180 }}>
              <strong>Role split</strong>
              Sign-in branches to Guard, Supervisor, or Client. Manager/Admin are still missing from the app.
            </div>

            <FlowNode id="guard-home" label="03 - Guard Home with Bottom Nav" x={72} y={980} tone="ok" order={2}>
              <Frame navActive="home"><window.HomeScreen A={A} data={DATA} counts={COUNTS} onClockIn={NOOP} onSchedule={NOOP} /></Frame>
            </FlowNode>
            <FlowNode id="schedule" label="Home branch - Schedule" x={560} y={720} order={3}>
              <Frame navActive="home"><window.ScheduleScreen A={A} /></Frame>
            </FlowNode>
            <FlowNode id="clockin" label="Home branch - Clock In" x={1048} y={720} tone="ok" order={4}>
              <Frame><ClockInFlowPreview /></Frame>
            </FlowNode>
            <FlowNode id="active-shift" label="Clock-in result - Active Shift Hub" x={72} y={2300} tone="ok" order={5}>
              <Frame navActive="home"><window.ActiveShiftScreen A={A} data={DATA} patrol={PATROL} /></Frame>
            </FlowNode>

            <FlowNode id="patrol" label="Patrol destination" x={560} y={1980} order={6}>
              <Frame navActive="patrol"><window.PatrolScreen A={A} patrol={PATROL} setPatrol={NOOP} /></Frame>
            </FlowNode>
            <FlowNode id="visitor-log" label="Active Shift branch - Visitor Log" x={1048} y={1980} order={7}>
              <Frame><window.VisitorLogScreen A={A} data={DATA} /></Frame>
            </FlowNode>
            <FlowNode id="dar" label="Active Shift branch - DAR" x={1536} y={1980} order={8}>
              <Frame><window.DailyActivityScreen A={A} data={DATA} /></Frame>
            </FlowNode>

            <FlowNode id="incident-list" label="Bottom nav/action - Reports" x={560} y={2940} tone="warn" order={9}>
              <Frame navActive="reports"><window.ReportsScreen A={A} data={DATA} mode="list" setMode={NOOP} incidents={INCIDENTS} addIncident={NOOP} /></Frame>
            </FlowNode>
            <FlowNode id="incident-form" label="Reports continues - Incident Form" x={1048} y={2940} tone="warn" order={10}>
              <Frame navActive="reports"><window.ReportsScreen A={A} data={DATA} mode="form" setMode={NOOP} incidents={INCIDENTS} addIncident={NOOP} /></Frame>
            </FlowNode>
            <FlowNode id="messages" label="Bottom nav - Messages" x={1536} y={2940} order={11}>
              <Frame navActive="messages"><window.MessagesScreen A={A} messages={MSGS} send={NOOP} /></Frame>
            </FlowNode>

            <FlowNode id="sos" label="Center nav - SOS" x={560} y={3820} tone="danger" order={12}>
              <Frame><window.SosScreen A={A} /></Frame>
            </FlowNode>
            <FlowNode id="clockout" label="Active Shift action - Clock Out" x={1048} y={3820} tone="ok" order={13}>
              <Frame><window.ClockOutScreen A={A} data={DATA} patrol={DONE_PATROL} /></Frame>
            </FlowNode>

            <FlowNode id="supervisor-home" label="Supervisor Home" x={72} y={4480} order={14}>
              <Frame><window.SupervisorHomeScreen A={A} incidents={INCIDENTS} /></Frame>
            </FlowNode>
            <FlowNode id="supervisor-schedule" label="Supervisor branch - Assignments" x={560} y={4480} order={15}>
              <Frame><window.SupervisorScheduleScreen A={A} /></Frame>
            </FlowNode>
            <FlowNode id="supervisor-reports" label="Supervisor branch - Reports" x={1048} y={4480} tone="warn" order={16}>
              <Frame><window.ReportsScreen A={A} data={DATA} mode="list" setMode={NOOP} incidents={INCIDENTS} addIncident={NOOP} /></Frame>
            </FlowNode>
            <FlowNode id="client-home" label="Client Home / Read-only output" x={1536} y={4480} order={17}>
              <Frame><window.ClientHomeScreen A={A} incidents={INCIDENTS} data={DATA} /></Frame>
            </FlowNode>
          </div>
          </div>
        </div>
      </div>
    );
  }

  function ViperExperience() {
    const [mode, setMode] = useState('canvas');
    const timer = useRef(null);

    useEffect(() => {
      injectFlowStyles();
      return () => clearTimeout(timer.current);
    }, []);

    const goLive = () => {
      if (mode !== 'canvas') return;
      setMode('transitioning');
      timer.current = setTimeout(() => setMode('live'), 1360);
    };

    return (
      <div className="vf-root" data-mode={mode}>
        {mode !== 'live' && <FlowCanvas onGoLive={goLive} />}
        <div className="vf-live-stage">
          <window.ViperApp />
        </div>
      </div>
    );
  }

  window.ViperExperience = ViperExperience;
})();
