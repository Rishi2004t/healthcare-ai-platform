/* Emergency Symptom Detection Banner */
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyBannerProps {
  message: string;
  onDismiss: () => void;
}

const emergencyKeywords = [
  'chest pain',
  'breathing difficulty',
  'difficulty breathing',
  'can\'t breathe',
  'cannot breathe',
  'unconscious',
  'severe bleeding',
  'heart attack',
  'stroke',
  'choking',
  'overdose',
  'suicidal',
  'suicide',
];

export const checkForEmergency = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return emergencyKeywords.some(keyword => lowerText.includes(keyword));
};

const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ message, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 30 seconds but keep it visible
    const timer = setTimeout(() => {
      // Don't auto-dismiss for safety
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="animate-fade-in bg-destructive/95 text-destructive-foreground p-4 rounded-xl mb-4 border-2 border-destructive shadow-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 flex-shrink-0 animate-pulse" />
        <div className="flex-1">
          <p className="font-bold text-lg">⚠️ Emergency Warning</p>
          <p className="text-sm mt-1 opacity-90">
            Based on your message, this may be a medical emergency. 
            <strong> Please seek immediate medical care.</strong>
          </p>
          <p className="text-sm mt-2 opacity-90">
            Detected concern: "{message}"
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 bg-white text-destructive hover:bg-white/90"
            >
              <Phone className="h-4 w-4" />
              Call Emergency Services
            </Button>
          </div>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs mt-3 opacity-75">
        This is a safety feature. If this is not an emergency, you may dismiss this message and continue.
      </p>
    </div>
  );
};

export default EmergencyBanner;
