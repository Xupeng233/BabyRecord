import { useState, useEffect } from 'react';
import { LogOut, Baby, ChevronRight, User, Heart, Users, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EditModal } from '../components/EditModal';

interface Profile {
  babyName: string;
  babyGender: string;
}

interface ProfilePageProps {
  userId: string;
  userEmail: string;
  birthDate: string | null;
  entryCount: number;
  onSignOut: () => void;
  onUpdateBirthDate: (date: string) => void;
  onFamilyClick: () => void;
  onUpdateBabyName: (name: string) => void;
}

const PROFILE_FIELD_MAP: Record<string, string> = {
  babyName: 'baby_name',
  babyGender: 'baby_gender',
};

const PROFILE_CACHE_KEY = 'baby_profile';

export const ProfilePage = ({
  userId,
  userEmail,
  birthDate,
  entryCount,
  onSignOut,
  onUpdateBirthDate,
  onFamilyClick,
  onUpdateBabyName,
}: ProfilePageProps) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const cached = localStorage.getItem('baby_profile');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.userId === userId) {
        return {
          babyName: parsed.babyName || '',
          babyGender: parsed.babyGender || '',
        };
      }
    }
    return { babyName: '', babyGender: '' };
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newBirthDate, setNewBirthDate] = useState(birthDate || '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<{
    title: string;
    field: string;
    placeholder?: string;
    type?: 'text' | 'select';
    options?: Array<{ label: string; value: string; emoji?: string }>;
  } | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useEffect(() => {
    setNewBirthDate(birthDate || '');
  }, [birthDate]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('baby_name, baby_gender')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      const p = {
        babyName: data.baby_name || '',
        babyGender: data.baby_gender || '',
      };
      setProfile(p);
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ userId, ...p }));
    }
  };

  const saveProfile = async (field: string, value: string) => {
    const dbField = PROFILE_FIELD_MAP[field] || field;
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ userId, ...newProfile }));
    setEditingField(null);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        [dbField]: value,
      }, { onConflict: 'user_id' });
    if (error) {
      console.error('Save profile error:', error);
      loadProfile();
    }
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

  const handleOpenEdit = (
    title: string,
    field: string,
    placeholder?: string,
    type: 'text' | 'select' = 'text',
    options?: Array<{ label: string; value: string; emoji?: string }>
  ) => {
    setCurrentEditField({ title, field, placeholder, type, options });
    setShowEditModal(true);
  };

  const handleSaveEdit = (value: string) => {
    if (!currentEditField) return;
    
    if (currentEditField.field === 'babyName') {
      onUpdateBabyName(value);
    } else {
      saveProfile(currentEditField.field, value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-6 pt-12 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            {profile.babyGender === 'male' ? (
              <span className="text-2xl">👦</span>
            ) : profile.babyGender === 'female' ? (
              <span className="text-2xl">👧</span>
            ) : (
              <span className="text-2xl">👶</span>
            )}
          </div>
          <button
            onClick={() => handleOpenEdit('修改昵称', 'babyName', '请输入宝宝昵称')}
            className="flex-1 text-left hover:opacity-80 transition-opacity"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {profile.babyName || '宝宝成长记录'}
              <Pencil className="w-4 h-4 text-white/70" />
            </h2>
            <p className="text-sm text-white/80 mt-1">{userEmail}</p>
          </button>
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
              <button
                onClick={() => handleOpenEdit('修改昵称', 'babyName', '请输入宝宝昵称')}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <span>{profile.babyName || '未设置'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">宝宝性别</span>
              </div>
              <button
                onClick={() => handleOpenEdit('选择性别', 'babyGender', undefined, 'select', genderOptions)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
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
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">出生日期</span>
              </div>
              <button
                onClick={() => {
                  setNewBirthDate(birthDate || '');
                  setEditingField('birthDate');
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <span>{birthDate || '未设置'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700">记录数量</span>
              </div>
              <span className="text-sm text-gray-500">{entryCount} 条</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">家庭成员</h3>
          </div>
          <button
            onClick={onFamilyClick}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-gray-700">家长信息</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">账号</h3>
          </div>
          <div className="divide-y divide-gray-100">
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

      {showEditModal && currentEditField && (
        <EditModal
          isOpen={showEditModal}
          title={currentEditField.title}
          placeholder={currentEditField.placeholder}
          currentValue={profile[currentEditField.field as keyof Profile] || ''}
          type={currentEditField.type}
          options={currentEditField.options}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};
