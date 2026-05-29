import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EditModal } from '../components/EditModal';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<{
    title: string;
    field: string;
    placeholder?: string;
  } | null>(null);

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

  const handleOpenEdit = (title: string, field: string, placeholder?: string) => {
    setCurrentEditField({ title, field, placeholder });
    setShowEditModal(true);
  };

  const renderEditField = (field: string, label: string) => (
    <div className="px-4 py-3 flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => handleOpenEdit(`修改${label}`, field, `请输入${label}`)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
      >
        <span>{(profile as any)[field] || '未设置'}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
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

      {showEditModal && currentEditField && (
        <EditModal
          isOpen={showEditModal}
          title={currentEditField.title}
          placeholder={currentEditField.placeholder}
          currentValue={profile[currentEditField.field as keyof Profile] || ''}
          onClose={() => setShowEditModal(false)}
          onSave={(value) => saveProfile(currentEditField.field, value)}
        />
      )}
    </div>
  );
};
