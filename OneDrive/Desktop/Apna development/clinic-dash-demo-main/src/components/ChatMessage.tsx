import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, timestamp }) => {
  return (
    <div
      className={`flex gap-3 ${isBot ? 'animate-slide-in-left' : 'animate-slide-in-right flex-row-reverse'}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isBot ? 'gradient-hero' : 'bg-secondary'
        }`}
      >
        {isBot ? (
          <Bot className="h-5 w-5 text-primary-foreground" />
        ) : (
          <User className="h-5 w-5 text-secondary-foreground" />
        )}
      </div>
      
      <div className={`flex flex-col ${isBot ? '' : 'items-end'}`}>
        <div
          className={`max-w-[280px] sm:max-w-[360px] px-4 py-3 rounded-2xl ${
            isBot
              ? 'gradient-chat-bot text-primary-foreground rounded-tl-sm'
              : 'gradient-chat-user text-foreground rounded-tr-sm border border-border/50'
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">{timestamp}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
