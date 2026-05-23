import { Home, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export type Tab = 'home' | 'growth';

interface BottomTabProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomTab = ({ currentTab, onTabChange }: BottomTabProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={clsx(
            'flex flex-col items-center py-2 px-6 rounded-xl transition-all',
            currentTab === 'home' 
              ? 'text-primary-600 bg-primary-50' 
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Home className={clsx('w-6 h-6 mb-1', currentTab === 'home' && 'text-primary-600')} />
          <span className={clsx('text-xs font-medium', currentTab === 'home' && 'text-primary-600')}>首页</span>
        </button>
        
        <button
          onClick={() => onTabChange('growth')}
          className={clsx(
            'flex flex-col items-center py-2 px-6 rounded-xl transition-all',
            currentTab === 'growth' 
              ? 'text-primary-600 bg-primary-50' 
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Sparkles className={clsx('w-6 h-6 mb-1', currentTab === 'growth' && 'text-primary-600')} />
          <span className={clsx('text-xs font-medium', currentTab === 'growth' && 'text-primary-600')}>成长</span>
        </button>
      </div>
    </div>
  );
};