import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AddEntryPage } from './pages/AddEntryPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { FamilyPage } from './pages/FamilyPage';
import { BirthDateModal } from './components/BirthDateModal';
import { Toast } from './components/Toast';
import { BottomTab, Tab } from './components/BottomTab';
import { AuthPage } from './pages/AuthPage';
import { supabase } from './lib/supabase';
import { entriesService } from './lib/db';
import { ToastMessage, Entry } from './types';

type Page = 'home' | 'add' | 'family' | null;

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<{ birthDate: string } | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSettings(session.user.id);
        loadEntries(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadSettings(session.user.id);
          loadEntries(session.user.id);
        } else {
          setSettings(null);
          setEntries([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadSettings = async (userId: string) => {
    const { data, error } = await supabase
      .from('settings')
      .select('birth_date')
      .eq('user_id', userId)
      .maybeSingle();
    if (data && !error) {
      setSettings({ birthDate: data.birth_date });
    }
  };

  const loadEntries = async (userId: string) => {
    try {
      const data = await entriesService.getAll(userId);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
    }
  };

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToastMessages(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToastMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const handleSaveBirthDate = useCallback(async (birthDate: string) => {
    if (!user) {
      console.error('No user in handleSaveBirthDate');
      return;
    }
    const { data, error } = await supabase
      .from('settings')
      .upsert({ user_id: user.id, birth_date: birthDate }, { onConflict: 'user_id' })
      .select();
    if (error) {
      console.error('Save settings error:', error);
      addToast('保存失败，请重试', 'error');
    } else {
      setSettings({ birthDate });
      addToast('出生日期设置成功');
    }
  }, [user, addToast]);

  const handleSaveEntry = useCallback(async (entry: Omit<Entry, 'id' | 'createdAt'>) => {
    if (!user) return;
    try {
      const newEntry = await entriesService.add(user.id, entry);
      setEntries(prev => [newEntry, ...prev]);
      addToast('记录保存成功');
      setCurrentPage('home');
    } catch (err) {
      addToast('保存失败，请重试', 'error');
    }
  }, [user, addToast]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    try {
      await entriesService.delete(id);
      setEntries(prev => prev.filter(e => e.id !== id));
      addToast('记录已删除');
    } catch (err) {
      addToast('删除失败，请重试', 'error');
    }
  }, [addToast]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSettings(null);
    setEntries([]);
    setCurrentTab('home');
    setCurrentPage('home');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthPage onAuthSuccess={() => {}} />
        <Toast messages={toastMessages} onRemove={removeToast} />
      </>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👶</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">宝宝成长记录</h1>
          <p className="text-gray-500">请先设置宝宝的出生日期</p>
        </div>
        <BirthDateModal
          isOpen={true}
          onClose={() => {}}
          onSave={handleSaveBirthDate}
        />
        <Toast messages={toastMessages} onRemove={removeToast} />
      </div>
    );
  }

  const renderContent = () => {
    if (currentPage === 'add') {
      return (
        <AddEntryPage
          birthDate={settings.birthDate}
          onSave={handleSaveEntry}
          onBack={() => setCurrentPage('home')}
        />
      );
    }

    if (currentPage === 'family') {
      return (
        <FamilyPage
          userId={user.id}
          onBack={() => setCurrentPage(null)}
        />
      );
    }

    if (currentTab === 'home') {
      return (
        <>
          <Header
            settings={settings}
            onSettingsClick={() => setCurrentTab('profile')}
            onHistoryClick={() => setCurrentTab('growth')}
            showHistoryButton={entries.length > 0}
          />
          <HomePage
            entries={entries}
            onAddClick={() => setCurrentPage('add')}
            onDelete={handleDeleteEntry}
            isLoggedIn={!!user}
          />
        </>
      );
    }

    if (currentTab === 'growth') {
      return (
        <>
          <header className="bg-white px-4 py-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👶</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">宝宝成长记录</h1>
                <p className="text-xs text-gray-500">成长历史</p>
              </div>
            </div>
          </header>
          <HistoryPage
            entries={entries}
            onDelete={handleDeleteEntry}
          />
        </>
      );
    }

    return (
      <ProfilePage
        userId={user.id}
        userEmail={user?.email || ''}
        birthDate={settings?.birthDate || null}
        entryCount={entries.length}
        onSignOut={handleSignOut}
        onUpdateBirthDate={handleSaveBirthDate}
        onFamilyClick={() => setCurrentPage('family')}
      />
    );
  };

  const showBottomTab = currentPage === null || currentPage === 'home';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 pb-20">
        {renderContent()}
      </div>

      {showBottomTab && (
        <BottomTab
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      )}

      <BirthDateModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={handleSaveBirthDate}
        currentDate={settings.birthDate}
      />

      <Toast messages={toastMessages} onRemove={removeToast} />
    </div>
  );
}

export default App;
