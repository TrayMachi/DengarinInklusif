import { PdfReader } from "pdfreader";

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

export const extractTextFromPDF = async (
  buffer: Buffer,
  fileName: string
): Promise<ExtractedPDFData> => {
  return new Promise((resolve) => {
    const textItems: string[] = [];
    let currentPage = 0;
    let totalPages = 0;
    let itemCount = 0;

    const pdfReader = new PdfReader();

    pdfReader.parseBuffer(buffer, (err: any, data: PDFItem | null) => {
      if (err) {
        console.error("PDF parsing error:", err);
        resolve({
          success: false,
          error: `Gagal membaca PDF: ${
            typeof err === "string" ? err : err.message || "Unknown error"
          }`,
        });
        return;
      }

      if (!data) {
        const extractedText = textItems.join(" ").trim();
        resolve({
          success: true,
          data: {
            fileName,
            fileSize: buffer.length,
            totalPages,
            extractedText,
            metadata: {
              pageCount: totalPages,
              textItems: itemCount,
            },
          },
        });
        return;
      }

      if (data.page !== undefined) {
        currentPage = data.page;
        totalPages = Math.max(totalPages, currentPage);
        return;
      }

      if (data.text) {
        const cleanText = data.text.trim();
        if (cleanText.length > 0) {
          textItems.push(cleanText);
          itemCount++;
        }
      }
    });
  });
};

export const validatePDFFile = (file: File): string | null => {
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

  if (file.type !== "application/pdf") {
    return "Hanya file PDF yang diizinkan";
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return `Ukuran file terlalu besar. Maksimal ${sizeInMB}MB`;
  }

  if (file.size === 0) {
    return "File PDF kosong atau rusak";
  }

  return null;
};
