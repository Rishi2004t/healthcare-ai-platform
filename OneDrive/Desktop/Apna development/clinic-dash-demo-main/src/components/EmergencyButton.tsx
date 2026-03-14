/* Emergency Help Button Component */
import React, { useState } from 'react';
import { Phone, X, AlertTriangle, Ambulance, Hospital } from 'lucide-react';

const EmergencyButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Emergency Button - Fixed Bottom Right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center animate-emergency-pulse hover:scale-110 transition-transform"
        aria-label="Emergency Help"
      >
        <Phone className="h-6 w-6" />
      </button>

      {/* Emergency Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modal-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Emergency Help</h3>
                  <p className="text-sm text-muted-foreground">24/7 Emergency Services</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-3">
              <a 
                href="tel:911"
                className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-destructive flex items-center justify-center">
                  <Phone className="h-5 w-5 text-destructive-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Emergency Hotline</p>
                  <p className="text-sm text-muted-foreground">911</p>
                </div>
              </a>

              <a 
                href="tel:102"
                className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Ambulance className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Ambulance Service</p>
                  <p className="text-sm text-muted-foreground">102</p>
                </div>
              </a>

              <a 
                href="tel:108"
                className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Hospital className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Hospital Helpline</p>
                  <p className="text-sm text-muted-foreground">108</p>
                </div>
              </a>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              For immediate medical emergencies, please call emergency services directly.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyButton;
