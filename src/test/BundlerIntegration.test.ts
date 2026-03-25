import { describe, it, expect } from 'vitest';
import { generateStandaloneHTML } from '../utils/BundlerLogic';
import type { SortedFiles } from '../hooks/useFileSorter';

// Mock FileReader for jsdom
(globalThis as Record<string, unknown>).FileReader = class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;

  readAsText(file: File) {
    setTimeout(() => {
      this.result = `/* content of ${file.name} */`;
      this.onload?.();
    }, 0);
  }

  readAsDataURL(file: File) {
    setTimeout(() => {
      this.result = `data:image/png;base64,MOCK_BASE64_${file.name}`;
      this.onload?.();
    }, 0);
  }
} as unknown as typeof FileReader;

const makeFile = (name: string, content = ''): File => new File([content], name);

describe('generateStandaloneHTML - integration', () => {
  it('generates HTML with embedded CSS and JS', async () => {
    const sortedFiles: SortedFiles = {
      html: [makeFile('index.html', '<html><head></head><body><p>Hello</p></body></html>')],
      css: [makeFile('styles.css', 'body { color: red; }')],
      js: [makeFile('app.js', 'console.log("hi");')],
      images: [],
      videos: [],
    };

    const result = await generateStandaloneHTML(sortedFiles);
    expect(result.filename).toBe('bundle.html');
    expect(result.content).toContain('<style>');
    expect(result.content).toContain('<script>');
  });

  it('uses custom filename when provided', async () => {
    const sortedFiles: SortedFiles = {
      html: [makeFile('index.html', '<html><head></head><body></body></html>')],
      css: [makeFile('styles.css')],
      js: [makeFile('app.js')],
      images: [],
      videos: [],
    };

    const result = await generateStandaloneHTML(sortedFiles, 'my-bundle');
    expect(result.filename).toBe('my-bundle.html');
  });

  it('appends .html extension if missing from custom filename', async () => {
    const sortedFiles: SortedFiles = {
      html: [makeFile('index.html', '<html><head></head><body></body></html>')],
      css: [makeFile('styles.css')],
      js: [makeFile('app.js')],
      images: [],
      videos: [],
    };

    const result = await generateStandaloneHTML(sortedFiles, 'output.html');
    expect(result.filename).toBe('output.html');
  });
});

describe('bundling flow - IIFE wrapping', () => {
  it('wraps JS in IIFE for scope isolation', async () => {
    const { wrapJSInIIFE } = await import('../utils/BundlerLogic');
    const code = 'var x = 1;';
    const wrapped = wrapJSInIIFE(code);
    expect(wrapped).toMatch(/^\(function\(\)/);
    expect(wrapped).toContain('var x = 1;');
  });
});
