import React, { useState, useRef } from 'react';
import { FileUploader } from '../components/FileUploader';
import { useFileSorter } from '../hooks/useFileSorter';
import { generateStandaloneHTML, generateWebComponent, downloadFile } from '../utils/BundlerLogic';
import { useAuth } from '../AuthContext';
import { useToast } from '../contexts/ToastContext';
import { FirebaseService } from '../services/FirebaseService';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { KeyboardHints } from '../components/KeyboardHints';
import { Package, Sparkles, Download, Eye, X, RefreshCw, StopCircle } from 'lucide-react';

type OutputType = 'html' | 'js';

export const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { sortedFiles, sortFiles, clearFiles } = useFileSorter();
  const [outputType, setOutputType] = useState<OutputType>('html');
  const [customFileName, setCustomFileName] = useState('');
  const [componentName, setComponentName] = useState('StackPackComponent');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [resetTrigger, setResetTrigger] = useState(0);
  const isCancelledRef = useRef(false);

  const handleFilesSelected = (files: File[]): void => {
    sortFiles(files);
  };

  const getTotalFileCount = (): number => {
    return (
      sortedFiles.html.length +
      sortedFiles.css.length +
      sortedFiles.js.length +
      sortedFiles.images.length +
      sortedFiles.videos.length
    );
  };

  const validateFiles = (): boolean => {
    const missing = [];
    if (sortedFiles.html.length === 0) missing.push('HTML');
    if (sortedFiles.css.length === 0) missing.push('CSS');
    if (sortedFiles.js.length === 0) missing.push('JavaScript');

    if (missing.length > 0) {
      showToast(
        `Missing required files: ${missing.join(', ')}. Please upload at least one of each.`,
        'warning'
      );
      return false;
    }
    return true;
  };

  const generateContent = async (): Promise<{ content: string; filename: string }> => {
    if (outputType === 'html') {
      return await generateStandaloneHTML(sortedFiles, customFileName);
    } else {
      return await generateWebComponent(sortedFiles, customFileName, componentName);
    }
  };

  const handleCancel = (): void => {
    isCancelledRef.current = true;
    setIsProcessing(false);
    setProgressMessage('');
    showToast('Operation cancelled.', 'info');
  };

  const handlePreview = async (): Promise<void> => {
    if (!validateFiles()) return;

    isCancelledRef.current = false;
    setIsProcessing(true);
    setProgressMessage('Generating preview...');
    try {
      const result = await generateContent();
      if (isCancelledRef.current) return;

      let contentToPreview = result.content;
      if (outputType === 'js') {
        // Generate the custom element tag name from component name
        const tagName = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        // Create a complete HTML page that renders the Web Component
        contentToPreview = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Preview</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
        }
    </style>
</head>
<body>
    <${tagName}></${tagName}>
    
    <script>
${result.content}
    </script>
</body>
</html>`;
      }

      setPreviewContent(contentToPreview);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      showToast('Error generating preview.', 'error');
    } finally {
      setIsProcessing(false);
      setProgressMessage('');
    }
  };

  const handleGenerate = async (): Promise<void> => {
    if (!validateFiles()) return;

    isCancelledRef.current = false;
    setIsProcessing(true);
    setProgressMessage('Reading files...');
    try {
      setProgressMessage('Encoding assets to Base64...');
      const result = await generateContent();
      if (isCancelledRef.current) return;
      setProgressMessage('Saving to cloud...');

      // Save to Firestore if user is logged in
      if (user) {
        try {
          await FirebaseService.saveProject({
            userId: user.uid,
            name: result.filename,
            outputType: outputType,
            fileCount: getTotalFileCount(),
            content: result.content,
            isPublic: false, // Default to private
          });
          showToast('Project bundle saved to dashboard!', 'success');
        } catch (error) {
          console.error('Error saving project:', error);
          showToast('Bundle downloaded, but failed to save to dashboard.', 'warning');
        }
      }
      // Auto-download
      downloadFile(result.content, result.filename);

      showToast(`Successfully generated ${result.filename}!`, 'success');
    } catch (error) {
      console.error('Error generating bundle:', error);
      showToast('Error generating bundle. Please check your files and try again.', 'error');
    } finally {
      setIsProcessing(false);
      setProgressMessage('');
    }
  };

  const handleReset = (): void => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = (): void => {
    clearFiles();
    setCustomFileName('');
    setPreviewContent('');
    setShowPreview(false);
    setResetTrigger((prev) => prev + 1);
    setShowResetConfirm(false);
  };

  const totalFiles = getTotalFileCount();
  const canGenerate = totalFiles > 0 && !isProcessing;

  return (
    <div className="pt-8 sm:pt-12 pb-1 sm:pb-2">
      <div className="max-w-6xl mx-auto w-full px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
              <Package className="w-10 h-10 text-white animate-bounce-spin" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              StackPack Bundler
            </h1>
          </div>
          <p className="text-lg text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
            Bundle your HTML, CSS, JS, Images, and Videos into a single file with automatic Base64
            encoding and Shadow DOM isolation
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-600" />
            Upload Files
          </h2>
        </div>

        {/* Main Card */}
        <div className="card mb-8">
          {/* File Uploader */}
          <div className={totalFiles > 0 ? 'mb-8' : ''}>
            <FileUploader onFilesSelected={handleFilesSelected} resetTrigger={resetTrigger} />
          </div>

          {/* Conditional Content (Summary & Options) */}
          {totalFiles > 0 && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              {/* File Summary */}
              <div className="mb-8 p-4 rounded-lg border border-amber-200 dark:border-gray-600">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  File Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-amber-600">
                      {sortedFiles.html.length}
                    </div>
                    <div className="text-amber-700 dark:text-amber-300">HTML</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">
                      {sortedFiles.css.length}
                    </div>
                    <div className="text-amber-700 dark:text-amber-300">CSS</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-yellow-600">
                      {sortedFiles.js.length}
                    </div>
                    <div className="text-amber-700 dark:text-amber-300">JS</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-amber-600">
                      {sortedFiles.images.length}
                    </div>
                    <div className="text-amber-700 dark:text-amber-300">Images</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-red-600">
                      {sortedFiles.videos.length}
                    </div>
                    <div className="text-amber-700 dark:text-amber-300">Videos</div>
                  </div>
                </div>
              </div>

              {/* Output Options */}
              <div className="mb-8 border-t border-amber-100 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                  Output Options
                </h2>

                {/* Output Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setOutputType('html')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        outputType === 'html'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md ring-2 ring-amber-200 ring-opacity-50'
                          : 'border-amber-200 dark:border-gray-600 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                        Standalone HTML
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        Single .html file with embedded CSS, JS, and assets
                      </div>
                    </button>

                    <button
                      onClick={() => setOutputType('js')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        outputType === 'js'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md ring-2 ring-amber-200 ring-opacity-50'
                          : 'border-amber-200 dark:border-gray-600 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                        Web Component
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        .js file with Shadow DOM isolation for reusable components
                      </div>
                    </button>
                  </div>
                </div>

                {/* Custom Filename */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Custom Filename (optional)
                  </label>
                  <input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder={outputType === 'html' ? 'bundle.html' : 'component.js'}
                    className="input-field w-full"
                  />
                </div>

                {/* Component Name (only for Web Component) */}
                {outputType === 'js' && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Component Name
                    </label>
                    <input
                      type="text"
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                      placeholder="StackPackComponent"
                      className="input-field w-full"
                    />
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Will be converted to kebab-case for the custom element tag
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handlePreview}
                  disabled={!canGenerate}
                  className="flex-1 bg-white dark:bg-gray-700 border-2 border-amber-200 dark:border-gray-600 hover:border-amber-400 dark:hover:border-gray-500 text-amber-700 dark:text-amber-300 font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="w-5 h-5" />
                  Preview
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className={`flex-[2] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${!canGenerate ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Download className="w-5 h-5" />
                  {isProcessing ? progressMessage || 'Generating...' : 'Generate & Download'}
                </button>

                {isProcessing ? (
                  <button
                    onClick={handleCancel}
                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
                  >
                    <StopCircle className="w-5 h-5" />
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Status */}
        {!user && (
          <div className="text-center p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200">
              💡 <strong>Tip:</strong> Sign in to save your projects and access them later from the
              dashboard!
            </p>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <div className="flex justify-end mt-4">
          <KeyboardHints />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset All Files"
        message="Are you sure you want to reset? All uploaded files will be cleared."
        confirmLabel="Reset"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
        variant="warning"
      />

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600" />
                Preview:{' '}
                {customFileName || (outputType === 'html' ? 'bundle.html' : 'component.js')}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden">
                <iframe
                  srcDoc={previewContent}
                  title="Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
