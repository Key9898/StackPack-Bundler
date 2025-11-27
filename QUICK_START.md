# 🚀 Quick Start Guide

Get started with StackPack Bundler in 5 minutes!

## Prerequisites
- Node.js installed (v18+)
- A Google account (for authentication features)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase (Optional - for saving projects)

If you want to save projects and use authentication:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Google Authentication
3. Create a Firestore database
4. Copy your Firebase config

Create a `.env` file:
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

**Note**: The app works without Firebase, but you won't be able to save projects.

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## First Test - Using Demo Files

The easiest way to test the bundler is with the included demo files:

1. **Open the app** at http://localhost:5173
2. **Drag and drop** all files from the `demo-files/` folder into the upload zone:
   - demo.html
   - demo.css
   - demo.js
   - demo.png
3. **Choose output format**: Standalone HTML or Web Component
4. **Click "Generate & Download"**
5. **Open the downloaded file** to see the result!

### What You Should See
- A purple gradient card with "Welcome to StackPack Demo"
- A clickable button that creates confetti animation
- An image displayed in the demo box (converted from Base64)

## Creating Your Own Bundle

### Step 1: Prepare Your Files
Organize your project files:
```
my-project/
├── index.html
├── styles.css
├── script.js
└── images/
    ├── logo.png
    └── background.jpg
```

### Step 2: Upload Files
1. Open StackPack Bundler
2. Drag all files into the dropzone (HTML, CSS, JS, images)
3. The app automatically sorts them by type

### Step 3: Configure Output

**For Standalone HTML:**
- Choose "Standalone HTML"
- Enter a custom filename (optional)
- Click "Generate & Download"
- You'll get a single `.html` file with everything embedded

**For Web Component:**
- Choose "Web Component"
- Enter a component name (e.g., "MyAwesomeComponent")
- Enter a custom filename (optional)
- Click "Generate & Download"
- You'll get a `.js` file you can import anywhere

### Step 4: Use Your Bundle

**Standalone HTML:**
Just open the `.html` file in any browser. It works offline!

**Web Component:**
Include in your HTML:
```html
<!DOCTYPE html>
<html>
<body>
  <!-- Use your component -->
  <my-awesome-component></my-awesome-component>
  
  <!-- Include the script -->
  <script src="my-awesome-component.js"></script>
</body>
</html>
```

## Tips & Tricks

### Image Paths in CSS
The bundler automatically converts these:
```css
/* Before */
.hero {
  background: url('./images/hero.jpg');
}

/* After (automatic) */
.hero {
  background: url('data:image/jpeg;base64,/9j/4AAQ...');
}
```

Just make sure:
- ✅ Upload the image file
- ✅ Use relative paths in CSS
- ✅ Filename matches exactly

### Multiple CSS/JS Files
You can upload multiple files of the same type:
- All CSS files are combined
- All JS files are combined and wrapped in IIFE
- Order may vary, so avoid dependencies between files

### Shadow DOM Benefits
When using Web Components:
- Styles don't leak out
- External styles don't leak in
- Perfect for reusable components
- No ID/class conflicts

## Common Issues

### "Image not showing in output"
- Make sure you uploaded the image file
- Check the filename matches exactly (case-sensitive)
- Verify the path in CSS is relative (./image.png)

### "JavaScript not working"
- Check browser console for errors
- Make sure you're using standard JavaScript (not ES modules)
- For Web Components, scripts run in Shadow DOM context

### "Can't save projects"
- You need to sign in with Google
- Firebase must be configured (see FIREBASE_SETUP.md)
- Check browser console for Firebase errors

## Next Steps

1. ✅ Test with demo files
2. ✅ Create your first bundle
3. ✅ Sign in to save projects
4. ✅ Explore the dashboard
5. ✅ Deploy your bundles!

## Resources

- **Full Documentation**: See [README.md](README.md)
- **Firebase Setup**: See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Project Summary**: See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- **Demo Files Guide**: See [demo-files/README.md](demo-files/README.md)

## Need Help?

1. Check the browser console (F12) for errors
2. Review the documentation files
3. Test with the demo files first
4. Make sure all dependencies are installed

---

**Ready to bundle?** Start the dev server and open http://localhost:5173! 🎁
