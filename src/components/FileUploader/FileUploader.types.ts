export interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  resetTrigger?: number;
}
