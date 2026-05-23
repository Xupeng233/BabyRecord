import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AddEntryPage } from './pages/AddEntryPage';
import { HistoryPage } from './pages/HistoryPage';
import { BirthDateModal } from './components/BirthDateModal';
import { Toast } from './components/Toast';
import { useStorage } from './hooks/useStorage';
import { ToastMessage, Entry } from './types';

type Page = 'home' | 'add' | 'history';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">宝宝头型记录</h1>
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {currentPage === 'home' && (
        <>
          <Header
            settings={settings}
            onSettingsClick={() => setShowSettingsModal(true)}
            onHistoryClick={() => setCurrentPage('history')}
            showHistoryButton={entries.length > 0}
          />
          <HomePage
            entries={entries}
            onAddClick={() => setCurrentPage('add')}
            onDelete={handleDeleteEntry}
          />
        </>
      )}
      
      {currentPage === 'add' && (
        <AddEntryPage
          birthDate={settings.birthDate}
          onSave={handleSaveEntry}
          onBack={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'history' && (
        <HistoryPage
          entries={entries}
          onBack={() => setCurrentPage('home')}
          onDelete={handleDeleteEntry}
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