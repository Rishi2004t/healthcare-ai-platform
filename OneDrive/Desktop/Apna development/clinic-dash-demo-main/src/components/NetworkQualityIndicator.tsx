/* Network Quality Indicator - Simulated Connection Status */
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NetworkQuality = 'good' | 'weak' | 'poor';

const NetworkQualityIndicator: React.FC = () => {
  const [quality, setQuality] = useState<NetworkQuality>('good');

  // Simulate random network quality changes
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.7) {
        setQuality('good');
      } else if (random < 0.9) {
        setQuality('weak');
      } else {
        setQuality('poor');
      }
    }, 8000); // Change every 8 seconds randomly

    return () => clearInterval(interval);
  }, []);

  const getQualityConfig = () => {
    switch (quality) {
      case 'good':
        return {
          color: 'text-green-500',
          bg: 'bg-green-500/20',
          label: 'Good Connection',
          icon: Wifi,
          bars: 3,
        };
      case 'weak':
        return {
          color: 'text-amber-500',
          bg: 'bg-amber-500/20',
          label: 'Weak Connection',
          icon: Signal,
          bars: 2,
        };
      case 'poor':
        return {
          color: 'text-red-500',
          bg: 'bg-red-500/20',
          label: 'Poor Connection',
          icon: WifiOff,
          bars: 1,
        };
    }
  };

  const config = getQualityConfig();
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg} cursor-help`}>
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          {/* Signal Bars */}
          <div className="flex items-end gap-0.5 h-3">
            <div className={`w-1 rounded-full transition-all ${config.bars >= 1 ? config.color : 'bg-muted'}`} 
                 style={{ height: '33%', backgroundColor: config.bars >= 1 ? undefined : undefined }} />
            <div className={`w-1 rounded-full transition-all ${config.bars >= 2 ? config.color.replace('text-', 'bg-') : 'bg-muted-foreground/30'}`} 
                 style={{ height: '66%' }} />
            <div className={`w-1 rounded-full transition-all ${config.bars >= 3 ? config.color.replace('text-', 'bg-') : 'bg-muted-foreground/30'}`} 
                 style={{ height: '100%' }} />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{config.label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NetworkQualityIndicator;
