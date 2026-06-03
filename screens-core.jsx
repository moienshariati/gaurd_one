// screens-core.jsx — Landing, SignIn, Home, JobDetail, ClockIn, Supervisor, Client. Requires components.jsx.
(function () {
  const { useState, useEffect, useRef } = React;
  const { Icon, Logo, StatusBadge, ShiftCard, PrimaryActionButton, QuickActionGrid, QuickAction,
    AppHeader, Section, MapView, Chip } = window;

  /* ============================ LANDING ============================ */
  function LandingScreen({ A }) {
    const features = [
      { color: '#F59E0B', title: 'Company-owned tenants', desc: 'Each company keeps separate sites, staff, and clients.' },
      { color: '#22C55E', title: 'Live guard tracking',   desc: 'Clock in, location pings, geofence state, and SOS are stitched together.' },
      { color: '#3B82F6', title: 'Client transparency',   desc: 'Read-only visibility is filtered by assigned sites and policy.' },
    ];
    return (
      <div className="screen-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#07111F', overflow: 'hidden' }}>
        {/* top spacer + shield */}
        <div style={{ flex: '1 1 auto', minHeight: 0, padding: '34px 26px 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 18 }}>
            <window.ViperMark size={40} />
          </div>
          <h1 style={{ margin: '0 0 12px', fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 28,
            color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-.02em' }}>
            One tenant-aware control room for guards, companies, and clients.
          </h1>
          <p style={{ margin: '0 0 20px', color: '#7C8CA8', fontSize: 13.5, lineHeight: 1.55, fontWeight: 400 }}>
            Role-aware dashboards, active shift tracking, geofence awareness, and client visibility all run in the same platform.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: f.color, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-title)' }}>{f.title}</div>
                  <div style={{ color: '#7C8CA8', fontSize: 12.5, marginTop: 2, lineHeight: 1.45 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom sign-in card */}
        <div style={{ margin: '18px 0 0', background: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '22px 24px 30px', flex: '0 0 auto' }}>
          <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 19, color: '#0F172A', marginBottom: 6 }}>
            Multi-role sign in
          </div>
          <div style={{ color: '#64748B', fontSize: 13.5, marginBottom: 22, lineHeight: 1.5 }}>
            Use a company code and one of the seeded accounts to access the platform.
          </div>
          <button className="btn btn-block btn-lg" onClick={() => A.go('signin')}
            style={{ background: '#2563EB', color: '#fff', borderRadius: 14, fontSize: 16, fontWeight: 700, boxShadow: '0 8px 24px -6px rgba(37,99,235,.45)' }}>
            Open ViperOne
          </button>
        </div>
      </div>
    );
  }

  /* ============================ SIGN IN ============================ */
  function SignInScreen({ A, role, homeScreen }) {
    const [company, setCompany] = useState('viper-demo');
    const [selectedRole, setSelectedRole] = useState(role || 'guard');
    const [guardId, setGuardId] = useState('michael.carter');
    const [pin, setPin] = useState('••••');
    const [busy, setBusy] = useState(false);

    const roles = [
      { id: 'guard', label: 'Guard' },
      { id: 'supervisor', label: 'Supervisor' },
      { id: 'client', label: 'Client' },
    ];

    const fieldLabel = selectedRole === 'guard' ? 'Guard ID' : selectedRole === 'supervisor' ? 'Supervisor ID' : 'Client Account';
    const pinLabel   = selectedRole === 'client' ? 'Access Code' : 'PIN';

    const submit = () => {
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        A.setRole(selectedRole);
        A.go(selectedRole === 'supervisor' ? 'sup-home' : selectedRole === 'client' ? 'client-home' : 'home');
      }, 800);
    };

    return (
      <div className="scroll screen-in" style={{ background: '#F2F4F8', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px 14px',
          background: '#FFFFFF', borderBottom: '1px solid #E8ECF2' }}>
          <button className="btn" onClick={() => A.go('landing')}
            style={{ width: 38, height: 38, borderRadius: 11, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}>
            <Icon name="chevron" size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 17, color: '#0F172A' }}>Multi-role sign in</div>
          </div>
          <window.ViperMark size={28} />
        </div>

        <div style={{ padding: '22px 20px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* company code */}
          <SignInField label="Company code" icon="building" value={company} onChange={setCompany} />

          {/* role tabs */}
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', letterSpacing: '.06em',
              textTransform: 'uppercase', marginBottom: 10 }}>Sign in as</div>
            <div style={{ display: 'flex', gap: 8, background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 14, padding: 6 }}>
              {roles.map(r => (
                <button key={r.id} onClick={() => setSelectedRole(r.id)}
                  className="btn" style={{ flex: 1, height: 40, borderRadius: 10, fontSize: 14, fontWeight: 700,
                    background: selectedRole === r.id ? '#2563EB' : 'transparent',
                    color: selectedRole === r.id ? '#FFFFFF' : '#64748B',
                    transition: 'background .15s, color .15s' }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* credentials */}
          <SignInField label={fieldLabel} icon="user" value={guardId} onChange={setGuardId} />
          <SignInField label={pinLabel} icon="lock" value={pin} onChange={setPin} type="password" />

          {/* submit */}
          <button className="btn btn-block btn-lg" onClick={submit} disabled={busy}
            style={{ marginTop: 8, background: '#2563EB', color: '#fff', borderRadius: 14, height: 54, fontSize: 16,
              fontWeight: 700, boxShadow: '0 8px 24px -6px rgba(37,99,235,.4)' }}>
            {busy ? <Spinner /> : 'Sign in'}
          </button>

          <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 12.5, marginTop: 4 }}>
            <Icon name="lock" size={12} style={{ verticalAlign: '-2px', marginRight: 5 }} />
            Encrypted · ViperOne Security Platform
          </div>
        </div>
      </div>
    );
  }

  function SignInField({ label, icon, value, onChange, type = 'text' }) {
    return (
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', letterSpacing: '.06em',
          textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 54, padding: '0 16px',
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
          <Icon name={icon} size={18} color="#94A3B8" />
          <input value={value} onChange={e => onChange(e.target.value)} type={type}
            style={{ flex: 1, background: 'none', border: 0, outline: 'none',
              color: '#0F172A', fontSize: 15.5, fontFamily: 'var(--font-body)', fontWeight: 500 }} />
        </div>
      </div>
    );
  }

  /* Legacy Field component kept for ClockIn screen */
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
  // PRD 8.1: Guard logs in → sees assigned shift → clocks in
  function HomeScreen({ A, data, counts, onClockIn, onSchedule }) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return (
      <div className="scroll screen-in">
        {/* greeting */}
        <div style={{ background: 'var(--shell)', padding: '4px 18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--shell-3)', border: '1px solid var(--shell-line)',
              display: 'grid', placeItems: 'center', fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 17, color: 'var(--on-shell)' }}>MC</div>
            <div style={{ flex: 1 }}>
              <div className="t-eyebrow" style={{ color: 'var(--on-shell-dim)' }}>{greeting}</div>
              <div className="t-h2" style={{ color: 'var(--on-shell)', marginTop: 3 }}>Officer Carter</div>
            </div>
            <button className="btn" aria-label="Log out" onClick={() => A.go('signin')} style={{ width: 44, height: 44, borderRadius: 13,
              background: 'var(--shell-3)', border: '1px solid var(--shell-line)', color: 'var(--on-shell)' }}>
              <Icon name="x" size={19} />
            </button>
          </div>
        </div>

        {/* assigned shift card + clock-in CTA */}
        <div style={{ background: 'var(--shell)', padding: '0 16px 22px', borderRadius: '0 0 28px 28px' }}>
          <ShiftCard site={data.site} address={data.address} client={data.client} time={data.shift} distance={data.distance} status="assigned" />
          <div style={{ marginTop: 14 }}>
            <PrimaryActionButton label="Clock In" icon="clock" tone="ok" onClick={onClockIn}
              sub="Tap to verify location and start your shift" />
          </div>
        </div>

        {/* quick actions — PRD: patrol, incidents, messages, I'm Alive */}
        <div style={{ padding: '20px 16px 24px' }}>
          <Section title="Shift Operations">
            <QuickActionGrid>
              <QuickAction icon="route"      label="Patrol"    tone="ok"     onClick={() => A.go('patrol')} />
              <QuickAction icon="alert"      label="Incidents" tone="warn"   badge={counts.incidents || undefined} onClick={() => A.go('reports')} />
              <QuickAction icon="heartbeat"  label="I'm Alive" tone="accent" onClick={() => A.toast({ msg: 'Safety check sent · supervisor notified', icon: 'heartbeat' })} />
              <QuickAction icon="chat"       label="Messages"  tone="info"   badge={counts.messages || undefined} onClick={() => A.go('messages')} />
            </QuickActionGrid>
          </Section>

          {/* schedule shortcut */}
          <Section title="My Schedule" style={{ marginTop: 22 }} action="View all" onAction={onSchedule}>
            <div className="card" style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={onSchedule}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'color-mix(in srgb, var(--accent) 13%, transparent)',
                display: 'grid', placeItems: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                <Icon name="clock" size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Today — {data.shift}</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 2 }}>North Gate · 3 more shifts this week</div>
              </div>
              <Icon name="chevron" size={17} color="var(--ink-faint)" />
            </div>
          </Section>

          {/* post orders — brief */}
          <Section title="Post Orders" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: 15 }}>
              <div style={{ color: 'var(--ink-dim)', fontSize: 13.5, lineHeight: 1.55 }}>
                Maintain access control at the main vehicle gate. Verify contractor credentials and log all entries after 09:00.
                Conduct foot patrol of the parking structure every two hours.
              </div>
            </div>
          </Section>

          {/* supervisor */}
          <Section title="Supervisor" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--card-2)', display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--ink-dim)' }}>DB</div>
              <div style={{ flex: 1 }}>
                <div className="t-h3" style={{ color: 'var(--ink)' }}>Daniel Brooks</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 1 }}>Field Supervisor · On duty</div>
              </div>
              <button className="btn" onClick={() => A.toast({ msg: 'Calling Daniel Brooks…', icon: 'phone', tone: 'info' })}
                style={{ width: 44, height: 44, borderRadius: 12, background: 'color-mix(in srgb, var(--ok) 14%, transparent)', color: 'var(--ok)' }}>
                <Icon name="phone" size={20} /></button>
              <button className="btn" onClick={() => A.go('messages')}
                style={{ width: 44, height: 44, borderRadius: 12, background: 'color-mix(in srgb, var(--accent) 13%, transparent)', color: 'var(--accent)' }}>
                <Icon name="chat" size={20} /></button>
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
            onClick={() => {
              A.setStatus('clocked_in');
              A.toast({ msg: `Clocked in · ${new Date().toTimeString().slice(0,5)} · North Gate Plaza`, icon: 'checkCircle' });
              A.go('shift');
            }}>
            <Icon name="clock" size={20} />{canClock ? 'Clock In Now' : inside ? 'Capture photo to clock in' : 'Verifying location…'}
          </button>
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

  /* ============================ SUPERVISOR HOME ============================ */
  function SupervisorHomeScreen({ A, incidents }) {
    const guards = [
      { id: 'MC', name: 'Michael Carter', site: 'North Gate Plaza',   status: 'clocked_in', time: '08:02', checkpoint: 'CP-4 of 8' },
      { id: 'SR', name: 'Sofia Reyes',    site: 'Eastside Mall',       status: 'patrol',     time: '07:45', checkpoint: 'CP-6 of 10' },
      { id: 'JP', name: 'James Parker',   site: 'Harbor Warehouse',    status: 'enroute',    time: '—',     checkpoint: 'ETA 08:15' },
      { id: 'AL', name: 'Amy Liu',        site: 'Central Tower',       status: 'assigned',   time: '—',     checkpoint: 'Starts 09:00' },
    ];
    const statusColor = { clocked_in: '#22C55E', patrol: '#3B82F6', enroute: '#F59E0B', assigned: '#94A3B8' };
    const statusLabel = { clocked_in: 'On site', patrol: 'On patrol', enroute: 'En route', assigned: 'Assigned' };
    const openInc = incidents.filter(i => i.status !== 'Resolved');

    return (
      <div className="scroll screen-in">
        {/* header */}
        <div style={{ padding: '10px 18px 14px', background: 'var(--shell)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--shell-3)', border: '1px solid var(--shell-line)',
              display: 'grid', placeItems: 'center', color: 'var(--accent)', fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 16 }}>DB</div>
            <div style={{ flex: 1 }}>
              <div className="t-eyebrow" style={{ color: 'var(--on-shell-dim)' }}>Supervisor</div>
              <div className="t-h2" style={{ color: 'var(--on-shell)', marginTop: 2 }}>Control Room</div>
            </div>
            <button className="btn" onClick={() => A.go('messages')}
              style={{ width: 44, height: 44, borderRadius: 13, background: 'var(--shell-3)', border: '1px solid var(--shell-line)', color: 'var(--on-shell)' }}>
              <Icon name="chat" size={21} />
            </button>
            <button className="btn" onClick={() => A.reset()}
              style={{ width: 44, height: 44, borderRadius: 13, background: 'var(--shell-3)', border: '1px solid var(--shell-line)', color: 'var(--on-shell-dim)' }}>
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ padding: '0 16px 18px', display: 'flex', gap: 10 }}>
          {[
            { label: 'Active', value: guards.filter(g => g.status === 'clocked_in' || g.status === 'patrol').length, color: 'var(--ok)' },
            { label: 'En Route', value: guards.filter(g => g.status === 'enroute').length, color: 'var(--warn)' },
            { label: 'Incidents', value: openInc.length, color: 'var(--danger)' },
          ].map(k => (
            <div key={k.label} className="card" style={{ flex: 1, padding: '13px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 26, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ color: 'var(--ink-faint)', fontSize: 12, fontWeight: 600, marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          {/* guards list */}
          <Section title="Active Personnel">
            <div className="card" style={{ padding: '4px 0' }}>
              {guards.map((g, i) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                  borderBottom: i < guards.length - 1 ? '1px solid var(--card-line)' : 'none', cursor: 'pointer' }}
                  onClick={() => A.toast({ msg: `${g.name} · ${g.site}`, icon: 'user', tone: 'info' })}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--card-2)', display: 'grid',
                    placeItems: 'center', fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 14, color: 'var(--ink-dim)', flexShrink: 0 }}>{g.id}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)', fontFamily: 'var(--font-title)' }}>{g.name}</div>
                    <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.site}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                      <div style={{ width: 7, height: 7, borderRadius: 999, background: statusColor[g.status] }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: statusColor[g.status] }}>{statusLabel[g.status]}</span>
                    </div>
                    <div style={{ color: 'var(--ink-faint)', fontSize: 11.5, marginTop: 2 }}>{g.checkpoint}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* open incidents */}
          {openInc.length > 0 && (
            <Section title="Open Incidents" style={{ marginTop: 22 }}
              action="View all" onAction={() => A.go('reports')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {openInc.slice(0, 3).map((inc, i) => (
                  <div key={i} className="card" style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: inc.severity === 'High' ? 'color-mix(in srgb, var(--danger) 14%, transparent)' : 'color-mix(in srgb, var(--warn) 14%, transparent)',
                      display: 'grid', placeItems: 'center', flexShrink: 0, color: inc.severity === 'High' ? 'var(--danger)' : 'var(--warn)' }}>
                      <Icon name="alert" size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-title)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.title}</div>
                      <div style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 2 }}>{inc.category} · {inc.time}</div>
                    </div>
                    <button className="btn btn-md btn-accent" style={{ height: 34, padding: '0 12px', fontSize: 12, borderRadius: 9 }}
                      onClick={() => A.toast({ msg: `Acknowledged: ${inc.title}`, icon: 'check', tone: 'ok' })}>
                      ACK
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* quick actions */}
          <Section title="Quick Actions" style={{ marginTop: 22 }}>
            <QuickActionGrid>
              <QuickAction icon="route"     label="Patrol Map"  tone="accent" onClick={() => A.toast({ msg: 'Live patrol map — Phase 2', icon: 'route', tone: 'info' })} />
              <QuickAction icon="list"      label="Schedule"    tone="ok"     onClick={() => A.go('sup-schedule')} />
              <QuickAction icon="clipboard" label="Reports"     tone="warn"   badge={openInc.length} onClick={() => A.go('reports')} />
              <QuickAction icon="chat"      label="Messages"    tone="info"   onClick={() => A.go('messages')} />
            </QuickActionGrid>
          </Section>
        </div>
      </div>
    );
  }

  /* ============================ CLIENT HOME ============================ */
  function ClientHomeScreen({ A, incidents, data }) {
    const recentInc = incidents.slice(0, 3);
    return (
      <div className="scroll screen-in">
        {/* header */}
        <div style={{ padding: '10px 18px 16px', background: 'var(--shell)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
              display: 'grid', placeItems: 'center', color: 'var(--accent)', flexShrink: 0 }}>
              <Icon name="building" size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-eyebrow" style={{ color: 'var(--on-shell-dim)' }}>Client Portal</div>
              <div className="t-h2" style={{ color: 'var(--on-shell)', marginTop: 2 }}>{data.client}</div>
            </div>
            <button className="btn" onClick={() => A.reset()}
              style={{ width: 44, height: 44, borderRadius: 13, background: 'var(--shell-3)', border: '1px solid var(--shell-line)', color: 'var(--on-shell-dim)' }}>
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          {/* site card */}
          <div className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'color-mix(in srgb, var(--ok) 14%, transparent)',
              display: 'grid', placeItems: 'center', color: 'var(--ok)', flexShrink: 0 }}>
              <Icon name="shield" size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)' }}>{data.site}</div>
              <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 3 }}>{data.address}</div>
            </div>
          </div>

          {/* live status */}
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            {[
              { label: 'Guards On Site', value: '1', color: 'var(--ok)' },
              { label: 'Shift Hours', value: data.shift, color: 'var(--accent)' },
              { label: 'Open Incidents', value: incidents.filter(i => i.status !== 'Resolved').length, color: incidents.some(i => i.severity === 'High' && i.status !== 'Resolved') ? 'var(--danger)' : 'var(--warn)' },
            ].map(k => (
              <div key={k.label} className="card" style={{ flex: 1, padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: k.value.toString().length > 4 ? 14 : 22, color: k.color, lineHeight: 1 }}>{k.value}</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 11, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* recent incidents — read only */}
          <Section title="Recent Incidents" style={{ marginTop: 22 }} action="View all" onAction={() => {}}>
            {recentInc.length === 0
              ? <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--ink-faint)', fontSize: 14 }}>No incidents reported</div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recentInc.map((inc, i) => (
                    <div key={i} className="card" style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-title)' }}>{inc.title}</div>
                          <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 3 }}>{inc.category} · {inc.time}</div>
                        </div>
                        <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--font-title)',
                          background: inc.status === 'Resolved' ? 'color-mix(in srgb, var(--ok) 15%, transparent)' : 'color-mix(in srgb, var(--warn) 15%, transparent)',
                          color: inc.status === 'Resolved' ? 'var(--ok)' : 'var(--warn)' }}>{inc.status}</span>
                      </div>
                    </div>
                  ))}
                </div>}
          </Section>

          {/* download reports */}
          <Section title="Reports" style={{ marginTop: 22 }}>
            <div className="card" style={{ padding: 16 }}>
              {['Daily Activity Report', 'Patrol Completion Summary', 'Incident Log — This Month'].map((r, i, arr) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--card-line)' : 'none' }}>
                  <Icon name="clipboard" size={18} color="var(--accent)" />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{r}</span>
                  <button className="btn btn-md btn-outline" style={{ height: 32, padding: '0 12px', fontSize: 12 }}
                    onClick={() => A.toast({ msg: `Downloading ${r}…`, icon: 'download', tone: 'info' })}>
                    <Icon name="download" size={14} />PDF
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    );
  }

  /* ============================ SCHEDULE (FR-20/21/23) ============================ */
  function ScheduleScreen({ A }) {
    const today = new Date();
    const shifts = [
      { date: today, site: 'North Gate Commercial Plaza', address: '1450 Gateway Blvd', time: '08:00 – 16:00', status: 'today',    client: 'US Security Svc' },
      { date: new Date(today.getTime() + 86400000),     site: 'Eastside Mall',               address: '230 Mall Dr',         time: '10:00 – 18:00', status: 'upcoming', client: 'Eastside Retail' },
      { date: new Date(today.getTime() + 2*86400000),   site: 'Harbor Warehouse',             address: '88 Dock Ave',         time: '22:00 – 06:00', status: 'upcoming', client: 'Harbor Logistics' },
      { date: new Date(today.getTime() + 3*86400000),   site: 'North Gate Commercial Plaza',  address: '1450 Gateway Blvd',   time: '08:00 – 16:00', status: 'upcoming', client: 'US Security Svc' },
      { date: new Date(today.getTime() - 86400000),     site: 'Central Tower',                address: '1 Main St',           time: '08:00 – 16:00', status: 'completed', client: 'Metro Properties' },
      { date: new Date(today.getTime() - 2*86400000),   site: 'Eastside Mall',                address: '230 Mall Dr',         time: '14:00 – 22:00', status: 'completed', client: 'Eastside Retail' },
    ];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const fmtDate = d => `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
    const statusStyle = {
      today:     { bg: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)', label: 'Today' },
      upcoming:  { bg: 'color-mix(in srgb, var(--ok) 12%, transparent)',     color: 'var(--ok)',     label: 'Upcoming' },
      completed: { bg: 'var(--card-2)',                                        color: 'var(--ink-faint)', label: 'Completed' },
    };
    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="My Shifts" title="Schedule" onBack={() => A.go('home')} />
        <div style={{ padding: '4px 16px 32px' }}>
          {/* week summary */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[
              { n: shifts.filter(s => s.status !== 'completed').length, label: 'Upcoming', tone: 'var(--accent)' },
              { n: shifts.filter(s => s.status === 'today').length,     label: 'Today',    tone: 'var(--ok)' },
              { n: shifts.filter(s => s.status === 'completed').length, label: 'Done',     tone: 'var(--ink-faint)' },
            ].map(k => (
              <div key={k.label} className="card" style={{ flex: 1, padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 24, color: k.tone, lineHeight: 1 }}>{k.n}</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 12, fontWeight: 600, marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* shift list */}
          {shifts.map((s, i) => {
            const st = statusStyle[s.status];
            const isNight = s.time.startsWith('22') || s.time.startsWith('00');
            return (
              <div key={i} className="card" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {/* date block */}
                  <div style={{ width: 50, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
                      {s.date.getDate()}
                    </div>
                    <div style={{ color: 'var(--ink-faint)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>
                      {months[s.date.getMonth()]}
                    </div>
                    <div style={{ color: 'var(--ink-faint)', fontSize: 11, marginTop: 1 }}>{days[s.date.getDay()]}</div>
                  </div>
                  <div style={{ width: 1, background: 'var(--card-line)', alignSelf: 'stretch', marginRight: 4, flexShrink: 0 }} />
                  {/* shift info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', flex: 1, minWidth: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.site}</div>
                      <span style={{ padding: '3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--font-title)',
                        background: st.bg, color: st.color, flexShrink: 0 }}>{st.label}</span>
                    </div>
                    <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon name="pin" size={12} />{s.address}
                    </div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12.5 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        <Icon name="clock" size={13} color="var(--ink-faint)" />{s.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-dim)' }}>
                        <Icon name="building" size={13} color="var(--ink-faint)" />{s.client}
                      </span>
                    </div>
                  </div>
                </div>
                {s.status === 'today' && (
                  <button className="btn btn-block btn-ok btn-md" style={{ marginTop: 14 }} onClick={() => A.go('clockin')}>
                    <Icon name="clock" size={17} />Clock In Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ============================ SUPERVISOR SCHEDULE (FR-20/21/22) ============================ */
  function SupervisorScheduleScreen({ A }) {
    const guards = [
      { id: 'MC', name: 'Michael Carter', site: 'North Gate Commercial Plaza', time: '08:00–16:00', status: 'on-shift' },
      { id: 'SR', name: 'Sofia Reyes',    site: 'Eastside Mall',               time: '10:00–18:00', status: 'on-shift' },
      { id: 'JP', name: 'James Parker',   site: 'Harbor Warehouse',            time: '22:00–06:00', status: 'upcoming' },
      { id: 'AL', name: 'Amy Liu',        site: 'Central Tower',               time: '08:00–16:00', status: 'upcoming' },
      { id: 'TN', name: 'Tom Nguyen',     site: '— Unassigned —',              time: '—',           status: 'unassigned' },
    ];
    const sites = ['North Gate Commercial Plaza', 'Eastside Mall', 'Harbor Warehouse', 'Central Tower', 'Riverside Office Park'];
    const [assignments, setAssignments] = useState({});
    const statusColor = { 'on-shift': 'var(--ok)', 'upcoming': 'var(--accent)', 'unassigned': 'var(--warn)' };
    const statusLabel = { 'on-shift': 'On Shift', 'upcoming': 'Scheduled', 'unassigned': 'Unassigned' };

    return (
      <div className="scroll screen-in">
        <AppHeader eyebrow="Supervisor" title="Schedule & Assignments" onBack={() => A.go('sup-home')} />
        <div style={{ padding: '4px 16px 32px' }}>
          {/* summary row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[
              { n: guards.filter(g => g.status === 'on-shift').length,  label: 'On Shift',  c: 'var(--ok)' },
              { n: guards.filter(g => g.status === 'upcoming').length,  label: 'Scheduled', c: 'var(--accent)' },
              { n: guards.filter(g => g.status === 'unassigned').length,label: 'Unassigned',c: 'var(--warn)' },
            ].map(k => (
              <div key={k.label} className="card" style={{ flex: 1, padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 24, color: k.c, lineHeight: 1 }}>{k.n}</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>

          <Section title="Guard Assignments — Today">
            <div className="card" style={{ padding: '4px 0' }}>
              {guards.map((g, i) => (
                <div key={g.id} style={{ padding: '14px 16px', borderBottom: i < guards.length - 1 ? '1px solid var(--card-line)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center',
                      background: 'var(--card-2)', fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 13, color: 'var(--ink-dim)' }}>{g.id}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>{g.name}</div>
                      <div style={{ color: 'var(--ink-faint)', fontSize: 12.5, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 999, background: statusColor[g.status], display: 'inline-block', flexShrink: 0 }} />
                        {statusLabel[g.status]}
                        {g.time !== '—' && <span className="t-mono" style={{ fontSize: 11.5 }}>· {g.time}</span>}
                      </div>
                    </div>
                    {g.status === 'unassigned'
                      ? <button className="btn btn-md btn-accent" style={{ height: 34, padding: '0 12px', fontSize: 12, borderRadius: 9 }}
                          onClick={() => A.toast({ msg: `Assigning ${g.name}…`, icon: 'check', tone: 'info' })}>Assign</button>
                      : <button className="btn btn-md btn-ghost-light" style={{ height: 34, padding: '0 12px', fontSize: 12, borderRadius: 9 }}
                          onClick={() => A.toast({ msg: `Edit shift for ${g.name}`, icon: 'list', tone: 'info' })}>Edit</button>
                    }
                  </div>
                  {/* assignment picker — show for unassigned */}
                  {g.status === 'unassigned' && assignments[g.id] !== undefined && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {sites.map(s => (
                        <button key={s} className="btn" onClick={() => { setAssignments(a => ({ ...a, [g.id]: s })); A.toast({ msg: `${g.name} → ${s}`, icon: 'check', tone: 'ok' }); }}
                          style={{ height: 30, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                            background: assignments[g.id] === s ? 'var(--accent)' : 'var(--card-2)',
                            color: assignments[g.id] === s ? '#fff' : 'var(--ink-dim)',
                            border: '1px solid var(--card-line)' }}>{s.split(' ').slice(0,2).join(' ')}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          <button className="btn btn-block btn-lg btn-ghost-shell" style={{ marginTop: 20 }}
            onClick={() => A.toast({ msg: 'Schedule notifications sent to all guards', icon: 'send', tone: 'ok' })}>
            <Icon name="send" size={18} />Notify All Guards
          </button>
        </div>
      </div>
    );
  }

  Object.assign(window, { LandingScreen, SignInScreen, LoginScreen: LandingScreen, HomeScreen, ScheduleScreen, ClockInScreen, SupervisorHomeScreen, SupervisorScheduleScreen, ClientHomeScreen, Spinner, StickyBar });
})();
