/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useState, useEffect } from 'react';
import { Upload, FileText, Image, Code, Video, AlertTriangle } from 'lucide-react';
import type { FileUploaderProps } from './FileUploader.types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB warn
const MAX_BLOCK_SIZE = 50 * 1024 * 1024; // 50MB block

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  accept = '.html,.css,.js,.jsx,.ts,.tsx,.jpg,.jpeg,.png,.gif,.svg,.webp,.mp4,.webm',
  resetTrigger = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [sizeWarnings, setSizeWarnings] = useState<string[]>([]);

  // Reset state when parent triggers a reset via resetTrigger prop
  useEffect(() => {
    if (resetTrigger > 0) {
      setUploadedFiles([]);
      setSizeWarnings([]);
    }
  }, [resetTrigger]);

  const validateFileSizes = useCallback((files: File[]): File[] => {
    const warnings: string[] = [];
    const validFiles = files.filter((file) => {
      if (file.size > MAX_BLOCK_SIZE) {
        warnings.push(
          `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 50MB.`
        );
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        warnings.push(
          `"${file.name}" is large (${(file.size / 1024 / 1024).toFixed(1)}MB). May affect performance.`
        );
      }
      return true;
    });
    setSizeWarnings(warnings);
    return validFiles;
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = validateFileSizes(Array.from(e.dataTransfer.files));
      setUploadedFiles(files);
      onFilesSelected(files);
    },
    [onFilesSelected, validateFileSizes]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = validateFileSizes(Array.from(e.target.files));
        setUploadedFiles(files);
        onFilesSelected(files);
      }
    },
    [onFilesSelected, validateFileSizes]
  );

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return <Image className="w-4 h-4 text-amber-600" />;
    } else if (['js', 'jsx', 'ts', 'tsx'].includes(ext || '')) {
      return <Code className="w-4 h-4 text-orange-600" />;
    } else if (['mp4', 'webm'].includes(ext || '')) {
      return <Video className="w-4 h-4 text-red-600" />;
    } else {
      return <FileText className="w-4 h-4 text-amber-700" />;
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 scale-[1.02]'
            : 'border-amber-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-gray-700 hover:border-amber-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`p-4 rounded-full transition-colors duration-200 ${
              isDragging
                ? 'bg-amber-200 dark:bg-amber-800/40'
                : 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30'
            }`}
          >
            <Upload className={`w-12 h-12 ${isDragging ? 'text-amber-700' : 'text-amber-600'}`} />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-2">
              Drop your files here
            </h3>
            <p className="text-amber-700 dark:text-amber-300">or click to browse</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Supports HTML, CSS, JS, Images, and Videos
            </p>
          </div>
        </div>
      </div>

      {sizeWarnings.length > 0 && (
        <div className="mt-4 space-y-1">
          {sizeWarnings.map((warning, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
              {warning}
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-gray-700 rounded-lg border border-amber-200 dark:border-gray-600"
              >
                {getFileIcon(file.name)}
                <span className="text-sm text-amber-900 dark:text-amber-100 truncate flex-1">
                  {file.name}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
