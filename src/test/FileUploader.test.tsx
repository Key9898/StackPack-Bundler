import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploader } from '../components/FileUploader';

describe('FileUploader', () => {
  it('renders the upload area with drop text', () => {
    render(<FileUploader onFilesSelected={() => {}} />);
    expect(screen.getByText('Drop your files here')).toBeInTheDocument();
  });

  it('renders "or click to browse" text', () => {
    render(<FileUploader onFilesSelected={() => {}} />);
    expect(screen.getByText('or click to browse')).toBeInTheDocument();
  });

  it('renders the hidden file input', () => {
    render(<FileUploader onFilesSelected={() => {}} />);
    const input = document.getElementById('file-input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('file');
    expect(input.multiple).toBe(true);
  });

  it('renders supported formats text', () => {
    render(<FileUploader onFilesSelected={() => {}} />);
    expect(screen.getByText(/Supports HTML, CSS, JS/)).toBeInTheDocument();
  });

  it('accepts custom accept prop', () => {
    render(<FileUploader onFilesSelected={() => {}} accept=".html,.css" />);
    const input = document.getElementById('file-input') as HTMLInputElement;
    expect(input.accept).toBe('.html,.css');
  });

  it('calls onFilesSelected with valid files on input change', () => {
    const mockCallback = vi.fn();
    render(<FileUploader onFilesSelected={mockCallback} />);

    const input = document.getElementById('file-input') as HTMLInputElement;
    const file = new File(['body { color: red; }'], 'styles.css', { type: 'text/css' });
    Object.defineProperty(input, 'files', { value: [file], writable: false });

    fireEvent.change(input);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith([file]);
  });

  it('does not show file list when no files are uploaded', () => {
    render(<FileUploader onFilesSelected={() => {}} />);
    expect(screen.queryByText(/Uploaded Files/)).not.toBeInTheDocument();
  });
});
