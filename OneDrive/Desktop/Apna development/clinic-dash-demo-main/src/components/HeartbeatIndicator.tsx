import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/* Heartbeat Sync Indicator Component */
/* ECG-style animated line synced with doctor status */

type DoctorStatus = 'available' | 'busy' | 'offline';

interface HeartbeatIndicatorProps {
  status?: DoctorStatus;
}

const HeartbeatIndicator: React.FC<HeartbeatIndicatorProps> = ({ status = 'available' }) => {
  const { botOnline } = useTheme();
  
  // Determine status based on botOnline if not explicitly provided
  const currentStatus: DoctorStatus = botOnline ? status : 'offline';

  const statusConfig = {
    available: {
      color: 'stroke-green-500',
      glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]',
      speed: 'heartbeat-normal',
      label: 'Healthy heartbeat',
    },
    busy: {
      color: 'stroke-yellow-500',
      glow: 'drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]',
      speed: 'heartbeat-fast',
      label: 'Elevated rhythm',
    },
    offline: {
      color: 'stroke-muted-foreground',
      glow: '',
      speed: 'heartbeat-flat',
      label: 'Flatline',
    },
  };

  const config = statusConfig[currentStatus];

  return (
    <div className="group relative">
      {/* Container */}
      <div
        className={`
          relative w-32 h-10 md:w-40 md:h-12
          bg-card/80 backdrop-blur-sm rounded-lg
          border border-border/50 shadow-sm
          overflow-hidden
          transition-all duration-300
          hover:shadow-lg hover:border-primary/30
          ${config.glow}
        `}
      >
        {/* ECG Line */}
        <svg
          viewBox="0 0 200 50"
          className={`absolute inset-0 w-full h-full ${config.color} ${config.speed}`}
          preserveAspectRatio="none"
        >
          {currentStatus === 'offline' ? (
            /* Flatline */
            <path
              d="M0,25 L200,25"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="flatline-path"
            />
          ) : (
            /* Heartbeat Pattern */
            <path
              d="M0,25 L30,25 L35,25 L40,10 L45,40 L50,5 L55,45 L60,25 L65,25 L100,25 L105,25 L110,10 L115,40 L120,5 L125,45 L130,25 L135,25 L170,25 L175,25 L180,10 L185,40 L190,5 L195,45 L200,25"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="heartbeat-path"
            />
          )}
        </svg>

        {/* Scan Line Effect */}
        {currentStatus !== 'offline' && (
          <div className={`heartbeat-scan absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent ${config.speed}`} />
        )}

        {/* Status Dot */}
        <div
          className={`
            absolute top-1 right-1 w-2 h-2 rounded-full
            ${currentStatus === 'available' ? 'bg-green-500 animate-pulse' : ''}
            ${currentStatus === 'busy' ? 'bg-yellow-500 animate-pulse' : ''}
            ${currentStatus === 'offline' ? 'bg-muted-foreground' : ''}
          `}
        />
      </div>

      {/* Tooltip */}
      <div
        className="
          absolute -top-8 left-1/2 -translate-x-1/2
          px-2 py-1 rounded-md bg-card border border-border/50
          text-xs text-foreground whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
        "
      >
        {config.label}
      </div>
    </div>
  );
};

export default HeartbeatIndicator;
