import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-hero">
        <Bot className="h-5 w-5 text-primary-foreground" />
      </div>
      
      <div className="px-4 py-3 rounded-2xl gradient-chat-bot rounded-tl-sm">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary-foreground/70 animate-typing" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-primary-foreground/70 animate-typing" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-primary-foreground/70 animate-typing" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
