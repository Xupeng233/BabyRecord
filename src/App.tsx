import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AddEntryPage } from './pages/AddEntryPage';
import { HistoryPage } from './pages/HistoryPage';
import { EntryDetailPage } from './pages/EntryDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { FamilyPage } from './pages/FamilyPage';
import { BirthDateModal } from './components/BirthDateModal';
import { Toast } from './components/Toast';
import { BottomTab, Tab } from './components/BottomTab';
import { AuthPage } from './pages/AuthPage';
import { supabase } from './lib/supabase';
import { entriesService } from './lib/db';
import { storageService } from './lib/storage';
import { ToastMessage, Entry } from './types';

type Page = 'home' | 'add' | 'detail' | 'family' | null;

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<{ birthDate: string } | null>(() => {
    const cached = localStorage.getItem('baby_settings');
    return cached ? JSON.parse(cached) : null;
  });
  const [entries, setEntries] = useState<Entry[]>(() => {
    const cached = localStorage.getItem('baby_entries');
    return cached ? JSON.parse(cached) : [];
  });
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
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
          localStorage.removeItem('baby_settings');
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
    if (error) {
      console.error('Load settings error:', error);
    }
    if (data && !error) {
      const s = { birthDate: data.birth_date };
      setSettings(s);
      localStorage.setItem('baby_settings', JSON.stringify(s));
    }
  };

  const loadEntries = async (userId: string) => {
    try {
      const data = await entriesService.getAll(userId);
      setEntries(data);
      localStorage.setItem('baby_entries', JSON.stringify(data));
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
    if (!user) return;
    const { error } = await supabase
      .from('settings')
      .upsert({ user_id: user.id, birth_date: birthDate }, { onConflict: 'user_id' })
      .select();
    if (error) {
      addToast('保存失败，请重试', 'error');
    } else {
      const s = { birthDate };
      setSettings(s);
      localStorage.setItem('baby_settings', JSON.stringify(s));
      addToast('出生日期设置成功');
    }
  }, [user, addToast]);

  const handleSaveEntry = useCallback(async (entry: Omit<Entry, 'id' | 'createdAt'>, files: File[]) => {
    if (!user) return;

    const optimisticEntry: Entry = {
      ...entry,
      id: 'temp_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const newEntries = [optimisticEntry, ...entries];
    setEntries(newEntries);
    localStorage.setItem('baby_entries', JSON.stringify(newEntries));
    setCurrentPage('home');

    try {
      const urls = await storageService.uploadPhotos(user.id, files);
      const entryWithUrls = { ...entry, photoUrls: urls };
      const newEntry = await entriesService.add(user.id, entryWithUrls);
      const updatedEntries = entries.map(e => e.id === optimisticEntry.id ? newEntry : e);
      setEntries(updatedEntries);
      localStorage.setItem('baby_entries', JSON.stringify(updatedEntries));
      addToast('记录同步成功');
    } catch (err) {
      console.error('Save entry error:', err);
      const filteredEntries = entries.filter(e => e.id !== optimisticEntry.id);
      setEntries(filteredEntries);
      localStorage.setItem('baby_entries', JSON.stringify(filteredEntries));
      addToast('记录同步失败，请重试', 'error');
    }
  }, [user, addToast, entries]);

  const handleUpdateEntry = useCallback(async (id: string, updates: Partial<Entry>, newFiles: File[]) => {
    const updatedEntries = entries.map(e => e.id === id ? { ...e, ...updates } : e);
    setEntries(updatedEntries);
    localStorage.setItem('baby_entries', JSON.stringify(updatedEntries));
    setCurrentPage(null);

    try {
      let finalUpdates = { ...updates };
      if (newFiles.length > 0) {
        const newUrls = await storageService.uploadPhotos(user.id, newFiles);
        finalUpdates.photoUrls = [...(updates.photoUrls || []), ...newUrls];
      }
      const updated = await entriesService.update(id, finalUpdates);
      const syncedEntries = entries.map(e => e.id === id ? updated : e);
      setEntries(syncedEntries);
      localStorage.setItem('baby_entries', JSON.stringify(syncedEntries));
      addToast('修改同步成功');
    } catch (err) {
      console.error('Update entry error:', err);
      addToast('修改同步失败，请重试', 'error');
    }
  }, [user, addToast, entries]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    const entry = entries.find(e => e.id === id);
    const filteredEntries = entries.filter(e => e.id !== id);
    setEntries(filteredEntries);
    localStorage.setItem('baby_entries', JSON.stringify(filteredEntries));
    setCurrentPage(null);
    setSelectedEntry(null);

    try {
      await entriesService.delete(id);
      if (entry?.photoUrls?.length) {
        storageService.deletePhotos(entry.photoUrls).catch(console.error);
      }
      addToast('记录已删除');
    } catch (err) {
      addToast('删除失败，请重试', 'error');
    }
  }, [entries, addToast]);

  const handleEntryClick = useCallback((entry: Entry) => {
    setSelectedEntry(entry);
    setCurrentPage('detail');
  }, []);

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
          userId={user.id}
          onSave={handleSaveEntry}
          onBack={() => setCurrentPage('home')}
        />
      );
    }

    if (currentPage === 'detail' && selectedEntry) {
      return (
        <EntryDetailPage
          entry={selectedEntry}
          birthDate={settings.birthDate}
          userId={user.id}
          onSave={handleUpdateEntry}
          onDelete={handleDeleteEntry}
          onBack={() => {
            setCurrentPage(null);
            setSelectedEntry(null);
          }}
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
            onEntryClick={handleEntryClick}
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
                <p className="text-xs text-gray-500">成长曲线</p>
              </div>
            </div>
          </header>
          <HistoryPage entries={entries} />
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
