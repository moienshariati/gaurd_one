// screens-active.jsx — ActiveShift, Patrol, Reports/Incident, SOS, Messages, ClockOut.
(function () {
  const { useState, useEffect, useRef } = React;
  const { Icon, StatusBadge, AppHeader, Section, MapView, Chip, QuickActionGrid, QuickAction,
    PatrolProgressCard, CheckpointItem, ProgressBar, ProgressRing, Sheet, Dot, Spinner, StickyBar } = window;

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  /* ============================ ACTIVE SHIFT ============================ */
  function ActiveShiftScreen({ A, data, patrol }) {
    const [t, setT] = useState(2 * 3600 + 34 * 60 + 12);
    const [alive, setAlive] = useState(false);
    useEffect(() => { const id = setInterval(() => setT(x => x + 1), 1000); return () => clearInterval(id); }, []);
    const tasks = [
      { t: 'Check front gate', done: true }, { t: 'Patrol parking area', done: true },
      { t: 'Inspect loading dock', done: false }, { t: 'Submit activity note', done: false },
    ];
    return (
      <div className="scroll screen-in">
        {/* live timer header */}
        <div style={{ background: 'var(--shell)', padding: '6px 18px 22px', borderRadius: '0 0 28px 28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(100% 80% at 100% 0, color-mix(in srgb, var(--ok) 18%, transparent), transparent 60%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <StatusBadge tone="ok" label="On Shift · Active" icon="bolt" on="shell" pulse />
              <div style={{ color: 'var(--on-shell-dim)', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="pin" size={14} color="var(--on-shell-dim)" />{data.site}</div>
            </div>
            <div className="t-mono" style={{ fontSize: 52, fontWeight: 700, color: 'var(--on-shell)', letterSpacing: '.01em', marginTop: 16, lineHeight: 1 }}>{fmt(t)}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ color: 'var(--on-shell-dim)', fontSize: 13, fontWeight: 600 }}>On shift · started 08:02 · ends 16:00</div>
              <div className="t-mono" style={{ color: 'var(--ok)', fontSize: 13, fontWeight: 700 }}>5h 26m left</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px 24px' }}>
          {/* primary ops */}
          <Section title="Field Operations">
            <QuickActionGrid cols={2}>
              <QuickAction icon="route" label="Scan Checkpoint" tone="ok" onClick={() => A.go('patrol')} />
              <QuickAction icon="alert" label="Report Incident" tone="warn" onClick={() => A.go('reports', { mode: 'form' })} />
              <QuickAction icon="heartbeat" label="I'm Alive" tone="accent" onClick={() => { setAlive(true); A.toast({ msg: 'Safety check sent · 08:36 · supervisor notified', icon: 'heartbeat' }); }} />
              <QuickAction icon="chat" label="Message Supervisor" tone="info" onClick={() => A.go('messages')} />
            </QuickActionGrid>
          </Section>

          {/* patrol progress */}
          <Section title="Patrol Progress" style={{ marginTop: 22 }} action="Open Patrol" onAction={() => A.go('patrol')}>
            <PatrolProgressCard route="Main Patrol Route" done={patrol.done} total={patrol.total}
              next={patrol.next} remaining="42 min" onClick={() => A.go('patrol')} />
          </Section>

          {/* tasks */}
          <Section title="Shift Tasks" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: '6px 16px' }}>
              {tasks.map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0',
                  borderBottom: i < tasks.length - 1 ? '1px solid var(--card-line)' : 'none' }}>
                  <div style={{ width: 25, height: 25, borderRadius: 8, flex: '0 0 25px', display: 'grid', placeItems: 'center',
                    background: task.done ? 'var(--ok)' : 'transparent', border: task.done ? 'none' : '2px solid var(--card-line)' }}>
                    {task.done && <Icon name="check" size={14} stroke={3} color="#fff" />}</div>
                  <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: task.done ? 'var(--ink-faint)' : 'var(--ink)',
                    textDecoration: task.done ? 'line-through' : 'none' }}>{task.t}</span>
                  {!task.done && <Icon name="chevron" size={17} color="var(--ink-faint)" />}
                </div>
              ))}
            </div>
          </Section>

          <button className="btn btn-block btn-lg btn-ghost-light" style={{ marginTop: 22 }} onClick={() => A.go('clockout')}>
            <Icon name="clock" size={19} />End Shift & Clock Out</button>
        </div>
      </div>
    );
  }

  /* ============================ PATROL / SCAN ============================ */
  function PatrolScreen({ A, patrol, setPatrol }) {
    const [scan, setScan] = useState(null); // null | 'scanning' | 'success' | 'error'
    const checkpoints = [
      { name: 'Front Gate', time: '08:05', state: 'done', location: 'GPS ✓' },
      { name: 'Main Lobby', time: '08:21', state: 'done', location: 'GPS ✓' },
      { name: 'Parking Lot A', time: '08:40', state: 'done', location: 'GPS ✓' },
      { name: 'Loading Dock', time: '08:58', state: 'done', location: 'GPS ✓' },
      { name: 'Service Corridor', state: 'next' },
      { name: 'East Stairwell', state: 'pending' },
      { name: 'Roof Access', state: 'pending' },
      { name: 'Final Sweep', state: 'pending' },
    ].map((c, i) => ({ ...c, state: i < patrol.done ? 'done' : i === patrol.done ? 'next' : 'pending' }));
    const next = checkpoints.find(c => c.state === 'next');

    const doScan = (kind) => {
      setScan('scanning');
      setTimeout(() => {
        setScan('success');
        setTimeout(() => {
          setPatrol(p => ({ ...p, done: Math.min(p.total, p.done + 1), next: checkpoints[Math.min(checkpoints.length - 1, patrol.done + 1)]?.name || 'Complete' }));
          setScan(null);
          A.toast({ msg: `Checkpoint verified · ${next?.name} · ${new Date().toTimeString().slice(0, 5)}`, icon: 'checkCircle' });
        }, 1100);
      }, 1400);
    };

    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="Main Patrol Route" title="Checkpoint Scan"
          right={<span className="t-mono" style={{ color: 'var(--ok)', fontWeight: 700, fontSize: 15 }}>{patrol.done}/{patrol.total}</span>} />
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ padding: '0 2px 16px' }}>
            <ProgressBar value={patrol.done} total={patrol.total} tone="ok" height={10} />
          </div>

          {/* next checkpoint banner */}
          <div className="card" style={{ padding: 15, display: 'flex', alignItems: 'center', gap: 13,
            background: 'color-mix(in srgb, var(--accent) 8%, var(--card))' }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, flex: '0 0 44px', display: 'grid', placeItems: 'center',
              background: 'color-mix(in srgb, var(--accent) 16%, transparent)', color: 'var(--accent)' }}><Icon name="target" size={24} /></div>
            <div style={{ flex: 1 }}>
              <div className="t-eyebrow" style={{ color: 'var(--accent)' }}>Next Expected</div>
              <div className="t-h2" style={{ color: 'var(--ink)', marginTop: 3 }}>{next ? next.name : 'Route complete'}</div>
            </div>
          </div>

          {/* big scan area */}
          <div style={{ marginTop: 16, position: 'relative', height: 230, borderRadius: 'var(--r-card)', overflow: 'hidden',
            background: 'var(--shell)', display: 'grid', placeItems: 'center' }}>
            <ScanViewport scan={scan} />
          </div>
          <div style={{ display: 'flex', gap: 11, marginTop: 14 }}>
            <button className="btn btn-lg btn-accent" style={{ flex: 1 }} disabled={!!scan || !next} onClick={() => doScan('qr')}>
              <Icon name="qr" size={20} />Scan QR</button>
            <button className="btn btn-lg btn-ghost-light" style={{ flex: 1 }} disabled={!!scan || !next} onClick={() => doScan('nfc')}>
              <Icon name="nfc" size={20} />Scan NFC</button>
          </div>

          {/* timeline */}
          <Section title="Checkpoint Timeline" style={{ marginTop: 24 }}>
            <div className="card" style={{ padding: '16px 16px 14px' }}>
              {checkpoints.map((c, i) => (
                <CheckpointItem key={i} {...c} last={i === checkpoints.length - 1} />
              ))}
            </div>
          </Section>
        </div>
      </div>
    );
  }
  function ScanViewport({ scan }) {
    if (scan === 'success') return (
      <div style={{ textAlign: 'center', color: '#fff', animation: 'screenIn .3s ease' }}>
        <div style={{ width: 76, height: 76, borderRadius: 999, background: 'var(--ok)', display: 'grid', placeItems: 'center', margin: '0 auto',
          boxShadow: '0 0 0 12px color-mix(in srgb, var(--ok) 25%, transparent)' }}><Icon name="check" size={42} stroke={3} color="#fff" /></div>
        <div style={{ marginTop: 16, fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 18 }}>Checkpoint Verified</div>
        <div className="t-mono" style={{ fontSize: 12, color: 'var(--on-shell-dim)', marginTop: 5 }}>{new Date().toTimeString().slice(0, 8)} · location confirmed</div>
      </div>
    );
    return (
      <div style={{ textAlign: 'center', color: 'var(--on-shell-dim)', position: 'relative' }}>
        <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto' }}>
          {[0, 1, 2, 3].map(i => {
            const corners = [{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }][i];
            const rot = ['0 0', '0 100%', '100% 0', '100% 100%'];
            return <div key={i} style={{ position: 'absolute', width: 34, height: 34, ...corners,
              borderTop: i < 2 ? '3px solid var(--accent)' : 'none', borderBottom: i >= 2 ? '3px solid var(--accent)' : 'none',
              borderLeft: i % 2 === 0 ? '3px solid var(--accent)' : 'none', borderRight: i % 2 === 1 ? '3px solid var(--accent)' : 'none',
              borderRadius: ['8px 0 0', '0 8px 0 0', '0 0 0 8px', '0 0 8px 0'][i] }} />;
          })}
          {scan === 'scanning' && <div style={{ position: 'absolute', left: 6, right: 6, height: 3, background: 'var(--accent)', borderRadius: 2,
            boxShadow: '0 0 16px 3px var(--accent)', top: '50%', animation: 'scanline 1.4s ease-in-out infinite' }} />}
          <Icon name="qr" size={64} color="var(--on-shell-faint)" style={{ position: 'absolute', inset: 0, margin: 'auto', opacity: .5 }} />
        </div>
        <div style={{ marginTop: 18, fontWeight: 600, fontSize: 14, color: 'var(--on-shell)' }}>{scan === 'scanning' ? 'Scanning checkpoint tag…' : 'Align QR / NFC tag in the frame'}</div>
        <style>{`@keyframes scanline{0%{top:8%}50%{top:88%}100%{top:8%}}`}</style>
      </div>
    );
  }

  /* ============================ REPORTS / INCIDENT ============================ */
  const CATS = ['Security Issue', 'Maintenance', 'Parking', 'Visitor', 'Contractor', 'Emergency', 'Other'];
  const SEV = [{ k: 'Low', tone: 'ok' }, { k: 'Medium', tone: 'info' }, { k: 'High', tone: 'warn' }, { k: 'Critical', tone: 'danger' }];
  function ReportsScreen({ A, data, mode, setMode, incidents, addIncident }) {
    if (mode === 'form') return <IncidentForm A={A} data={data} onCancel={() => setMode('list')}
      onSubmit={(inc) => { addIncident(inc); setMode('sent'); }} />;
    if (mode === 'sent') return <IncidentSent A={A} onDone={() => setMode('list')} inc={incidents[0]} />;
    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="Field Reports" title="Incidents" big
          right={<button className="btn" onClick={() => A.go('reports', { mode: 'form' })} style={{ width: 44, height: 44, borderRadius: 13,
            background: 'var(--accent)', color: '#fff' }}><Icon name="plus" size={22} stroke={2.6} /></button>} />
        <div style={{ padding: '4px 16px 24px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <StatTile n={incidents.filter(i => i.status !== 'Resolved').length} label="Open" tone="warn" />
            <StatTile n={incidents.filter(i => i.status === 'Resolved').length} label="Resolved" tone="ok" />
            <StatTile n={incidents.length} label="Today" tone="accent" />
          </div>
          {incidents.map((inc, i) => (
            <div key={i} className="card" style={{ padding: 15, marginBottom: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SevDot tone={SEV.find(s => s.k === inc.severity)?.tone} />
                    <span className="t-eyebrow" style={{ color: 'var(--ink-faint)' }}>{inc.category}</span>
                  </div>
                  <div className="t-h3" style={{ color: 'var(--ink)', marginTop: 6 }}>{inc.title}</div>
                </div>
                <IncidentStatus status={inc.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 11, color: 'var(--ink-faint)', fontSize: 12, fontWeight: 500 }}>
                <span className="t-mono">{inc.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="pin" size={12} />{data.site}</span>
                {inc.evidence > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="camera" size={12} />{inc.evidence}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  function StatTile({ n, label, tone }) {
    const c = window.TONE[tone].c;
    return (
      <div className="card" style={{ flex: 1, padding: '13px 14px' }}>
        <div className="t-mono" style={{ fontWeight: 700, fontSize: 26, color: c, lineHeight: 1 }}>{n}</div>
        <div style={{ color: 'var(--ink-dim)', fontSize: 12, fontWeight: 600, marginTop: 5 }}>{label}</div>
      </div>
    );
  }
  function SevDot({ tone }) { return <span style={{ width: 8, height: 8, borderRadius: 999, background: window.TONE[tone || 'neutral'].c, display: 'inline-block' }} />; }
  function IncidentStatus({ status }) {
    const map = { 'New': 'danger', 'Acknowledged': 'warn', 'In Progress': 'info', 'Resolved': 'ok' };
    return <StatusBadge tone={map[status]} label={status} />;
  }
  function IncidentForm({ A, data, onCancel, onSubmit }) {
    const [cat, setCat] = useState('Security Issue');
    const [sev, setSev] = useState('Medium');
    const [desc, setDesc] = useState('');
    const [ev, setEv] = useState([]);
    const toggleEv = (e) => setEv(p => p.includes(e) ? p.filter(x => x !== e) : [...p, e]);
    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="New Report" title="Report Incident" onBack={onCancel} />
        <div style={{ padding: '4px 16px 130px' }}>
          <Section title="Category">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATS.map(c => <Chip key={c} active={cat === c} tone="accent" onClick={() => setCat(c)}>{c}</Chip>)}
            </div>
          </Section>
          <Section title="Severity" style={{ marginTop: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {SEV.map(s => {
                const on = sev === s.k, c = window.TONE[s.tone].c;
                return <button key={s.k} className="btn" onClick={() => setSev(s.k)} style={{ height: 50, flexDirection: 'column', gap: 5, borderRadius: 'var(--r-sm)',
                  background: on ? c : 'var(--card)', border: `1px solid ${on ? c : 'var(--card-line)'}`, color: on ? '#fff' : 'var(--ink-dim)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: on ? '#fff' : c }} />
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-title)' }}>{s.k}</span></button>;
              })}
            </div>
          </Section>
          <Section title="Location" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 11 }}>
              <Icon name="pin" size={19} color="var(--ok)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-title)' }}>{data.site}</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 1 }}>Auto-filled · GPS tagged</div>
              </div>
              <StatusBadge tone="ok" label="Auto" icon="check" />
            </div>
          </Section>
          <Section title="Description" style={{ marginTop: 22 }}>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what happened, who was involved, and any action taken…"
              style={{ width: '100%', minHeight: 110, resize: 'none', padding: 15, borderRadius: 'var(--r-card)', background: 'var(--card)',
                border: '1px solid var(--card-line)', color: 'var(--ink)', fontSize: 14.5, fontFamily: 'var(--font-body)', lineHeight: 1.5, outline: 'none' }} />
          </Section>
          <Section title="Attach Evidence" style={{ marginTop: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
              {[{ k: 'Photo', icon: 'camera' }, { k: 'Voice', icon: 'mic' }, { k: 'Signature', icon: 'sign' }, { k: 'Video', icon: 'video' }].map(e => {
                const on = ev.includes(e.k);
                return <button key={e.k} className="btn" onClick={() => toggleEv(e.k)} style={{ flexDirection: 'column', gap: 7, padding: '14px 4px', borderRadius: 'var(--r-sm)',
                  background: on ? 'color-mix(in srgb, var(--accent) 13%, var(--card))' : 'var(--card)', border: `1px solid ${on ? 'var(--accent)' : 'var(--card-line)'}` }}>
                  <Icon name={e.icon} size={22} color={on ? 'var(--accent)' : 'var(--ink-faint)'} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--font-title)', color: on ? 'var(--accent)' : 'var(--ink-dim)' }}>{e.k}</span></button>;
              })}
            </div>
          </Section>
        </div>
        <StickyBar>
          <button className="btn btn-block btn-lg btn-accent" onClick={() => onSubmit({
            category: cat, severity: sev, title: desc.slice(0, 38) || `${cat} reported`, status: 'New', time: new Date().toTimeString().slice(0, 5), evidence: ev.length })}>
            <Icon name="send" size={19} />Submit Report</button>
        </StickyBar>
      </div>
    );
  }
  function IncidentSent({ A, onDone, inc }) {
    return (
      <div className="scroll screen-in" style={{ display: 'flex', flexDirection: 'column' }}>
        <AppHeader title="" onBack={onDone} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 60px', textAlign: 'center' }}>
          <div style={{ width: 92, height: 92, borderRadius: 999, background: 'color-mix(in srgb, var(--ok) 14%, transparent)', margin: '0 auto',
            display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 66, height: 66, borderRadius: 999, background: 'var(--ok)', display: 'grid', placeItems: 'center' }}>
              <Icon name="check" size={38} stroke={3} color="#fff" /></div>
          </div>
          <div className="t-h1" style={{ color: 'var(--on-shell)', marginTop: 22 }}>Incident Sent</div>
          <div style={{ color: 'var(--on-shell-dim)', fontSize: 14.5, marginTop: 8, lineHeight: 1.5 }}>Your report was delivered to the supervisor and queued for review.</div>
          <div className="card" style={{ marginTop: 26, padding: 16, textAlign: 'left' }}>
            <StatusTracker steps={['New', 'Acknowledged', 'In Progress', 'Resolved']} current={0} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--card-line)', color: 'var(--warn)', fontSize: 13, fontWeight: 600 }}>
              <Icon name="clock" size={15} />Client notification pending</div>
          </div>
        </div>
        <div style={{ padding: '0 16px 22px' }}>
          <button className="btn btn-block btn-lg btn-ghost-shell" onClick={onDone}>Back to Reports</button>
        </div>
      </div>
    );
  }
  function StatusTracker({ steps, current }) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            {i < steps.length - 1 && <div style={{ position: 'absolute', top: 11, left: '50%', right: '-50%', height: 2,
              background: i < current ? 'var(--ok)' : 'var(--card-line)' }} />}
            <div style={{ width: 24, height: 24, borderRadius: 999, margin: '0 auto', position: 'relative', display: 'grid', placeItems: 'center',
              background: i <= current ? (i === current ? 'var(--accent)' : 'var(--ok)') : 'var(--card)', border: i <= current ? 'none' : '2px solid var(--card-line)' }}>
              {i < current ? <Icon name="check" size={13} stroke={3} color="#fff" /> : i === current ? <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} /> : null}</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 6, color: i <= current ? 'var(--ink)' : 'var(--ink-faint)', fontFamily: 'var(--font-title)' }}>{s}</div>
          </div>
        ))}
      </div>
    );
  }

  /* ============================ SOS ============================ */
  function SosScreen({ A }) {
    const [phase, setPhase] = useState('arm'); // arm | sent
    const [ack, setAck] = useState(0); // 0 New 1 Acknowledged 2 Responding
    const [hold, setHold] = useState(0);
    const holdRef = useRef(null);
    const start = () => { holdRef.current = setInterval(() => setHold(h => { if (h >= 100) { trigger(); return 100; } return h + 4; }), 30); };
    const stop = () => { clearInterval(holdRef.current); if (phase === 'arm') setHold(0); };
    const trigger = () => { clearInterval(holdRef.current); setPhase('sent');
      setTimeout(() => setAck(1), 2600); setTimeout(() => setAck(2), 5200); };
    useEffect(() => () => clearInterval(holdRef.current), []);

    if (phase === 'sent') return (
      <div className="scroll screen-in" style={{ background: 'var(--danger)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'rgba(0,0,0,.14)' }}><AppHeader title="" onBack={() => A.go(A.back || 'shift')}
          right={<span style={{ color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}><Dot tone="ok" pulse /> LIVE</span>} /></div>
        <div style={{ flex: 1, padding: '10px 22px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center', color: '#fff', marginTop: 8 }}>
            <div style={{ width: 96, height: 96, margin: '0 auto', display: 'grid', placeItems: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(255,255,255,.3)', animation: 'pulseRing 2s ease-out infinite' }} />
              <div style={{ width: 78, height: 78, borderRadius: 999, background: '#fff', display: 'grid', placeItems: 'center' }}>
                <Icon name="sos" size={40} color="var(--danger)" stroke={2.6} /></div>
            </div>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 30, marginTop: 18 }}>SOS ACTIVE</div>
            <div style={{ fontSize: 14.5, opacity: .92, marginTop: 6 }}>Emergency alert broadcast to your supervisor and dispatch.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.14)', borderRadius: 18, padding: 16, marginTop: 24, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="pin" size={18} color="#fff" />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-title)' }}>Live location shared</div>
                <div className="t-mono" style={{ fontSize: 12, opacity: .85, marginTop: 2 }}>40.7621° N, 73.9712° W · ±5 m</div></div>
              <Dot tone="ok" pulse />
            </div>
          </div>
          {/* ack tracker */}
          <div style={{ background: 'rgba(0,0,0,.16)', borderRadius: 18, padding: 18, marginTop: 14, color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', opacity: .8, marginBottom: 14 }}>RESPONSE STATUS</div>
            {[{ k: 'Alert Sent', d: 'Broadcast to dispatch' }, { k: 'Acknowledged', d: 'Supervisor confirmed receipt' }, { k: 'Responding', d: 'Help is on the way' }].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', opacity: i <= ack ? 1 : .4 }}>
                <div style={{ width: 30, height: 30, borderRadius: 999, flex: '0 0 30px', display: 'grid', placeItems: 'center',
                  background: i <= ack ? '#fff' : 'rgba(255,255,255,.2)' }}>
                  {i < ack ? <Icon name="check" size={16} stroke={3} color="var(--danger)" /> : i === ack ? <Spinner color="var(--danger)" size={15} /> : <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }} />}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-title)' }}>{s.k}</div>
                  <div style={{ fontSize: 12, opacity: .82 }}>{s.d}</div></div>
                <span className="t-mono" style={{ fontSize: 11, opacity: .8 }}>{i <= ack ? new Date(Date.now() - (ack - i) * 60000).toTimeString().slice(0, 5) : '—'}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-block btn-lg" style={{ marginTop: 18, background: '#fff', color: 'var(--danger)' }}
            onClick={() => A.toast({ msg: 'Calling supervisor — Daniel Brooks', icon: 'phone', tone: 'danger' })}>
            <Icon name="phone" size={20} />Call Supervisor Now</button>
          <button className="btn btn-block btn-md" style={{ marginTop: 10, background: 'rgba(0,0,0,.2)', color: '#fff' }}
            onClick={() => A.go(A.back || 'shift')}>I'm safe — stand down</button>
        </div>
      </div>
    );

    return (
      <div className="scroll screen-in" style={{ background: 'var(--shell)', display: 'flex', flexDirection: 'column' }}>
        <AppHeader title="" onBack={() => A.go(A.back || 'shift')} right={<StatusBadge tone="danger" label="Emergency" icon="alert" on="shell" />} />
        <div style={{ flex: 1, padding: '0 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="t-h1" style={{ color: 'var(--on-shell)', textAlign: 'center' }}>Emergency SOS</div>
          <div style={{ color: 'var(--on-shell-dim)', fontSize: 14.5, textAlign: 'center', marginTop: 10, lineHeight: 1.5, maxWidth: 290 }}>
            This sends an immediate alert with your live GPS location to your supervisor and dispatch. Use only in a genuine emergency.</div>

          {/* hold to confirm */}
          <div style={{ position: 'relative', margin: '46px 0 30px' }}>
            <svg width="220" height="220" style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(229,53,43,.2)" strokeWidth="6" />
              <circle cx="110" cy="110" r="100" fill="none" stroke="var(--danger)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={628} strokeDashoffset={628 * (1 - hold / 100)} style={{ transition: 'stroke-dashoffset .05s linear' }} />
            </svg>
            <button onMouseDown={start} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchEnd={stop}
              className="btn" style={{ width: 220, height: 220, borderRadius: 999, background: 'var(--danger)', color: '#fff', flexDirection: 'column', gap: 6,
                boxShadow: '0 20px 50px -12px color-mix(in srgb, var(--danger) 70%, transparent)', userSelect: 'none' }}>
              <Icon name="sos" size={50} stroke={2.4} />
              <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 26, letterSpacing: '.06em' }}>SOS</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, opacity: .9 }}>{hold > 0 ? 'Keep holding…' : 'Press & hold 3s'}</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-shell-dim)', fontSize: 13, fontWeight: 500 }}>
            <Icon name="lock" size={14} />Hold prevents accidental activation</div>
        </div>
      </div>
    );
  }

  /* ============================ MESSAGES ============================ */
  function MessagesScreen({ A, messages, send }) {
    const [text, setText] = useState('');
    const endRef = useRef(null);
    useEffect(() => { if (endRef.current) endRef.current.parentNode.scrollTop = endRef.current.offsetTop; }, [messages.length]);
    const quick = ['Arrived on site', 'Need assistance', 'Checkpoint completed', 'Incident submitted'];
    return (
      <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ background: 'var(--shell)', padding: '8px 16px 14px', position: 'relative', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44 }}>
            <button className="btn" onClick={() => A.go('home')} style={{ width: 40, height: 40, borderRadius: 12, flex: '0 0 40px',
              background: 'var(--shell-3)', border: '1px solid var(--shell-line)', color: 'var(--on-shell)' }}><Icon name="chevronL" size={20} /></button>
            <div style={{ width: 42, height: 42, borderRadius: 999, flex: '0 0 42px', background: 'var(--shell-3)', display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--on-shell)', border: '1px solid var(--shell-line)' }}>DB</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-h2" style={{ color: 'var(--on-shell)' }}>Daniel Brooks</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ok)', fontSize: 12, fontWeight: 600, marginTop: 2 }}><Dot tone="ok" /> Supervisor · Online</div>
            </div>
            <button className="btn" onClick={() => A.toast({ msg: 'Calling Daniel Brooks…', icon: 'phone', tone: 'info' })}
              style={{ width: 42, height: 42, borderRadius: 12, flex: '0 0 42px', background: 'var(--shell-3)', color: 'var(--ok)', border: '1px solid var(--shell-line)' }}><Icon name="phone" size={19} /></button>
          </div>
        </div>
        <div className="scroll" style={{ flex: 1, padding: '16px 16px 8px', background: 'var(--shell)' }}>
          <div style={{ textAlign: 'center', margin: '0 0 18px' }}>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--on-shell-faint)', background: 'var(--shell-3)', padding: '4px 12px', borderRadius: 999 }}>TODAY · 30 MAY</span>
          </div>
          {messages.map((m, i) => <Bubble key={i} {...m} />)}
          <div ref={endRef} />
        </div>
        {/* quick replies */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 16px 6px', overflowX: 'auto', background: 'var(--shell)', flex: '0 0 auto' }} className="scroll">
          {quick.map(q => <button key={q} className="btn" onClick={() => send(q)} style={{ flex: '0 0 auto', height: 36, padding: '0 14px', borderRadius: 999,
            background: 'var(--shell-3)', color: 'var(--on-shell)', border: '1px solid var(--shell-line)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)' }}>{q}</button>)}
        </div>
        {/* input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 16px', background: 'var(--shell)' }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Message supervisor…"
            onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { send(text); setText(''); } }}
            style={{ flex: 1, height: 48, padding: '0 16px', borderRadius: 999, background: 'var(--shell-3)', border: '1px solid var(--shell-line)',
              color: 'var(--on-shell)', fontSize: 14.5, fontFamily: 'var(--font-body)', outline: 'none' }} />
          <button className="btn" onClick={() => { if (text.trim()) { send(text); setText(''); } }}
            style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--accent)', color: '#fff', flex: '0 0 48px' }}><Icon name="send" size={20} /></button>
        </div>
      </div>
    );
  }
  function Bubble({ from, text, time }) {
    const me = from === 'me';
    return (
      <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: '78%' }}>
          <div style={{ padding: '11px 14px', borderRadius: me ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
            background: me ? 'var(--accent)' : 'var(--card)', color: me ? '#fff' : 'var(--ink)', fontSize: 14.5, lineHeight: 1.42,
            border: me ? 'none' : '1px solid var(--card-line)', fontWeight: 500 }}>{text}</div>
          <div className="t-mono" style={{ fontSize: 10.5, color: 'var(--on-shell-faint)', marginTop: 4, textAlign: me ? 'right' : 'left', padding: '0 4px' }}>{time}</div>
        </div>
      </div>
    );
  }

  /* ============================ CLOCK OUT ============================ */
  function ClockOutScreen({ A, data, patrol, night }) {
    const [photo, setPhoto] = useState(false);
    const [done, setDone] = useState(false);
    if (done) return (
      <div className="scroll screen-in" style={{ display: 'flex', flexDirection: 'column', background: 'var(--shell)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, background: 'color-mix(in srgb, var(--ok) 16%, transparent)', margin: '0 auto', display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: 999, background: 'var(--ok)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={40} stroke={3} color="#fff" /></div></div>
          <div className="t-h1" style={{ color: 'var(--on-shell)', marginTop: 22 }}>Shift Completed</div>
          <div style={{ color: 'var(--on-shell-dim)', fontSize: 14.5, marginTop: 8 }}>Clocked out at {new Date().toTimeString().slice(0, 5)} · North Gate Plaza</div>
          <div className="card" style={{ marginTop: 26, padding: 6 }}>
            {[['Attendance submitted', 'check'], ['Payroll & scheduling record updated', 'check'], ['Activity report filed', 'check']].map(([t, ic], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', borderBottom: i < 2 ? '1px solid var(--card-line)' : 'none' }}>
                <Icon name="checkCircle" size={20} color="var(--ok)" stroke={2.4} />
                <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{t}</span></div>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 16px 24px' }}>
          <button className="btn btn-block btn-lg btn-accent" onClick={() => { A.reset(); }}>Back to Home</button>
        </div>
      </div>
    );
    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="End of Shift" title="Clock Out" onBack={() => A.go('shift')} />
        <div style={{ padding: '4px 16px 130px' }}>
          {/* summary */}
          <Section title="Shift Summary">
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div><div className="t-eyebrow" style={{ color: 'var(--ink-faint)' }}>Total Time Worked</div>
                  <div className="t-mono" style={{ fontWeight: 700, fontSize: 34, color: 'var(--ink)', marginTop: 4 }}>07:58:11</div></div>
                <ProgressRing value={7.97} total={8} size={62} stroke={7} tone="ok"><Icon name="check" size={22} color="var(--ok)" stroke={3} /></ProgressRing>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, marginTop: 18, background: 'var(--card-line)', borderRadius: 12, overflow: 'hidden' }}>
                {[[patrol.total + '/' + patrol.total, 'Checkpoints'], ['2', 'Incidents'], ['4/4', 'Tasks']].map(([n, l], i) => (
                  <div key={i} style={{ background: 'var(--card)', padding: '13px 8px', textAlign: 'center' }}>
                    <div className="t-mono" style={{ fontWeight: 700, fontSize: 19, color: 'var(--ink)' }}>{n}</div>
                    <div style={{ color: 'var(--ink-faint)', fontSize: 11, fontWeight: 600, marginTop: 3 }}>{l}</div></div>
                ))}
              </div>
            </div>
          </Section>
          {/* gps + photo */}
          <Section title="Clock-Out Verification" style={{ marginTop: 22 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <MapView height={140} inside dark={night} radius="0" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 15px', borderBottom: '1px solid var(--card-line)' }}>
                <Icon name="checkCircle" size={20} color="var(--ok)" stroke={2.4} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>GPS verified at North Gate Plaza</span>
                <StatusBadge tone="ok" label="±4 m" icon="target" />
              </div>
              <div style={{ padding: 15 }}>
                <div onClick={() => setPhoto(true)} style={{ height: 120, borderRadius: 'var(--r-sm)', cursor: 'pointer', display: 'grid', placeItems: 'center',
                  background: photo ? 'color-mix(in srgb, var(--ok) 12%, var(--card-2))' : 'var(--card-2)', border: photo ? '1px solid color-mix(in srgb,var(--ok) 35%,transparent)' : '2px dashed var(--card-line)', color: photo ? 'var(--ok)' : 'var(--ink-faint)' }}>
                  {photo ? <div style={{ textAlign: 'center' }}><Icon name="checkCircle" size={32} color="var(--ok)" /><div style={{ fontWeight: 700, fontSize: 13, marginTop: 6, fontFamily: 'var(--font-title)' }}>Clock-out photo captured</div></div>
                    : <div style={{ textAlign: 'center' }}><Icon name="camera" size={30} /><div style={{ fontWeight: 600, fontSize: 13, marginTop: 6 }}>Take clock-out photo</div></div>}
                </div>
              </div>
            </div>
          </Section>
        </div>
        <StickyBar>
          <button className="btn btn-block btn-lg btn-ok" disabled={!photo} onClick={() => { setDone(true); A.setStatus('completed'); }}>
            <Icon name="clock" size={20} />{photo ? 'Clock Out & Submit Shift' : 'Capture photo to clock out'}</button>
        </StickyBar>
      </div>
    );
  }

  Object.assign(window, { ActiveShiftScreen, PatrolScreen, ReportsScreen, SosScreen, MessagesScreen, ClockOutScreen });
})();
