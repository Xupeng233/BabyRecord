import { useState, useEffect } from 'react';
import { Settings, LogOut, Baby, ChevronRight, User, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  babyName: string;
  babyGender: string;
  parentName: string;
}

interface ProfilePageProps {
  userId: string;
  userEmail: string;
  birthDate: string | null;
  entryCount: number;
  onSettingsClick: () => void;
  onSignOut: () => void;
  onUpdateBirthDate: (date: string) => void;
}

export const ProfilePage = ({
  userId,
  userEmail,
  birthDate,
  entryCount,
  onSettingsClick,
  onSignOut,
  onUpdateBirthDate,
}: ProfilePageProps) => {
  const [profile, setProfile] = useState<Profile>({
    babyName: '',
    babyGender: '',
    parentName: '',
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newBirthDate, setNewBirthDate] = useState(birthDate || '');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('baby_name, baby_gender, parent_name')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      setProfile({
        babyName: data.baby_name || '',
        babyGender: data.baby_gender || '',
        parentName: data.parent_name || '',
      });
    }
  };

  const saveProfile = async (field: string, value: string) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        [field]: value,
      });
    if (!error) {
      setProfile((prev) => ({ ...prev, [field]: value }));
    }
    setEditingField(null);
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditingValue(currentValue);
  };

  const handleSaveBirthDate = async () => {
    if (newBirthDate && newBirthDate !== birthDate) {
      onUpdateBirthDate(newBirthDate);
    }
    setEditingField(null);
  };

  const genderOptions = [
    { label: '男孩', value: 'male', emoji: '👦' },
    { label: '女孩', value: 'female', emoji: '👧' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-6 pt-12 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            {profile.babyGender === 'male' ? (
              <span className="text-3xl">👦</span>
            ) : profile.babyGender === 'female' ? (
              <span className="text-3xl">👧</span>
            ) : (
              <span className="text-3xl">👶</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {profile.babyName || '宝宝成长记录'}
            </h2>
            <p className="text-sm text-white/80 mt-1">{userEmail}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">宝宝信息</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">宝宝昵称</span>
              </div>
              {editingField === 'babyName' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    placeholder="请输入昵称"
                    className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1 w-24"
                  />
                  <button
                    onClick={() => saveProfile('baby_name', editingValue)}
                    className="text-sm text-primary-600 font-medium"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-sm text-gray-400"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('babyName', profile.babyName)}
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <span>{profile.babyName || '未设置'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">宝宝性别</span>
              </div>
              {editingField === 'babyGender' ? (
                <div className="flex items-center gap-2">
                  {genderOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => saveProfile('baby_gender', opt.value)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        profile.babyGender === opt.value
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-sm text-gray-400 ml-1"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('babyGender', profile.babyGender)}
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <span>
                    {profile.babyGender === 'male'
                      ? '👦 男孩'
                      : profile.babyGender === 'female'
                      ? '👧 女孩'
                      : '未设置'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">家长姓名</span>
              </div>
              {editingField === 'parentName' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    placeholder="请输入姓名"
                    className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1 w-24"
                  />
                  <button
                    onClick={() => saveProfile('parent_name', editingValue)}
                    className="text-sm text-primary-600 font-medium"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-sm text-gray-400"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('parentName', profile.parentName)}
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <span>{profile.parentName || '未设置'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">出生日期</span>
              </div>
              {editingField === 'birthDate' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1"
                  />
                  <button
                    onClick={handleSaveBirthDate}
                    className="text-sm text-primary-600 font-medium"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-sm text-gray-400"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setNewBirthDate(birthDate || '');
                    setEditingField('birthDate');
                  }}
                  className="flex items-center gap-1 text-sm text-gray-500"
                >
                  <span>{birthDate || '未设置'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">记录数量</span>
              </div>
              <span className="text-sm text-gray-500">{entryCount} 条</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">账号设置</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <button
              onClick={onSettingsClick}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">应用设置</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={onSignOut}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-500">退出登录</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 py-4">
          宝宝成长记录 v1.0.0
        </p>
      </div>
    </div>
  );
};