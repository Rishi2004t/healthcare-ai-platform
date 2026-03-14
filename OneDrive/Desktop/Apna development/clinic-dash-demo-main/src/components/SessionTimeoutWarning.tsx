/* Session Auto-End Warning - Inactivity Timeout */
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionTimeoutWarningProps {
  onTimeout: () => void;
  onContinue: () => void;
  inactivityThreshold?: number; // in seconds
  warningDuration?: number; // in seconds
}

const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  onTimeout,
  onContinue,
  inactivityThreshold = 120, // 2 minutes of inactivity
  warningDuration = 60, // 1 minute warning
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningDuration);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (showWarning) {
      setShowWarning(false);
      setCountdown(warningDuration);
      onContinue();
    }
  }, [showWarning, warningDuration, onContinue]);

  // Listen for user activity
  useEffect(() => {
    const handleActivity = () => {
      if (!showWarning) {
        setLastActivity(Date.now());
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [showWarning]);

  // Check for inactivity
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const elapsed = (Date.now() - lastActivity) / 1000;
      if (elapsed >= inactivityThreshold && !showWarning) {
        setShowWarning(true);
        setCountdown(warningDuration);
      }
    }, 1000);

    return () => clearInterval(inactivityCheck);
  }, [lastActivity, inactivityThreshold, showWarning, warningDuration]);

  // Countdown when warning is shown
  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, onTimeout]);

  if (!showWarning) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-lg p-6 mx-4 animate-scale-in">
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/20 mb-3">
            <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Session Timeout Warning</h3>
        </div>

        {/* Message */}
        <p className="text-center text-muted-foreground mb-4">
          Your session will end in <span className="font-bold text-amber-500">{formatTime(countdown)}</span> due to inactivity.
        </p>

        {/* Countdown Bar */}
        <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / warningDuration) * 100}%` }}
          />
        </div>

        {/* Action Button */}
        <Button
          onClick={resetActivity}
          className="w-full h-12 gap-2"
        >
          <MousePointer className="h-4 w-4" />
          I'm Still Here - Continue Session
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-3">
          Any activity will dismiss this warning
        </p>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
