"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  className?: string;
}

export default function UploadBox({ onFileSelect, selectedFile, className }: UploadBoxProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center transition-all text-center focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]",
        isDragActive
          ? "border-blue-500 bg-blue-500/10"
          : "border-border hover:border-blue-400 hover:bg-blue-500/5",
        selectedFile && "border-solid border-green-500/50 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500",
        className
      )}
    >
      <input {...getInputProps()} />
      {selectedFile ? (
        <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200">
          <div className="p-4 bg-green-500/10 rounded-full relative">
            <ImageIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-500 bg-background rounded-full" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground font-medium">Click or drag to replace photo</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <UploadCloud className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {isDragActive ? "Drop your image here" : "Drag & drop an image"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse from your device
          </p>
        </div>
      )}
    </div>
  );
}