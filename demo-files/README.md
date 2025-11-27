# Demo Files - Quick Test Guide

This folder contains sample files you can use to test the StackPack Bundler.

## Files Included

- `demo.html` - Sample HTML structure
- `demo.css` - Styled with gradients and animations
- `demo.js` - Interactive button with confetti effect
- `demo.png` - Sample image referenced in CSS

## How to Test

### Method 1: Test All Files Together

1. Open the StackPack Bundler app
2. Drag and drop ALL files from this folder into the upload zone
3. Choose your output format:
   - **Standalone HTML**: Creates a single `.html` file
   - **Web Component**: Creates a `.js` component file
4. Click "Generate & Download"
5. Open the generated file to see the result

### Method 2: Test Individual Features

**Test 1: HTML + CSS Only**
- Upload only `demo.html` and `demo.css`
- See how styles are embedded

**Test 2: Add JavaScript**
- Upload `demo.html`, `demo.css`, and `demo.js`
- Click the button in the output to see the interactive effect

**Test 3: Full Bundle with Images**
- Upload all 4 files
- Notice how the image in CSS (`url('./demo.png')`) is automatically converted to Base64

## Expected Results

### Standalone HTML Output
- Single `.html` file
- All CSS embedded in `<style>` tags
- All JS wrapped in IIFE and embedded in `<script>` tags
- Image converted to Base64 data URL in CSS

### Web Component Output
- Single `.js` file
- Creates a custom element (e.g., `<stack-pack-component>`)
- Uses Shadow DOM for style isolation
- Can be imported and used in any HTML page

## What to Look For

✅ **Image Conversion**: The purple gradient box should display the demo image
✅ **Style Isolation**: Styles don't leak outside the component
✅ **JavaScript Isolation**: Variables are scoped (no global conflicts)
✅ **Interactivity**: Button click creates confetti animation
✅ **No External Dependencies**: Everything works offline

## Troubleshooting

**Image not showing?**
- Make sure you uploaded `demo.png`
- Check that the CSS references `./demo.png` (relative path)

**JavaScript not working?**
- Open browser console (F12) to check for errors
- Look for the "StackPack Demo Script Loaded!" message

**Styles not applied?**
- For Web Components, styles are in Shadow DOM
- Use browser DevTools to inspect the shadow root

## Next Steps

After testing with these demo files, try creating your own:
1. Create your own HTML/CSS/JS files
2. Add your own images
3. Bundle them together
4. Deploy the output anywhere!

---

Happy bundling! 🎁
