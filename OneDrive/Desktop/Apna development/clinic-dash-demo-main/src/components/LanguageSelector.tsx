/* Language Preference Selector */
import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border/50">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-lg overflow-hidden border border-border/50">
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            language === 'en'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('hi')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            language === 'hi'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          हिं
        </button>
      </div>
    </div>
  );
};

// Translations for UI text
export const translations = {
  en: {
    chatTitle: 'MediBot',
    friendlyMode: 'Friendly Mode',
    professionalMode: 'Professional Mode',
    online: 'Online',
    offline: 'Offline',
    typeMessage: 'Type your message...',
    botOffline: 'Bot is offline',
    chatDisabled: 'Chat is disabled',
    chat: 'Chat',
    quickReplies: [
      'I have a headache',
      'Book an appointment',
      'Talk to a doctor',
      'View my records',
    ],
    endConsultation: 'End Consultation',
    consultationTime: 'Consultation Time',
  },
  hi: {
    chatTitle: 'मेडीबॉट',
    friendlyMode: 'मित्रवत मोड',
    professionalMode: 'पेशेवर मोड',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    typeMessage: 'अपना संदेश लिखें...',
    botOffline: 'बॉट ऑफलाइन है',
    chatDisabled: 'चैट अक्षम है',
    chat: 'चैट',
    quickReplies: [
      'मुझे सिरदर्द है',
      'अपॉइंटमेंट बुक करें',
      'डॉक्टर से बात करें',
      'मेरे रिकॉर्ड देखें',
    ],
    endConsultation: 'परामर्श समाप्त करें',
    consultationTime: 'परामर्श समय',
  },
};

export default LanguageSelector;
