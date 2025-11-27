import React, { useState } from 'react';
import { FileUploader } from '../components/FileUploader';
import { useFileSorter } from '../hooks/useFileSorter';
import {
    generateStandaloneHTML,
    generateWebComponent,
    downloadFile
} from '../utils/BundlerLogic';
import { useAuth } from '../AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Package, Sparkles, Download } from 'lucide-react';

type OutputType = 'html' | 'js';

export const UploadPage: React.FC = () => {
    const { user } = useAuth();
    const { sortedFiles, sortFiles, clearFiles } = useFileSorter();
    const [outputType, setOutputType] = useState<OutputType>('html');
    const [customFileName, setCustomFileName] = useState('');
    const [componentName, setComponentName] = useState('StackPackComponent');
    const [isProcessing, setIsProcessing] = useState(false);


    const handleFilesSelected = (files: File[]) => {
        sortFiles(files);
    };

    const getTotalFileCount = () => {
        return (
            sortedFiles.html.length +
            sortedFiles.css.length +
            sortedFiles.js.length +
            sortedFiles.images.length
        );
    };

    const handleGenerate = async () => {
        setIsProcessing(true);
        try {
            let result: { content: string; filename: string };

            if (outputType === 'html') {
                result = await generateStandaloneHTML(sortedFiles, customFileName);
            } else {
                result = await generateWebComponent(sortedFiles, customFileName, componentName);
            }



            // Save to Firestore if user is logged in
            if (user) {
                try {
                    await addDoc(collection(db, 'projects'), {
                        userId: user.uid,
                        name: result.filename,
                        outputType,
                        // content: result.content, // Don't save content to Firestore
                        fileCount: getTotalFileCount(),
                        createdAt: serverTimestamp(),
                    });
                } catch (error) {
                    console.error('Error saving to Firestore:', error);
                }
            }

            // Auto-download
            downloadFile(result.content, result.filename);

            // Show success message
            alert(`✅ Successfully generated ${result.filename}!`);
        } catch (error) {
            console.error('Error generating bundle:', error);
            alert('❌ Error generating bundle. Please check your files and try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        clearFiles();
        setCustomFileName('');

    };

    const totalFiles = getTotalFileCount();
    const canGenerate = totalFiles > 0 && !isProcessing;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
                            <Package className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            StackPack Bundler
                        </h1>
                    </div>
                    <p className="text-lg text-amber-700 max-w-2xl mx-auto">
                        Bundle your HTML, CSS, JS, and images into a single file with automatic Base64 encoding and Shadow DOM isolation
                    </p>
                </div>

                {/* Main Card */}
                <div className="card mb-8">
                    {/* File Upload Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-amber-600" />
                            Upload Files
                        </h2>
                        <FileUploader onFilesSelected={handleFilesSelected} />
                    </div>

                    {/* File Summary */}
                    {totalFiles > 0 && (
                        <div className="mb-8 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-200">
                            <h3 className="font-semibold text-amber-900 mb-2">File Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="text-center p-2 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-amber-600">{sortedFiles.html.length}</div>
                                    <div className="text-amber-700">HTML</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{sortedFiles.css.length}</div>
                                    <div className="text-amber-700">CSS</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{sortedFiles.js.length}</div>
                                    <div className="text-amber-700">JavaScript</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-amber-600">{sortedFiles.images.length}</div>
                                    <div className="text-amber-700">Images</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Output Options */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-amber-900 mb-4">Output Options</h2>

                        {/* Output Type Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-amber-900 mb-2">
                                Output Format
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setOutputType('html')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${outputType === 'html'
                                        ? 'border-amber-500 bg-amber-50 shadow-md'
                                        : 'border-amber-200 hover:border-amber-300'
                                        }`}
                                >
                                    <div className="font-semibold text-amber-900 mb-1">Standalone HTML</div>
                                    <div className="text-sm text-amber-700">
                                        Single .html file with embedded CSS, JS, and images
                                    </div>
                                </button>

                                <button
                                    onClick={() => setOutputType('js')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${outputType === 'js'
                                        ? 'border-amber-500 bg-amber-50 shadow-md'
                                        : 'border-amber-200 hover:border-amber-300'
                                        }`}
                                >
                                    <div className="font-semibold text-amber-900 mb-1">Web Component</div>
                                    <div className="text-sm text-amber-700">
                                        .js file with Shadow DOM isolation for reusable components
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Custom Filename */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-amber-900 mb-2">
                                Custom Filename (optional)
                            </label>
                            <input
                                type="text"
                                value={customFileName}
                                onChange={(e) => setCustomFileName(e.target.value)}
                                placeholder={outputType === 'html' ? 'bundle.html' : 'component.js'}
                                className="input-field"
                            />
                        </div>

                        {/* Component Name (only for Web Component) */}
                        {outputType === 'js' && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-amber-900 mb-2">
                                    Component Name
                                </label>
                                <input
                                    type="text"
                                    value={componentName}
                                    onChange={(e) => setComponentName(e.target.value)}
                                    placeholder="StackPackComponent"
                                    className="input-field"
                                />
                                <p className="text-xs text-amber-600 mt-1">
                                    Will be converted to kebab-case for the custom element tag
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleGenerate}
                            disabled={!canGenerate}
                            className={`btn-primary flex-1 flex items-center justify-center gap-2 ${!canGenerate ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <Download className="w-5 h-5" />
                            {isProcessing ? 'Generating...' : 'Generate & Download'}
                        </button>

                        <button
                            onClick={handleReset}
                            className="btn-secondary"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* User Status */}
                {!user && (
                    <div className="text-center p-4 bg-amber-100 rounded-lg border border-amber-200">
                        <p className="text-amber-800">
                            💡 <strong>Tip:</strong> Sign in to save your projects and access them later from the dashboard!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
