# Changelog

All notable changes to the Vpple Notes project are documented in this file.
This repository is based on the upstream project [iCloud-Notes-Clone](https://github.com/LubaKaper/iCloud-Notes-Clone) by Luba Kaper (commit `ea176c0ca4d33bc6f323e2873d43dae6ad8eb9e9`).

---

## [1.2.0] - 2026-11-09

### Added
- **Volumetric Liquid Glass Material System (`frontend/src/styles/index.css`)**:
  - Implemented Snell's Law optical refraction simulation ($n \approx 1.52$) with multi-layer blur and saturation boosts.
  - Added chromatic dispersion meniscus (`--liquid-meniscus`) using cyan (`#00f0ff`) and magenta (`#ff00a0`) edge-fringing.
  - Added dynamic Fresnel specular caustics tracking cursor movements (`--liquid-mx`, `--liquid-my`) in real-time.
  - Applied Liquid Glass styling to toolbars, modals, floating action buttons, and sidebars.
- **Dedicated Apple ID / Vpple ID Sign In Interface**:
  - Added official Apple-style 46px white pill **"Sign In"** button on the landing screen (`LoginScreen.tsx`).
  - Added interactive in-app **"Sign In"** button on the Note Viewer toolbar for guest/local users.
  - Implemented interactive Apple ID modal with credential authentication and Google OAuth option.
- **Visual Interactive Checklists (`frontend/src/app/components/NoteViewer.tsx`)**:
  - Rendered live circular check boxes (`SymbolCircle` -> `SymbolCheckmarkCircleFill`) for `[ ]` and `[x]` lines.
  - Interactive click handling with instant visual strikethrough and debounced autosave.
  - Bound checklist toggle shortcut `⇧⌘L`.

### Changed
- Refactored `NotesApp.tsx` with atmospheric macOS Tahoe desktop background.
- Updated root deployment bundle for GitHub Pages with fresh assets.

---

## [1.1.0] - 2026-11-09

### Added
- **Apple SF Symbols Vector Iconography (`frontend/src/app/components/SFSymbols.tsx`)**:
  - Replaced generic Lucide icons and character emojis with resolution-independent SVG symbols.
  - Implemented exact glyphs for: `SymbolFolder`, `SymbolFolderBadgePlus`, `SymbolPinFill`, `SymbolSquareAndPencil`, `SymbolChecklist`, `SymbolCircle`, `SymbolCheckmarkCircleFill`, `SymbolTableCells`, `SymbolTextFormat`, `SymbolTrash`, `SymbolSquareAndArrowUp`, `SymbolSidebarLeft`, `SymbolMagnifyingGlass`, `SymbolLockFill`, `SymbolListBullet`, `SymbolSquareGrid2x2`, `SymbolChevronLeft`, `SymbolChevronRight`, `SymbolChevronDown`, `SymbolTrafficLights`, and `SymbolVpplePeach`.
- **macOS Tahoe & Sequoia Dark Mode Material Tokens (`frontend/src/styles/index.css`)**:
  - Semantic CSS custom properties:
    - `--notes-bg-sidebar`: `#1e1e1e`
    - `--notes-bg-list`: `#1c1c1e`
    - `--notes-bg-editor`: `#1e1e1e`
    - `--notes-toolbar`: `#262626`
    - `--notes-accent`: `#e5a00d` (Amber Gold)
    - `--notes-border`: `rgba(255, 255, 255, 0.08)`
    - `--notes-text-primary`: `#f5f5f7`
    - `--notes-text-secondary`: `#86868b`
    - `--notes-text-muted`: `#636366`
- **Pinned Notes Functionality (`frontend/src/context/NotesContext.tsx`, `frontend/src/app/components/NotesList.tsx`)**:
  - Added `isPinned?: boolean` field to `Note` type definition.
  - Added dedicated "PINNED" section header with `pin.fill` symbol at the top of the note list.
  - Added toggle pin action with persistent cache updating.
- **Interactive Checklists & Tables (`frontend/src/app/components/NoteViewer.tsx`)**:
  - Added checklist insertion trigger with shortcut `⇧⌘L`.
  - Added Markdown table template insertion with shortcut `⌥⌘T`.
  - Added typography formatting dropdown supporting Title, Heading, Subheading, Body, and Monospaced presets.
- **Offline & Standalone Fallback Support**:
  - Added local storage fallback to `LoginScreen.tsx` allowing instant entry without requiring an active Google OAuth client ID or local backend server.
  - Added local folder creation and persistence fallback when backend REST endpoints are unreachable.
  - Added pre-loaded sample notes demonstrating Apple Notes formatting.
- **GitHub Pages Static Deployment Support**:
  - Configured `frontend/vite.config.ts` with `base: './'` for relative asset resolution.
  - Built production bundle to root `index.html` and `assets/` directory for direct hosting via GitHub Pages.
- **Audit & Specifications Documentation (`REVERSE_ENGINEERING.md`)**:
  - Documented gap analysis, design tokens, shortcut references, and upstream provenance.

### Changed
- **`frontend/src/app/components/Sidebar.tsx`**:
  - Redesigned sidebar layout to match macOS 3-column split view (240px width).
  - Integrated macOS window controls (`SymbolTrafficLights`) and Vpple Peach silhouette branding.
  - Added dynamic note count badges per folder.
  - Added inline folder creation input.
- **`frontend/src/app/components/NotesList.tsx`**:
  - Added Gallery vs List view mode toggle (`SymbolSquareGrid2x2` / `SymbolListBullet`).
  - Added full search filtering by title and body with real-time clear button.
  - Styled note cards with Amber Gold selection highlights and two-line preview snippets.
  - Formatted timestamps using macOS relative date formatting (`9:41 AM`, `Yesterday`, or date).
- **`frontend/src/app/components/NoteViewer.tsx`**:
  - Restructured top toolbar with native Apple Notes action layout.
  - Added centered modification timestamp header.
  - Bound keyboard shortcuts `⌘N` (new note), `⇧⌘L` (checklist), and `⌥⌘T` (table).
  - Integrated account profile popover and note deletion confirmation.
- **`frontend/index.html`**:
  - Updated title to `Notes — Vpple`.
  - Added mobile web app meta tags for standalone browser display.

### Removed
- Removed emoji usage across all components and documentation.
- Removed unused imports across React source tree to ensure strict TypeScript compilation.
