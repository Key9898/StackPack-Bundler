import type { SortedFiles } from '../hooks/useFileSorter';

/**
 * Convert a file to Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Read file content as text
 */
export const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

/**
 * Create a map of image filenames to their Base64 data
 */
export const createImageMap = async (images: File[]): Promise<Map<string, string>> => {
    const imageMap = new Map<string, string>();

    for (const image of images) {
        const base64 = await fileToBase64(image);
        imageMap.set(image.name, base64);
    }

    return imageMap;
};

/**
 * Replace image URLs in CSS with Base64 data
 */
export const replaceImageUrlsInCSS = (cssContent: string, imageMap: Map<string, string>): string => {
    let updatedCSS = cssContent;

    // Match url() patterns in CSS
    const urlPattern = /url\(['"]?([^'"()]+)['"]?\)/gi;

    updatedCSS = updatedCSS.replace(urlPattern, (match, imagePath) => {
        // Extract filename from path (handle both ./ and ../ and absolute paths)
        const filename = imagePath.split('/').pop()?.split('\\').pop();

        if (filename && imageMap.has(filename)) {
            const base64Data = imageMap.get(filename);
            return `url('${base64Data}')`;
        }

        // If image not found, keep original
        return match;
    });

    return updatedCSS;
};

/**
 * Wrap JavaScript code in IIFE to avoid variable conflicts
 */
export const wrapJSInIIFE = (jsContent: string): string => {
    return `(function() {
  'use strict';
  ${jsContent}
})();`;
};

/**
 * Generate standalone HTML file
 */
export const generateStandaloneHTML = async (
    sortedFiles: SortedFiles,
    customFileName?: string
): Promise<{ content: string; filename: string }> => {
    // Read all file contents
    const htmlContents = await Promise.all(sortedFiles.html.map(readFileAsText));
    const cssContents = await Promise.all(sortedFiles.css.map(readFileAsText));
    const jsContents = await Promise.all(sortedFiles.js.map(readFileAsText));

    // Create image map
    const imageMap = await createImageMap(sortedFiles.images);

    // Process CSS to replace image URLs
    const processedCSS = cssContents
        .map((css) => replaceImageUrlsInCSS(css, imageMap))
        .join('\n\n');

    // Wrap JS in IIFE
    const processedJS = jsContents
        .map((js) => wrapJSInIIFE(js))
        .join('\n\n');

    // Combine HTML (use first HTML file as base, or create default)
    const baseHTML = htmlContents[0] || '<!DOCTYPE html><html><head></head><body></body></html>';

    // Insert CSS and JS into HTML
    let finalHTML = baseHTML;

    // Insert CSS before </head> or at the beginning if no </head>
    if (processedCSS) {
        const styleTag = `<style>\n${processedCSS}\n</style>`;
        if (finalHTML.includes('</head>')) {
            finalHTML = finalHTML.replace('</head>', `${styleTag}\n</head>`);
        } else {
            finalHTML = `${styleTag}\n${finalHTML}`;
        }
    }

    // Insert JS before </body> or at the end if no </body>
    if (processedJS) {
        const scriptTag = `<script>\n${processedJS}\n</script>`;
        if (finalHTML.includes('</body>')) {
            finalHTML = finalHTML.replace('</body>', `${scriptTag}\n</body>`);
        } else {
            finalHTML = `${finalHTML}\n${scriptTag}`;
        }
    }

    const filename = customFileName || 'bundle.html';

    return {
        content: finalHTML,
        filename: filename.endsWith('.html') ? filename : `${filename}.html`,
    };
};

/**
 * Generate Web Component JS file
 */
export const generateWebComponent = async (
    sortedFiles: SortedFiles,
    customFileName?: string,
    componentName: string = 'StackPackComponent'
): Promise<{ content: string; filename: string }> => {
    // Read all file contents
    const htmlContents = await Promise.all(sortedFiles.html.map(readFileAsText));
    const cssContents = await Promise.all(sortedFiles.css.map(readFileAsText));
    const jsContents = await Promise.all(sortedFiles.js.map(readFileAsText));

    // Create image map
    const imageMap = await createImageMap(sortedFiles.images);

    // Process CSS to replace image URLs
    const processedCSS = cssContents
        .map((css) => replaceImageUrlsInCSS(css, imageMap))
        .join('\n\n');

    // Get HTML content (extract body content if available)
    let htmlContent = htmlContents.join('\n\n');
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
        htmlContent = bodyMatch[1];
    }

    // Combine JS
    const combinedJS = jsContents.join('\n\n');

    // Generate Web Component code
    const webComponentCode = `class ${componentName} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initializeScripts();
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = \`
      <style>
        ${processedCSS}
      </style>
      ${htmlContent}
    \`;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  initializeScripts() {
    ${combinedJS ? `
    // Execute component scripts in isolated scope
    (function() {
      'use strict';
      const shadowRoot = this.shadowRoot;
      ${combinedJS}
    }).call(this);
    ` : '// No scripts to initialize'}
  }
}

// Register the custom element
customElements.define('${componentName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}', ${componentName});
`;

    const filename = customFileName || 'component.js';

    return {
        content: webComponentCode,
        filename: filename.endsWith('.js') ? filename : `${filename}.js`,
    };
};

/**
 * Download generated file
 */
export const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
