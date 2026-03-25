# 🎁 StackPack Bundler

A powerful client-side web application for bundling HTML, CSS, JavaScript, and images into a single file. Built with React, TypeScript, and Firebase.

## ✨ Features

### 🎯 Core Functionality

- **Smart Unified Upload**: Single dropzone that automatically sorts files by extension (HTML, CSS, JS, Images)
- **Shadow DOM Isolation**: Web Component output uses Shadow DOM to prevent style conflicts
- **Base64 Image Encoding**: Automatically converts images to Base64 and replaces CSS `url()` references
- **IIFE Wrapping**: JavaScript code is wrapped in Immediately Invoked Function Expressions to prevent variable conflicts
- **Dual Output Formats**:
  - **Standalone HTML**: Single `.html` file with all assets embedded
  - **Web Component**: Reusable `.js` component with Shadow DOM encapsulation

### 🔐 Authentication & Storage

- Google Sign-In integration via Firebase Auth
- Email/Password authentication with Sign Up / Sign In
- Password visibility toggle (Eye/EyeOff icon) in auth form
- Project history saved to Cloud Firestore (for authenticated users)
- Dashboard to view, re-download, delete, and share previous projects
- Public/private project visibility toggle (Globe = public, Lock = private)
- Shareable project links — share bundles with anyone via URL (`?project=ID`)

### 🎨 Design & UX

- Beautiful amber/orange/yellow muted color theme
- Dark mode with toggle button and localStorage persistence
- Responsive design with mobile hamburger navigation menu
- Loading skeleton cards during Dashboard data fetch
- Confirmation dialogs for all destructive actions (delete, reset)
- Toast notifications replacing all browser alerts
- Progress indicator messages during bundle generation
- Cancel button to abort long-running operations
- Keyboard shortcuts: `Ctrl+1` Upload, `Ctrl+2` Dashboard, `Ctrl+Enter` Generate, `Ctrl+R` Reset
- Keyboard shortcuts popup (click "Shortcuts" button in Upload page)

### 📱 PWA Support

- Install as a native-like app on desktop and mobile
- Service worker with offline caching (`public/sw.js`)
- Web App Manifest (`public/manifest.json`)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase project (for authentication and storage features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd stackpack-bundler
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication in Firebase Auth
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase credentials:

   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Creating a Bundle

1. **Upload Files**
   - Drag and drop your HTML, CSS, JS, and image files into the dropzone
   - Or click to browse and select files
   - Files are automatically sorted by type

2. **Choose Output Format**
   - **Standalone HTML**: Creates a single `.html` file with everything embedded
   - **Web Component**: Creates a `.js` file that can be imported and used as a custom element

3. **Customize (Optional)**
   - Enter a custom filename
   - For Web Components, specify the component class name

4. **Generate & Download**
   - Click "Generate & Download" to create your bundle
   - The file will automatically download
   - If signed in, the project is saved to your dashboard

### Using Generated Files

#### Standalone HTML

Simply open the generated `.html` file in any browser. All styles, scripts, and images are embedded.

#### Web Component

Include the generated `.js` file in your HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <!-- Use your custom component -->
    <stack-pack-component></stack-pack-component>

    <!-- Include the component script -->
    <script src="component.js"></script>
  </body>
</html>
```

## 🏗️ Project Structure

```
src/
├── components/              # Modular components (each in own folder)
│   ├── AuthModal/           # Sign In / Sign Up modal with password toggle
│   ├── ConfirmDialog/       # Reusable confirmation dialog
│   ├── ErrorBoundary/       # React error boundary with fallback UI
│   ├── FileUploader/        # Drag-and-drop with size validation
│   ├── Header/              # Navigation + dark mode + mobile menu
│   ├── KeyboardHints/       # Keyboard shortcuts popup
│   ├── ProjectCard/         # Project card with actions
│   └── ProjectCardSkeleton/ # Loading skeleton for Dashboard
├── contexts/                # React contexts
│   ├── AuthContext.tsx      # Firebase Auth
│   ├── ThemeContext.tsx     # Dark/light mode
│   └── ToastContext.tsx     # Toast notifications
├── hooks/                   # Custom React hooks
│   ├── useFileSorter.ts     # File sorting logic
│   └── useKeyboardShortcuts.ts # Global keyboard shortcuts
├── pages/                   # Page-level components
│   ├── Dashboard.tsx        # Project history with visibility toggle
│   ├── SharedView.tsx       # Public project view (?project=ID)
│   └── UploadPage.tsx       # Main upload interface
├── utils/                   # Utility functions
│   └── BundlerLogic.ts      # Core bundling logic
├── test/                    # Test files (50 tests)
├── App.tsx                  # Main component + SharedView routing
├── firebaseConfig.ts        # Firebase initialization
├── index.css                # Global styles + Tailwind v4 @theme
└── main.tsx                 # Entry point + service worker registration
```

## 🔧 Technical Details

### File Processing Pipeline

1. **File Upload & Sorting**
   - Files are categorized by extension using `useFileSorter` hook
   - Supported types: HTML, CSS, JS/JSX/TS/TSX, JPG/PNG/GIF/SVG/WEBP

2. **Image Processing**
   - Images are converted to Base64 using FileReader API
   - A map is created: `filename → base64Data`

3. **CSS Processing**
   - CSS files are read as text
   - Regex pattern matches all `url()` references
   - Image paths are replaced with Base64 data URLs

4. **JavaScript Processing**
   - JS files are wrapped in IIFE for scope isolation
   - Prevents global variable conflicts

5. **Bundle Generation**
   - **HTML Mode**: Injects `<style>` and `<script>` tags into HTML
   - **Component Mode**: Creates a Web Component class with Shadow DOM

### Shadow DOM Benefits

- Style encapsulation (no CSS leakage)
- DOM isolation (no ID/class conflicts)
- Reusable across different pages

### Zero Backend Architecture

- All processing happens in the browser
- No server-side code required
- Firebase used only for auth and storage (optional)

## 🎨 Customization

### Changing Theme Colors

Edit the `@theme` directive in `src/index.css` (Tailwind CSS v4):

```css
@theme {
  --color-amber-500: #f59e0b;
  --color-amber-600: #d97706;
  /* Add your custom colors here */
}
```

### Adding File Type Support

Edit `src/hooks/useFileSorter.ts` to add new file extensions:

```typescript
case 'newext':
  sorted.newCategory.push(file);
  break;
```

## 📦 Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend services by [Firebase](https://firebase.google.com/)

---

Made with ❤️ using StackPack Bundler
