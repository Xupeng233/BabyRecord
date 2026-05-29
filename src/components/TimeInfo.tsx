import { Settings } from '../types';

interface TimeInfoProps {
  settings: Settings | null;
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

export const TimeInfo = ({ settings }: TimeInfoProps) => {
  if (!settings?.birthDate) return null;

  const daysOld = calculateDaysOld(settings.birthDate);
  const currentDate = formatCurrentDate();
  const birthDateFormatted = formatBirthDate(settings.birthDate);

  return (
    <div className="bg-gradient-to-r from-primary-50 to-accent-50 px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">出生时间：</span>
            <span className="text-sm font-medium text-gray-800">{birthDateFormatted}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">当前时间：</span>
            <span className="text-sm font-medium text-gray-800">{currentDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-600">{daysOld}</span>
          <span className="text-sm text-gray-600">天</span>
        </div>
      </div>
    </div>
  );
};