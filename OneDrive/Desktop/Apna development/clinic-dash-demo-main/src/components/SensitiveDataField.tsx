/* Medical Data Sensitivity UX - Blur/Reveal Field */
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SensitiveDataFieldProps {
  label: string;
  value: string;
  autoHideDelay?: number; // milliseconds
}

const SensitiveDataField: React.FC<SensitiveDataFieldProps> = ({
  label,
  value,
  autoHideDelay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible && autoHideDelay > 0) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);
    }

    return () => clearTimeout(timer);
  }, [isVisible, autoHideDelay]);

  const maskValue = (val: string) => {
    if (val.length <= 4) return '••••';
    return val.substring(0, 2) + '•'.repeat(val.length - 4) + val.substring(val.length - 2);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div>
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className={`text-sm font-medium text-foreground ${!isVisible ? 'blur-sm select-none' : ''}`}>
          {isVisible ? value : maskValue(value)}
        </p>
      </div>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
        title={isVisible ? 'Hide sensitive data' : 'Reveal sensitive data'}
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export default SensitiveDataField;
