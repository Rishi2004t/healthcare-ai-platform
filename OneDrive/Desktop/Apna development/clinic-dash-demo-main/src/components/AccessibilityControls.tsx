/* Accessibility Controls Component */
import React from 'react';
import { Type, Contrast, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const AccessibilityControls: React.FC = () => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, highContrast, toggleHighContrast } = useAccessibility();

  return (
    <Card className="p-6 bg-card border border-border rounded-2xl shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Type className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Accessibility</h3>
          <p className="text-sm text-muted-foreground">Customize your viewing experience</p>
        </div>
      </div>

      {/* Font Size Controls */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">Font Size</label>
        <div className="flex items-center gap-3">
          <button
            onClick={decreaseFontSize}
            className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground font-bold transition-colors"
            aria-label="Decrease font size"
          >
            A-
          </button>
          <div className="flex-1 h-10 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">{fontSize}%</span>
          </div>
          <button
            onClick={increaseFontSize}
            className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground font-bold transition-colors"
            aria-label="Increase font size"
          >
            A+
          </button>
          <button
            onClick={resetFontSize}
            className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Reset font size"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* High Contrast Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
        <div className="flex items-center gap-3">
          <Contrast className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">High Contrast</p>
            <p className="text-xs text-muted-foreground">Enhanced visibility mode</p>
          </div>
        </div>
        <button
          onClick={toggleHighContrast}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            highContrast ? 'bg-primary' : 'bg-muted'
          }`}
          role="switch"
          aria-checked={highContrast}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
              highContrast ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>
    </Card>
  );
};

export default AccessibilityControls;
