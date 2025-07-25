import React, { useState, useCallback, useRef, useEffect } from "react";
import { useFetcher } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import type { FileUploadState, PDFFileInfo } from "./interface";

export const MateriTambahkanModule = () => {
  const fetcher = useFetcher();
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && uploadState.uploading) {
      // Clear the progress interval
      const progressInterval = (window as any).uploadProgressInterval;
      if (progressInterval) {
        clearInterval(progressInterval);
        delete (window as any).uploadProgressInterval;
      }

      // Set progress to 100%
      setUploadState((prev) => ({
        ...prev,
        progress: 100,
      }));

      // Handle response
      if (fetcher.data.success) {
        setUploadState((prev) => ({
          ...prev,
          uploading: false,
          success: true,
          extractedData: fetcher.data.data,
        }));
      } else {
        setUploadState((prev) => ({
          ...prev,
          uploading: false,
          error: fetcher.data.error || "Terjadi kesalahan saat memproses file",
        }));
      }
    }
  }, [fetcher.state, fetcher.data, uploadState.uploading]);

  useEffect(() => {
    return () => {
      const progressInterval = (window as any).uploadProgressInterval;
      if (progressInterval) {
        clearInterval(progressInterval);
        delete (window as any).uploadProgressInterval;
      }
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Hanya file PDF yang diizinkan";
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Ukuran file terlalu besar. Maksimal ${formatFileSize(
        MAX_FILE_SIZE
      )}`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);

    if (error) {
      setUploadState((prev) => ({
        ...prev,
        error,
        file: null,
        success: false,
      }));
      return;
    }

    setUploadState((prev) => ({
      ...prev,
      file,
      error: null,
      success: false,
    }));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = () => {
    if (!uploadState.file) return;

    setUploadState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
      error: null,
    }));

    const formData = new FormData();
    formData.append("pdf-file", uploadState.file);

    const progressInterval = setInterval(() => {
      setUploadState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }));
    }, 200);

    (window as any).uploadProgressInterval = progressInterval;

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  const handleReset = () => {
    const progressInterval = (window as any).uploadProgressInterval;
    if (progressInterval) {
      clearInterval(progressInterval);
      delete (window as any).uploadProgressInterval;
    }

    setUploadState({
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const getFileInfo = (): PDFFileInfo | null => {
    if (!uploadState.file) return null;

    return {
      name: uploadState.file.name,
      size: formatFileSize(uploadState.file.size),
      lastModified: formatDate(new Date(uploadState.file.lastModified)),
    };
  };

  const fileInfo = getFileInfo();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Tambah Materi</h1>
          <p className="text-muted-foreground mt-2">
            Unggah file PDF untuk menambahkan materi pembelajaran baru
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unggah File PDF</CardTitle>
            <CardDescription>
              Pilih file PDF dari komputer Anda atau seret ke area di bawah ini.
              Maksimal ukuran file {formatFileSize(MAX_FILE_SIZE)}.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleInputChange}
              className="hidden"
              aria-label="Pilih file PDF"
            />

            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                "hover:border-primary/50 hover:bg-primary/5",
                isDragOver && "border-primary bg-primary/10",
                uploadState.file &&
                  "border-green-500 bg-green-50 dark:bg-green-950/20",
                uploadState.error &&
                  "border-red-500 bg-red-50 dark:bg-red-950/20"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="button"
              aria-label="Area unggah file - klik atau seret file PDF ke sini"
            >
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 text-muted-foreground">
                  <svg
                    className="h-full w-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-lg font-medium">
                    {uploadState.file
                      ? "File Dipilih"
                      : "Seret file PDF ke sini"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    atau{" "}
                    <span className="text-primary font-medium">
                      klik untuk memilih file
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {uploadState.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/20 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {uploadState.error}
                </p>
              </div>
            )}

            {uploadState.success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md dark:bg-green-950/20 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">
                  File berhasil diunggah dan diproses!
                </p>
              </div>
            )}

            {fileInfo && (
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Nama File:</Label>
                      <span className="text-sm text-muted-foreground">
                        {fileInfo.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Ukuran:</Label>
                      <span className="text-sm text-muted-foreground">
                        {fileInfo.size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Dimodifikasi:
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {fileInfo.lastModified}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {uploadState.uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Progress Unggah</Label>
                  <span className="text-sm text-muted-foreground">
                    {uploadState.progress}%
                  </span>
                </div>
                <Progress value={uploadState.progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {uploadState.file && !uploadState.success && (
                <Button
                  onClick={handleUpload}
                  disabled={uploadState.uploading}
                  className="flex-1"
                >
                  {uploadState.uploading
                    ? "Memproses..."
                    : "Unggah & Proses File"}
                </Button>
              )}

              {(uploadState.file ||
                uploadState.error ||
                uploadState.success) && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={uploadState.uploading}
                >
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data Display */}
        {uploadState.success && uploadState.extractedData && (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Ekstraksi PDF</CardTitle>
              <CardDescription>
                Materi berhasil diekstrak dari file PDF Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Halaman:</Label>
                  <p className="text-sm text-muted-foreground">
                    {uploadState.extractedData.totalPages}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};
