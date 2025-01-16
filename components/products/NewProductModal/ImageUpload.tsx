import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
}

export function ImageUpload({ onChange }: ImageUploadProps) {
  const [, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const acceptedFiles = Array.from(event.target.files);

      setFiles((prevFiles) => {
        const newFiles = [...prevFiles, ...acceptedFiles];
        onChange(newFiles);
        return newFiles;
      });

      // Create preview URLs
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreview((prev) => [...prev, ...newPreviews]);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      onChange(newFiles);
      return newFiles;
    });
    setPreview((prev) => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg border-2 border-dashed p-8 text-center transition-colors border-gray-300 hover:border-primary-300">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <div className="space-y-2">
            <motion.div className="mx-auto w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </motion.div>
            <div className="text-sm">
              <span className="font-medium text-primary-400">
                Click to upload
              </span>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
          </div>
        </label>
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <AnimatePresence>
            {preview.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 rounded-full bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
