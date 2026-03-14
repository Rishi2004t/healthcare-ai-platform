import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';

/* Health Tip Bubble Component */
/* Floating bubble with rotating medical tips */

const healthTips = [
  "💧 Stay hydrated! Drink 8 glasses of water daily.",
  "🚶 Take a 5-minute walk every hour.",
  "😴 Aim for 7-8 hours of quality sleep.",
  "🥗 Include vegetables in every meal.",
  "🧘 Practice deep breathing for stress relief.",
  "👀 Rest your eyes every 20 minutes.",
  "🍎 An apple a day keeps worries away!",
  "💪 Stretch your body regularly.",
];

const HealthTipBubble: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-rotate tips
  useEffect(() => {
    if (isPaused || isMinimized) return;
    
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, isMinimized]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed left-6 bottom-32 z-30 md:left-8
        transition-all duration-500 ease-out
        ${isMinimized ? 'health-tip-minimized' : 'health-tip-float'}
      `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {isMinimized ? (
        /* Minimized State */
        <button
          onClick={() => setIsMinimized(false)}
          className="
            w-12 h-12 rounded-full bg-primary/10 border border-primary/30
            flex items-center justify-center
            hover:bg-primary/20 hover:scale-110
            transition-all duration-300
            shadow-lg hover:shadow-xl
          "
          aria-label="Show health tips"
        >
          <Heart className="w-5 h-5 text-primary animate-pulse" />
        </button>
      ) : (
        /* Expanded Bubble */
        <div
          className={`
            relative max-w-[280px] md:max-w-xs
            bg-card/95 backdrop-blur-sm
            rounded-2xl shadow-lg border border-border/50
            p-4 pr-10
            transition-all duration-300
            ${isPaused ? 'scale-105 shadow-xl border-primary/30' : ''}
          `}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="
              absolute top-2 right-2 w-6 h-6 rounded-full
              bg-muted/50 hover:bg-muted
              flex items-center justify-center
              transition-colors duration-200
            "
            aria-label="Minimize health tips"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary">Health Tip</span>
          </div>

          {/* Tip Text */}
          <p className="text-sm text-foreground leading-relaxed health-tip-fade">
            {healthTips[currentTip]}
          </p>

          {/* Progress Dots */}
          <div className="flex gap-1 mt-3 justify-center">
            {healthTips.map((_, index) => (
              <span
                key={index}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${index === currentTip ? 'bg-primary w-4' : 'bg-muted-foreground/30'}
                `}
              />
            ))}
          </div>

          {/* Decorative Corner */}
          <div className="absolute -bottom-2 left-6 w-4 h-4 bg-card/95 border-r border-b border-border/50 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default HealthTipBubble;
