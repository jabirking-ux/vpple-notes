# Vpple Notes: 1:1 Apple Notes Reverse-Engineering Specification & Audit

> **Strict Reverse Engineering & Provenance Log**  
> **Project:** Vpple Notes (1:1 Apple Notes MAX Clone)  
> **Upstream Repository:** [https://github.com/LubaKaper/iCloud-Notes-Clone](https://github.com/LubaKaper/iCloud-Notes-Clone)  
> **Upstream Author:** Luba Kaper (`liubovkaper@pursuit.org`)  
> **Upstream Base Commit:** `ea176c0ca4d33bc6f323e2873d43dae6ad8eb9e9` (Increase note body font size for presentation)  
> **Audit Date:** November 9, 2026  

---

## 1. Upstream Audit & Gap Analysis

An exhaustive audit of the cloned upstream repository revealed the following discrepancies between upstream and native Apple Notes on macOS Tahoe / iOS 26:

| Architectural Area | Upstream Implementation (`iCloud-Notes-Clone`) | Native Apple Notes Specification (1:1 Target) | Audit Status |
| :--- | :--- | :--- | :--- |
| **Iconography** | Generic `lucide-react` icons and text/emojis (`Folder`, `Trash2`, `PlusCircle`) | **100% Apple SF Symbols** (`folder`, `pin.fill`, `square.and.pencil`, `checklist`, `circle`, `checkmark.circle.fill`, `tablecells`, `textformat`, `sidebar.left`, `square.and.arrow.up`). **ZERO EMOJIS**. | **Replaced with SF Symbols SVGs** |
| **Color Tokens** | Hardcoded flat grays (`#2d2d2d`, `#252525`, `#1e1e1e`) | **macOS Dark Mode Semantic Materials:** Toolbar `#262626`, Sidebar `#1e1e1e`, Notes List `#1c1c1e`, Editor `#1e1e1e`, Selection Accent `#e5a00d` (Amber Gold). | **Applied Apple Palette** |
| **Typography** | Generic system Tailwind font stack (`sans-serif`) | **SP Pro Display (SF Pro metric-identical)**: Title 28px bold, Heading 20px bold, Subheading 16px semibold, Body 15px regular, SF Mono for code. | **Integrated SP Pro Display** |
| **Checklists** | None (plain text only) | Interactive circular checklist toggles (`circle` to `checkmark.circle.fill` with text strikethrough). | **Implemented** |
| **Table Insertion** | None | Grid matrix table (`tablecells` SF Symbol) with clean cell borders. | **Implemented** |
| **Pinning System** | None | Pinned section at top of notes list with SF Symbol `pin.fill`. | **Implemented** |
| **Window Chrome** | Plain browser container | macOS Tahoe Traffic Lights (`close`, `minimize`, `fullscreen` with micro-glyphs on hover). | **Implemented** |
| **Offline Resilience** | Blocked with "Failed to load notes. Is backend running?" if PostgreSQL server is absent | **Offline-First Resilience**: Seamless fallback to LocalStorage & IndexedDB with preloaded authentic sample notes. | **Implemented** |
| **Branding & Logo** | Generic text | Vpple stylized vector Peach silhouette glyph (Apple monochrome style). | **Implemented** |

---

## 2. Strict SF Symbols Mapping (Zero Emojis Policy)

In accordance with strict Apple HIG specifications, **zero emojis** are permitted anywhere in the user interface, source code, or system controls. Every visual metaphor is mapped directly to its official Apple SF Symbol vector representation:

| UI Metaphor | Legacy / Web Counterpart | Official Apple SF Symbol | Exact SVG Implementation |
| :--- | :--- | :--- | :--- |
| New Note | Standard memo icon | `square.and.pencil` | Custom vector SVG matching SF Symbol weight |
| Pin Note | Generic pushpin | `pin.fill` | Solid pushpin glyph silhouette |
| Folder | Generic folder | `folder` | Apple rounded tabbed folder outline |
| Checklist Action | Generic checkbox | `checklist` | Triple-tier checklist icon |
| Unchecked Item | Hollow circle | `circle` | 18px amber outline circle |
| Checked Item | Checked circle | `checkmark.circle.fill` | Filled amber circle with micro-checkmark |
| Table Tool | Generic grid | `tablecells` | 2x2 grid matrix symbol |
| Format Tool | Generic typography | `textformat` | Iconic Apple "Aa" vector glyph |
| Trash / Delete | Generic wastebasket | `trash` | Apple tapered wastebasket silhouette |
| Share | Generic export arrow | `square.and.arrow.up` | Standard Apple export/share symbol |
| Search | Generic loupe | `magnifyingglass` | Standard 45-degree angled glass |
| Lock Note | Generic padlock | `lock.fill` | Solid Apple security padlock |
| Sidebar Toggle | Generic split | `sidebar.left` | Dual-pane split window icon |
| Vpple Logo | Generic fruit | `vpple.peach` | Clean monochrome vector fruit silhouette |

---

## 3. Keyboard Shortcut Reference

All keyboard accelerators match native macOS Apple Notes:
* `⌘ + N`: New Note
* `⇧ + ⌘ + N`: New Folder
* `⌥ + ⌘ + S`: Toggle Sidebar
* `⌘ + B`: Bold
* `⌘ + I`: Italic
* `⌘ + U`: Underline
* `⇧ + ⌘ + L`: Insert Checklist
* `⌥ + ⌘ + T`: Insert Table
* `⇧ + ⌘ + T`: Apply Title Format
* `⇧ + ⌘ + H`: Apply Heading Format
* `⇧ + ⌘ + B`: Apply Body Format

---

## 4. Liquid Glass Specification (Kyant0 Physical SDF & Ray Optics)

The visual presentation implements authentic physical glass materials directly adapted from **Kyant0/AndroidLiquidGlass** (Apache 2.0):
* **Signed Distance Field Normal Mapping**: Uses exact 2D rounded rectangle SDF (`sdRoundedRect` and `gradSdRoundedRect`) to compute surface normals at every border pixel.
* **Nonlinear Lens Displacement**: Applies `circleMap(x) = 1.0 - sqrt(1.0 - x * x)` for physical lens refraction across button and toolbar boundaries.
* **Directional Specular Highlight**: Evaluates dot product of surface normal and light direction (`dot(grad, normal)` with `pow(abs(d), falloff)`) for cursor-tracking specular sheens.
* **Neutral Dark Material Base**: Matches Kyant's dark base palette `rgba(18, 18, 18, 0.40)` with `backdrop-filter: blur(32px) saturate(180%)` and zero neon chromatic aberrations.
* **Incident Highlight & Rim Occlusion**: Top boundary incident highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.32)`) and bottom ambient occlusion shadow (`inset 0 -1px 0 rgba(0, 0, 0, 0.45)`).

---

## 5. Authentication Flow & Sign In Architecture

1. **Global Landing Screen (`LoginScreen.tsx`)**:
   - Official Apple-styled 46px white pill **"Sign In"** button.
   - Interactive Apple ID / Vpple ID authentication modal supporting email, password, and optional Google OAuth credentials.
   - Direct link to guest/offline local session without blocking popups.
2. **In-App Persistent Sign In (`NoteViewer.tsx`)**:
   - Prominent **"Sign In"** pill button in the top-right toolbar when operating as guest or in offline mode.
   - Live modal authentication without disrupting note editing or requiring page reloads.
   - Signed-in state displays user profile avatar with account management popover and sign-out action.

---

## 6. Interactive Checklists & Reading vs Editing Mode

* **Default Reading Mode**: Clean, distraction-free Apple Notes reading canvas displaying formatted title and body.
* **Interactive Checklists**: Markdown lines starting with `[ ] ` or `[x] ` render visual circular checkbox toggles (`SymbolCircle` -> `SymbolCheckmarkCircleFill`). Clicking toggles state in real-time and triggers debounced autosave without duplicating text.
* **Editing Mode & Done Button**: Clicking note text opens the full editor with keyboard focus; an Amber Gold (`#e5a00d`) **Done** button appears in the top toolbar to return to reading mode.
* **Table Tooling**: Integrated grid templates with `⌥⌘T` accelerator.

---

## 7. Upstream Attribution

* **iCloud Notes Base Application**: Derived from and building upon the upstream repository by **Luba Kaper** ([https://github.com/LubaKaper/iCloud-Notes-Clone](https://github.com/LubaKaper/iCloud-Notes-Clone)). The original commit history and core React component structure have been preserved, refined, and hardened to 1:1 Apple Notes fidelity.
* **Liquid Glass Shader Mathematics**: Derived from and incorporating the open-source shader algorithms in [Kyant0/AndroidLiquidGlass](https://github.com/Kyant0/AndroidLiquidGlass) by Kyant (licensed under the Apache License, Version 2.0). Special thanks to Kyant for the elegant AGSL/SkSL SDF normal and lens refraction mathematics.
