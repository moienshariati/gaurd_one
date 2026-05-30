// components.jsx — ViperOne reusable mobile UI. Requires icons.jsx loaded first.
(function () {
  const { Icon } = window;

  /* ----- status semantics ----- */
  const TONE = {
    ok:      { c: 'var(--ok)' },
    info:    { c: 'var(--info)' },
    accent:  { c: 'var(--accent)' },
    warn:    { c: 'var(--warn)' },
    danger:  { c: 'var(--danger)' },
    neutral: { c: 'var(--ink-faint)' },
  };
  const STATUS = {
    assigned:   { label: 'Job Assigned',      tone: 'info',    icon: 'clipboard' },
    accepted:   { label: 'Job Accepted',      tone: 'accent',  icon: 'check' },
    enroute:    { label: 'En Route',          tone: 'info',    icon: 'navigate' },
    arrived:    { label: 'Arrived at Site',   tone: 'warn',    icon: 'pin' },
    verified:   { label: 'Location Verified', tone: 'ok',      icon: 'target' },
    clocked_in: { label: 'Clocked In',        tone: 'ok',      icon: 'clock' },
    patrol:     { label: 'Patrol Active',     tone: 'ok',      icon: 'route' },
    completed:  { label: 'Shift Completed',   tone: 'neutral', icon: 'checkCircle' },
  };

  function Dot({ tone = 'ok', size = 8, pulse }) {
    const c = TONE[tone].c;
    return (
      <span style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
        {pulse && <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: c,
          animation: 'pulseRing 1.8s ease-out infinite' }} />}
        <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: c }} />
      </span>
    );
  }

  function StatusBadge({ status, tone, label, icon, on = 'light', pulse }) {
    const meta = status ? STATUS[status] : { tone, label, icon };
    const c = TONE[meta.tone].c;
    const bg = on === 'shell'
      ? `color-mix(in srgb, ${c} 22%, transparent)`
      : `color-mix(in srgb, ${c} 13%, var(--card))`;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '6px 11px 6px 10px', borderRadius: 999, background: bg,
        border: `1px solid color-mix(in srgb, ${c} 32%, transparent)` }}>
        {pulse ? <Dot tone={meta.tone} pulse /> : (meta.icon && <Icon name={meta.icon} size={14} stroke={2.4} color={c} />)}
        <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12,
          letterSpacing: '.02em', color: c }}>{meta.label}</span>
      </span>
    );
  }

  function Chip({ children, tone = 'neutral', active, onClick, icon }) {
    const c = TONE[tone] ? TONE[tone].c : tone;
    return (
      <button onClick={onClick} className="btn" style={{
        height: 38, padding: '0 14px', borderRadius: 999,
        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5,
        background: active ? c : 'color-mix(in srgb, var(--ink) 6%, transparent)',
        color: active ? '#fff' : 'var(--ink-dim)',
        border: active ? 'none' : '1px solid var(--card-line)', gap: 6,
      }}>
        {icon && <Icon name={icon} size={15} stroke={2.2} />}
        {children}
      </button>
    );
  }

  /* ----- progress ----- */
  function ProgressBar({ value, total, tone = 'ok', height = 8 }) {
    const pct = Math.max(0, Math.min(100, (value / total) * 100));
    const c = TONE[tone].c;
    return (
      <div style={{ height, borderRadius: 999, background: 'color-mix(in srgb, var(--ink) 8%, transparent)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: c,
          transition: 'width .5s cubic-bezier(.2,.7,.3,1)' }} />
      </div>
    );
  }
  function ProgressRing({ value, total, size = 56, stroke = 6, tone = 'ok', children }) {
    const r = (size - stroke) / 2, C = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(1, value / total));
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="color-mix(in srgb, var(--ink) 10%, transparent)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={TONE[tone].c} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.7,.3,1)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>
      </div>
    );
  }

  /* ----- stylized map ----- */
  function MapView({ height = 180, inside = true, showGeofence = true, dark, radius = 'var(--r-card)', accuracy = 6, marker = true }) {
    const land = dark ? '#0E1A2E' : '#E9EEF6';
    const road = dark ? '#1B2A44' : '#FFFFFF';
    const roadEdge = dark ? '#24365400' : '#D7DEEA';
    const block = dark ? '#13223A' : '#DCE4F0';
    const geo = inside ? 'var(--ok)' : 'var(--warn)';
    return (
      <div style={{ position: 'relative', height, borderRadius: radius, overflow: 'hidden', background: land }}>
        <svg width="100%" height="100%" viewBox="0 0 390 200" preserveAspectRatio="xMidYMid slice">
          {/* blocks */}
          <g fill={block} opacity={dark ? 1 : .85}>
            <rect x="14" y="18" width="86" height="60" rx="6" />
            <rect x="120" y="10" width="70" height="48" rx="6" />
            <rect x="250" y="22" width="120" height="54" rx="6" />
            <rect x="18" y="120" width="96" height="64" rx="6" />
            <rect x="280" y="128" width="92" height="60" rx="6" />
          </g>
          {/* roads */}
          <g stroke={road} strokeWidth="16" fill="none" strokeLinecap="round">
            <path d="M-10 100 H400" />
            <path d="M110 -10 V210" />
            <path d="M245 -10 V210" />
          </g>
          <g stroke={roadEdge} strokeWidth="1" fill="none" opacity=".7">
            <path d="M-10 92 H400 M-10 108 H400" />
          </g>
          {/* dashed centerline */}
          <path d="M-10 100 H400" stroke={dark ? '#3a5482' : '#C4CEDD'} strokeWidth="1.5" strokeDasharray="7 9" fill="none" />
        </svg>
        {showGeofence && (
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            width: 150, height: 150, borderRadius: 999,
            background: `color-mix(in srgb, ${geo} 14%, transparent)`,
            border: `2px dashed color-mix(in srgb, ${geo} 70%, transparent)` }} />
        )}
        {marker && (
          <div style={{ position: 'absolute', left: '50%', top: inside ? '50%' : '74%',
            transform: 'translate(-50%,-50%)', display: 'grid', placeItems: 'center' }}>
            <div style={{ position: 'absolute', width: 30 + accuracy * 2, height: 30 + accuracy * 2, borderRadius: 999,
              background: 'color-mix(in srgb, var(--accent) 28%, transparent)' }} />
            <div style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--accent)',
              border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,.4)' }} />
          </div>
        )}
        {/* site pin */}
        {showGeofence && (
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-130%)' }}>
            <Icon name="pin" size={30} fill color={geo} stroke={0} />
          </div>
        )}
      </div>
    );
  }

  /* ----- shift card ----- */
  function ShiftCard({ site, address, client, time, distance, status, children }) {
    const { Icon } = window;
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 16px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div className="t-eyebrow" style={{ color: 'var(--accent)' }}>Current Shift</div>
              <div className="t-h2" style={{ color: 'var(--ink)', marginTop: 6 }}>{site}</div>
            </div>
            <StatusBadge status={status} pulse={status === 'patrol' || status === 'clocked_in'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, color: 'var(--ink-dim)', fontSize: 13.5 }}>
            <Icon name="pin" size={15} color="var(--ink-faint)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--card-line)' }}>
          <MetaCell icon="clock" label="Shift" value={time} />
          <MetaCell icon="building" label="Client" value={client} border />
          <MetaCell icon="navigate" label="Distance" value={distance} />
        </div>
        {children}
      </div>
    );
  }
  function MetaCell({ icon, label, value, border }) {
    return (
      <div style={{ padding: '12px 12px', borderLeft: border ? '1px solid var(--card-line)' : 'none',
        borderRight: border ? '1px solid var(--card-line)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-faint)' }}>
          <Icon name={icon} size={13} stroke={2.2} />
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div className="t-mono" style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginTop: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
    );
  }

  /* ----- primary action ----- */
  function PrimaryActionButton({ label, sub, icon, tone = 'accent', onClick, disabled }) {
    const cls = tone === 'ok' ? 'btn-ok' : tone === 'danger' ? 'btn-danger' : 'btn-accent';
    return (
      <button className={`btn btn-block ${cls}`} onClick={onClick} disabled={disabled}
        style={{ height: 62, flexDirection: 'column', gap: 1, borderRadius: 'var(--r-btn)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 17 }}>
          {icon && <Icon name={icon} size={20} stroke={2.4} />}{label}
        </span>
        {sub && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 11.5, opacity: .85 }}>{sub}</span>}
      </button>
    );
  }

  /* ----- quick actions grid ----- */
  function QuickAction({ icon, label, tone = 'accent', onClick, badge }) {
    const c = TONE[tone] ? TONE[tone].c : tone;
    return (
      <button className="btn" onClick={onClick} style={{
        flexDirection: 'column', gap: 9, padding: '15px 8px', borderRadius: 'var(--r-sm)',
        background: 'var(--card)', border: '1px solid var(--card-line)', boxShadow: 'var(--shadow-card)',
        position: 'relative',
      }}>
        {badge != null && <span style={{ position: 'absolute', top: 9, right: 9, minWidth: 18, height: 18, padding: '0 5px',
          borderRadius: 999, background: 'var(--danger)', color: '#fff', fontSize: 11, fontWeight: 700,
          fontFamily: 'var(--font-mono)', display: 'grid', placeItems: 'center' }}>{badge}</span>}
        <span style={{ width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center',
          background: `color-mix(in srgb, ${c} 14%, transparent)`, color: c }}>
          <Icon name={icon} size={22} stroke={2.2} />
        </span>
        <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12.5, color: 'var(--ink)' }}>{label}</span>
      </button>
    );
  }
  function QuickActionGrid({ children, cols = 2 }) {
    return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 11 }}>{children}</div>;
  }

  /* ----- patrol progress card ----- */
  function PatrolProgressCard({ route, done, total, next, remaining, onClick }) {
    return (
      <div className="card" onClick={onClick} style={{ padding: 16, cursor: onClick ? 'pointer' : 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <ProgressRing value={done} total={total} size={62} stroke={7} tone="ok">
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div className="t-mono" style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{done}<span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>/{total}</span></div>
            </div>
          </ProgressRing>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-eyebrow" style={{ color: 'var(--ink-faint)' }}>{route}</div>
            <div className="t-h3" style={{ color: 'var(--ink)', marginTop: 5 }}>Next: {next}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, color: 'var(--ink-dim)', fontSize: 12.5 }}>
              <Icon name="clock" size={13} color="var(--ink-faint)" /> {remaining} remaining
            </div>
          </div>
          {onClick && <Icon name="chevron" size={20} color="var(--ink-faint)" />}
        </div>
      </div>
    );
  }

  /* ----- checkpoint timeline item ----- */
  function CheckpointItem({ name, time, state = 'done', last, location }) {
    const map = {
      done:    { c: 'var(--ok)', icon: 'check', label: time },
      next:    { c: 'var(--accent)', icon: 'target', label: 'Next checkpoint' },
      pending: { c: 'var(--ink-faint)', icon: null, label: 'Pending' },
      missed:  { c: 'var(--danger)', icon: 'x', label: 'Missed' },
    };
    const m = map[state];
    return (
      <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
          <div style={{ width: 30, height: 30, borderRadius: 999, flex: '0 0 30px', display: 'grid', placeItems: 'center',
            background: state === 'done' ? 'var(--ok)' : state === 'next' ? 'color-mix(in srgb, var(--accent) 15%, var(--card))' : 'var(--card)',
            border: state === 'done' ? 'none' : `2px ${state === 'next' ? 'solid' : 'dashed'} ${m.c}` }}>
            {m.icon && <Icon name={m.icon} size={15} stroke={3} color={state === 'done' ? '#fff' : m.c} />}
          </div>
          {!last && <div style={{ width: 2, flex: 1, minHeight: 18, background: 'var(--card-line)', margin: '3px 0' }} />}
        </div>
        <div style={{ flex: 1, paddingBottom: last ? 0 : 14 }}>
          <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14.5,
            color: state === 'pending' ? 'var(--ink-faint)' : 'var(--ink)' }}>{name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontSize: 12, color: m.c, fontWeight: 600 }}>
            {state === 'done' && <Icon name="pin" size={12} color="var(--ink-faint)" />}
            <span className={state === 'done' ? 't-mono' : ''}>{m.label}</span>
            {location && state === 'done' && <span style={{ color: 'var(--ink-faint)', fontWeight: 500 }}>· {location}</span>}
          </div>
        </div>
      </div>
    );
  }

  /* ----- bottom navigation ----- */
  function BottomNavigation({ active, onNav, onSos, badges = {} }) {
    const tabs = [
      { id: 'home', icon: 'home', label: 'Home' },
      { id: 'patrol', icon: 'route', label: 'Patrol' },
      { id: 'reports', icon: 'clipboard', label: 'Reports' },
      { id: 'messages', icon: 'chat', label: 'Messages' },
    ];
    return (
      <div style={{ position: 'relative', flex: '0 0 auto', background: 'var(--shell-2)',
        borderTop: '1px solid var(--shell-line)', paddingBottom: 10 }}>
        {/* SOS floating */}
        <button className="btn" onClick={onSos} aria-label="SOS"
          style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', zIndex: 4,
            width: 60, height: 60, borderRadius: 999, background: 'var(--danger)', color: '#fff',
            border: '4px solid var(--shell-2)', boxShadow: '0 10px 24px -6px color-mix(in srgb, var(--danger) 70%, transparent)',
            flexDirection: 'column', gap: 0 }}>
          <Icon name="sos" size={20} stroke={2.6} fill={false} />
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.08em', marginTop: 1 }}>SOS</span>
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 64px 1fr 1fr', alignItems: 'center', height: 60 }}>
          {tabs.slice(0, 2).map(t => <NavItem key={t.id} {...t} active={active === t.id} badge={badges[t.id]} onClick={() => onNav(t.id)} />)}
          <div />
          {tabs.slice(2).map(t => <NavItem key={t.id} {...t} active={active === t.id} badge={badges[t.id]} onClick={() => onNav(t.id)} />)}
        </div>
      </div>
    );
  }
  function NavItem({ icon, label, active, onClick, badge }) {
    return (
      <button className="btn" onClick={onClick} style={{ flexDirection: 'column', gap: 4, background: 'none', height: 60, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Icon name={icon} size={23} stroke={active ? 2.5 : 2} color={active ? 'var(--accent)' : 'var(--on-shell-faint)'} fill={false} />
          {badge != null && <span style={{ position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, padding: '0 4px',
            borderRadius: 999, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700,
            fontFamily: 'var(--font-mono)', display: 'grid', placeItems: 'center', border: '2px solid var(--shell-2)' }}>{badge}</span>}
        </div>
        <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 10.5,
          color: active ? 'var(--accent)' : 'var(--on-shell-faint)' }}>{label}</span>
      </button>
    );
  }

  /* ----- app header (navy) ----- */
  function AppHeader({ title, eyebrow, left, right, onBack, big, children }) {
    return (
      <div style={{ background: 'var(--shell)', padding: big ? '6px 20px 16px' : '8px 18px 14px', position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 40 }}>
          {onBack && (
            <button className="btn" onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12,
              background: 'var(--shell-3)', border: '1px solid var(--shell-line)', color: 'var(--on-shell)', flex: '0 0 40px' }}>
              <Icon name="chevronL" size={20} />
            </button>
          )}
          {left}
          <div style={{ flex: 1, minWidth: 0 }}>
            {eyebrow && <div className="t-eyebrow" style={{ color: 'var(--on-shell-dim)' }}>{eyebrow}</div>}
            {title && <div className={big ? 't-h1' : 't-h2'} style={{ color: 'var(--on-shell)', marginTop: eyebrow ? 3 : 0 }}>{title}</div>}
          </div>
          {right}
        </div>
        {children}
      </div>
    );
  }

  /* ----- bottom sheet ----- */
  function Sheet({ open, onClose, children, height }) {
    if (!open) return null;
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(5,9,18,.55)',
        backdropFilter: 'blur(2px)', animation: 'fadeIn .2s ease', display: 'flex', alignItems: 'flex-end' }}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxHeight: height || '88%', overflowY: 'auto',
          background: 'var(--card)', borderRadius: '24px 24px 0 0', animation: 'sheetUp .32s cubic-bezier(.2,.8,.2,1)',
          boxShadow: 'var(--shadow-pop)', paddingBottom: 20 }}>
          <div style={{ display: 'grid', placeItems: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: 40, height: 5, borderRadius: 999, background: 'var(--card-line)' }} />
          </div>
          {children}
        </div>
      </div>
    );
  }

  /* ----- toast ----- */
  function Toast({ toast }) {
    if (!toast) return null;
    const c = TONE[toast.tone || 'ok'].c;
    return (
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 92, zIndex: 60, animation: 'screenIn .3s ease' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 15px',
          background: 'var(--shell-3)', border: '1px solid var(--shell-line)', boxShadow: 'var(--shadow-pop)' }}>
          <Icon name={toast.icon || 'checkCircle'} size={20} color={c} stroke={2.4} />
          <span style={{ color: 'var(--on-shell)', fontWeight: 600, fontSize: 13.5, fontFamily: 'var(--font-body)' }}>{toast.msg}</span>
        </div>
      </div>
    );
  }

  /* ----- section label ----- */
  function Section({ title, action, onAction, children, style }) {
    return (
      <div style={style}>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 11px' }}>
            <div className="t-eyebrow" style={{ color: 'var(--on-shell-dim)' }}>{title}</div>
            {action && <button className="btn" onClick={onAction} style={{ background: 'none', color: 'var(--accent)',
              fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12.5, gap: 4 }}>{action}<Icon name="chevron" size={14} /></button>}
          </div>
        )}
        {children}
      </div>
    );
  }

  Object.assign(window, {
    StatusBadge, Chip, Dot, ProgressBar, ProgressRing, MapView, ShiftCard, MetaCell,
    PrimaryActionButton, QuickAction, QuickActionGrid, PatrolProgressCard, CheckpointItem,
    BottomNavigation, AppHeader, Sheet, Toast, Section, STATUS, TONE,
  });
})();
