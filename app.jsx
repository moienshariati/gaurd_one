// app.jsx — ViperOne Guard shell: state machine, nav, chrome, tweaks.
(function () {
  const { useState, useEffect, useRef } = React;
  const { Icon, BottomNavigation, Toast } = window;
  const { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio } = window;

  const DATA = {
    guard: 'Michael Carter', site: 'North Gate Commercial Plaza',
    address: '1450 Gateway Blvd, North District', client: 'US Security Svc',
    shift: '08:00 – 16:00', distance: '0.6 mi',
  };
  const SEED_MSGS = [
    { from: 'them', text: "Morning Michael — you're on North Gate today, 08:00 start. Confirm when you arrive.", time: '07:40' },
    { from: 'me', text: 'Copy. En route now, ETA 07:55.', time: '07:46' },
    { from: 'them', text: 'Great. Gate code is in the post orders. Radio me if any issues.', time: '07:47' },
  ];
  const SEED_INC = [
    { category: 'Maintenance', title: 'Unsecured door at Loading Dock', severity: 'High', status: 'In Progress', time: '08:12', evidence: 2 },
    { category: 'Security Issue', title: 'Suspicious vehicle in Lot A', severity: 'Medium', status: 'Acknowledged', time: '07:58', evidence: 1 },
    { category: 'Maintenance', title: 'Lighting outage — east wall', severity: 'Low', status: 'Resolved', time: 'Yesterday', evidence: 0 },
  ];

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "night": false,
    "accent": "blue",
    "radius": "rounded"
  }/*EDITMODE-END*/;

  const TAB_OF = { home: 'home', shift: 'home', patrol: 'patrol', reports: 'reports', messages: 'messages' };
  const SHOW_NAV = ['home', 'shift', 'patrol', 'reports'];

  function StatusBar({ night }) {
    const [now, setNow] = useState(new Date());
    useEffect(() => { const id = setInterval(() => setNow(new Date()), 10000); return () => clearInterval(id); }, []);
    return (
      <div className="statusbar">
        <span>{now.toTimeString().slice(0, 5)}</span>
        <span className="sb-icons">
          <Icon name="signal" size={16} fill color="var(--on-shell)" stroke={0} />
          <Icon name="wifi" size={15} color="var(--on-shell)" stroke={2.2} />
          <Icon name="battery" size={20} color="var(--on-shell)" stroke={1.8} />
        </span>
      </div>
    );
  }

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [screen, setScreen] = useState('login');
    const [status, setStatus] = useState('assigned');
    const [patrol, setPatrol] = useState({ done: 4, total: 8, next: 'Service Corridor' });
    const [incidents, setIncidents] = useState(SEED_INC);
    const [messages, setMessages] = useState(SEED_MSGS);
    const [reportsMode, setReportsMode] = useState('list');
    const [toast, setToast] = useState(null);
    const [sosFrom, setSosFrom] = useState('shift');
    const tRef = useRef(null);

    const pushToast = (tt) => { setToast(tt); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(null), 3200); };

    const A = {
      go: (s, opts) => {
        if (s === 'reports') setReportsMode(opts && opts.mode ? opts.mode : 'list');
        if (s === 'sos') setSosFrom(SHOW_NAV.includes(screen) || screen === 'messages' ? screen : 'shift');
        setScreen(s);
      },
      setStatus: (s) => setStatus(s),
      toast: pushToast,
      back: sosFrom,
      reset: () => { setScreen('home'); },
    };

    const sendMsg = (text) => {
      setMessages(m => [...m, { from: 'me', text, time: new Date().toTimeString().slice(0, 5) }]);
      setTimeout(() => setMessages(m => [...m, { from: 'them', text: 'Copy that — noted. Stay safe out there.', time: new Date().toTimeString().slice(0, 5) }]), 1400);
    };
    const addIncident = (inc) => setIncidents(list => [inc, ...list]);

    const openIncidents = incidents.filter(i => i.status !== 'Resolved').length;
    const counts = { tasks: 2, incidents: openIncidents, messages: messages.filter(m => m.from === 'them').length - 1 };

    let body;
    if (screen === 'login') body = <window.LoginScreen A={A} />;
    else if (screen === 'home') body = <window.HomeScreen A={A} status={status} data={DATA} counts={counts} />;
    else if (screen === 'jobDetail') body = <window.JobDetailScreen A={A} status={status} data={DATA} night={t.night} />;
    else if (screen === 'clockin') body = <window.ClockInScreen A={A} data={DATA} night={t.night} />;
    else if (screen === 'shift') body = <window.ActiveShiftScreen A={A} data={DATA} patrol={patrol} />;
    else if (screen === 'patrol') body = <window.PatrolScreen A={A} patrol={patrol} setPatrol={setPatrol} />;
    else if (screen === 'reports') body = <window.ReportsScreen A={A} data={DATA} mode={reportsMode} setMode={setReportsMode} incidents={incidents} addIncident={addIncident} />;
    else if (screen === 'messages') body = <window.MessagesScreen A={A} messages={messages} send={sendMsg} />;
    else if (screen === 'sos') body = <window.SosScreen A={A} />;
    else if (screen === 'clockout') body = <window.ClockOutScreen A={A} data={DATA} patrol={patrol} night={t.night} />;

    const showNav = SHOW_NAV.includes(screen);
    const showStatusBar = screen !== 'login';

    return (
      <div className="phone" data-mode={t.night ? 'night' : 'day'} data-accent={t.accent} data-radius={t.radius}>
        {showStatusBar && <StatusBar night={t.night} />}
        <div className="app" style={{ paddingTop: showStatusBar ? 0 : 0 }}>
          {/* offset for non-statusbar (login) */}
          {!showStatusBar && <div style={{ height: 44, flex: '0 0 44px' }} />}
          {body}
          <Toast toast={toast} />
        </div>
        {showNav && <BottomNavigation active={TAB_OF[screen]} onNav={(id) => A.go(id === 'home' ? (['clocked_in', 'patrol', 'completed'].includes(status) ? 'shift' : 'home') : id)}
          onSos={() => A.go('sos')} badges={{ reports: openIncidents || undefined, messages: counts.messages > 0 ? counts.messages : undefined }} />}

        <TweaksPanel>
          <TweakSection label="Appearance" />
          <TweakToggle label="Night-shift mode" value={t.night} onChange={v => setTweak('night', v)} />
          <TweakRadio label="Accent" value={t.accent} options={['blue', 'navy', 'slate']} onChange={v => setTweak('accent', v)} />
          <TweakRadio label="Corners" value={t.radius} options={['rounded', 'sharp']} onChange={v => setTweak('radius', v)} />
        </TweaksPanel>
      </div>
    );
  }

  window.ViperApp = App;
})();
