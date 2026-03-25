# StackPack Bundler - Project Rules

## Coding Standards

### TypeScript

- Use strict mode TypeScript
- Always define explicit types for function parameters and return values
- Avoid `any` type - use `unknown` when type is truly unknown
- Use interfaces for object shapes, types for unions/primitives
- Use const assertions for literal types

```typescript
// Good
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

function formatFileSize(bytes: number): string {
  // ...
}

// Bad
function processFile(file: any) { ... }
```

### React Components

- Use functional components with hooks
- Use arrow functions for component definitions
- Place imports in order: React, External libs, Internal modules, Types, Assets
- Destructure props in function signature
- Use descriptive component names in PascalCase

```typescript
// Good
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import type { Project } from '../types';

const ProjectCard: React.FC<{
  project: Project;
  onDelete: (id: string) => void;
}> = ({ project, onDelete }) => {
  // ...
};
```

### File Naming

| Type       | Convention     | Example            |
| ---------- | -------------- | ------------------ |
| Components | PascalCase.tsx | `FileUploader.tsx` |
| Hooks      | camelCase.ts   | `useFileSorter.ts` |
| Utils      | PascalCase.ts  | `BundlerLogic.ts`  |
| Contexts   | PascalCase.tsx | `AuthContext.tsx`  |
| Types      | camelCase.ts   | `types.ts`         |
| Pages      | PascalCase.tsx | `UploadPage.tsx`   |

### Styling (Tailwind CSS v4)

- Use Tailwind utility classes for styling
- **No Inline CSS**: Absolutely NO inline styling (`style={{ ... }}`) is allowed anywhere
  - **Exception**: Third-party library requirements (e.g., `prism-react-renderer` style prop) where inline styles are mandatory
- Use `@theme` directive for custom colors in `index.css`
- Group related classes logically
- Use responsive prefixes for mobile-first design
- For dynamic styles, use conditional Tailwind classes or CSS variables

```css
/* index.css */
@theme {
  --color-amber-500: #f59e0b;
  --color-amber-600: #d97706;
}
```

```typescript
// ✅ Good - Tailwind classes
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">

// ❌ Bad - Inline styles (NEVER use)
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

// ✅ Good - Conditional Tailwind classes
<div className={`px-4 py-2 ${isActive ? 'bg-amber-500' : 'bg-gray-200'}`}>

// ✅ Good - CSS variables for dynamic values
<div style={{ '--custom-width': `${width}px` } as React.CSSProperties} className="w-[var(--custom-width)]">

// ✅ Exception - Third-party library requirement
<Highlight style={prismTheme}>{code}</Highlight>
```

### State Management

- Use React Context for global state (auth, theme, toasts)
- Use local state for component-specific state
- Use `useReducer` for complex state logic
- Lift state up when needed by multiple components

### Error Handling

- Always use try-catch for async operations
- Provide user-friendly error messages
- Log errors to console in development
- Use Error Boundaries for React errors

```typescript
// Good
try {
  await saveProject(project);
  showToast('Project saved successfully!', 'success');
} catch (error) {
  console.error('Failed to save project:', error);
  showToast('Failed to save project. Please try again.', 'error');
}
```

### Firebase

- Use environment variables for all Firebase config
- Never commit `.env` file
- Use Firestore security rules for data protection
- Handle offline scenarios gracefully

### Git Commits

- Use conventional commit format
- Keep commits atomic and focused

```
feat: add delete functionality to dashboard
fix: resolve Tailwind CSS v4 build error
docs: update README with setup instructions
refactor: extract file sorting logic to custom hook
test: add unit tests for BundlerLogic
```

---

## Project Structure

```
src/
├── components/           # Modular components (each in own folder)
│   ├── AuthModal/
│   │   ├── AuthModal.tsx     # Sign In / Sign Up modal with password toggle
│   │   └── index.ts
│   ├── ConfirmDialog/
│   │   ├── ConfirmDialog.tsx # Reusable confirmation dialog (danger/warning variants)
│   │   └── index.ts
│   ├── ErrorBoundary/
│   │   ├── ErrorBoundary.tsx # React error boundary with fallback UI
│   │   └── index.ts
│   ├── FileUploader/
│   │   ├── FileUploader.tsx  # Drag-and-drop uploader with file size validation
│   │   └── index.ts
│   ├── Header/
│   │   ├── Header.tsx        # Navigation + dark mode toggle + mobile hamburger menu
│   │   └── index.ts
│   ├── KeyboardHints/
│   │   ├── KeyboardHints.tsx # Floating shortcuts popup (Ctrl+1/2/Enter/R)
│   │   └── index.ts
│   ├── ProjectCard/
│   │   ├── ProjectCard.tsx   # Project card with download/delete/share/visibility
│   │   └── index.ts
│   └── ProjectCardSkeleton/
│       ├── ProjectCardSkeleton.tsx # Loading skeleton for Dashboard
│       └── index.ts
├── pages/                # Page-level components (flat files)
│   ├── Dashboard.tsx     # Project list with delete, share, visibility toggle
│   ├── SharedView.tsx    # Public project view via ?project=ID URL param
│   └── UploadPage.tsx    # File upload, bundling, preview, generate & download
├── hooks/                # Custom hooks
│   ├── useFileSorter.ts       # Sorts uploaded files by type
│   └── useKeyboardShortcuts.ts # Ctrl+1/2/Enter/R global shortcuts
├── utils/                # Utility functions
│   └── BundlerLogic.ts   # File processing, Base64 encoding, Shadow DOM
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Firebase Auth (Google + Email/Password)
│   ├── ThemeContext.tsx  # Dark/light mode with localStorage persistence
│   └── ToastContext.tsx  # Toast notification system
├── test/                 # Test files
│   ├── setup.ts
│   ├── BundlerLogic.test.ts
│   ├── useFileSorter.test.ts
│   ├── BundlerIntegration.test.ts
│   ├── FileUploader.test.tsx
│   ├── ProjectCard.test.tsx
│   ├── AuthFlow.test.tsx
│   └── DashboardIntegration.test.tsx
├── App.tsx               # Main app — reads ?project= URL, renders SharedView or normal app
├── main.tsx              # Entry point + service worker registration
└── index.css             # Global styles + @theme directive (Tailwind v4)
```

---

## Modular Component Architecture

### Dumb vs Smart Components

This project follows **Modular Component Architecture** - a modern standard for library development.

#### Dumb Components (UI/View)

- Pure UI components with no business logic
- Receive data via props
- Emit events via callbacks
- Located in `ComponentName.tsx` within each component folder

```typescript
// components/Button/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};
```

#### Smart Logic (Hooks)

- Business logic extracted to custom hooks
- Can be reused independently
- Located in `src/hooks/`

```typescript
// hooks/useModal.ts
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
};
```

### Component Folder Structure

Each component should have its own folder:

```
ComponentName/
├── ComponentName.tsx        # UI implementation (Dumb)
├── ComponentName.types.ts   # TypeScript interfaces/types
├── ComponentName.test.tsx   # Unit tests (optional)
├── ComponentName.stories.tsx # Storybook stories (optional)
└── index.ts                 # Public API (barrel export)
```

```typescript
// components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

### API & Services

- API calls and external functions go in `src/utils/` or `src/services/`
- Use `services/` for API-related functions
- Use `utils/` for general utility functions

```typescript
// services/firebase.ts
export const saveProject = async (project: Project) => {
  const docRef = await addDoc(collection(db, 'projects'), project);
  return docRef.id;
};
```

### Mock Data

For testing and development:

- **Web App**: Use `src/demo/mocks/` for mock data
- **Library**: Use Storybook stories or `src/tests/` for mock data

```
demo/
└── mocks/
    ├── projects.ts    # Mock project data
    └── users.ts       # Mock user data
```

```typescript
// demo/mocks/projects.ts
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Demo Project',
    outputType: 'standalone',
    fileCount: 5,
    createdAt: new Date(),
  },
];
```

---

## Commands

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run lint`          | Run ESLint                     |
| `npm run preview`       | Preview production build       |
| `npm run test`          | Run unit tests (watch mode)    |
| `npm run test:ui`       | Run tests with Vitest UI       |
| `npm run test:coverage` | Run tests with coverage report |

---

## Testing

### Test Stack

| Package                     | Purpose                           |
| --------------------------- | --------------------------------- |
| `vitest`                    | Test runner (Vite-native)         |
| `@vitest/ui`                | Browser-based test UI             |
| `jsdom`                     | DOM environment for tests         |
| `@testing-library/react`    | React component testing utilities |
| `@testing-library/jest-dom` | Custom DOM matchers               |

### Test File Locations

```
src/test/
├── setup.ts                        # Global test setup (jest-dom imports)
├── BundlerLogic.test.ts            # Unit tests for bundler logic (13 tests)
├── useFileSorter.test.ts           # Unit tests for useFileSorter hook (7 tests)
├── BundlerIntegration.test.ts      # Integration tests for bundling flow (4 tests)
├── FileUploader.test.tsx           # Component tests for FileUploader (7 tests)
├── ProjectCard.test.tsx            # Component tests for ProjectCard (11 tests)
├── AuthFlow.test.tsx               # Auth flow tests — AuthModal render/toggle (7 tests)
└── DashboardIntegration.test.tsx   # Dashboard integration tests — unauthenticated state (4 tests)
```

### Writing Tests

- Place test files in `src/test/` or co-located as `ComponentName.test.tsx`
- Use `describe` + `it`/`test` structure
- Mock Firebase and browser APIs as needed
- Run `npm run test` to verify before committing

---

## Environment Variables

| Variable                            | Required | Description                       |
| ----------------------------------- | -------- | --------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Yes      | Firebase API key                  |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Yes      | Firebase auth domain              |
| `VITE_FIREBASE_PROJECT_ID`          | Yes      | Firebase project ID               |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Yes      | Firebase storage bucket           |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes      | Firebase messaging sender ID      |
| `VITE_FIREBASE_APP_ID`              | Yes      | Firebase app ID                   |
| `VITE_FIREBASE_MEASUREMENT_ID`      | No       | Firebase analytics measurement ID |

---

## Best Practices

### Performance

- Lazy load pages with `React.lazy()`
- Memoize expensive computations with `useMemo`
- Debounce user input for search/filter
- Optimize images before Base64 encoding

### Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### Security

- Never expose sensitive keys in client code
- Validate user input on both client and server
- Use Firestore security rules
- Sanitize user-generated content

---

## Git Workflow

### Branch Naming Convention

| Branch Type | Pattern                 | Example                    |
| ----------- | ----------------------- | -------------------------- |
| Feature     | `feature/<description>` | `feature/add-dark-mode`    |
| Fix         | `fix/<description>`     | `fix/tailwind-build-error` |
| Hotfix      | `hotfix/<description>`  | `hotfix/auth-redirect`     |
| Release     | `release/<version>`     | `release/v0.2.0`           |
| Docs        | `docs/<description>`    | `docs/update-readme`       |

### Branch Rules

- Always branch from `main`
- Use lowercase with hyphens
- Keep description concise but descriptive
- Delete branch after merge

---

## Code Review Guidelines

### Review Process

```
1. Create feature branch
2. Make changes & commit
3. Push branch & create PR
4. Request review
5. Address feedback
6. Get approval
7. Squash & merge
```

### Review Checklist

#### Code Quality

- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Functions are well-named and focused
- [ ] No duplicated code

#### Functionality

- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] Error handling in place
- [ ] Loading states implemented

#### Testing

- [ ] Unit tests added (if applicable)
- [ ] Manual testing completed
- [ ] Mobile responsiveness checked

#### Documentation

- [ ] README updated (if needed)
- [ ] CHANGELOG updated
- [ ] Comments added for complex logic

### Approval Requirements

| Change Type      | Reviewers Required |
| ---------------- | ------------------ |
| Critical fixes   | 1+                 |
| New features     | 1+                 |
| Breaking changes | 2+                 |
| Documentation    | 1+                 |

---

## Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Related Issue

Closes #<issue-number>

## Changes Made

- Change 1
- Change 2

## Testing

- [ ] Tested locally
- [ ] Unit tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings

## Screenshots (if applicable)

| Before | After |
| ------ | ----- |
| [img]  | [img] |

## Checklist

- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

---

## Documentation Standards

### File Headers

```markdown
# Component Name

Brief description of what this document contains.

## Sections

- Section 1
- Section 2
```

### Code Comments

```typescript
// Good: Explain WHY, not WHAT
// Using setTimeout to ensure DOM is ready before measuring
const measureElement = () => { ... };

// Bad: Obvious comment
// Set loading to true
setLoading(true);
```

### README Structure

```markdown
# Project Name

Brief description

## Features

## Quick Start

## Installation

## Usage

## Configuration

## Contributing

## License
```

### Update Triggers

Update documentation when:

- Adding new features
- Changing existing behavior
- Fixing bugs that affect user experience
- Adding new dependencies
- Changing configuration

---

## Documentation Update Matrix

### When PROJECT_RULES.md Changes

| Section Changed             | Files to Update                    | Action Required                          |
| --------------------------- | ---------------------------------- | ---------------------------------------- |
| **Coding Standards**        | All new files                      | Apply new standards to future code       |
| **File Naming**             | All new files                      | Follow new naming convention             |
| **Project Structure**       | `PROJECT_PLAN.md`                  | Update structure diagram if major change |
| **Git Workflow**            | `.github/` (if exists)             | Create/update branch protection rules    |
| **Code Review Guidelines**  | `.github/pull_request_template.md` | Sync checklist items                     |
| **PR Template**             | `.github/pull_request_template.md` | Copy template to GitHub                  |
| **Documentation Standards** | All `.md` files                    | Apply new standards                      |
| **Environment Variables**   | `.env.example`, `README.md`        | Add new variables                        |

### When PROJECT_PLAN.md Changes

| Section Changed            | Files to Update      | Action Required          |
| -------------------------- | -------------------- | ------------------------ |
| **Phases/Tasks**           | `CHANGELOG.md`       | Add to Upcoming Changes  |
| **Technical Architecture** | `PROJECT_RULES.md`   | Sync structure section   |
| **Dependencies Map**       | `package.json`       | Install new dependencies |
| **Known Limitations**      | `TROUBLESHOOTING.md` | Add relevant issues      |
| **Future Considerations**  | `CHANGELOG.md`       | Note in Upcoming Changes |

### When CHANGELOG.md Changes

| Section Changed      | Files to Update      | Action Required          |
| -------------------- | -------------------- | ------------------------ |
| **New Version**      | `package.json`       | Update version number    |
| **Breaking Changes** | `TROUBLESHOOTING.md` | Add migration steps      |
| **Migration Guides** | `README.md`          | Add upgrade instructions |
| **Features**         | `README.md`          | Update features list     |

### When TROUBLESHOOTING.md Changes

| Section Changed     | Files to Update    | Action Required            |
| ------------------- | ------------------ | -------------------------- |
| **New Issue**       | `PROJECT_PLAN.md`  | Add fix task if critical   |
| **Build Issues**    | `PROJECT_RULES.md` | Update build commands      |
| **Firebase Issues** | `.env.example`     | Verify env vars documented |

### When Adding New Dependencies

| Dependency Type      | Files to Update                    | Action Required                             |
| -------------------- | ---------------------------------- | ------------------------------------------- |
| **Production**       | `package.json`, `PROJECT_RULES.md` | Add to dependencies, update imports section |
| **Development**      | `package.json`, `PROJECT_RULES.md` | Add to devDependencies                      |
| **Type Definitions** | `package.json`                     | Add to devDependencies                      |
| **Environment**      | `.env.example`, `PROJECT_RULES.md` | Document new variables                      |

### When Adding New Features

| Feature Type             | Files to Update                                          | Action Required            |
| ------------------------ | -------------------------------------------------------- | -------------------------- |
| **UI Component**         | `PROJECT_RULES.md`                                       | Follow component structure |
| **Hook**                 | `PROJECT_RULES.md`                                       | Follow hooks section       |
| **API/Service**          | `PROJECT_RULES.md`, `TROUBLESHOOTING.md`                 | Add error handling docs    |
| **Page**                 | `PROJECT_PLAN.md`                                        | Update navigation flow     |
| **Environment Variable** | `.env.example`, `PROJECT_RULES.md`, `TROUBLESHOOTING.md` | Document everywhere        |

---

## Forced Update Checklist

### After Every PROJECT_RULES.md Edit

```
□ Check if .env.example needs new variables
□ Check if TROUBLESHOOTING.md needs new issues
□ Check if CHANGELOG.md needs entry
□ Check if README.md needs updates
□ Verify no conflicts with existing code
□ Run npm run lint to verify standards
```

### After Every PROJECT_PLAN.md Edit

```
□ Check if CHANGELOG.md needs entry
□ Check if PROJECT_RULES.md structure section needs sync
□ Check if TROUBLESHOOTING.md needs new limitations
□ Update LAST_SESSION_SUMMARY.md with decisions
```

### After Every Code Change

```
□ Follow PROJECT_RULES.md coding standards
□ Update CHANGELOG.md if user-facing
□ Update TROUBLESHOOTING.md if new error possible
□ Run npm run lint
□ Test on desktop and mobile
```

---

## Cross-Reference Table

| If You Edit...       | Must Check...          | May Need to Update...                            |
| -------------------- | ---------------------- | ------------------------------------------------ |
| `PROJECT_RULES.md`   | All code files         | `.env.example`, `.github/`, `TROUBLESHOOTING.md` |
| `PROJECT_PLAN.md`    | `CHANGELOG.md`         | `PROJECT_RULES.md`, `TROUBLESHOOTING.md`         |
| `CHANGELOG.md`       | `package.json` version | `README.md`, `TROUBLESHOOTING.md`                |
| `TROUBLESHOOTING.md` | `PROJECT_PLAN.md`      | `PROJECT_RULES.md`                               |
| `package.json`       | `PROJECT_RULES.md`     | `TROUBLESHOOTING.md`                             |
| `.env.example`       | `PROJECT_RULES.md`     | `TROUBLESHOOTING.md`                             |
| Any `.tsx` file      | `PROJECT_RULES.md`     | `CHANGELOG.md`                                   |
| Any `.ts` file       | `PROJECT_RULES.md`     | `CHANGELOG.md`                                   |

---

## Protected Code Policy

### Core Principle

> **"If it ain't broke, don't fix it"**
>
> Only modify code that is explicitly required by the task. Do NOT touch working code.

### Protected Areas

| Area                        | Protection Level | When to Modify                                 |
| --------------------------- | ---------------- | ---------------------------------------------- |
| **Working UI Components**   | 🔒 High          | Only if task explicitly requires UI changes    |
| **Working Logic/Functions** | 🔒 High          | Only if task explicitly requires logic changes |
| **Working Styles**          | 🔒 High          | Only if task explicitly requires style changes |
| **Working Tests**           | 🔒 Medium        | Only if functionality changes                  |
| **Working Config**          | 🔒 Medium        | Only if task requires config change            |

### Modification Rules

#### Before Modifying Any File

```
□ Is this file explicitly mentioned in the task?
□ Is there a bug in this file that needs fixing?
□ Is this modification required for the feature?
□ Will this break existing functionality?

If ALL answers are NO → DO NOT MODIFY
```

#### What NOT to Do

| Action                      | Reason                    |
| --------------------------- | ------------------------- |
| ❌ Refactor working code    | Unnecessary risk          |
| ❌ Rename working variables | Breaks consistency        |
| ❌ Reformat working code    | Creates noise in git diff |
| ❌ Add "improvements"       | Scope creep               |
| ❌ Change working styles    | May break layout          |
| ❌ Optimize working logic   | Premature optimization    |

#### What IS Allowed

| Action              | When Allowed                    |
| ------------------- | ------------------------------- |
| ✅ Fix bugs         | Task requires fix               |
| ✅ Add new features | Task requires feature           |
| ✅ Update styles    | Task requires style change      |
| ✅ Modify logic     | Task requires logic change      |
| ✅ Add new files    | Task requires new functionality |

### Task Interpretation Guide

| Task Type          | What to Modify                 | What NOT to Modify    |
| ------------------ | ------------------------------ | --------------------- |
| **Fix Bug X**      | Only code related to bug X     | All other code        |
| **Add Feature Y**  | New files + integration points | Existing working code |
| **Update Style Z** | Only style Z                   | Other styles, logic   |
| **Refactor A**     | Only A (if explicitly asked)   | Everything else       |
| **Documentation**  | Only .md files                 | All code files        |

### Example Scenarios

#### Scenario 1: Fix Tailwind Build Error

```
Task: Fix Tailwind CSS v4 build error

✅ MODIFY: src/index.css (add @theme directive)
❌ DO NOT MODIFY:
   - Component files
   - Other CSS files
   - Logic files
   - Config files (unless needed)
```

#### Scenario 2: Add Delete Functionality

```
Task: Add delete button to ProjectCard

✅ MODIFY:
   - ProjectCard.tsx (add delete button)
   - Dashboard.tsx (add delete handler)
   - types.ts (if new types needed)

❌ DO NOT MODIFY:
   - Other components
   - Working styles
   - Other logic
   - Auth code
```

#### Scenario 3: Save Bundle Content

```
Task: Save bundle content to Firestore

✅ MODIFY:
   - UploadPage.tsx (add content field to save)

❌ DO NOT MODIFY:
   - UI components
   - Other logic
   - Styles
   - Other pages
```

### Git Commit Discipline

```
Good Commit: "fix: add @theme directive for Tailwind v4 colors"
Bad Commit:  "fix: add @theme directive and refactor components and update styles"

One task = One focused change
```

---

## Notes for AI Assistant

- Always read existing files before making changes
- Follow existing code patterns and conventions
- Run `npm run lint` after making changes
- Test on both desktop and mobile viewports
- Update documentation when adding new features
- **ONLY modify what is explicitly required by the task**
- **DO NOT refactor, rename, or "improve" working code**
- **When in doubt, ask before modifying**
