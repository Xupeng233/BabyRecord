import { useRef } from 'react';
import { Camera, Image, X } from 'lucide-react';

interface PendingPhoto {
  file: File;
  preview: string;
}

interface PhotoUploaderProps {
  onPhotosChange: (pendingFiles: File[], existingUrls: string[]) => void;
  existingUrls: string[];
  pendingPhotos: PendingPhoto[];
  onPendingChange: (pending: PendingPhoto[]) => void;
  max?: number;
}

export const PhotoUploader = ({ existingUrls, pendingPhotos, onPendingChange, onPhotosChange, max = 9 }: PhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);

  const totalCount = existingUrls.length + pendingPhotos.length;
  const canAdd = totalCount < max;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = max - totalCount;
    const filesToProcess = Array.from(files).slice(0, remaining);

    const newPending: PendingPhoto[] = [];
    let loaded = 0;

    if (filesToProcess.length === 0) return;

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPending.push({
          file,
          preview: event.target?.result as string,
        });
        loaded++;
        if (loaded === filesToProcess.length) {
          const updated = [...pendingPhotos, ...newPending];
          onPendingChange(updated);
          onPhotosChange(
            updated.map(p => p.file),
            existingUrls
          );
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (captureInputRef.current) captureInputRef.current.value = '';
  };

  const handleRemoveExisting = (index: number) => {
    const updated = existingUrls.filter((_, i) => i !== index);
    onPhotosChange(pendingPhotos.map(p => p.file), updated);
  };

  const handleRemovePending = (index: number) => {
    const updated = pendingPhotos.filter((_, i) => i !== index);
    onPendingChange(updated);
    onPhotosChange(updated.map(p => p.file), existingUrls);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {existingUrls.map((url, index) => (
          <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={url}
              alt={`照片 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemoveExisting(index)}
              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {pendingPhotos.map((photo, index) => (
          <div key={`pending-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={photo.preview}
              alt={`新照片 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemovePending(index)}
              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="absolute bottom-1 left-1 bg-blue-500/70 text-white text-xs px-1.5 py-0.5 rounded">
              新
            </span>
          </div>
        ))}

        {canAdd && (
          <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <label
              htmlFor="photo-capture-multi"
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer"
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs font-medium">拍照</span>
            </label>
            <span className="text-gray-400 text-xs">或</span>
            <label
              htmlFor="photo-upload-multi"
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-accent-100 text-accent-600 hover:bg-accent-200 transition-colors cursor-pointer"
            >
              <Image className="w-6 h-6" />
              <span className="text-xs font-medium">相册</span>
            </label>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id="photo-upload-multi"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={captureInputRef}
        id="photo-capture-multi"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-gray-400 mt-2">
        已选 {totalCount}/{max} 张
      </p>
    </div>
  );
};

export type { PendingPhoto };
