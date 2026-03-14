/* Consultation Readiness Check */
import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ReadinessCheckProps {
  onReady: () => void;
}

const ReadinessCheck: React.FC<ReadinessCheckProps> = ({ onReady }) => {
  const [privatePlace, setPrivatePlace] = useState(false);
  const [notEmergency, setNotEmergency] = useState(false);

  const canProceed = privatePlace && notEmergency;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-card p-6 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Before We Begin</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please confirm the following to ensure a quality consultation.
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-4 mb-6">
          {/* Private Place Check */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 cursor-pointer hover:bg-muted/70 transition-colors">
            <Checkbox
              checked={privatePlace}
              onCheckedChange={(checked) => setPrivatePlace(checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Private Environment</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                I am in a quiet and private place where I can speak freely about my health concerns.
              </p>
            </div>
          </label>

          {/* Not Emergency Check */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 cursor-pointer hover:bg-muted/70 transition-colors">
            <Checkbox
              checked={notEmergency}
              onCheckedChange={(checked) => setNotEmergency(checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Non-Emergency Care</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                I understand this is not emergency care. For emergencies, I will call local emergency services.
              </p>
            </div>
          </label>
        </div>

        {/* Warning Note */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            ⚠️ If you are experiencing chest pain, difficulty breathing, severe bleeding, or other life-threatening symptoms, please call emergency services immediately.
          </p>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onReady}
          disabled={!canProceed}
          className="w-full h-12"
        >
          {canProceed ? 'Continue to Consultation' : 'Please confirm both items'}
        </Button>
      </div>
    </div>
  );
};

export default ReadinessCheck;
