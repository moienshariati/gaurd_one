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
      .vf-phone { position: relative; width: 360px; height: 760px; background: var(--shell); overflow: hidden; display: flex; flex-direction: column; font-size: 15.5px; }
      .vf-phone .app { flex: 1 1 auto; min-height: 0; }
      .vf-phone .scroll { overflow: hidden; }
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
      .vf-root[data-mode="transitioning"] [data-dc-slot] { animation: vfArtboardGather 1.1s cubic-bezier(.2,.8,.2,1) forwards; animation-delay: calc(var(--vf-order, 0) * 26ms); }
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

  function Frame({ children, login, accent = 'blue', night = false, order = 0 }) {
    return (
      <div className="vf-phone" data-mode={night ? 'night' : 'day'} data-accent={accent} data-radius="rounded" style={{ '--vf-order': order }}>
        {!login && <StatusBar />}
        <div className="app">{login && <div style={{ height: 44 }} />}{children}</div>
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

  function FlowCanvas({ onGoLive }) {
    const { DesignCanvas, DCSection, DCArtboard } = window;
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

        <DesignCanvas minScale={0.12} maxScale={4}>
          <DCSection id="entry" title="Entry & Role Selection" subtitle="Public entry into role-aware authentication">
            <DCArtboard id="landing" label="01 - Landing" width={360} height={760}><Frame login order={0}><window.LandingScreen A={A} /></Frame></DCArtboard>
            <DCArtboard id="signin" label="02 - Sign In" width={360} height={760}><Frame login order={1}><window.SignInScreen A={A} role="guard" /></Frame></DCArtboard>
            <Note left={1020} top={128} title="Branch point" text="The selected sign-in role routes the user to Guard, Supervisor, or Client flows." />
            <FlowWireLayer sectionId="entry" wires={[
              { from: 'landing', to: 'signin', label: 'Open ViperOne' },
            ]} />
          </DCSection>

          <DCSection id="guard-flow" title="Guard Shift Flow" subtitle="Assignment, verification, active field work, reports, and wrap-up">
            <DCArtboard id="home" label="03 - Guard Home" width={360} height={760}><Frame order={2}><window.HomeScreen A={A} data={DATA} counts={COUNTS} onClockIn={NOOP} onSchedule={NOOP} /></Frame></DCArtboard>
            <DCArtboard id="schedule" label="04 - Schedule" width={360} height={760}><Frame order={3}><window.ScheduleScreen A={A} /></Frame></DCArtboard>
            <DCArtboard id="clockin" label="05 - Clock In" width={360} height={760}><Frame order={4}><window.ClockInScreen A={A} data={DATA} /></Frame></DCArtboard>
            <DCArtboard id="shift" label="06 - Active Shift" width={360} height={760}><Frame order={5}><window.ActiveShiftScreen A={A} data={DATA} patrol={PATROL} /></Frame></DCArtboard>
            <DCArtboard id="patrol" label="07 - Patrol Scan" width={360} height={760}><Frame order={6}><window.PatrolScreen A={A} patrol={PATROL} setPatrol={NOOP} /></Frame></DCArtboard>
            <DCArtboard id="visitor" label="08 - Visitor Log" width={360} height={760}><Frame order={7}><window.VisitorLogScreen A={A} data={DATA} /></Frame></DCArtboard>
            <DCArtboard id="dar" label="09 - DAR" width={360} height={760}><Frame order={8}><window.DailyActivityScreen A={A} data={DATA} /></Frame></DCArtboard>
            <DCArtboard id="reports" label="10 - Incidents" width={360} height={760}><Frame order={9}><window.ReportsScreen A={A} data={DATA} mode="list" setMode={NOOP} incidents={INCIDENTS} addIncident={NOOP} /></Frame></DCArtboard>
            <DCArtboard id="incident-form" label="11 - Incident Form" width={360} height={760}><Frame order={10}><window.ReportsScreen A={A} data={DATA} mode="form" setMode={NOOP} incidents={INCIDENTS} addIncident={NOOP} /></Frame></DCArtboard>
            <DCArtboard id="messages" label="12 - Messages" width={360} height={760}><Frame order={11}><window.MessagesScreen A={A} messages={MSGS} send={NOOP} /></Frame></DCArtboard>
            <DCArtboard id="sos" label="13 - SOS" width={360} height={760}><Frame order={12}><window.SosScreen A={A} /></Frame></DCArtboard>
            <DCArtboard id="clockout" label="14 - Clock Out" width={360} height={760}><Frame order={13}><window.ClockOutScreen A={A} data={DATA} patrol={DONE_PATROL} /></Frame></DCArtboard>
            <FlowWireLayer sectionId="guard-flow" wires={[
              { from: 'home', to: 'schedule', label: 'View schedule' },
              { from: 'schedule', to: 'clockin', label: 'Clock in', tone: 'ok' },
              { from: 'clockin', to: 'shift', label: 'Start shift', tone: 'ok' },
              { from: 'shift', to: 'patrol', label: 'Patrol' },
              { from: 'patrol', to: 'visitor', label: 'Field ops' },
              { from: 'visitor', to: 'dar', label: 'Log activity' },
              { from: 'dar', to: 'reports', label: 'Reports' },
              { from: 'reports', to: 'incident-form', label: 'New incident', tone: 'warn' },
              { from: 'incident-form', to: 'messages', label: 'Notify' },
              { from: 'messages', to: 'sos', label: 'Emergency', tone: 'danger' },
              { from: 'sos', to: 'clockout', label: 'Wrap up', tone: 'ok' },
            ]} />
          </DCSection>

          <DCSection id="office-flow" title="Supervisor & Client Visibility" subtitle="Operational oversight and read-only client transparency">
            <DCArtboard id="sup-home" label="15 - Supervisor Home" width={360} height={760}><Frame order={14}><window.SupervisorHomeScreen A={A} incidents={INCIDENTS} /></Frame></DCArtboard>
            <DCArtboard id="sup-schedule" label="16 - Assignments" width={360} height={760}><Frame order={15}><window.SupervisorScheduleScreen A={A} /></Frame></DCArtboard>
            <DCArtboard id="sup-reports" label="17 - Supervisor Reports" width={360} height={760}><Frame order={16}><window.ReportsScreen A={A} data={DATA} mode="list" setMode={NOOP} incidents={INCIDENTS} addIncident={NOOP} /></Frame></DCArtboard>
            <DCArtboard id="client-home" label="18 - Client Home" width={360} height={760}><Frame order={17}><window.ClientHomeScreen A={A} incidents={INCIDENTS} data={DATA} /></Frame></DCArtboard>
            <FlowWireLayer sectionId="office-flow" wires={[
              { from: 'sup-home', to: 'sup-schedule', label: 'Schedule' },
              { from: 'sup-schedule', to: 'sup-reports', label: 'Incidents', tone: 'warn' },
              { from: 'sup-reports', to: 'client-home', label: 'Client view' },
            ]} />
          </DCSection>

          <DCSection id="variants" title="Presentation Variants" subtitle="Same operational screen under theme settings">
            <DCArtboard id="blue" label="Blue Accent" width={360} height={760}><Frame order={18}><window.ActiveShiftScreen A={A} data={DATA} patrol={PATROL} /></Frame></DCArtboard>
            <DCArtboard id="navy" label="Navy Accent" width={360} height={760}><Frame accent="navy" order={19}><window.ActiveShiftScreen A={A} data={DATA} patrol={PATROL} /></Frame></DCArtboard>
            <DCArtboard id="night" label="Night Shift" width={360} height={760}><Frame night order={20}><window.ActiveShiftScreen A={A} data={DATA} patrol={PATROL} /></Frame></DCArtboard>
            <FlowWireLayer sectionId="variants" wires={[
              { from: 'blue', to: 'navy', label: 'Accent' },
              { from: 'navy', to: 'night', label: 'Night mode' },
            ]} />
          </DCSection>
        </DesignCanvas>
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
