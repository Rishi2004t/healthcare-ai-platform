/* End-of-Visit Thank You Flow */
import React from 'react';
import { Heart, Calendar, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ThankYouMessageProps {
  onNewConsultation: () => void;
}

const ThankYouMessage: React.FC<ThankYouMessageProps> = ({ onNewConsultation }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-card p-8 text-center animate-fade-in">
        {/* Heart Animation */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
          <Heart className="h-10 w-10 text-primary animate-pulse" />
        </div>

        {/* Thank You Message */}
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Thank You for Consulting
        </h2>
        <p className="text-muted-foreground mb-6">
          We hope you found this consultation helpful. Take care of yourself and don't hesitate to reach out if you need further assistance.
        </p>

        {/* Wellness Tip */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
          <p className="text-sm text-foreground">
            💡 <span className="font-medium">Wellness Tip:</span> Remember to stay hydrated, get adequate rest, and follow any recommendations discussed during your consultation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onNewConsultation}
            className="w-full h-12 gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Start New Consultation
          </Button>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1 h-11 gap-2">
              <Link to="/appointments">
                <Calendar className="h-4 w-4" />
                Book Follow-up
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-11 gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-xs text-muted-foreground mt-6">
          Your health is our priority. Wishing you a speedy recovery. 🩺
        </p>
      </div>
    </div>
  );
};

export default ThankYouMessage;
