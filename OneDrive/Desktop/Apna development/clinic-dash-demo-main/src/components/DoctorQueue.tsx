/* Doctor Queue & Waiting Status */
import React, { useState, useEffect } from 'react';
import { Users, Clock, Loader2 } from 'lucide-react';

interface DoctorQueueProps {
  onReady: () => void;
}

const DoctorQueue: React.FC<DoctorQueueProps> = ({ onReady }) => {
  const [patientsAhead, setPatientsAhead] = useState(2);
  const [waitTime, setWaitTime] = useState(45); // seconds
  const [statusText, setStatusText] = useState('Doctor is reviewing previous case');

  const statusMessages = [
    'Doctor is reviewing previous case',
    'Doctor is finishing up a consultation',
    'Doctor is preparing for your session',
    'Almost ready for you...',
  ];

  useEffect(() => {
    // Simulate queue progress
    const queueInterval = setInterval(() => {
      setPatientsAhead(prev => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 15000); // Every 15 seconds, one patient leaves

    return () => clearInterval(queueInterval);
  }, []);

  useEffect(() => {
    // Countdown timer
    const timerInterval = setInterval(() => {
      setWaitTime(prev => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    // Update status messages
    const statusInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * statusMessages.length);
      setStatusText(statusMessages[randomIndex]);
    }, 8000);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    // When wait time is done, proceed
    if (waitTime === 0 && patientsAhead === 0) {
      setTimeout(onReady, 1000);
    }
  }, [waitTime, patientsAhead, onReady]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-card border border-border/50 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border/50 text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin mb-4" />
          <h2 className="text-xl font-bold text-foreground">Connecting to Doctor</h2>
          <p className="text-sm text-muted-foreground mt-1">Please wait while we prepare your consultation</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patients Ahead */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-foreground">Patients ahead of you</span>
            </div>
            <span className="text-2xl font-bold text-primary">{patientsAhead}</span>
          </div>

          {/* Wait Time */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-foreground">Estimated wait time</span>
            </div>
            <span className="text-2xl font-bold text-primary">{formatTime(waitTime)}</span>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-primary">{statusText}</span>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Your consultation will begin automatically when the doctor is ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorQueue;
