# Gap Analysis: PRD vs Current ViperOne vs Guard Website

## Summary
PRD = source of truth. Current ViperOne = partial prototype. Guard website = design reference.

---

## ✅ Already Exists in ViperOne (matches PRD intent)

| Feature | PRD Ref | Status |
|---|---|---|
| Guard login screen | FR-1 | Exists (basic, no company code) |
| Home screen with shift card | FR-71 | Exists |
| Clock In / Clock Out flow | FR-10 | Exists (no photo, no GPS) |
| Patrol with checkpoints | FR-30 | Exists (UI only, no NFC/QR) |
| Reports / Incidents list | FR-40 | Exists (UI only) |
| Two-way messages | FR-50 | Exists (UI only) |
| SOS alert | FR-73 | Exists |
| Bottom navigation (5 tabs) | FR-71 | Exists |
| Dark/light theming | NFR-Usability | Exists |

---

## ❌ Missing — PRD Phase 1 MVP (highest priority)

### 1. Landing / Onboarding Page
- **PRD:** Phase 0 UX prototype, FR-75 (minimal training)
- **Guard website has it:** Dark navy, shield icon, feature list, "Open the guard" CTA
- **Gap:** ViperOne jumps straight to login with no context

### 2. Multi-role Sign In (Company Code + Role Tabs)
- **PRD:** FR-1, FR-2, Section 7 (5 roles)
- **Guard website has it:** Company code field + Guard/Supervisor/Client tabs + Guard ID + PIN
- **Gap:** ViperOne has a single generic login form with no company code, no role selector

### 3. Photo Capture on Clock-In / Clock-Out
- **PRD:** FR-10 — "Require photo on clock-in and clock-out"
- **Gap:** ViperOne has no camera UI at all

### 4. GPS Capture + Geofence Validation UI
- **PRD:** FR-11, FR-12 — GPS coords + geofence check
- **Gap:** No GPS/location feedback shown to guard anywhere in current UI

### 5. Incident Report Form (Full)
- **PRD:** FR-40, FR-41 — Category, severity, narrative + photo/voice/signature
- **Gap:** Current report screen shows a list but the form is minimal, no media attachments, no signature

### 6. NFC / QR Checkpoint Scan UI
- **PRD:** FR-30 — NFC and QR scanning at checkpoints
- **Gap:** Patrol UI shows checkpoints as a list but no scan action (no camera/NFC trigger)

### 7. Supervisor Role Screens
- **PRD:** Section 7 — Real-time team monitoring, SOS acknowledgment, incident management
- **Gap:** Completely missing — ViperOne only has Guard role UI

### 8. Client Role Screens
- **PRD:** FR-72 — Read-only access, incident notifications, report download
- **Gap:** Completely missing

---

## ❌ Missing — PRD Phase 2 (important but after MVP)

| Feature | PRD Ref | Notes |
|---|---|---|
| "I'm Alive" welfare check | FR-33 | Button + timer |
| Man-down detection | FR-35 | Alert trigger |
| Scheduling / route assignment | FR-20–23 | Admin-side + guard view |
| Admin portal | FR-70 | Separate role entirely |
| Report exports (PDF/CSV/Excel) | FR-64 | Download actions |
| Client email notifications | FR-44 | Backend + UI status |
| Attendace anomaly flags | FR-14 | Supervisor view |
| Offline queue indicator | NFR-Reliability | Status badge |

---

## Implementation Priority Order

### Sprint 1 — Core Guard Flow (do now)
1. **Landing page** — dark navy, feature list, CTA
2. **Sign In** — company code + role tabs (Guard/Supervisor/Client) + credentials  
3. **Clock In** — add photo capture UI + GPS status
4. **Clock Out** — add photo + GPS
5. **Checkpoint scan** — add NFC/QR scan trigger in patrol
6. **Incident form** — category + severity + description + photo attachment

### Sprint 2 — Supervisor & Client
7. **Supervisor Home** — team list, live map, incidents queue
8. **Supervisor SOS ACK** — acknowledge flow
9. **Client Home** — site status, recent incidents (read-only)

### Sprint 3 — Polish & PRD completeness
10. Welfare check / "I'm Alive" 
11. Scheduling view (guard sees their schedule)
12. Report filters + export buttons
13. Offline indicator

---

## Design Changes Required (to match Guard website)

| Element | Current ViperOne | Target |
|---|---|---|
| Login flow | Single screen | Landing → Sign In (2 screens) |
| Role selector | None | Guard / Supervisor / Client tabs |
| Company code | None | Required first field |
| Input style | Borderless | Outlined white card on gray bg |
| Clock-in | Button only | Photo capture + GPS check + button |
| Card radius | 20px | 16px |
| Landing bg | N/A | Dark navy `#07111F` |
