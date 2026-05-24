import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  fatherName: string;
  motherName: string;
  paternalGrandfatherName: string;
  paternalGrandmotherName: string;
  maternalGrandfatherName: string;
  maternalGrandmotherName: string;
}

interface FamilyPageProps {
  userId: string;
  onBack: () => void;
}

const FIELD_MAP: Record<string, string> = {
  fatherName: 'father_name',
  motherName: 'mother_name',
  paternalGrandfatherName: 'paternal_grandfather_name',
  paternalGrandmotherName: 'paternal_grandmother_name',
  maternalGrandfatherName: 'maternal_grandfather_name',
  maternalGrandmotherName: 'maternal_grandmother_name',
};

export const FamilyPage = ({ userId, onBack }: FamilyPageProps) => {
  const [profile, setProfile] = useState<Profile>({
    fatherName: '',
    motherName: '',
    paternalGrandfatherName: '',
    paternalGrandmotherName: '',
    maternalGrandfatherName: '',
    maternalGrandmotherName: '',
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('father_name, mother_name, paternal_grandfather_name, paternal_grandmother_name, maternal_grandfather_name, maternal_grandmother_name')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      setProfile({
        fatherName: data.father_name || '',
        motherName: data.mother_name || '',
        paternalGrandfatherName: data.paternal_grandfather_name || '',
        paternalGrandmotherName: data.paternal_grandmother_name || '',
        maternalGrandfatherName: data.maternal_grandfather_name || '',
        maternalGrandmotherName: data.maternal_grandmother_name || '',
      });
    }
  };

  const saveProfile = async (field: string, value: string) => {
    const dbField = FIELD_MAP[field] || field;
    setProfile((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        [dbField]: value,
      }, { onConflict: 'user_id' });
    if (error) {
      console.error('Save family error:', error);
      loadProfile();
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditingValue(currentValue);
  };

  const renderEditField = (field: string, label: string) => (
    <div className="px-4 py-3 flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      {editingField === field ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            placeholder={`请输入${label}`}
            className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1 w-28"
            autoFocus
          />
          <button
            onClick={() => saveProfile(field, editingValue)}
            className="text-sm text-primary-600 font-medium whitespace-nowrap"
          >
            保存
          </button>
          <button
            onClick={() => setEditingField(null)}
            className="text-sm text-gray-400 whitespace-nowrap"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={() => startEditing(field, (profile as any)[field])}
          className="flex items-center gap-1 text-sm text-gray-500"
        >
          <span>{(profile as any)[field] || '未设置'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">家长信息</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">父母信息</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {renderEditField('fatherName', '爸爸')}
            {renderEditField('motherName', '妈妈')}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">祖父母信息</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {renderEditField('paternalGrandfatherName', '爷爷')}
            {renderEditField('paternalGrandmotherName', '奶奶')}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">外祖父母信息</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {renderEditField('maternalGrandfatherName', '外公')}
            {renderEditField('maternalGrandmotherName', '外婆')}
          </div>
        </div>
      </div>
    </div>
  );
};
