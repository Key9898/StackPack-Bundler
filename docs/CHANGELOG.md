# Changelog

All notable changes to StackPack Bundler will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 2026-03-26

### Added

- **FirebaseService** — Centralized all Firestore database operations into a dedicated service layer, separating business logic from UI components.
- **Component Types** — Extracted all Prop interfaces into separate `ComponentName.types.ts` files across the entire codebase to satisfy strict project rules.
- **Footer Component** — Professional footer with dynamic year and developer attribution.
- **Tooling Integration** — Integrated Storybook (v10) for component documentation, and Prettier/ESLint for automated code quality.

### Changed

- **Layout Symmetry** — Equalized all vertical spacing (Header-Content vs Content-Footer) to a consistent 64px for a "Pro" visual balance.
- **Project Structure** — Fully refactored into a modular folder structure with barrel exports for all internal components.
- **Padding Optimization** — Minimized content-bottom padding to reduce excessive gaps on short pages while maintaining sticky footer standards.

---

## [0.2.0] - 2026-03-25

### Added

#### Feature Phases

- **Phase 1: Critical Fixes** — `.env.example` file, project delete functionality, and bundle content Firestore persistence.
- **Phase 2: Essential Features** — Toast notification system, file size validation (10MB/50MB), progress indicators, and React Error Boundaries.
- **Phase 3: Quality Improvements** — Vitest unit & integration tests (30+ tests), reusable confirmation dialogs, mobile navigation menu, and project skeletons.
- **Phase 4: Nice to Have** — Full dark mode support, project sharing links, PWA capability, and global keyboard shortcuts.

#### Detailed Features

- **SharedView Page** — Public project viewing and downloading via `?project=ID` URL parameter.
- **Public/Private Toggle** — Globe/Lock icons on Dashboard cards to control project visibility.
- **KeyboardHints Component** — Floating UI with hints for common shortcuts (Ctrl+1, Ctrl+2, etc.).
- **Cancel Button** — `StopCircle` icon to safely abort bundling operations in progress.
- **Password Visibility Toggle** — Eye/EyeOff icons in AuthModal for better security UX.
- **Strict Typing** — Added explicit return types for all functions in AuthContext, UploadPage, and Dashboard.

### Changed

- **UI Layout Alignment** — Standardized `max-width` to 6xl and horizontal padding to `px-4`; unified heading positions for perfect vertical alignment.
- **Modular Architecture** — Refactored all components into modular folders with barrel exports.
- **App Navigation** — Improved navigation logic to allow users to exit a SharedView link and return to the main app.
- **Dark Mode** — Applied dark mode styling across the entire application using Tailwind v4.

### Fixed

- **Service Worker Invalidation** — Bumped cache version to `stackpack-v2` to force refresh old CSS.
- Added missing `VITE_FIREBASE_MEASUREMENT_ID` to environment configuration.

### Removed

- **i18n System** — Removed unused localization context and files to maintain codebase simplicity.

---

## [0.1.0] - Initial Release

### Added

#### Core Features

- **File Bundling**: Bundle HTML, CSS, JS, images, and videos into a single file
- **Base64 Encoding**: Automatic conversion of images and videos to Base64
- **CSS URL Replacement**: Replace CSS `url()` references with Base64 data URLs
- **IIFE Wrapping**: Wrap JavaScript in IIFE for scope isolation
- **Shadow DOM Support**: Generate Web Components with Shadow DOM isolation

#### Output Formats

- **Standalone HTML**: Self-contained HTML file with embedded assets
- **Web Component JS**: Reusable custom element with Shadow DOM

#### User Interface

- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **File Type Icons**: Visual indicators for different file types
- **Preview Modal**: Preview generated bundle before download
- **File Summary**: Display categorized file counts

#### Authentication

- **Google Sign-In**: One-click authentication with Google
- **Email/Password**: Traditional email and password authentication
- **Auth Modal**: Unified sign-in/sign-up interface

#### Dashboard

- **Project History**: View all saved projects
- **Project Cards**: Display project metadata and actions
- **Download from Dashboard**: Download previously generated bundles

#### Technical

- React 19.2.0 with TypeScript 5.9.3
- Tailwind CSS v4.1.17 for styling
- Vite 7.2.4 for build tooling
- Firebase Authentication
- Firebase Firestore for data persistence
- Framer Motion for animations
- Lucide React for icons

---

## Version History

| Version | Date    | Description                                      |
| ------- | ------- | ------------------------------------------------ |
| 0.1.0   | TBD     | Initial release with core bundling functionality |
| 0.2.0   | Planned | Critical fixes and stability improvements        |
| 0.3.0   | Planned | Essential features and UX improvements           |
| 0.4.0   | Planned | Quality improvements and testing                 |
| 1.0.0   | Planned | Production-ready release                         |

---

## Upcoming Changes

### [0.2.0] - Planned

#### Fixed

- Tailwind CSS v4 build error
- Bundle content not saved to Firestore
- Missing `.env.example` file

#### Added

- Delete functionality for projects
- Toast notification system
- File size validation
- Progress indicator for file processing

---

## Breaking Changes

### Version Compatibility

| From Version | To Version | Breaking Changes               | Migration Required |
| ------------ | ---------- | ------------------------------ | ------------------ |
| 0.1.0        | 0.2.0      | Environment variables required | Yes                |

### Breaking Change Policy

- Breaking changes require version bump (major for 1.0+, minor for pre-release)
- Must include migration guide
- Must announce in CHANGELOG with `BREAKING:` prefix
- Provide deprecation notice when possible

### Example Breaking Change Entry

```markdown
### [0.2.0]

#### Breaking Changes

- `BREAKING:` Firebase configuration now requires environment variables
  - Migration: Copy `.env.example` to `.env` and fill in values
  - See Migration Guide below
```

---

## Migration Guides

### Migrating from 0.1.0 to 0.2.0

#### Firebase Environment Variables

**Before (0.1.0):**

```typescript
// firebaseConfig.ts - hardcoded values
const firebaseConfig = {
  apiKey: 'your-api-key-here',
  authDomain: 'your-project.firebaseapp.com',
  // ...
};
```

**After (0.2.0):**

```typescript
// firebaseConfig.ts - environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

**Steps:**

1. Copy `.env.example` to `.env`
2. Fill in your Firebase project values
3. Restart development server
4. Verify authentication works

---

## Contributors

### Core Team

| Name  | Role                 | GitHub                             |
| ----- | -------------------- | ---------------------------------- |
| keych | Creator & Maintainer | [@keych](https://github.com/keych) |

### How to Contribute

1. Fork the repository
2. Create a feature branch (`feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Recognition

Contributors will be listed here after their first merged PR.

---

## Notes

- This changelog is maintained manually
- Update this file with each release
- Include breaking changes, new features, fixes, and deprecations
- Follow [Keep a Changelog](https://keepachangelog.com/) format
