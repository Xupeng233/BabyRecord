import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast = ({ messages, onRemove }: ToastProps) => {
  useEffect(() => {
    messages.forEach((message) => {
      const timer = setTimeout(() => {
        onRemove(message.id);
      }, 2000);
      return () => clearTimeout(timer);
    });
  }, [messages, onRemove]);

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${getColors(message.type)} text-white shadow-lg min-w-[200px] max-w-[300px] animate-slide-up`}
        >
          {getIcon(message.type)}
          <span className="flex-1 text-sm font-medium">{message.message}</span>
          <button
            onClick={() => onRemove(message.id)}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};