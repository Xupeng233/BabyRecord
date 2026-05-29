import { Baby } from 'lucide-react';
import { Settings } from '../types';

interface HeaderProps {
  settings: Settings | null;
  onSettingsClick: () => void;
  onHistoryClick: () => void;
  showHistoryButton?: boolean;
}

const calculateDaysOld = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  birth.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - birth.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const formatCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return `${year}年${month}月${day}日`;
};

const formatBirthDate = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const year = birth.getFullYear();
  const month = birth.getMonth() + 1;
  const day = birth.getDate();
  return `${year}年${month}月${day}日`;
};

export const Header = ({ settings, onSettingsClick, onHistoryClick, showHistoryButton = true }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Baby className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">宝宝成长记录</h1>
        </div>
        <div className="flex items-center gap-2">
          {showHistoryButton && (
            <button
              onClick={onHistoryClick}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="历史记录"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
