import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Write a 3-line professional summary for a Software Engineer",
  "Suggest top 10 skills for a Data Analyst",
  "How can I make my work experience section more impactful?",
  "Write a short cover letter for a Graphic Designer",
  "Review my resume and tell me what's missing",
];

export const RiyaAssistant = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Riya, your AI Resume Assistant. 👋\n\nI'm here to help you build an amazing resume! Ask me anything about:\n- Writing professional summaries\n- Improving your experience descriptions\n- Suggesting skills for your role\n- Creating cover letters\n- Reviewing your resume\n\nWhat would you like help with today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        role: "assistant",
        content: "⚠️ I'm sorry, but my AI backend (Supabase) is currently offline or has been removed. I cannot process your request at this moment."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling assistant:", error);
      toast({
        title: "Error",
        description: "Failed to get response from Riya. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chatContent = (
    <>
      <ScrollArea className="flex-1 p-4 sm:p-6">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg px-4 py-3 bg-muted">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce delay-100" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="mt-6 space-y-3 pb-4">
            <p className="text-sm text-muted-foreground font-medium">Try asking:</p>
            {SUGGESTED_QUESTIONS.map((question, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                onClick={() => sendMessage(question)}
                disabled={isLoading}
              >
                <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="text-xs">{question}</span>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 sm:p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Riya anything..."
            className="min-h-[50px] sm:min-h-[60px] text-sm resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger ? trigger : (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Ask Riya
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Riya - AI Resume Assistant</SheetTitle>
              <SheetDescription>
                Your friendly career coach
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        {chatContent}
      </SheetContent>
    </Sheet>
  );
};
