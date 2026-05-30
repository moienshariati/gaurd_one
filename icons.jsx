// icons.jsx — ViperOne line-icon set + brand mark. Stroke icons, currentColor.
(function () {
  const P = {
    home: 'M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9',
    shield: 'M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Z',
    route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h6a3 3 0 0 0 3-3V9M16 7H9a3 3 0 0 0-3 3v5',
    clipboard: 'M9 4h6v3H9zM7 5H5v15h14V5h-2M8.5 12h7M8.5 16h5',
    chat: 'M4 5h16v11H9l-4 3v-3H4z',
    sos: 'M12 2 2 21h20L12 2Z M12 9v5 M12 17.5v.5',
    pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    navigate: 'M3 11 21 3l-8 18-2-7-8-3Z',
    camera: 'M4 8h3l1.5-2h7L18 8h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z M12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    check: 'M5 12.5 10 17.5 19.5 7',
    checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M8.5 12.5 11 15l4.5-5',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7.5V12l3 2',
    qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
    nfc: 'M5 7c4 3 4 7 0 10 M9 6c5 4 5 8 0 12 M13.5 5c3 2.5 3 11.5 0 14 M18 8.5c1.5 1.5 1.5 5 0 7',
    phone: 'M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V20a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z',
    chevron: 'M9 6l6 6-6 6',
    chevronL: 'M15 6l-6 6 6 6',
    alert: 'M12 3 2 20h20L12 3Z M12 10v4 M12 17h.01',
    mic: 'M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z M6 11a6 6 0 0 0 12 0 M12 17v4',
    sign: 'M4 18c3 0 4-9 6-9s2 6 4 6 2-4 4-4 M3.5 21h17',
    video: 'M4 7h11v10H4zM15 11l5-3v8l-5-3',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M5 20c.7-3.5 3.6-5 7-5s6.3 1.5 7 5',
    building: 'M5 21V5l7-2v18M12 9h7v12 M9 8h.01M9 12h.01M9 16h.01M15.5 13h.01M15.5 17h.01',
    target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M12 12h.01',
    lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
    faceid: 'M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3 M9 10v1M15 10v1M12 9v4l-1 1M9.5 15.5c1.5 1 3.5 1 5 0',
    send: 'M4 12 20 4l-6 16-2.5-6.5L4 12Z',
    plus: 'M12 5v14M5 12h14',
    x: 'M6 6l12 12M18 6 6 18',
    play: 'M7 5l12 7-12 7V5Z',
    flag: 'M6 21V4M6 5h11l-2 3 2 3H6',
    bolt: 'M13 3 5 14h6l-1 7 8-11h-6l1-7Z',
    walk: 'M13 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M11 22l1.5-6L10 13V9l3-1 3 3 2 1 M10 13l-2 3',
    gauge: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M13.5 10.5 16 8',
    list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
    refresh: 'M20 11a8 8 0 0 0-14-4L3 9M3 4v5h5 M4 13a8 8 0 0 0 14 4l3-2M21 20v-5h-5',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    eyeOff: 'M3 3l18 18 M10 6.5A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.5M6 6.7A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 3.4-.6M9.5 9.6a3 3 0 0 0 4.2 4.2',
    download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
    heartbeat: 'M3 12h4l2-5 3 9 2-6 2 2h5',
    battery: 'M3 8h15v8H3zM21 11v2',
    signal: 'M4 18h2v-3H4zM9 18h2v-6H9zM14 18h2v-9h-2zM19 18h2V6h-2z',
    wifi: 'M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01',
  };
  function Icon({ name, size = 22, stroke = 2, fill = false, style, color }) {
    const d = P[name];
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color || 'currentColor'} strokeWidth={stroke}
        strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
        {d.split(' M').map((seg, i) => (
          <path key={i} d={(i ? 'M' : '') + seg} fill={fill ? (color || 'currentColor') : 'none'} />
        ))}
      </svg>
    );
  }

  // Brand: shield with a coiled-viper "V" negative-space motif.
  function ViperMark({ size = 34 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
        <path d="M20 3 6 8v9.5C6 26 12 32.5 20 35.5 28 32.5 34 26 34 17.5V8L20 3Z"
          fill="url(#vg)" stroke="#5B9BFF" strokeWidth="1" strokeOpacity=".5" />
        <path d="M13 13.5l5.4 11.4a1.8 1.8 0 0 0 3.2 0L27 13.5"
          fill="none" stroke="#EAF2FF" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="27.4" r="1.7" fill="#7CF2B0" />
      </svg>
    );
  }

  function Logo({ size = 34, showText = true, light = true }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ViperMark size={size} />
        {showText && (
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: size * .5,
              letterSpacing: '-.01em', color: light ? 'var(--on-shell)' : 'var(--ink)' }}>
              ViperOne
            </div>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: size * .26,
              letterSpacing: '.32em', textTransform: 'uppercase', marginTop: 3,
              color: 'var(--accent)' }}>
              Guard
            </div>
          </div>
        )}
      </div>
    );
  }

  Object.assign(window, { Icon, ViperMark, Logo });
})();
