export interface FileUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  extractedData?: {
    fileName: string;
    fileSize: number;
    totalPages: number;
    extractedText: string;
    metadata: {
      pageCount: number;
      textItems: number;
    };
  };
}

export interface PDFFileInfo {
  name: string;
  size: string;
  lastModified: string;
}

export interface PDFItem {
  text?: string;
  x?: number;
  y?: number;
  w?: number;
  page?: number;
  width?: number;
  height?: number;
  file?: { path?: string; buffer?: string };
}

export interface ExtractedPDFData {
  success: boolean;
  error?: string;
  data?: {
    fileName: string;
    fileSize: number;
    totalPages: number;
    extractedText: string;
    metadata: {
      pageCount: number;
      textItems: number;
    };
  };
}
