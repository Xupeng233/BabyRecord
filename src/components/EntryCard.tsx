import { useState, useRef, useEffect } from 'react';
import { Trash2, ChevronRight, X } from 'lucide-react';
import { Entry } from '../types';
import { useAgeCalculator } from '../hooks/useAgeCalculator';

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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
    setCurrentImageIndex(0);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNextImage();
      } else {
        goToPrevImage();
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
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
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              aria-label="删除记录"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </div>

      {showImageViewer && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black z-[100] flex flex-col"
          style={{ 
            height: window.innerHeight,
            width: window.innerWidth,
            overscrollBehavior: 'none',
            touchAction: 'none',
            position: 'fixed',
            top: '-env(safe-area-inset-top)',
            left: 0,
            right: 0,
            bottom: '-env(safe-area-inset-bottom)',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
          onClick={closeImageViewer}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-black/50 shrink-0">
            <div className="text-white text-sm">
              {currentImageIndex + 1} / {photos.length}
            </div>
            <button
              onClick={closeImageViewer}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="关闭"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div 
            className="flex-1 flex items-center justify-center relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="absolute left-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="上一张"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <img
              src={photos[currentImageIndex]}
              alt={`照片 ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="下一张"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {photos.length > 1 && (
            <div 
              className="absolute left-0 right-0 flex justify-center gap-2"
              style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
            >
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`跳转到第 ${index + 1} 张`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
