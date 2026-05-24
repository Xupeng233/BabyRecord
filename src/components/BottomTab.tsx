import { Home, Sparkles, User } from 'lucide-react';
import { clsx } from 'clsx';

export type Tab = 'home' | 'growth' | 'profile';

interface BottomTabProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'growth', label: '成长', icon: Sparkles },
  { key: 'profile', label: '我的', icon: User },
];

export const BottomTab = ({ currentTab, onTabChange }: BottomTabProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={clsx(
              'flex flex-col items-center py-2 px-5 rounded-xl transition-all',
              currentTab === key
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon className={clsx('w-6 h-6 mb-1', currentTab === key && 'text-primary-600')} />
            <span className={clsx('text-xs font-medium', currentTab === key && 'text-primary-600')}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};