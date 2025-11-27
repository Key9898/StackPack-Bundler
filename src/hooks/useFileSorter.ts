import { useState, useCallback } from 'react';

export interface SortedFiles {
    html: File[];
    css: File[];
    js: File[];
    images: File[];
}

export const useFileSorter = () => {
    const [sortedFiles, setSortedFiles] = useState<SortedFiles>({
        html: [],
        css: [],
        js: [],
        images: [],
    });

    const sortFiles = useCallback((files: File[]) => {
        const sorted: SortedFiles = {
            html: [],
            css: [],
            js: [],
            images: [],
        };

        files.forEach((file) => {
            const extension = file.name.split('.').pop()?.toLowerCase();

            switch (extension) {
                case 'html':
                case 'htm':
                    sorted.html.push(file);
                    break;
                case 'css':
                    sorted.css.push(file);
                    break;
                case 'js':
                case 'jsx':
                case 'ts':
                case 'tsx':
                    sorted.js.push(file);
                    break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'svg':
                case 'webp':
                case 'bmp':
                case 'ico':
                    sorted.images.push(file);
                    break;
                default:
                    console.warn(`Unsupported file type: ${file.name}`);
            }
        });

        setSortedFiles(sorted);
        return sorted;
    }, []);

    const clearFiles = useCallback(() => {
        setSortedFiles({
            html: [],
            css: [],
            js: [],
            images: [],
        });
    }, []);

    return {
        sortedFiles,
        sortFiles,
        clearFiles,
    };
};
