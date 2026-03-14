import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Info, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import { aiApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await aiApi.getHistory();
      if (response.data && response.data.length > 0) {
        const history = response.data.map((m: any) => ({
          id: m.id,
          text: m.message,
          isBot: m.sender === 'bot',
          timestamp: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(history);
      } else {
        // Initial greeting if no history
        setMessages([{
          id: 1,
          text: "Hi! I'm your AI Medical Assistant. How can I help you today? You can describe any symptoms you're having.",
          isBot: true,
          timestamp: getCurrentTime(),
        }]);
      }
    } catch (error) {
      console.error('Failed to fetch chat history', error);
      toast.error('Could not load chat history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || !user?.id) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiApi.chat(user.id, messageText);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.response,
        isBot: true,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('AI Chat failed:', error);
      toast.error('AI is currently unavailable.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="page-transition min-h-[calc(100vh-4rem)] bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[85vh] flex flex-col rounded-3xl overflow-hidden border-border/50 shadow-soft bg-card">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl gradient-hero flex items-center justify-center shadow-soft">
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Medical Assistant</h1>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Online & Ready to help
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchHistory} title="Refresh History">
            <RefreshCcw className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {loadingHistory ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Loading your medical history...</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Disclaimer Area */}
        <div className="px-6 py-2 bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/20">
          <p className="text-[10px] text-amber-800 dark:text-amber-500 text-center leading-tight">
            <Info className="h-3 w-3 inline mr-1 -mt-0.5" />
            AI suggestions are for informational purposes. Not a replacement for professional diagnosis.
          </p>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-card border-t border-border/50">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your symptoms or ask a medical question..."
              className="flex-1 h-14 px-6 rounded-2xl bg-muted border-0 focus-visible:ring-primary text-base shadow-inner"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="h-14 w-14 rounded-2xl shadow-soft gradient-hero"
            >
              {isTyping ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["I have a headache", "Symptoms of flu", "Dosage for Paracetamol"].map((tip) => (
              <button
                key={tip}
                onClick={() => handleSend(tip)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                {tip}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
