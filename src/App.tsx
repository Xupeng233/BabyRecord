import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AddEntryPage } from './pages/AddEntryPage';
import { HistoryPage } from './pages/HistoryPage';
import { BirthDateModal } from './components/BirthDateModal';
import { Toast } from './components/Toast';
import { BottomTab, Tab } from './components/BottomTab';
import { useStorage } from './hooks/useStorage';
import { ToastMessage, Entry } from './types';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [currentPage, setCurrentPage] = useState<'home' | 'add' | null>('home');
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { entries, settings, saveEntry, deleteEntry, saveSettings } = useStorage();

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToastMessages(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToastMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const handleSaveBirthDate = useCallback((birthDate: string) => {
    const success = saveSettings({ birthDate });
    if (success) {
      addToast('出生日期设置成功');
    } else {
      addToast('保存失败，请重试', 'error');
    }
  }, [saveSettings, addToast]);

  const handleSaveEntry = useCallback((entry: Entry) => {
    const success = saveEntry(entry);
    if (success) {
      addToast('记录保存成功');
      setCurrentPage('home');
    } else {
      addToast('保存失败，请重试', 'error');
    }
  }, [saveEntry, addToast]);

  const handleDeleteEntry = useCallback((id: string) => {
    const success = deleteEntry(id);
    if (success) {
      addToast('记录已删除');
    } else {
      addToast('删除失败，请重试', 'error');
    }
  }, [deleteEntry, addToast]);

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
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

    if (currentTab === 'home') {
      return (
        <>
          <Header
            settings={settings}
            onSettingsClick={() => setShowSettingsModal(true)}
            onHistoryClick={() => setCurrentTab('growth')}
            showHistoryButton={entries.length > 0}
          />
          <HomePage
            entries={entries}
            onAddClick={() => setCurrentPage('add')}
            onDelete={handleDeleteEntry}
          />
        </>
      );
    }

    return (
      <>
        <header className="bg-white px-4 py-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">成长时光</h1>
              <p className="text-xs text-gray-500">记录每一个珍贵瞬间</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="设置"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </header>
        <HistoryPage
          entries={entries}
          onDelete={handleDeleteEntry}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 pb-20">
        {renderContent()}
      </div>
      
      {currentPage !== 'add' && (
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