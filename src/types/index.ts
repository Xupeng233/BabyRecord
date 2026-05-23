export interface Entry {
  id: string;
  date: string;
  photoBase64: string;
  daysOld: number;
  createdAt: string;
}

export interface Settings {
  birthDate: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}