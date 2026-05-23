import { useState, useEffect } from 'react';
import { Entry, Settings } from '../types';

const ENTRIES_KEY = 'baby_head_entries';
const SETTINGS_KEY = 'baby_head_settings';

export const useStorage = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const savedEntries = localStorage.getItem(ENTRIES_KEY);
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch {
        setEntries([]);
      }
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        setSettings(null);
      }
    }
  }, []);

  const saveEntry = (entry: Entry): boolean => {
    try {
      const newEntries = [...entries, entry];
      setEntries(newEntries);
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
      return true;
    } catch {
      return false;
    }
  };

  const deleteEntry = (id: string): boolean => {
    try {
      const newEntries = entries.filter(entry => entry.id !== id);
      setEntries(newEntries);
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
      return true;
    } catch {
      return false;
    }
  };

  const saveSettings = (newSettings: Settings): boolean => {
    try {
      setSettings(newSettings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      return true;
    } catch {
      return false;
    }
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  return {
    entries,
    settings,
    saveEntry,
    deleteEntry,
    saveSettings,
    generateId,
  };
};