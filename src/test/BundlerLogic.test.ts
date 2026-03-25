import { describe, it, expect } from 'vitest';
import { wrapJSInIIFE, replaceAssetUrlsInCSS, replaceAssetUrlsInHTML } from '../utils/BundlerLogic';

describe('wrapJSInIIFE', () => {
  it('wraps JS code in an IIFE', () => {
    const input = 'console.log("hello");';
    const result = wrapJSInIIFE(input);
    expect(result).toContain('(function()');
    expect(result).toContain("'use strict'");
    expect(result).toContain('console.log("hello");');
    expect(result).toContain('})();');
  });

  it('wraps empty string in IIFE', () => {
    const result = wrapJSInIIFE('');
    expect(result).toContain('(function()');
    expect(result).toContain('})();');
  });
});

describe('replaceAssetUrlsInCSS', () => {
  it('replaces url() with base64 when asset is in map', () => {
    const assetMap = new Map([['image.png', 'data:image/png;base64,ABC123']]);
    const css = 'background: url(image.png);';
    const result = replaceAssetUrlsInCSS(css, assetMap);
    expect(result).toContain("url('data:image/png;base64,ABC123')");
  });

  it('keeps original url() when asset is not in map', () => {
    const assetMap = new Map<string, string>();
    const css = 'background: url(missing.png);';
    const result = replaceAssetUrlsInCSS(css, assetMap);
    expect(result).toContain('url(missing.png)');
  });

  it('handles url with quotes', () => {
    const assetMap = new Map([['logo.svg', 'data:image/svg+xml;base64,XYZ']]);
    const css = "background: url('logo.svg');";
    const result = replaceAssetUrlsInCSS(css, assetMap);
    expect(result).toContain("url('data:image/svg+xml;base64,XYZ')");
  });

  it('handles url with path prefix', () => {
    const assetMap = new Map([['image.png', 'data:image/png;base64,ABC']]);
    const css = 'background: url(./assets/image.png);';
    const result = replaceAssetUrlsInCSS(css, assetMap);
    expect(result).toContain("url('data:image/png;base64,ABC')");
  });
});

describe('replaceAssetUrlsInHTML', () => {
  it('replaces img src with base64', () => {
    const assetMap = new Map([['photo.jpg', 'data:image/jpeg;base64,DEF456']]);
    const html = '<img src="photo.jpg" alt="photo">';
    const result = replaceAssetUrlsInHTML(html, assetMap);
    expect(result).toContain('src="data:image/jpeg;base64,DEF456"');
  });

  it('keeps original src when asset not in map', () => {
    const assetMap = new Map<string, string>();
    const html = '<img src="missing.jpg">';
    const result = replaceAssetUrlsInHTML(html, assetMap);
    expect(result).toContain('src="missing.jpg"');
  });

  it('handles video src', () => {
    const assetMap = new Map([['video.mp4', 'data:video/mp4;base64,GHI789']]);
    const html = '<video src="video.mp4"></video>';
    const result = replaceAssetUrlsInHTML(html, assetMap);
    expect(result).toContain('src="data:video/mp4;base64,GHI789"');
  });
});
