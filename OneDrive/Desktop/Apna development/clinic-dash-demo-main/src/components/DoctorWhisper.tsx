import React, { useState, useEffect } from 'react';

/* Doctor Whisper Mode Component */
/* Subtle, reassuring rotating text messages */

const whisperMessages = [
  "Reviewing your symptoms…",
  "Preparing your consultation…",
  "Here to help you feel better…",
  "Your health is our priority…",
  "Ready when you are…",
  "Taking care of you…",
  "Standing by for you…",
  "Your wellness matters…",
];

interface DoctorWhisperProps {
  isPaused?: boolean;
}

const DoctorWhisper: React.FC<DoctorWhisperProps> = ({ isPaused = false }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate messages with fade effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % whisperMessages.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="relative h-6 flex items-center justify-center min-w-[180px]">
      <p
        className={`
          text-xs md:text-sm text-muted-foreground italic
          transition-all duration-500 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          ${isPaused ? 'text-foreground font-medium' : ''}
        `}
      >
        {whisperMessages[currentMessage]}
      </p>
      
      {/* Decorative dots */}
      <span
        className={`
          ml-1 inline-flex gap-0.5
          transition-opacity duration-300
          ${isVisible && !isPaused ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </span>
    </div>
  );
};

export default DoctorWhisper;
