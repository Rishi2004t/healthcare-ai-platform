/* Doctor Notes - Read-Only View */
import React, { useState } from 'react';
import { FileText, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface DoctorNotesProps {
  symptoms?: string[];
  duration?: number;
}

const DoctorNotes: React.FC<DoctorNotesProps> = ({ symptoms = [], duration = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : 'Less than a minute';
  };

  // Static example notes (simulation)
  const staticNotes = {
    assessment: 'Patient presents with reported symptoms. Vital signs discussed during consultation. No immediate red flags identified based on reported information.',
    recommendations: [
      'Rest and adequate hydration recommended',
      'Over-the-counter medication as discussed',
      'Monitor symptoms for any changes',
      'Follow up if symptoms persist or worsen',
    ],
    followUp: 'Recommended follow-up in 7 days if symptoms persist.',
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              Doctor's Notes
              <Lock className="h-3 w-3 text-muted-foreground" />
            </h3>
            <p className="text-xs text-muted-foreground">Read-only consultation notes</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 animate-fade-in">
          {/* Consultation Info */}
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-foreground">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-foreground">{formatDuration(duration)}</span>
            </div>
            {symptoms.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reported Symptoms:</span>
                <span className="text-foreground text-right max-w-[200px]">
                  {symptoms.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Assessment */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Assessment</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              {staticNotes.assessment}
            </p>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {staticNotes.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow-up */}
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-sm text-primary font-medium">{staticNotes.followUp}</p>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
            🔒 These notes are confidential and for your records only.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorNotes;
