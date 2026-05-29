import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Entry } from '../types';
import { useAgeCalculator } from '../hooks/useAgeCalculator';
import { ImageViewer } from './ImageViewer';

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
  onClick: (entry: Entry) => void;
}

export const EntryCard = ({ entry, onDelete, onClick }: EntryCardProps) => {
  const { formatDate, formatDateShort } = useAgeCalculator();
  const photos = entry.photoUrls || [];
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const MAX_PHOTOS = 9;
  const displayPhotos = photos.slice(0, MAX_PHOTOS);
  const remainingCount = photos.length - MAX_PHOTOS;

  const handlePhotoClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
    setShowImageViewer(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageViewer = () => {
    setShowImageViewer(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]"
        onClick={() => onClick(entry)}
      >
        {photos.length > 0 && (
          <div className="relative">
            <div
              className="flex overflow-x-auto gap-2 p-3 pb-0 scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', overflowX: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {displayPhotos.map((url, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-100 cursor-pointer relative ${
                    index === MAX_PHOTOS - 1 && remainingCount > 0 ? 'relative' : ''
                  }`}
                  onClick={(e) => handlePhotoClick(index, e)}
                >
                  <img
                    src={url}
                    alt={`照片 ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {index === MAX_PHOTOS - 1 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{remainingCount}</span>
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
            {photos.length > 3 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                ›
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-4 p-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-800">{entry.daysOld}</span>
              <span className="text-base text-gray-600">天</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{formatDateShort(entry.date)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(entry.date)}</p>
            <div className="flex items-center gap-3 mt-1">
              {entry.height && (
                <span className="text-xs text-primary-600 font-medium">身高 {entry.height}cm</span>
              )}
              {entry.weight && (
                <span className="text-xs text-accent-600 font-medium">体重 {entry.weight}kg</span>
              )}
              {photos.length > 1 && (
                <span className="text-xs text-gray-400">{photos.length}张照片</span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>
      </div>

      {showImageViewer && (
        <ImageViewer
          images={photos}
          initialIndex={currentImageIndex}
          onClose={closeImageViewer}
        />
      )}
    </>
  );
};
