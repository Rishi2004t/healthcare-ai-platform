/* Consultation Session Timer */
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Pause, Play } from 'lucide-react';

interface ConsultationTimerProps {
  isActive: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

const ConsultationTimer: React.FC<ConsultationTimerProps> = ({ isActive, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Auto-pause after 30 seconds of inactivity
  const INACTIVITY_THRESHOLD = 30000;

  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
    if (isPaused) {
      setIsPaused(false);
    }
  }, [isPaused]);

  useEffect(() => {
    // Listen for user activity
    const handleActivity = () => resetActivityTimer();
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [resetActivityTimer]);

  useEffect(() => {
    // Check for inactivity
    const inactivityCheck = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_THRESHOLD && !isPaused && isActive) {
        setIsPaused(true);
      }
    }, 1000);

    return () => clearInterval(inactivityCheck);
  }, [lastActivity, isPaused, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newValue = prev + 1;
          onTimeUpdate?.(newValue);
          return newValue;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full border border-border/50">
      <Clock className="h-4 w-4 text-primary" />
      <span className="text-sm font-mono font-medium text-foreground">
        {formatTime(seconds)}
      </span>
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="p-1 hover:bg-primary/10 rounded-full transition-colors"
        title={isPaused ? 'Resume timer' : 'Pause timer'}
      >
        {isPaused ? (
          <Play className="h-3 w-3 text-primary" />
        ) : (
          <Pause className="h-3 w-3 text-muted-foreground" />
        )}
      </button>
      {isPaused && (
        <span className="text-xs text-muted-foreground">(Paused)</span>
      )}
    </div>
  );
};

export default ConsultationTimer;
