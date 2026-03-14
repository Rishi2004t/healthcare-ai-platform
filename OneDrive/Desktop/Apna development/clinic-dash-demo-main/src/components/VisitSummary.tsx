/* Visit Summary - Post-Consultation */
import React from 'react';
import { FileText, Clock, Activity, AlertCircle, Printer, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisitSummaryProps {
  symptoms: string[];
  duration: number;
  onClose: () => void;
}

const VisitSummary: React.FC<VisitSummaryProps> = ({ symptoms, duration, onClose }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} min ${secs} sec`;
    }
    return `${secs} seconds`;
  };

  const handlePrint = () => {
    // UI only - no real print functionality
    alert('Print functionality would open print dialog in production.');
  };

  const handleDownload = () => {
    // UI only - no real download functionality
    alert('Download functionality would generate PDF in production.');
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-card border border-border/50 w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border/50 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Visit Summary</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Consultation completed on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Consultation Details */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Consultation Details
            </h3>
            <div className="bg-muted rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground">{formatDuration(duration)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="text-foreground">Virtual Consultation</span>
              </div>
            </div>
          </div>

          {/* Reported Symptoms */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Reported Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.length > 0 ? (
                symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No symptoms reported</span>
              )}
            </div>
          </div>

          {/* Doctor's Notes Summary */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Doctor's Notes</h3>
            <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">
              <p>
                Patient consulted regarding reported symptoms. General health advice provided.
                Recommended rest, hydration, and monitoring of symptoms. Follow-up advised
                if condition persists or worsens.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-500">Important Disclaimer</p>
              <p className="text-muted-foreground mt-1">
                This summary is for informational purposes only and does not constitute a 
                medical prescription or diagnosis. Always consult with a healthcare professional
                for medical advice.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print Summary
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <Button onClick={onClose} className="w-full">
            Close Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitSummary;
