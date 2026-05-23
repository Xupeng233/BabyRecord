import { useState, useRef } from 'react';
import { Camera, Image, X } from 'lucide-react';

interface PhotoUploaderProps {
  onPhotoSelect: (base64: string) => void;
  currentPhoto?: string;
}

export const PhotoUploader = ({ onPhotoSelect, currentPhoto }: PhotoUploaderProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onPhotoSelect(result);
        setIsPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    onPhotoSelect('');
    setIsPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="photo-upload"
      />
      
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="photo-capture"
      />

      {currentPhoto ? (
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={currentPhoto}
            alt="预览"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-4 hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <label
            htmlFor="photo-capture"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer"
          >
            <Camera className="w-8 h-8" />
            <span className="text-sm font-medium">拍照</span>
          </label>
          <span className="text-gray-400 text-sm">或</span>
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent-100 text-accent-600 hover:bg-accent-200 transition-colors cursor-pointer"
          >
            <Image className="w-8 h-8" />
            <span className="text-sm font-medium">从相册选择</span>
          </label>
        </div>
      )}
    </div>
  );
};