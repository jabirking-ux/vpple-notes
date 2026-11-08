# Vpple Notes

A 1:1 reverse-engineered implementation of Apple Notes (macOS & iOS) built on top of [iCloud-Notes-Clone](https://github.com/LubaKaper/iCloud-Notes-Clone) by Luba Kaper.

Features a 3-column split layout, native Apple SF Symbols vector iconography (with zero emojis), macOS Tahoe dark mode materials, amber gold accent tint, interactive checklists, markdown tables, real-time autosave, and offline IndexedDB persistence.

Hosted live on GitHub Pages: [https://jabirking-ux.github.io/vpple-notes/](https://jabirking-ux.github.io/vpple-notes/)

---

## Upstream Attribution & Provenance

* **Upstream Repository:** [https://github.com/LubaKaper/iCloud-Notes-Clone](https://github.com/LubaKaper/iCloud-Notes-Clone)
* **Upstream Author:** Luba Kaper (`liubovkaper@pursuit.org`)
* **Base Commit:** `ea176c0ca4d33bc6f323e2873d43dae6ad8eb9e9` (Increase note body font size for presentation)

All architectural differences, token audits, and reverse engineering decisions are documented in detail in [REVERSE_ENGINEERING.md](./REVERSE_ENGINEERING.md). For revision history, see [CHANGELOG.md](./CHANGELOG.md).

---

## Architecture & Specifications

### 1. Zero Emoji & Native SF Symbols Policy
Native Apple Notes uses vector SF Symbols instead of unicode emojis or generic web icons. All symbols in this application are resolution-independent monochrome SVGs matching macOS Tahoe & iOS 26 SF Symbols:
* `folder` / `folder.badge.plus`: Folder navigation and creation
* `pin.fill`: Note pinning
* `square.and.pencil`: New note creation
* `checklist` / `circle` / `checkmark.circle.fill`: Interactive task lists
* `tablecells`: 2x2 table grid insertion
* `textformat`: Typography format dropdown
* `trash`: Note deletion
* `square.and.arrow.up`: Share and export
* `sidebar.left`: Sidebar visibility toggle
* `magnifyingglass`: Search input
* `lock.fill`: Note security toggle

### 2. Design Tokens & macOS Dark Palette
* **Toolbar / Header:** `#262626`
* **Sidebar (240px width):** `#1e1e1e`
* **Notes List (320px width):** `#1c1c1e`
* **Editor Canvas:** `#1e1e1e`
* **Accent Color:** `#e5a00d` (Apple Notes Amber Gold)
* **Active Note Selection:** `#e5a00d` background, `#f5f5f7` text
* **Window Controls:** Red (`#ff5f56`), Yellow (`#ffbd2e`), Green (`#27c93f`)

### 3. Keyboard Accelerators
* `⌘ + N` / `Ctrl + N`: Create new note
* `⇧ + ⌘ + L` / `Ctrl + Shift + L`: Insert checklist item
* `⌥ + ⌘ + T` / `Alt + Cmd + T`: Insert markdown table
* `⌥ + ⌘ + S`: Toggle sidebar visibility

---

## Directory Structure

```
vpple-notes/
├── index.html              # Production standalone root entry for GitHub Pages
├── assets/                 # Compiled CSS and JavaScript bundles
├── REVERSE_ENGINEERING.md  # Factual technical audit and gap analysis
├── CHANGELOG.md            # Version change history
├── frontend/               # React 18 + TypeScript + Vite source code
│   ├── src/
│   │   ├── app/
│   │   │   └── components/ # NotesApp, Sidebar, NotesList, NoteViewer, SFSymbols
│   │   ├── context/        # NotesContext, AuthContext, ToastContext
│   │   ├── utils/          # api.ts, offlineSync.ts, indexedDb.ts, debounce.ts
│   │   ├── styles/         # index.css with Apple Notes variables
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                # Express 4 + TypeScript REST API (optional)
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/         # Notes and folders API routes
│   │   └── db.ts           # PostgreSQL connection pool
│   └── package.json
└── package.json            # Root workspace configuration
```

---

## Running Locally

### Prerequisites
* Node.js 18+
* npm 9+
* Optional: PostgreSQL 17 (only required if running local backend API)

### 1. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
The client starts on `http://localhost:5173`. If no backend is running, the app automatically operates in offline-first mode using IndexedDB and LocalStorage.

### 2. Building for Production
```bash
cd frontend
npm run build
```
Compiled output is written to `frontend/dist/` with relative asset links (`base: './'`).

### 3. Running Backend (Optional)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
The API server starts on `http://localhost:3000`.

---

## License

Derived from the original MIT-compatible work by Luba Kaper. Modifications follow open-source software licensing.
