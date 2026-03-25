# StackPack Bundler - Troubleshooting Guide

Common issues and their solutions for StackPack Bundler.

---

## Table of Contents

1. [Build Issues](#build-issues)
2. [Test Issues](#test-issues)
3. [Authentication Issues](#authentication-issues)
4. [Firebase Issues](#firebase-issues)
5. [File Upload Issues](#file-upload-issues)
6. [Dashboard Issues](#dashboard-issues)
7. [Development Environment](#development-environment)
8. [Performance Issues](#performance-issues)

---

## Build Issues

### Tailwind CSS v4 Build Error

**Error:**

```
Error: Cannot apply unknown utility class `from-amber-500`
```

**Cause:** Tailwind CSS v4 changed how custom colors are defined. The `@theme` directive is now required.

**Solution:**

1. Open `src/index.css`
2. Add the `@theme` directive with your custom colors:

```css
@import 'tailwindcss';

@theme {
  --color-amber-500: #f59e0b;
  --color-amber-600: #d97706;
  --color-amber-700: #b45309;
}
```

3. Restart the development server

---

### TypeScript Compilation Errors

**Error:**

```
error TS2307: Cannot find module '...' or its corresponding type declarations.
```

**Solutions:**

| Cause                    | Solution                                  |
| ------------------------ | ----------------------------------------- |
| Missing dependency       | Run `npm install`                         |
| Missing type definitions | Run `npm install -D @types/package-name`  |
| Path alias issue         | Check `tsconfig.json` paths configuration |

---

### Vite Build Fails

**Error:**

```
Build failed with errors
```

**Debugging Steps:**

1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for circular dependencies
4. Verify all imports are correct

---

## Test Issues

### Vitest Not Found

**Error:**

```
sh: vitest: command not found
```

**Solution:**

```bash
npm install
npm run test
```

---

### Tests Fail with jsdom Errors

**Error:**

```
ReferenceError: document is not defined
```

**Solution:** Ensure `vite.config.ts` uses `vitest/config` import and has `environment: 'jsdom'`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

---

### Test Commands

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run test`          | Run tests in watch mode  |
| `npm run test:ui`       | Open Vitest browser UI   |
| `npm run test:coverage` | Generate coverage report |

---

## Authentication Issues

### Google Sign-In Not Working

**Symptoms:**

- Popup closes immediately
- "Authentication failed" error
- Redirect loop

**Solutions:**

| Issue                 | Solution                                                                        |
| --------------------- | ------------------------------------------------------------------------------- |
| Domain not authorized | Add domain to Firebase Console > Authentication > Settings > Authorized domains |
| Wrong API key         | Verify `VITE_FIREBASE_API_KEY` in `.env`                                        |
| Popup blocked         | Ask user to allow popups or use redirect method                                 |

---

### Session Not Persisting

**Symptoms:**

- User logged out on refresh
- Auth state lost

**Solutions:**

1. Check browser localStorage is enabled
2. Verify Firebase Auth persistence setting
3. Check for conflicting auth state listeners

```typescript
import { getAuth, setPersistence, browserLocalSessionPersistence } from 'firebase/auth';

const auth = getAuth();
setPersistence(auth, browserLocalSessionPersistence);
```

---

## Firebase Issues

### Firestore Permission Denied

**Error:**

```
FirebaseError: Missing or insufficient permissions
```

**Solutions:**

1. Check Firestore Security Rules in Firebase Console
2. Verify user is authenticated before accessing data
3. Ensure correct collection/document path

**Example Security Rules (with public project sharing support):**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      // Authenticated owner can read/write their own projects
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // Anyone can read a project marked as public (for SharedView)
      allow read: if resource.data.isPublic == true;
    }
  }
}
```

---

### Shared Project Not Loading (SharedView)

**Symptoms:**

- Visiting `?project=ID` URL shows "Project not found"
- Visiting `?project=ID` URL shows "This project is private"
- Getting `FirebaseError: Missing or insufficient permissions`

**Solutions:**

| Issue                              | Solution                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| Project is private                 | Go to Dashboard → click the 🔒 Lock icon on the project to make it public    |
| Firestore rules block public reads | Update security rules — add `allow read: if resource.data.isPublic == true;` |
| Wrong project ID                   | Verify the URL was copied from the Share button in Dashboard                 |
| Project deleted                    | The project no longer exists — regenerate and share again                    |

---

### Firebase Configuration Error

**Error:**

```
Firebase: Error (auth/invalid-api-key)
```

**Solutions:**

| Check              | Action                                  |
| ------------------ | --------------------------------------- |
| `.env` file exists | Create `.env` from `.env.example`       |
| Variables prefixed | Ensure `VITE_` prefix on all variables  |
| Server restarted   | Restart dev server after `.env` changes |
| Correct values     | Verify values match Firebase Console    |

---

### Quota Exceeded

**Error:**

```
FirebaseError: Resource exhausted
```

**Solutions:**

1. Check Firebase Console for quota limits
2. Upgrade Firebase plan if needed
3. Implement caching to reduce reads
4. Add rate limiting

---

## File Upload Issues

### File Too Large

**Symptoms:**

- Upload hangs
- Browser becomes unresponsive
- Out of memory error

**Solutions:**

| Issue          | Solution                                              |
| -------------- | ----------------------------------------------------- |
| Large files    | Implement file size validation (max 10MB recommended) |
| Too many files | Limit number of files per bundle                      |
| Memory limit   | Warn user about large bundles                         |

**Recommended Limits:**

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 100;
```

---

### Unsupported File Type

**Error:**

```
Unsupported file type: .xyz
```

**Supported Types:**

| Category   | Extensions                                               |
| ---------- | -------------------------------------------------------- |
| HTML       | `.html`, `.htm`                                          |
| CSS        | `.css`                                                   |
| JavaScript | `.js`, `.mjs`                                            |
| Images     | `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.ico` |
| Video      | `.mp4`, `.webm`, `.ogg`                                  |
| Fonts      | `.woff`, `.woff2`, `.ttf`, `.eot`                        |

---

## Dashboard Issues

### Projects Not Loading

**Symptoms:**

- Empty dashboard
- Loading spinner forever
- "No projects found" when projects exist

**Debugging:**

1. Check browser console for errors
2. Verify Firestore connection
3. Check authentication state
4. Verify security rules allow read

---

### Download Not Working

**Symptoms:**

- Download button does nothing
- File is empty or corrupted

**Solutions:**

| Issue             | Solution                                     |
| ----------------- | -------------------------------------------- |
| Content not saved | Ensure `content` field is saved to Firestore |
| Browser blocking  | Check popup/download settings                |
| Large file        | May need to chunk the download               |

---

## Development Environment

### Node.js Version Warning

**Warning:**

```
Node.js version x.x.x is not supported
```

**Requirements:**

- Node.js 18.x or higher
- npm 9.x or higher

**Solution:**

```bash
# Using nvm
nvm install 18
nvm use 18

# Or install from nodejs.org
```

---

### Port Already in Use

**Error:**

```
Port 5173 is already in use
```

**Solutions:**

1. Kill process using the port
2. Use different port: `npm run dev -- --port 5174`

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

---

### Environment Variables Not Loading

**Symptoms:**

- `import.meta.env.VITE_*` returns undefined
- Firebase initialization fails

**Solutions:**

| Check           | Action                         |
| --------------- | ------------------------------ |
| File location   | `.env` must be in project root |
| Variable prefix | Must start with `VITE_`        |
| Server restart  | Restart after `.env` changes   |
| File format     | No spaces around `=`           |

**Correct Format:**

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

---

## Performance Issues

### Slow Bundle Generation / Stuck Processing

**Causes & Solutions:**

| Cause           | Solution                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| Large files     | Add file size validation (warn >10MB, block >50MB — already implemented) |
| Many files      | Progress messages shown during processing                                |
| Base64 encoding | Warn about large images/videos                                           |
| Slow network    | Add offline support (PWA cache)                                          |

**Cancelling a running operation:**
If the generation is taking too long, click the **Cancel** button (red `StopCircle` icon) that appears next to the Generate button during processing. The operation will be marked as cancelled and the UI will reset. The background work may still complete but the result will be discarded.

---

### Memory Leaks

**Symptoms:**

- Browser tab uses excessive memory
- Performance degrades over time

**Solutions:**

1. Clean up event listeners in `useEffect`
2. Cancel pending requests on unmount
3. Use `React.memo` for expensive components

```typescript
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal });

  return () => controller.abort();
}, []);
```

---

## Getting Help

### Before Asking

1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Check browser console for errors
4. Try clearing cache and reinstalling

### When Reporting Issues

Include:

- Node.js version (`node -v`)
- npm version (`npm -v`)
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (screenshots if possible)

---

## Quick Reference

| Issue                                        | Quick Fix                                                                                                             |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Build fails                                  | Clear cache: `rm -rf node_modules/.vite`                                                                              |
| Tests not running                            | Run `npm install`, then `npm run test`                                                                                |
| jsdom errors in tests                        | Check `vite.config.ts` uses `vitest/config`                                                                           |
| Auth not working                             | Check `.env` file and restart server                                                                                  |
| Firestore error                              | Check security rules in Firebase Console                                                                              |
| Slow performance                             | Check file sizes, add validation                                                                                      |
| Port in use                                  | Kill process or use different port                                                                                    |
| Dark mode not persisting                     | Check `localStorage` key `theme` in browser DevTools                                                                  |
| Dark mode does nothing after rebuild         | Service worker cached old CSS — do a hard refresh (`Ctrl+Shift+R`) or bump `CACHE_NAME` in `public/sw.js`             |
| Components appear light-colored in dark mode | Ensure `dark:` Tailwind variants are in component className strings; `@custom-variant dark` is defined in `index.css` |
| PWA not installing                           | Verify `public/manifest.json` and `public/sw.js` exist                                                                |
| Shared project says "private"                | Click Lock icon on ProjectCard in Dashboard to make it public                                                         |
| Shared project "permission denied"           | Add `allow read: if resource.data.isPublic == true;` to Firestore rules                                               |
| Processing stuck                             | Click **Cancel** button (StopCircle icon) next to Generate button                                                     |
| Password field shows plain text              | Click Eye icon to toggle — EyeOff = hidden, Eye = visible                                                             |

---

_Last updated: 2026-03-25 (added SharedView Firestore rules, cancel operation, password toggle, dark mode component coverage, service worker cache invalidation)_
