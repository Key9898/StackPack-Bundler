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
- Project history saved to Cloud Firestore (for authenticated users)
- Dashboard to view and re-download previous projects

### 🎨 Design
- Beautiful amber/orange/yellow muted color theme
- Smooth animations and transitions
- Responsive design for all screen sizes
- Professional, modern UI with glassmorphism effects

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
├── components/          # Reusable UI components
│   ├── FileUploader.tsx    # Drag-and-drop file upload
│   ├── Header.tsx          # Navigation and auth
│   └── ProjectCard.tsx     # Project display card
├── hooks/              # Custom React hooks
│   └── useFileSorter.ts    # File sorting logic
├── pages/              # Main application pages
│   ├── Dashboard.tsx       # Project history
│   └── UploadPage.tsx      # Main upload interface
├── utils/              # Utility functions
│   └── BundlerLogic.ts     # Core bundling logic
├── App.tsx             # Main application component
├── AuthContext.tsx     # Authentication context
├── firebaseConfig.ts   # Firebase initialization
├── index.css           # Global styles & Tailwind
└── main.tsx            # Application entry point
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
Edit `tailwind.config.js` to modify the color palette:

```javascript
theme: {
  extend: {
    colors: {
      amber: {
        // Your custom colors
      },
    },
  },
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
