/* Symptom Triage Flow - Pre-Consultation Assessment */
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, Users, Activity, AlertTriangle, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface TriageData {
  age: string;
  gender: string;
  symptoms: string[];
  severity: number;
}

interface SymptomTriageProps {
  onComplete: (data: TriageData) => void;
  onSkip: () => void;
}

const symptomsList = [
  'Headache',
  'Fever',
  'Cough',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Body Aches',
  'Sore Throat',
  'Shortness of Breath',
  'Chest Pain',
];

const SymptomTriage: React.FC<SymptomTriageProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<TriageData>({
    age: '',
    gender: '',
    symptoms: [],
    severity: 3,
  });

  const handleSymptomToggle = (symptom: string) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.age.trim() !== '';
      case 2: return data.gender !== '';
      case 3: return data.symptoms.length > 0;
      case 4: return true;
      default: return true;
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else onComplete(data);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getSeverityLabel = (value: number) => {
    if (value <= 2) return 'Mild';
    if (value <= 4) return 'Moderate';
    if (value <= 6) return 'Significant';
    if (value <= 8) return 'Severe';
    return 'Critical';
  };

  const getSeverityColor = (value: number) => {
    if (value <= 2) return 'text-green-500';
    if (value <= 4) return 'text-yellow-500';
    if (value <= 6) return 'text-orange-500';
    if (value <= 8) return 'text-red-500';
    return 'text-red-700';
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-card border border-border/50 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Pre-Consultation Assessment</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            This information helps the doctor prepare for your consultation.
          </p>
          {/* Progress Bar */}
          <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[280px]">
          {/* Step 1: Age */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 text-foreground mb-4">
                <User className="h-5 w-5 text-primary" />
                <span className="font-medium">Step 1: Your Age</span>
              </div>
              <Input
                type="number"
                placeholder="Enter your age"
                value={data.age}
                onChange={(e) => setData({ ...data, age: e.target.value })}
                className="h-12 text-lg"
                min="0"
                max="120"
              />
              <p className="text-xs text-muted-foreground">
                Age helps determine appropriate care recommendations.
              </p>
            </div>
          )}

          {/* Step 2: Gender */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 text-foreground mb-4">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Step 2: Your Gender</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Male', 'Female', 'Other'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => setData({ ...data, gender })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      data.gender === gender
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Symptoms */}
          {step === 3 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 text-foreground mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-medium">Step 3: Select Symptoms</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {symptomsList.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`p-3 rounded-lg border text-sm text-left transition-all duration-200 ${
                      data.symptoms.includes(symptom)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {data.symptoms.includes(symptom) ? '✓ ' : ''}{symptom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Severity */}
          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center gap-2 text-foreground mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span className="font-medium">Step 4: Symptom Severity</span>
              </div>
              <div className="space-y-4">
                <Slider
                  value={[data.severity]}
                  onValueChange={([value]) => setData({ ...data, severity: value })}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">1 - Mild</span>
                  <span className={`text-lg font-bold ${getSeverityColor(data.severity)}`}>
                    {data.severity} - {getSeverityLabel(data.severity)}
                  </span>
                  <span className="text-sm text-muted-foreground">10 - Critical</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 5 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-2 text-foreground mb-4">
                <ClipboardList className="h-5 w-5 text-primary" />
                <span className="font-medium">Step 5: Summary</span>
              </div>
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium text-foreground">{data.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium text-foreground">{data.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Symptoms:</span>
                  <span className="font-medium text-foreground text-right max-w-[200px]">
                    {data.symptoms.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Severity:</span>
                  <span className={`font-medium ${getSeverityColor(data.severity)}`}>
                    {getSeverityLabel(data.severity)} ({data.severity}/10)
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ This is for informational purposes only and does not constitute medical advice.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 flex justify-between">
          <Button
            variant="ghost"
            onClick={step === 1 ? onSkip : prevStep}
            className="gap-2"
          >
            {step === 1 ? (
              'Skip Assessment'
            ) : (
              <>
                <ArrowLeft className="h-4 w-4" /> Back
              </>
            )}
          </Button>
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2"
          >
            {step === 5 ? 'Start Consultation' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SymptomTriage;
