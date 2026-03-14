/* Consent & Medical Disclaimer Modal */
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ConsentModalProps {
  onAccept: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false);
  const [emergencyAgreed, setEmergencyAgreed] = useState(false);

  useEffect(() => {
    // Check if consent was previously given
    const consent = localStorage.getItem('telemedicine_consent');
    if (consent === 'true') {
      onAccept();
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('telemedicine_consent', 'true');
    localStorage.setItem('telemedicine_consent_date', new Date().toISOString());
    onAccept();
  };

  const canContinue = agreed && emergencyAgreed;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-card border border-border/50 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Medical Disclaimer & Consent</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Please read and acknowledge the following before proceeding.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Disclaimer Text */}
          <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground space-y-3">
            <p>
              <strong className="text-foreground">Important Notice:</strong> This telemedicine 
              platform is designed for non-emergency medical consultations only.
            </p>
            <p>
              The information provided through this service does not replace professional 
              medical advice, diagnosis, or treatment. Always seek the advice of your 
              physician or other qualified health provider.
            </p>
            <p>
              By using this service, you acknowledge that you understand its limitations 
              and agree to use it responsibly.
            </p>
          </div>

          {/* Emergency Warning */}
          <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Emergency Warning</p>
              <p className="text-muted-foreground mt-1">
                If you are experiencing a medical emergency (chest pain, difficulty breathing, 
                severe bleeding, loss of consciousness), please call emergency services 
                immediately or go to your nearest emergency room.
              </p>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-foreground cursor-pointer">
                I have read and understood the medical disclaimer. I consent to receiving 
                telemedicine services through this platform.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="emergency"
                checked={emergencyAgreed}
                onCheckedChange={(checked) => setEmergencyAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="emergency" className="text-sm text-foreground cursor-pointer">
                I understand that this service is <strong>NOT for emergency care</strong> and 
                I will seek appropriate emergency services if needed.
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50">
          <Button
            onClick={handleAccept}
            disabled={!canContinue}
            className="w-full gap-2"
            size="lg"
          >
            <CheckCircle className="h-5 w-5" />
            I Agree & Continue
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Your consent will be saved for future visits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
