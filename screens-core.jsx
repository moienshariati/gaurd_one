// screens-core.jsx — Login, Home, JobDetail, ClockIn. Requires components.jsx.
(function () {
  const { useState, useEffect, useRef } = React;
  const { Icon, Logo, StatusBadge, ShiftCard, PrimaryActionButton, QuickActionGrid, QuickAction,
    AppHeader, Section, MapView, Chip } = window;

  /* ============================ LOGIN ============================ */
  function LoginScreen({ A }) {
    const [id, setId] = useState('michael.carter');
    const [pw, setPw] = useState('••••••••');
    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const submit = () => { setBusy(true); setTimeout(() => { setBusy(false); A.go('home'); }, 750); };
    return (
      <div className="scroll screen-in" style={{ background: 'var(--shell)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, background:
          'radial-gradient(120% 60% at 50% -10%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 34 }}>
            <window.ViperMark size={68} />
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 30, color: 'var(--on-shell)', marginTop: 16, letterSpacing: '-.01em' }}>ViperOne <span style={{ color: 'var(--accent)' }}>Guard</span></div>
            <div style={{ color: 'var(--on-shell-dim)', fontSize: 13.5, marginTop: 7, fontWeight: 500 }}>Secure field access for authorized officers</div>
          </div>
          <Field icon="user" label="Employee ID / Email" value={id} onChange={setId} />
          <div style={{ height: 13 }} />
          <Field icon="lock" label="Password" value={pw} onChange={setPw} type={show ? 'text' : 'password'}
            trailing={<button className="btn" onClick={() => setShow(s => !s)} style={{ background: 'none', color: 'var(--on-shell-dim)' }}>
              <Icon name={show ? 'eyeOff' : 'eye'} size={19} /></button>} />
          <div style={{ textAlign: 'right', margin: '11px 2px 20px' }}>
            <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>Forgot password?</span>
          </div>
          <button className="btn btn-block btn-accent btn-lg" onClick={submit} disabled={busy}>
            {busy ? <Spinner /> : <>Secure Login<Icon name="chevron" size={19} /></>}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--shell-line)' }} />
            <span style={{ color: 'var(--on-shell-faint)', fontSize: 11.5, fontWeight: 600, letterSpacing: '.08em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--shell-line)' }} />
          </div>
          <button className="btn btn-block btn-ghost-shell btn-lg" onClick={submit}>
            <Icon name="faceid" size={22} color="var(--accent)" />Sign in with Face ID
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '18px', color: 'var(--on-shell-faint)', fontSize: 11.5, position: 'relative' }}>
          <Icon name="lock" size={12} style={{ verticalAlign: '-2px', marginRight: 5 }} />Encrypted connection · ViperOne Security
        </div>
      </div>
    );
  }
  function Field({ icon, label, value, onChange, type = 'text', trailing }) {
    return (
      <label style={{ display: 'block' }}>
        <div style={{ color: 'var(--on-shell-dim)', fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em',
          textTransform: 'uppercase', marginBottom: 8, marginLeft: 2 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, height: 54, padding: '0 14px',
          background: 'var(--shell-3)', border: '1px solid var(--shell-line)', borderRadius: 'var(--r-btn)' }}>
          <Icon name={icon} size={19} color="var(--on-shell-faint)" />
          <input value={value} onChange={e => onChange(e.target.value)} type={type}
            style={{ flex: 1, background: 'none', border: 0, outline: 'none', color: 'var(--on-shell)',
              fontSize: 15.5, fontFamily: 'var(--font-body)', fontWeight: 500 }} />
          {trailing}
        </div>
      </label>
    );
  }
  function Spinner({ color = '#fff', size = 20 }) {
    return <span style={{ width: size, height: size, borderRadius: 999, border: `2.5px solid ${color}`,
      borderTopColor: 'transparent', display: 'inline-block', animation: 'spinner .7s linear infinite' }} />;
  }

  /* ============================ HOME ============================ */
  const PRIMARY = (A, set) => ({
    assigned:   { label: 'Accept Job',          icon: 'check',    tone: 'accent', do: () => A.go('jobDetail') },
    accepted:   { label: 'Navigate to Site',    icon: 'navigate', tone: 'accent', do: () => { set('enroute'); A.toast({ msg: 'Navigation started · 0.6 mi to North Gate', icon: 'navigate', tone: 'info' }); } },
    enroute:    { label: 'Verify Location',     icon: 'target',   tone: 'accent', do: () => A.go('clockin') },
    arrived:    { label: 'Verify Location',     icon: 'target',   tone: 'accent', do: () => A.go('clockin') },
    verified:   { label: 'Clock In',            icon: 'clock',    tone: 'ok',     do: () => A.go('clockin') },
    clocked_in: { label: 'Go to Active Shift',  icon: 'play',     tone: 'ok',     do: () => A.go('shift') },
    patrol:     { label: 'Continue Patrol',     icon: 'route',    tone: 'ok',     do: () => A.go('shift') },
    completed:  { label: 'View Shift Summary',  icon: 'checkCircle', tone: 'accent', do: () => A.go('clockout') },
  });

  function HomeScreen({ A, status, data, counts }) {
    const p = PRIMARY(A, A.setStatus)[status];
    return (
      <div className="scroll screen-in">
        {/* greeting bar */}
        <div style={{ background: 'var(--shell)', padding: '4px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--shell-3)', border: '1px solid var(--shell-line)',
              display: 'grid', placeItems: 'center', color: 'var(--on-shell)', fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 17 }}>MC</div>
            <div style={{ flex: 1 }}>
              <div className="t-eyebrow" style={{ color: 'var(--on-shell-dim)' }}>Good morning</div>
              <div className="t-h2" style={{ color: 'var(--on-shell)', marginTop: 3 }}>Officer Carter</div>
            </div>
            <button className="btn" onClick={() => A.go('messages')} style={{ width: 44, height: 44, borderRadius: 13,
              background: 'var(--shell-3)', border: '1px solid var(--shell-line)', color: 'var(--on-shell)', position: 'relative' }}>
              <Icon name="chat" size={21} />
              <span style={{ position: 'absolute', top: 8, right: 9, width: 9, height: 9, borderRadius: 999, background: 'var(--danger)', border: '2px solid var(--shell)' }} />
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--shell)', padding: '0 16px 22px', borderRadius: '0 0 28px 28px' }}>
          <div onClick={() => A.go('jobDetail')} style={{ cursor: 'pointer' }}>
            <ShiftCard site={data.site} address={data.address} client={data.client} time={data.shift} distance={data.distance} status={status} />
          </div>
          <div style={{ marginTop: 14 }}>
            <PrimaryActionButton label={p.label} icon={p.icon} tone={p.tone} onClick={p.do}
              sub={status === 'assigned' ? 'Tap to review post orders & accept' : status === 'verified' ? 'You are inside the approved zone' : null} />
          </div>
        </div>

        <div style={{ padding: '20px 16px 24px' }}>
          <Section title="Shift Operations">
            <QuickActionGrid>
              <QuickAction icon="route" label="Checkpoints" tone="ok" onClick={() => A.go('patrol')} />
              <QuickAction icon="list" label="Tasks" tone="accent" badge={counts.tasks} onClick={() => A.go('shift')} />
              <QuickAction icon="alert" label="Incidents" tone="warn" badge={counts.incidents} onClick={() => A.go('reports')} />
              <QuickAction icon="chat" label="Messages" tone="info" badge={counts.messages} onClick={() => A.go('messages')} />
            </QuickActionGrid>
          </Section>

          <Section title="Site Briefing" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: 15 }}>
              <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'color-mix(in srgb, var(--accent) 13%, transparent)',
                  display: 'grid', placeItems: 'center', color: 'var(--accent)', flex: '0 0 38px' }}><Icon name="flag" size={20} /></div>
                <div style={{ flex: 1 }}>
                  <div className="t-h3" style={{ color: 'var(--ink)' }}>Post Orders · North Gate</div>
                  <div style={{ color: 'var(--ink-dim)', fontSize: 13, marginTop: 3, lineHeight: 1.45 }}>
                    Maintain access control at the main vehicle gate. Log all contractor entries after 09:00.</div>
                </div>
              </div>
              <button className="btn btn-block btn-ghost-light btn-md" style={{ marginTop: 13 }} onClick={() => A.go('jobDetail')}>
                View full briefing<Icon name="chevron" size={16} /></button>
            </div>
          </Section>

          <Section title="Supervisor" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--card-2)', display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--ink-dim)' }}>DB</div>
              <div style={{ flex: 1 }}>
                <div className="t-h3" style={{ color: 'var(--ink)' }}>Daniel Brooks</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 1 }}>Field Supervisor · On duty</div>
              </div>
              <button className="btn" onClick={() => A.toast({ msg: 'Calling Daniel Brooks…', icon: 'phone', tone: 'info' })}
                style={{ width: 44, height: 44, borderRadius: 12, background: 'color-mix(in srgb, var(--ok) 14%, transparent)', color: 'var(--ok)' }}><Icon name="phone" size={20} /></button>
              <button className="btn" onClick={() => A.go('messages')}
                style={{ width: 44, height: 44, borderRadius: 12, background: 'color-mix(in srgb, var(--accent) 13%, transparent)', color: 'var(--accent)' }}><Icon name="chat" size={20} /></button>
            </div>
          </Section>
        </div>
      </div>
    );
  }

  /* ============================ JOB DETAIL ============================ */
  function JobDetailScreen({ A, status, data, night }) {
    const accepted = status !== 'assigned';
    const checklist = [
      { t: 'Arrive at site', done: ['arrived', 'verified', 'clocked_in', 'patrol', 'completed'].includes(status) },
      { t: 'Verify GPS location', done: ['verified', 'clocked_in', 'patrol', 'completed'].includes(status) },
      { t: 'Take clock-in photo', done: ['clocked_in', 'patrol', 'completed'].includes(status) },
      { t: 'Complete assigned patrol route', done: ['completed'].includes(status) },
      { t: 'Submit daily activity report', done: ['completed'].includes(status) },
    ];
    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="Assigned Job" title="Job Detail" onBack={() => A.go('home')}
          right={<StatusBadge status={status} on="shell" />} />
        <div style={{ padding: '4px 16px 120px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <MapView height={150} inside={false} dark={night} radius="0" />
            <div style={{ padding: 16 }}>
              <div className="t-h1" style={{ color: 'var(--ink)', fontSize: 22 }}>{data.site}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 7, color: 'var(--ink-dim)', fontSize: 13.5 }}>
                <Icon name="pin" size={15} color="var(--ink-faint)" />{data.address}</div>
              <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
                <button className="btn btn-md btn-outline" style={{ flex: 1 }} onClick={() => A.toast({ msg: 'Opening Maps…', icon: 'navigate', tone: 'info' })}>
                  <Icon name="navigate" size={17} />Open Maps</button>
                <button className="btn btn-md btn-ghost-light" style={{ flex: 1 }} onClick={() => A.toast({ msg: 'Calling Daniel Brooks…', icon: 'phone', tone: 'info' })}>
                  <Icon name="phone" size={17} />Supervisor</button>
              </div>
            </div>
          </div>

          {/* meta rows */}
          <div className="card" style={{ marginTop: 14, padding: '4px 16px' }}>
            <InfoRow icon="building" label="Client" value={data.client} />
            <InfoRow icon="clock" label="Shift Window" value={data.shift} mono />
            <InfoRow icon="target" label="Required Arrival" value="07:50" mono />
            <InfoRow icon="user" label="Supervisor" value="Daniel Brooks" last />
          </div>

          {/* post orders */}
          <Section title="Post Orders" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: 16, color: 'var(--ink-dim)', fontSize: 13.5, lineHeight: 1.55 }}>
              <p style={{ margin: '0 0 10px' }}>Maintain access control at the main vehicle gate. Verify contractor credentials and log all entries after 09:00.</p>
              <p style={{ margin: 0 }}>Conduct foot patrol of the parking structure every two hours. Report any unsecured doors or suspicious activity to the supervisor immediately.</p>
            </div>
          </Section>

          {/* checklist */}
          <Section title="Required Actions" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: '6px 16px' }}>
              {checklist.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                  borderBottom: i < checklist.length - 1 ? '1px solid var(--card-line)' : 'none' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 999, flex: '0 0 26px', display: 'grid', placeItems: 'center',
                    background: c.done ? 'var(--ok)' : 'transparent', border: c.done ? 'none' : '2px solid var(--card-line)' }}>
                    {c.done && <Icon name="check" size={15} stroke={3} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: c.done ? 'var(--ink-faint)' : 'var(--ink)',
                    textDecoration: c.done ? 'line-through' : 'none' }}>{c.t}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* sticky CTA */}
        <StickyBar>
          {accepted
            ? <button className="btn btn-block btn-ok btn-lg" onClick={() => A.go('clockin')}><Icon name="target" size={20} />Verify Location & Clock In</button>
            : <div style={{ display: 'flex', gap: 11 }}>
                <button className="btn btn-ghost-light btn-lg" style={{ flex: '0 0 120px' }} onClick={() => A.toast({ msg: 'Job declined — supervisor notified', icon: 'x', tone: 'danger' })}>Decline</button>
                <button className="btn btn-accent btn-lg" style={{ flex: 1 }} onClick={() => { A.setStatus('accepted'); A.toast({ msg: 'Job accepted · North Gate Plaza', icon: 'check' }); A.go('home'); }}>
                  <Icon name="check" size={20} />Accept Job</button>
              </div>}
        </StickyBar>
      </div>
    );
  }
  function InfoRow({ icon, label, value, mono, last }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0',
        borderBottom: last ? 'none' : '1px solid var(--card-line)' }}>
        <Icon name={icon} size={18} color="var(--ink-faint)" />
        <span style={{ flex: 1, color: 'var(--ink-dim)', fontSize: 13.5, fontWeight: 500 }}>{label}</span>
        <span className={mono ? 't-mono' : ''} style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-title)', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{value}</span>
      </div>
    );
  }
  function StickyBar({ children }) {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 16px 18px',
        background: 'linear-gradient(to top, var(--shell) 72%, transparent)', zIndex: 20 }}>{children}</div>
    );
  }

  /* ============================ CLOCK-IN / GPS ============================ */
  function ClockInScreen({ A, data, night }) {
    const [inside, setInside] = useState(false);   // start outside, then "move closer" -> inside
    const [photo, setPhoto] = useState(false);
    const [acc, setAcc] = useState(14);
    useEffect(() => {
      const t1 = setTimeout(() => { setInside(true); setAcc(5); }, 2600);
      return () => clearTimeout(t1);
    }, []);
    const canClock = inside && photo;
    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="Compliance" title="GPS Verification" onBack={() => A.go('home')} />
        <div style={{ padding: '4px 16px 130px' }}>
          {/* map */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <MapView height={230} inside={inside} dark={night} radius="0" accuracy={inside ? 5 : 12} />
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
                <Pill icon="signal" tone={acc <= 8 ? 'ok' : 'warn'}>±{acc} m</Pill>
                <Pill icon="clock" tone="neutral">{new Date().toTimeString().slice(0, 5)}</Pill>
              </div>
            </div>
            {/* verification banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 15,
              background: inside ? 'color-mix(in srgb, var(--ok) 12%, var(--card))' : 'color-mix(in srgb, var(--warn) 13%, var(--card))' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flex: '0 0 40px', display: 'grid', placeItems: 'center',
                background: inside ? 'var(--ok)' : 'var(--warn)', color: '#fff' }}>
                <Icon name={inside ? 'checkCircle' : 'navigate'} size={22} stroke={2.4} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="t-h3" style={{ color: inside ? 'var(--ok)' : 'var(--warn)' }}>{inside ? 'Inside approved location' : 'Move closer to the site'}</div>
                <div style={{ color: 'var(--ink-dim)', fontSize: 12.5, marginTop: 2 }}>
                  {inside ? 'You are within the 75 m geofence at North Gate' : 'You are 40 m outside the geofence radius'}</div>
              </div>
              {!inside && <Spinner color="var(--warn)" size={18} />}
            </div>
          </div>

          {/* photo capture */}
          <Section title="Clock-In Photo" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: 16 }}>
              <div onClick={() => setPhoto(true)} style={{ height: 150, borderRadius: 'var(--r-sm)', cursor: 'pointer',
                background: photo ? 'var(--shell-3)' : 'var(--card-2)', border: photo ? 'none' : '2px dashed var(--card-line)',
                display: 'grid', placeItems: 'center', overflow: 'hidden', position: 'relative' }}>
                {photo
                  ? <div style={{ textAlign: 'center', color: 'var(--on-shell)' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--ok)', display: 'grid', placeItems: 'center', margin: '0 auto' }}>
                        <Icon name="check" size={28} stroke={3} color="#fff" /></div>
                      <div style={{ marginTop: 10, fontWeight: 700, fontFamily: 'var(--font-title)', fontSize: 14 }}>Photo captured</div>
                      <div className="t-mono" style={{ fontSize: 11.5, color: 'var(--on-shell-dim)', marginTop: 3 }}>{new Date().toTimeString().slice(0, 8)} · geotagged</div>
                    </div>
                  : <div style={{ textAlign: 'center', color: 'var(--ink-faint)' }}>
                      <Icon name="camera" size={34} /><div style={{ marginTop: 8, fontWeight: 600, fontSize: 13.5 }}>Tap to capture verification photo</div></div>}
              </div>
              <button className={`btn btn-block btn-md ${photo ? 'btn-ghost-light' : 'btn-accent'}`} style={{ marginTop: 13 }} onClick={() => setPhoto(true)}>
                <Icon name="camera" size={18} />{photo ? 'Retake Photo' : 'Take Clock-In Photo'}</button>
            </div>
          </Section>

          {/* requirements */}
          <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
            <ReqPill ok={inside} label="GPS verified" />
            <ReqPill ok={photo} label="Photo captured" />
          </div>
        </div>

        <StickyBar>
          <button className="btn btn-block btn-lg btn-ok" disabled={!canClock}
            onClick={() => { A.setStatus('clocked_in'); A.toast({ msg: 'Clocked in · 08:02 · North Gate Plaza', icon: 'checkCircle' }); A.go('shift'); }}>
            <Icon name="clock" size={20} />{canClock ? 'Clock In Now' : inside ? 'Capture photo to clock in' : 'Verifying location…'}</button>
        </StickyBar>
      </div>
    );
  }
  function Pill({ icon, tone = 'neutral', children }) {
    const c = window.TONE[tone].c;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 999,
        background: 'rgba(8,14,26,.72)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
        <Icon name={icon} size={13} color={c} />{children}</span>
    );
  }
  function ReqPill({ ok, label }) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 13px', borderRadius: 'var(--r-sm)',
        background: ok ? 'color-mix(in srgb, var(--ok) 12%, var(--card))' : 'var(--card)', border: `1px solid ${ok ? 'color-mix(in srgb, var(--ok) 35%, transparent)' : 'var(--card-line)'}` }}>
        <div style={{ width: 22, height: 22, borderRadius: 999, display: 'grid', placeItems: 'center',
          background: ok ? 'var(--ok)' : 'transparent', border: ok ? 'none' : '2px solid var(--card-line)' }}>
          {ok && <Icon name="check" size={13} stroke={3} color="#fff" />}</div>
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-title)', color: ok ? 'var(--ink)' : 'var(--ink-faint)' }}>{label}</span>
      </div>
    );
  }

  Object.assign(window, { LoginScreen, HomeScreen, JobDetailScreen, ClockInScreen, Spinner, StickyBar });
})();
