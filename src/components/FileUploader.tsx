import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image, Code, Video } from 'lucide-react';

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onFilesSelected,
    accept = ".html,.css,.js,.jsx,.ts,.tsx,.jpg,.jpeg,.png,.gif,.svg,.webp,.mp4,.webm"
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles(files);
        onFilesSelected(files);
    }, [onFilesSelected]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles(files);
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

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
                className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer ${isDragging
                        ? 'border-amber-500 bg-amber-50 scale-[1.02]'
                        : 'border-amber-300 bg-white hover:bg-amber-50 hover:border-amber-400'
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
                    <div className={`p-4 rounded-full transition-colors duration-200 ${isDragging ? 'bg-amber-200' : 'bg-gradient-to-br from-amber-100 to-orange-100'
                        }`}>
                        <Upload className={`w-12 h-12 ${isDragging ? 'text-amber-700' : 'text-amber-600'}`} />
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-amber-900 mb-2">
                            Drop your files here
                        </h3>
                        <p className="text-amber-700">
                            or click to browse
                        </p>
                        <p className="text-sm text-amber-600 mt-2">
                            Supports HTML, CSS, JS, Images, and Videos
                        </p>
                    </div>
                </div>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-amber-900 mb-3">
                        Uploaded Files ({uploadedFiles.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200"
                            >
                                {getFileIcon(file.name)}
                                <span className="text-sm text-amber-900 truncate flex-1">
                                    {file.name}
                                </span>
                                <span className="text-xs text-amber-600">
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
