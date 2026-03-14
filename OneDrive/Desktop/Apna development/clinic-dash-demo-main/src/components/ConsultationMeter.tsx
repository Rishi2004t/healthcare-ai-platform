import React, { useState, useEffect } from 'react';
import { Stethoscope } from 'lucide-react';

/* Consultation Readiness Meter Component */
/* Circular progress ring showing doctor preparation status */

const ConsultationMeter: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Circle properties
  const size = 64;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Auto-progress animation
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          // Reset after delay
          setTimeout(() => {
            setProgress(0);
            setIsComplete(false);
          }, 3000);
          return 100;
        }
        // Random increment for natural feel
        return Math.min(prev + Math.random() * 8 + 2, 100);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isComplete]);

  const getStatusText = () => {
    if (isComplete) return "Ready for consultation!";
    if (progress > 75) return "Almost ready…";
    if (progress > 50) return "Preparing notes…";
    if (progress > 25) return "Reviewing records…";
    return "Getting ready…";
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <div
        className={`
          absolute -top-12 left-1/2 -translate-x-1/2
          px-3 py-1.5 rounded-lg bg-card border border-border/50
          text-xs text-foreground whitespace-nowrap shadow-lg
          transition-all duration-300
          ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}
      >
        {getStatusText()}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border/50 rotate-45" />
      </div>

      {/* Meter Container */}
      <div
        className={`
          relative w-16 h-16 cursor-pointer
          transition-all duration-300
          hover:scale-110
          ${isComplete ? 'consultation-complete-pulse' : ''}
        `}
      >
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`
              transition-all duration-500 ease-out
              ${isComplete ? 'text-green-500' : 'text-primary'}
            `}
            style={{
              filter: isComplete ? 'drop-shadow(0 0 8px rgba(34,197,94,0.5))' : 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))',
            }}
          />
        </svg>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`
              w-10 h-10 rounded-full bg-card border border-border/50
              flex items-center justify-center
              transition-all duration-300
              ${isComplete ? 'bg-green-500/10 border-green-500/30' : ''}
            `}
          >
            {isComplete ? (
              <span className="text-green-500 text-lg">✓</span>
            ) : (
              <Stethoscope
                className={`
                  w-4 h-4 text-primary
                  ${progress > 0 && !isComplete ? 'animate-pulse' : ''}
                `}
              />
            )}
          </div>
        </div>

        {/* Percentage */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
          <span
            className={`
              text-xs font-medium
              ${isComplete ? 'text-green-500' : 'text-muted-foreground'}
            `}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConsultationMeter;
