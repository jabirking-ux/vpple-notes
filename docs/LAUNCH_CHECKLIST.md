#  iCloud Notes Clone - Launch Checklist

**Repo:** https://github.com/LubaKaper/iCloud-Notes-Clone.git  
**Status:** READY TO BUILD  
**Date:** February 9, 2026

---

##  What You Have (Complete Package)

###  Documentation Files
- [x] `README_START_HERE.md` - Overview & strategy
- [x] `PROJECT_SETUP.md` - Detailed 5-day breakdown + daily prompts
- [x] `GITHUB_SETUP_INSTRUCTIONS.md` - Step-by-step GitHub setup
- [x] `FIGMA_DESIGN_INTEGRATION_GUIDE.md` - How Figma design works
- [x] `icloud_notes_prd_refined.docx` - Your PRD
- [x] `icloud_notes_ui_spec.docx` - Design specification
- [x] `icloud_notes_css_polish_guide.docx` - CSS refinement guide
- [x] `icloud_notes_tailwind_template.jsx` - Tailwind template

###  Starter Code Files
- [x] `NotesApp.tsx` - Main three-column layout
- [x] `Sidebar.tsx` - Folders & tags (200px width)
- [x] `NotesList.tsx` - Search & note list (360px width)
- [x] `NoteViewer.tsx` - Editor & toolbar (flex width)
- [x] `package.json` - Frontend dependencies (React 18, Tailwind, shadcn/ui)

###  Instructions & Guides
- [x] Daily Claude Code prompts (Day 1-5)
- [x] Git workflow instructions
- [x] Troubleshooting guide
- [x] Tech stack reference
- [x] Time estimates

---

##  Your Implementation Checklist

### Before You Start (DO THIS FIRST)
- [ ] Download all files from outputs folder
- [ ] Read `README_START_HERE.md` (5 min read)
- [ ] Clone your GitHub repo locally
- [ ] Create feature branch: `git checkout -b feature/autosave-backend-day1`

### Day 1: Backend Architecture (Express + PostgreSQL)
**Time estimate:** Full day  
**Claude Code:** Yes, ~80% of work  
**Manual:** ~20% (setup, testing, debugging)

**Checklist:**
- [ ] Run `mkdir -p docs` and copy all `.md` and `.docx` files into `docs/`
- [ ] Run `mkdir -p frontend/src/app/components` and copy `.tsx` files
- [ ] Run `mkdir -p backend/src/{routes,models,middleware}`
- [ ] `cd frontend && npm install && npm run dev` (verify it runs)
- [ ] Install Claude Code: `npm install -g @anthropic-ai/claude-code`
- [ ] Run Claude Code in project root: `claude-code`
- [ ] Give Claude Code the **Day 1 prompt** (from PROJECT_SETUP.md)
- [ ] Review generated backend code
- [ ] Set up `.env` file with PostgreSQL credentials
- [ ] Run backend: `cd backend && npm install && npm run dev`
- [ ] Test API endpoints with curl/Postman
- [ ] Commit: `git commit -am "feat: Day 1 - Express backend CRUD endpoints"`
- [ ] Push: `git push origin feature/autosave-backend-day1`

**Success = Backend running on localhost:3000, frontend on localhost:5173**

---

### Day 2: State Management & Component Wiring
**Time estimate:** Full day  
**Claude Code:** Yes, ~70% of work  
**Manual:** ~30% (integration, testing)

**Checklist:**
- [ ] Run Claude Code again
- [ ] Give Claude Code the **Day 2 prompt** (from PROJECT_SETUP.md)
- [ ] Claude Code generates React Context + custom hooks
- [ ] Update components to use Context
- [ ] Wire Sidebar → NotesList → NoteViewer clicks
- [ ] Test: Click sidebar folder → updates NotesList
- [ ] Test: Click note → shows in NoteViewer
- [ ] Verify API calls work (create, fetch, list)
- [ ] Commit: `git commit -am "feat: Day 2 - State management & wiring"`
- [ ] Push changes

**Success = Components talk to each other, data flows correctly**

---

### Day 3: Autosave & Persistence
**Time estimate:** Full day  
**Claude Code:** Yes, ~50% of work  
**Manual:** ~50% (integration, testing, debugging)

**Checklist:**
- [ ] Run Claude Code again
- [ ] Give Claude Code the **Day 3 prompt** (from PROJECT_SETUP.md)
- [ ] Claude Code generates debounce utility + IndexedDB service
- [ ] Integrate autosave into NoteViewer (800ms debounce)
- [ ] Add blur trigger for autosave
- [ ] Implement revision field in API call
- [ ] Test: Type in editor → autosaves after 800ms
- [ ] Test: Type, blur → saves immediately
- [ ] Test: Refresh page → notes persist (IndexedDB)
- [ ] Add "Saving..." / "Saved" status UI
- [ ] Commit: `git commit -am "feat: Day 3 - Autosave with IndexedDB"`
- [ ] Push changes

**Success = Zero data loss; autosave triggers correctly**

---

### Day 4: Polish & Features
**Time estimate:** Full day  
**Claude Code:** Yes, ~40% of work  
**Manual:** ~60% (integration, testing, refinement)

**Checklist:**
- [ ] Run Claude Code again
- [ ] Give Claude Code the **Day 4 prompt** (from PROJECT_SETUP.md)
- [ ] Claude Code generates search filter + delete dialog + error handling
- [ ] Integrate search into NotesList
- [ ] Test: Type in search → filters notes correctly
- [ ] Add delete confirmation dialog
- [ ] Test: Delete note → confirms first
- [ ] Add error boundaries & error toasts
- [ ] Test: Break network → shows error, can retry
- [ ] Refine UI/UX based on testing
- [ ] Compare with original iCloud design
- [ ] Adjust Tailwind classes if needed (colors, spacing)
- [ ] Commit: `git commit -am "feat: Day 4 - Search, delete, error handling"`
- [ ] Push changes

**Success = All features work; UI matches design; errors handled**

---

### Day 5: Testing & Deployment
**Time estimate:** Full day  
**Claude Code:** Optional, ~20% of work  
**Manual:** ~80% (testing, deployment, verification)

**Checklist:**

**Testing:**
- [ ] Create note → appears in list immediately
- [ ] Edit note → autosaves (check in DevTools Network tab)
- [ ] Refresh page → notes still there
- [ ] Search filters correctly
- [ ] Delete shows confirmation
- [ ] Try deleting while offline → saved locally
- [ ] Come back online → syncs to server
- [ ] Multiple browser tabs → both stay in sync
- [ ] Test on mobile viewport (responsive design)
- [ ] Check browser console → no errors

**Deployment:**
- [ ] Frontend: Push to Vercel
  ```bash
  # If using Vercel CLI:
  npm install -g vercel
  vercel --prod  # from frontend folder
  ```
- [ ] Backend: Deploy to Railway or Heroku
  ```bash
  # Railway: https://railway.app (connect GitHub)
  # Heroku: https://heroku.com (or use Railway)
  ```
- [ ] Update API URLs in frontend `.env` to production backend
- [ ] Redeploy frontend with production API URL
- [ ] Test production URLs work
- [ ] Verify database migrations ran

**Final Verification:**
- [ ] [ ] Create note on production → appears in list
- [ ] [ ] Edit note → autosaves
- [ ] [ ] Refresh → data persists
- [ ] [ ] All features work end-to-end
- [ ] [ ] Share URLs with others → they can use it

**Commit & Push:**
- [ ] `git commit -am "feat: Day 5 - Production deployment"`
- [ ] `git push origin feature/autosave-backend-day1`

**Create Pull Request:**
- [ ] Go to GitHub repo
- [ ] Click "Compare & pull request"
- [ ] Set base to `main`, compare to `feature/autosave-backend-day1`
- [ ] Title: "feat: iCloud Notes MVP - Complete 5-day build"
- [ ] Description: Include production URLs
- [ ] Create PR

**Success = Live MVP with zero data loss, all features working**

---

##  Daily Check-Ins

### End of Each Day, Verify:
- [ ] Frontend still runs on localhost:5173
- [ ] Backend still runs on localhost:3000
- [ ] No console errors
- [ ] Tests pass
- [ ] Code committed & pushed
- [ ] PR updated (or will create at end)

---

##  Critical Milestones

**Day 1 DONE when:**
- Backend API running 
- CRUD endpoints tested 
- Database connected 

**Day 2 DONE when:**
- Components wired to state 
- Clicking sidebar updates list 
- Selecting note shows content 

**Day 3 DONE when:**
- Autosave works on keystroke 
- Autosave works on blur 
- Data persists after refresh 

**Day 4 DONE when:**
- Search filters notes 
- Delete has confirmation 
- Errors handled & shown 

**Day 5 DONE when:**
- All features tested 
- Frontend deployed 
- Backend deployed 
- Production URLs work 

---

##  If You Get Stuck

**Frontend won't run:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend won't connect to DB:**
- Check PostgreSQL is running
- Verify `.env` DATABASE_URL is correct
- Check database exists

**Claude Code output doesn't work:**
- Read the generated code carefully
- Check for missing imports
- Verify file paths are correct
- Ask me for help (I'm available!)

**Git conflicts:**
```bash
git pull origin feature/autosave-backend-day1
# Resolve conflicts in editor
git add -A
git commit -m "fix: resolve merge conflicts"
git push origin feature/autosave-backend-day1
```

---

##  Support During Sprint

**I'm here for:**
-  Clarifying requirements
-  Debugging Claude Code output
-  Reviewing your code
-  Git/branch help
-  Deployment questions
-  Architecture questions
-  Performance optimization
-  Anything else!

**Just ask in the chat!** 

---

##  Success Criteria (End of Day 5)

You've succeeded when:

 **Functionality:**
- Users can create notes
- Users can view/search notes
- Users can edit notes
- Users can delete notes
- Autosave works (800ms debounce + blur)
- Zero data loss (IndexedDB fallback)

 **Design:**
- Three-column layout matches iCloud
- Colors/spacing match design spec
- Responsive on mobile

 **Technical:**
- Frontend deployed (Vercel)
- Backend deployed (Railway/Heroku)
- Production URLs work
- Code is clean & documented

 **Delivery:**
- Pull request created
- All code committed
- README with production links
- No console errors

---

##  Final Metrics

| Metric | Target | Result |
|--------|--------|--------|
| Time Spent | 5 days | __ days |
| Features Complete | 5/5 | __/5 |
| Bugs Found & Fixed | <5 | __ |
| Production Uptime | 100% | _% |
| Data Loss | 0 | __ |

---

##  You're Ready!

**Next step: Read `GITHUB_SETUP_INSTRUCTIONS.md` and start Day 1!**

Good luck! I'll be here for support throughout. 

---

**Questions? Ask anytime. Let's build! **
