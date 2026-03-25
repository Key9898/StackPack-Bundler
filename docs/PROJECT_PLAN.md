# StackPack Bundler - Project Plan

## Project Overview

**StackPack Bundler** is a web application that bundles HTML, CSS, JS, Images, and Videos into a single file with automatic Base64 encoding and Shadow DOM isolation.

### Technology Stack

- **Frontend**: React 19.2.0 + TypeScript 5.9.3
- **Styling**: Tailwind CSS v4.1.17
- **Build Tool**: Vite 7.2.4
- **Backend**: Firebase (Auth, Firestore)
- **Icons**: Lucide React

---

## Current Status: Version 0.3.0 Released ✅

### Major Milestones

| Phase | Title                | Status      |
| ----- | -------------------- | ----------- |
| 1     | Critical Fixes       | ✅ Complete |
| 2     | Essential Features   | ✅ Complete |
| 3     | Quality Improvements | ✅ Complete |
| 4     | Nice to Have         | ✅ Complete |
| 5     | UI/UX Refinement     | ✅ Complete |
| 6     | Codebase Hardening   | ✅ Complete |

---

## Phase 1: Critical Fixes

**Goal**: Make the application buildable and fully functional

### Tasks

- [x] **1.1** Fix Tailwind CSS v4 configuration
  - Migrate color definitions to `@theme` directive in `index.css`
  - Remove deprecated `tailwind.config.js` color extensions
  - Test all gradient and color classes

- [x] **1.2** Save bundle content to Firestore
  - Modify `UploadPage.tsx` to save `content` field
  - Update Firestore security rules if needed
  - Test Dashboard download functionality

- [x] **1.3** Create `.env.example` file
  - Document all required environment variables
  - Include placeholder values

- [x] **1.4** Add delete functionality to Dashboard
  - Add delete button to `ProjectCard.tsx`
  - Implement Firestore delete operation
  - Add confirmation dialog

### Success Criteria

- [x] `npm run build` completes without errors
- [x] Dashboard download works correctly
- [x] Projects can be deleted from Dashboard

---

## Phase 2: Essential Features

**Goal**: Improve user experience and reliability

### Tasks

- [x] **2.1** Add toast notification system
  - Create `ToastContext.tsx`
  - Create `Toast.tsx` component
  - Replace `alert()` calls with toast notifications

- [x] **2.2** Add file size validation
  - Warn users for files > 10MB
  - Block files > 50MB
  - Show file size in upload summary

- [x] **2.3** Add progress indicator
  - Show progress during file processing
  - Show progress during Base64 encoding
  - Add cancel button for long operations

- [x] **2.4** Add React Error Boundaries
  - Create `ErrorBoundary.tsx` component
  - Wrap main application sections
  - Add fallback UI

- [x] **2.5** Improve error handling
  - Add user-friendly error messages
  - Log errors to console in development
  - Consider error tracking service for production

### Success Criteria

- [x] All user feedback uses toast notifications
- [x] Large files show appropriate warnings
- [x] Application handles errors gracefully

---

## Phase 3: Quality Improvements

**Goal**: Improve code quality and maintainability

### Tasks

- [x] **3.1** Add unit tests
  - Setup Vitest
  - Add tests for `BundlerLogic.ts`
  - Add tests for `useFileSorter.ts`
  - Add component tests for critical components

- [x] **3.2** Add integration tests
  - Test complete bundling flow
  - Test authentication flow
  - Test dashboard functionality

- [x] **3.3** Add confirmation dialogs
  - Confirm before reset
  - Confirm before delete
  - Create reusable `ConfirmDialog.tsx`

- [x] **3.4** Improve mobile navigation
  - Add hamburger menu for mobile
  - Improve touch targets
  - Test on various screen sizes

- [x] **3.5** Add loading skeletons
  - Create skeleton components
  - Replace loading spinners where appropriate

### Success Criteria

- [x] Test coverage > 70%
- [x] All destructive actions require confirmation
- [x] Mobile experience is smooth

---

## Phase 4: Nice to Have

**Goal**: Add premium features

### Tasks

- [x] **4.1** Add dark mode
  - Create theme context
  - Add theme toggle to header
  - Persist preference in localStorage

- [x] **4.2** Add project sharing
  - Generate shareable links
  - Add public/private project visibility
  - Create shared project view page

- [x] **4.3** Add PWA support
  - Add service worker
  - Add manifest.json
  - Enable offline functionality

- [x] **4.4** Add keyboard shortcuts
  - Document shortcuts
  - Add shortcuts for common actions
  - Show shortcut hints in UI

### Success Criteria

- [x] Dark mode works correctly
- [x] Projects can be shared via link
- [x] PWA installs correctly

---

## Milestones

| Milestone            | Target Phase | Key Deliverables                          |
| -------------------- | ------------ | ----------------------------------------- |
| M1: Stable Build     | Phase 1      | Build works, Dashboard functional         |
| M2: Production Ready | Phase 2      | Error handling, notifications, validation |
| M3: Quality Assured  | Phase 3      | Tests, confirmations, mobile UX           |
| M4: Feature Complete | Phase 4      | Dark mode, sharing, PWA                   |

---

## Risk Assessment

| Risk                         | Probability | Impact | Mitigation                                |
| ---------------------------- | ----------- | ------ | ----------------------------------------- |
| Tailwind v4 breaking changes | High        | High   | Follow migration guide, test thoroughly   |
| Firestore storage limits     | Medium      | Medium | Consider Firebase Storage for large files |
| Browser memory limits        | Medium      | High   | Add file size limits, chunk processing    |
| Firebase pricing             | Low         | Medium | Monitor usage, set budget alerts          |

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │   Vite      │  │   Bundler Logic         │  │
│  │   App       │  │   Dev/Build │  │   - File Processing     │  │
│  │             │  │             │  │   - Base64 Encoding     │  │
│  │             │  │             │  │   - Shadow DOM Isolate  │  │
│  └──────┬──────┘  └─────────────┘  └─────────────────────────┘  │
└─────────┼───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Firebase (Backend-as-a-Service)               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Authentication │  │    Firestore    │  │    Analytics    │  │
│  │  - Google OAuth │  │    - Projects   │  │    - Usage      │  │
│  │  - Email/Pass   │  │    - Users      │  │    - Events     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.tsx
├── ErrorBoundary (outer)
├── ThemeProvider (ThemeContext)
├── AuthProvider (AuthContext)
├── ToastProvider (ToastContext)
│   ├── Header
│   │   └── AuthModal (password visibility toggle)
│   └── ErrorBoundary (inner)
│       ├── UploadPage          ← currentPage === 'upload'
│       │   ├── FileUploader    (drag-drop, size validation)
│       │   ├── ConfirmDialog   (reset confirmation)
│       │   └── KeyboardHints   (shortcut popup)
│       ├── Dashboard           ← currentPage === 'dashboard'
│       │   ├── ProjectCard     (download / delete / share / visibility toggle)
│       │   ├── ProjectCardSkeleton (loading state)
│       │   └── ConfirmDialog   (delete confirmation)
│       └── SharedView          ← URL contains ?project=ID
```

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │────▶│  FileUploader│────▶│ BundlerLogic │
│   Uploads    │     │  (Validate)  │     │ (Process)    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                    ┌─────────────────────────────┘
                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Base64     │────▶│   Shadow DOM │────▶│   Firestore  │
│   Encode     │     │   Isolate    │     │   Save       │
└──────────────┘     └──────────────┘     └──────────────┘
```

### State Management

| State Type   | Location          | Purpose                          |
| ------------ | ----------------- | -------------------------------- |
| Auth State   | `AuthContext.tsx` | User authentication, session     |
| Form State   | `UploadPage.tsx`  | File selection, bundling options |
| UI State     | Local `useState`  | Modals, loading states           |
| Server State | Firestore         | Projects, user data              |

### Firebase Integration

```typescript
// Authentication Flow
User → Google/Email Auth → Firebase Auth → AuthContext → App State

// Firestore Collections
/projects/{projectId}
  - name: string
  - userId: string
  - outputType: 'standalone' | 'zip'
  - fileCount: number
  - content: string (Base64 bundle)
  - createdAt: timestamp
  - updatedAt: timestamp
```

---

## Dependencies Map

### Task Dependencies

```
Phase 1 (All parallel)
├── 1.1 Tailwind Fix ─────────────────────────────────┐
├── 1.2 Firestore Save ───────────────────────────────┤
├── 1.3 .env.example ─────────────────────────────────┤
└── 1.4 Delete Functionality ─────────────────────────┘
                    │
                    ▼ (All Phase 1 must complete)
Phase 2 (All parallel)
├── 2.1 Toast System ─────────────────────────────────┐
├── 2.2 File Validation ──────────────────────────────┤
├── 2.3 Progress Indicator ───────────────────────────┤
├── 2.4 Error Boundaries ─────────────────────────────┤
└── 2.5 Error Handling ───────────────────────────────┘
                    │
                    ▼ (All Phase 2 must complete)
Phase 3 (Sequential recommended)
├── 3.1 Unit Tests ───────────────────────────────────┐
├── 3.2 Integration Tests (depends on 3.1) ───────────┤
├── 3.3 Confirmation Dialogs ─────────────────────────┤
├── 3.4 Mobile Navigation ────────────────────────────┤
└── 3.5 Loading Skeletons ────────────────────────────┘
                    │
                    ▼ (All Phase 3 must complete)
Phase 4 (All parallel)
├── 4.1 Dark Mode ────────────────────────────────────┐
├── 4.2 Project Sharing ──────────────────────────────┤
├── 4.3 PWA Support ──────────────────────────────────┤
└── 4.4 Keyboard Shortcuts ───────────────────────────┘
```

### External Dependencies

| Package      | Version  | Purpose          | Critical  |
| ------------ | -------- | ---------------- | --------- |
| react        | 19.2.0   | UI Framework     | ✅ Yes    |
| react-dom    | 19.2.0   | DOM Rendering    | ✅ Yes    |
| firebase     | ^12.6.0  | Backend Services | ✅ Yes    |
| tailwindcss  | 4.1.17   | Styling          | ✅ Yes    |
| vite         | 7.2.4    | Build Tool       | ✅ Yes    |
| typescript   | 5.9.3    | Type Safety      | ✅ Yes    |
| lucide-react | ^0.555.0 | Icons            | ⚠️ Medium |

### Blocking Issues

| Issue                   | Blocks              | Resolution   |
| ----------------------- | ------------------- | ------------ |
| Tailwind v4 Build Error | All development     | Phase 1.1    |
| Missing .env.example    | New developer setup | Phase 1.3    |
| Node.js Version         | Build process       | Use Node 20+ |

---

## Testing Strategy

### Testing Pyramid

```
                    ┌─────────────┐
                    │    E2E      │  (Future - Playwright)
                    │   Tests     │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │    Integration Tests    │  (Phase 3.2)
              │    - Bundling Flow      │
              │    - Auth Flow          │
              │    - Dashboard          │
              └────────────┬────────────┘
                           │
    ┌──────────────────────┴──────────────────────┐
    │              Unit Tests                      │  (Phase 3.1)
    │    - BundlerLogic.ts                        │
    │    - useFileSorter.ts                       │
    │    - Component rendering                    │
    └─────────────────────────────────────────────┘
```

### Unit Testing (Vitest)

| Target             | Test Focus                                   | Priority |
| ------------------ | -------------------------------------------- | -------- |
| `BundlerLogic.ts`  | File processing, Base64 encoding, Shadow DOM | High     |
| `useFileSorter.ts` | Sorting logic, state management              | High     |
| `FileUploader.tsx` | File selection, validation                   | Medium   |
| `ProjectCard.tsx`  | Rendering, actions                           | Medium   |

### Integration Testing

| Flow          | Test Cases                         | Priority |
| ------------- | ---------------------------------- | -------- |
| Bundling Flow | Upload → Process → Save → Download | High     |
| Auth Flow     | Login → Session → Logout           | High     |
| Dashboard     | Load projects → Delete → Refresh   | Medium   |

### Test Coverage Targets

| Phase   | Target | Focus              |
| ------- | ------ | ------------------ |
| Phase 3 | 70%    | Core functionality |
| Phase 4 | 80%    | All features       |

### Testing Commands

```bash
npm run test          # Run tests (watch mode by default in Vitest)
npm run test:ui       # Open Vitest browser UI
npm run test:coverage # Coverage report
```

---

## Deployment Strategy

### Current Setup

| Environment | Platform | URL                   |
| ----------- | -------- | --------------------- |
| Production  | Vercel   | Auto-deploy from main |
| Development | Local    | localhost:5173        |

### CI/CD Pipeline (Recommended)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Push to   │────▶│   Run       │────▶│   Build     │────▶│   Deploy    │
│   main      │     │   Tests     │     │   Project   │     │   Vercel    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼ (if tests fail)
                    ┌─────────────┐
                    │   Block     │
                    │   Deploy    │
                    └─────────────┘
```

### Environment Management

| Variable          | Development  | Production       |
| ----------------- | ------------ | ---------------- |
| `VITE_FIREBASE_*` | `.env.local` | Vercel Dashboard |
| `NODE_ENV`        | development  | production       |

### Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] Firebase rules updated (if needed)
- [ ] Manual testing on staging

### Deployment Commands

```bash
npm run build    # Production build
npm run preview  # Preview build locally
vercel --prod    # Deploy to production
```

---

## Rollback Plan

### Rollback Triggers

| Trigger         | Action                   |
| --------------- | ------------------------ |
| Build failure   | Fix issue, redeploy      |
| Runtime errors  | Check logs, hotfix       |
| Firebase outage | Wait for Firebase status |
| Critical bug    | Revert commit, redeploy  |

### Rollback Procedure

```
1. Identify the issue
   └── Check Vercel logs
   └── Check browser console
   └── Check Firebase console

2. Determine severity
   └── Critical: Immediate rollback
   └── Medium: Hotfix
   └── Low: Fix in next release

3. Execute rollback
   └── Vercel: Use "Rollback" button
   └── Git: git revert <commit>
   └── Firebase: Restore from backup (if needed)

4. Verify rollback
   └── Test critical flows
   └── Monitor error rates
```

### Backup Strategy

| Component   | Backup Method              | Frequency    |
| ----------- | -------------------------- | ------------ |
| Firestore   | Firebase automatic backups | Daily        |
| Code        | Git repository             | Every commit |
| Environment | Vercel dashboard           | On change    |

---

## Known Limitations

### Browser Compatibility

| Browser | Support    | Notes             |
| ------- | ---------- | ----------------- |
| Chrome  | ✅ Full    | Recommended       |
| Firefox | ✅ Full    | Tested            |
| Safari  | ⚠️ Partial | Shadow DOM quirks |
| Edge    | ✅ Full    | Chromium-based    |
| IE      | ❌ None    | Not supported     |

### File Size Limits

| Limit            | Value | Reason                         |
| ---------------- | ----- | ------------------------------ |
| Max single file  | 50MB  | Browser memory                 |
| Max total bundle | 100MB | Firestore document limit (1MB) |
| Recommended max  | 10MB  | Performance                    |

### Firebase Quotas

| Resource          | Free Tier | Notes              |
| ----------------- | --------- | ------------------ |
| Firestore reads   | 50K/day   | Monitor usage      |
| Firestore writes  | 20K/day   | Monitor usage      |
| Firestore storage | 1GB       | Clean old projects |
| Auth operations   | Unlimited | No limit           |

### Memory Constraints

| Scenario        | Limit          | Mitigation           |
| --------------- | -------------- | -------------------- |
| Base64 encoding | ~2x file size  | Warn users           |
| Large images    | Browser crash  | Block > 50MB         |
| Multiple files  | Memory buildup | Process sequentially |

### Security Considerations

| Risk                  | Mitigation               |
| --------------------- | ------------------------ |
| XSS in uploaded files | Shadow DOM isolation     |
| Unauthorized access   | Firestore security rules |
| Data exposure         | User-specific data only  |

---

## Future Considerations

### Potential Features (Post-Phase 4)

| Feature                 | Complexity | Value  |
| ----------------------- | ---------- | ------ |
| Real-time collaboration | High       | High   |
| Version history         | Medium     | Medium |
| Template library        | Low        | High   |
| API access              | High       | Medium |
| Desktop app (Electron)  | High       | Low    |
| Browser extension       | Medium     | Medium |

### Scalability Considerations

| Area      | Current   | Future            |
| --------- | --------- | ----------------- |
| Storage   | Firestore | Firebase Storage  |
| CDN       | Vercel    | Cloudflare        |
| Auth      | Firebase  | Firebase + Custom |
| Analytics | Firebase  | Custom dashboard  |

### Technology Upgrades

| Current     | Future Upgrade | Trigger        |
| ----------- | -------------- | -------------- |
| React 19    | React 20       | Stable release |
| Tailwind v4 | v5             | Stable release |
| Vite 7      | Vite 8         | Stable release |

### Deprecation Watch

| Item                        | Status        | Alternative         |
| --------------------------- | ------------- | ------------------- |
| `tailwind.config.js` colors | Deprecated    | `@theme` directive  |
| `alert()`                   | Should remove | Toast notifications |

---

## Notes

- Each phase should be completed before moving to the next
- All changes should be tested on both desktop and mobile
- Update this document as tasks are completed or requirements change
