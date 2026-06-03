# Guard App — UI/UX Specification
> Source: esmfamilonline.ir/guard/  
> Purpose: Reference for redesigning ViperOne to match this design language

---

## Color Palette

| Token | Light Mode | Dark Mode (Landing) | Usage |
|---|---|---|---|
| `--bg-shell` | `#F2F4F8` | `#07111F` | Page/screen background |
| `--bg-card` | `#FFFFFF` | `#0F1B2D` | Cards, sheets |
| `--bg-input` | `#ECEEF2` | — | Input fields |
| `--text-primary` | `#0F172A` | `#FFFFFF` | Headings |
| `--text-secondary` | `#64748B` | `#94A3B8` | Subtitles, captions |
| `--accent` | `#2563EB` | `#3B82F6` | Buttons, links, active tabs |
| `--ok` | `#16A34A` | `#22C55E` | Success, online |
| `--warn` | `#D97706` | `#F59E0B` | Warning dot |
| `--border` | `#E2E8F0` | `#1E3A5F` | Input borders, dividers |

---

## Typography

| Role | Size | Weight | Style |
|---|---|---|---|
| Hero headline | 28–32px | 800 | Dark navy, tight line-height |
| Screen title | 20px | 700 | — |
| Section label | 13px | 600 | Uppercase, letter-spaced |
| Body | 14–15px | 400 | — |
| Caption / hint | 12px | 400 | Secondary color |
| Button label | 15px | 600 | — |
| Input label | 13px | 500 | — |

Font family appears to be a sans-serif system font or Inter/Roboto.

---

## Screen Flow

```
Landing
  └── [Open the guard] ──► Sign In
                              └── [Sign in] ──► Home (Guard role)
                                                  ├── Clock In ──► Active Shift
                                                  │                   ├── Patrol
                                                  │                   ├── Reports
                                                  │                   ├── Messages
                                                  │                   ├── SOS
                                                  │                   └── Clock Out
                                                  ├── Supervisor view (different role)
                                                  └── Client view (different role)
```

---

## Screen 1 — Landing Page

**Background:** Full-screen dark navy `#07111F`  
**Layout:** Single scrollable column, centered, max-width ~390px

### Elements (top → bottom)

1. **Shield icon** — small white outline shield, centered, ~32px, top padding ~60px
2. **Hero heading** — `"One tenant-aware control room for guards, companies, and clients."` — white, 28px bold, tight line-height, left-aligned with padding ~24px horizontal
3. **Subtitle** — `"Role-aware dashboards, active shift tracking, geofence awareness, and client visibility all run in the same Flutter app shell."` — slate/gray #94A3B8, 14px, same padding
4. **Feature list** — 3 items with colored leading dot (8px circle):
   - 🟡 `Company-owned tenants` — "Each company keeps separate sites, staff, and clients."
   - 🟢 `Live guard tracking` — "Clock in, location pings, geofence state, and SOS are stitched together."
   - 🔵 `Client transparency` — "Read-only visibility is filtered by assigned sites and policy."
   - Each item: dot + bold label + gray description text, ~16px gap between items
5. **Sign-in card** — White rounded card (`border-radius: 20px`), bottom of screen, extends below fold
   - Title: `"Multi-role sign in"` — dark, 18px bold
   - Subtitle: `"Use a company code and one of the seeded accounts to open the guard."` — gray, 13px
   - Button: `"Open the guard"` — full-width, blue `#2563EB`, white text, `border-radius: 12px`, height ~52px

---

## Screen 2 — Sign In

**Background:** Light gray `#F2F4F8`  
**Header:** White bar with back arrow (←) + title `"Multi-role sign in"` centered

### Form elements (top → bottom)

1. **Company code input**
   - Label: `"Company code"` — 13px gray above field
   - Input: White card, rounded ~12px, height ~52px, placeholder text
   - Full width with ~16px horizontal padding

2. **Role selector tabs** — 3 pill tabs in a row:
   - `Guard` | `Supervisor` | `Client`
   - Selected: Blue background `#2563EB`, white text
   - Unselected: Light gray background, dark text
   - Container: White card, `border-radius: 12px`, ~8px internal padding

3. **Guard ID input** — same style as company code input

4. **PIN input** — same style, hidden/masked characters

5. **Sign in button** — full-width, blue `#2563EB`, white text `"Sign in"`, `border-radius: 12px`, height ~52px, top margin ~24px

---

## Screen 3 — Guard Home

**Background:** Light gray `#F2F4F8`  
**Bottom Navigation:** 5-tab bar

### Header area
- Avatar circle (initials or photo) + guard name: `"Alex Johnson"` (or similar)
- Status badge: green dot + `"On duty"` / `"Off duty"`
- Notification bell icon (top right)

### Current Shift Card — White card, rounded 16px, padding 16px
- Site name: bold, 16px
- Address: gray, 13px
- 3-column meta row: `Start time` | `Client` | `Distance`
- Status chip: `"Assigned"` / `"Clocked In"` / `"On Patrol"` — colored pill

### Quick Actions Grid — 2×2 grid, 12px gap
Each cell: White card, centered icon (24px) + label below
- **Clock In** — clock icon, blue accent
- **Patrol** — route/footsteps icon
- **Reports** — clipboard icon
- **Messages** — chat bubble icon + badge count

### Active Incidents (if any) — Section with `"Incidents"` label
- List of incident cards with type, time, status chip

### Bottom Navigation Bar
5 items: `Home` | `Patrol` | `SOS` | `Reports` | `Messages`  
- **SOS button**: center item, raised circular button ~56px, red `#DC2626`, white shield/alert icon — floats above nav bar
- Active item: blue icon + blue label
- Inactive: gray icon + gray label
- Background: white, top border light gray, height ~64px + safe area

---

## Screen 4 — Active Shift

**Header:** Back arrow + `"Active Shift"` + timer (HH:MM:SS)

### Shift Status Banner — Colored banner (blue for active)
- Large status text: `"Clocked In"` / `"On Patrol"`
- Sub-info: site name, start time

### Map View — Rounded card, ~200px height
- Simplified map with geofence circle
- Blue location pin at current position
- Terrain/road lines in muted colors

### Patrol Progress Card — White card
- Circular progress ring (e.g. `4 / 8`) center
- Label: `"Checkpoints"` below number
- Next checkpoint label below ring

### Action Buttons
- Primary: `"Start Patrol"` / `"Clock Out"` — full width blue button
- Secondary ghost button below

---

## Screen 5 — Patrol

**Header:** Back arrow + `"Patrol"`

### Checkpoint List — vertical timeline
Each checkpoint item:
- Left: status icon in circle:
  - ✅ Done: green check circle
  - ➡️ Next: blue arrow circle (pulsing)
  - ⏳ Pending: gray circle outline
  - ❌ Missed: red X circle
- Center: checkpoint name (bold) + location text (gray)
- Right: time (done) or distance (pending)
- Timeline connector line between items

### Summary bar (top of list)
- `"4 of 8 complete"` with progress bar
- Time remaining or elapsed

---

## Screen 6 — Reports / Incidents

**Header:** `"Reports"` + filter chips row

### Filter chips — horizontal scrollable
`All` | `Incidents` | `Patrol` | `Access` — pill chips

### Report cards — white cards with left colored border
Each card:
- Type icon (left) + type label + timestamp (right)
- Description text (gray, 2 lines)
- Status chip (right-bottom): `"Open"` / `"Closed"` / `"Pending"`

### FAB (Floating Action Button) — `+` icon, blue circle, bottom-right

---

## Screen 7 — Messages

**Header:** `"Messages"`

### Conversation list — cards or rows
Each item:
- Avatar circle (left) — initials
- Name (bold) + last message preview (gray)
- Time (right top) + unread count badge (right bottom, blue)

### Message thread view (on tap)
- Bubble messages: sent (blue, right) / received (gray, left)
- Input bar at bottom with attachment + send icons

---

## Screen 8 — SOS

**Modal overlay** — semi-transparent dark backdrop

### Center card — white, large rounded
- Large red alert icon / shield (pulsing animation)
- `"SOS Alert"` — large bold red text
- `"Sending alert to supervisor..."` — gray
- Location coordinates or address
- **Cancel button** — ghost/outline, below card

### After SOS sent
- `"Alert Sent"` confirmation state
- Green check animation
- ETA of response or supervisor name

---

## Screen 9 — Clock Out

**Background:** Light gray

### Summary card — White, large
- Total hours worked (large number, e.g. `8h 32m`)
- Shift date and site
- Patrol summary: `"6/8 checkpoints"`
- Incidents: count

### Confirmation buttons
- `"Clock Out"` — full width, red/danger button
- `"Cancel"` — ghost button below

---

## Key Design Patterns

### Cards
- Background: `#FFFFFF`
- Border-radius: `16px` (large cards) / `12px` (small)
- Shadow: `0 2px 8px rgba(0,0,0,0.06)`
- Padding: `16px`

### Inputs
- Background: `#FFFFFF` (on gray background) or `#F1F5F9`
- Border: `1px solid #E2E8F0`
- Border-radius: `12px`
- Height: `52px`
- Font size: `15px`
- Focus: `border-color: #2563EB`, `box-shadow: 0 0 0 3px rgba(37,99,235,0.15)`

### Buttons
- Primary: `background: #2563EB`, `color: #fff`, `border-radius: 12px`, `height: 52px`
- Danger: `background: #DC2626`
- Ghost: `background: transparent`, `color: #2563EB`, `border: 1.5px solid #2563EB`

### Status chips / badges
| Status | Background | Text | Border |
|---|---|---|---|
| Assigned | `#EFF6FF` | `#2563EB` | `#BFDBFE` |
| Clocked In | `#F0FDF4` | `#16A34A` | `#BBF7D0` |
| On Patrol | `#EFF6FF` | `#2563EB` | `#BFDBFE` |
| SOS | `#FEF2F2` | `#DC2626` | `#FECACA` |
| Missed | `#FFF7ED` | `#D97706` | `#FED7AA` |

### Bottom Navigation
- Height: `64px` + bottom safe area
- Background: `#FFFFFF`
- Top border: `1px solid #F1F5F9`
- Active icon+label: `#2563EB`
- Inactive: `#94A3B8`
- SOS button: `56px` circle, `background: #DC2626`, floating with shadow

### Animations
- Screen transitions: slide from right (push) / slide to right (pop)
- SOS pulse: `box-shadow` ring pulse, red
- Status badge: subtle pulse dot for live states
- Checkpoint completion: scale + fade check icon

---

## Differences vs Current ViperOne

| Aspect | Current ViperOne | Target (Guard app) |
|---|---|---|
| Border-radius (cards) | 20px | 16px |
| Input style | Minimal/borderless | Outlined white card |
| Role tabs | Not present | Guard / Supervisor / Client tabs |
| Landing page | Not present | Full dark navy onboarding page |
| Company code login | Not present | Company code + role-based sign in |
| Color scheme | Blue accent on off-white | Same — very similar |
| Navigation | Same pattern | Same — 5-tab bottom nav with floating SOS |
| Typography | Archivo + Hanken | System sans / Inter-like |
| Map | Stylized SVG | Similar stylized map |
