import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileSorter } from '../hooks/useFileSorter';

const makeFile = (name: string): File => new File(['content'], name);

describe('useFileSorter', () => {
  it('sorts HTML files correctly', () => {
    const { result } = renderHook(() => useFileSorter());
    act(() => {
      result.current.sortFiles([makeFile('index.html'), makeFile('page.htm')]);
    });
    expect(result.current.sortedFiles.html).toHaveLength(2);
  });

  it('sorts CSS files correctly', () => {
    const { result } = renderHook(() => useFileSorter());
    act(() => {
      result.current.sortFiles([makeFile('styles.css')]);
    });
    expect(result.current.sortedFiles.css).toHaveLength(1);
  });

  it('sorts JS files correctly', () => {
    const { result } = renderHook(() => useFileSorter());
    act(() => {
      result.current.sortFiles([makeFile('app.js'), makeFile('util.ts'), makeFile('comp.tsx')]);
    });
    expect(result.current.sortedFiles.js).toHaveLength(3);
  });

  it('sorts image files correctly', () => {
    const { result } = renderHook(() => useFileSorter());
    act(() => {
      result.current.sortFiles([
        makeFile('photo.jpg'),
        makeFile('logo.png'),
        makeFile('icon.svg'),
        makeFile('anim.gif'),
        makeFile('img.webp'),
      ]);
    });
    expect(result.current.sortedFiles.images).toHaveLength(5);
  });

  it('sorts video files correctly', () => {
    const { result } = renderHook(() => useFileSorter());
    act(() => {
      result.current.sortFiles([makeFile('clip.mp4'), makeFile('video.webm')]);
    });
    expect(result.current.sortedFiles.videos).toHaveLength(2);
  });

  it('sorts mixed files into correct categories', () => {
    const { result } = renderHook(() => useFileSorter());
    act(() => {
      result.current.sortFiles([
        makeFile('index.html'),
        makeFile('styles.css'),
        makeFile('app.js'),
        makeFile('logo.png'),
        makeFile('clip.mp4'),
      ]);
    });
    const s = result.current.sortedFiles;
    expect(s.html).toHaveLength(1);
    expect(s.css).toHaveLength(1);
    expect(s.js).toHaveLength(1);
    expect(s.images).toHaveLength(1);
    expect(s.videos).toHaveLength(1);
  });

  it('clearFiles resets all categories to empty', () => {
    const { result } = renderHook(() => useFileSorter());
    act(() => {
      result.current.sortFiles([makeFile('index.html'), makeFile('styles.css')]);
    });
    act(() => {
      result.current.clearFiles();
    });
    const s = result.current.sortedFiles;
    expect(s.html).toHaveLength(0);
    expect(s.css).toHaveLength(0);
    expect(s.js).toHaveLength(0);
    expect(s.images).toHaveLength(0);
    expect(s.videos).toHaveLength(0);
  });
});
