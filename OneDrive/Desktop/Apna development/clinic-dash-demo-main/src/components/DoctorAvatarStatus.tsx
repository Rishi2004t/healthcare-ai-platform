import React, { useState } from 'react';
import doctorHeroImage from '@/assets/doctor-hero.png';
import DoctorWhisper from './DoctorWhisper';
import HeartbeatIndicator from './HeartbeatIndicator';
import ConsultationMeter from './ConsultationMeter';

/* Doctor Avatar Status Component */
/* Floating animated doctor presence indicator with ripple waves */

type DoctorStatus = 'available' | 'busy' | 'offline';

const statusConfig: Record<DoctorStatus, { color: string; glow: string; text: string; pulse: boolean; rippleColor: string }> = {
  available: {
    color: 'bg-green-500',
    glow: 'shadow-[0_0_25px_rgba(34,197,94,0.6)]',
    text: 'Doctor is Available',
    pulse: true,
    rippleColor: 'border-green-500/40',
  },
  busy: {
    color: 'bg-yellow-500',
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
    text: 'Doctor is Busy',
    pulse: false,
    rippleColor: 'border-yellow-500/40',
  },
  offline: {
    color: 'bg-gray-400',
    glow: '',
    text: 'Doctor is Offline',
    pulse: false,
    rippleColor: 'border-gray-400/30',
  },
};

const DoctorAvatarStatus: React.FC = () => {
  const [status, setStatus] = useState<DoctorStatus>('available');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Status Toggle Logic - cycles through statuses on click
  const cycleStatus = () => {
    const statuses: DoctorStatus[] = ['available', 'busy', 'offline'];
    const currentIndex = statuses.indexOf(status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setStatus(statuses[nextIndex]);
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="fixed right-6 top-28 z-40 flex flex-col items-center gap-3 md:right-8">
      {/* Tooltip */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-lg border border-border/50 transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {currentStatus.text}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border/50 rotate-45" />
      </div>

      {/* Doctor Avatar Container with Ripple Waves */}
      <button
        onClick={cycleStatus}
        onMouseEnter={() => { setShowTooltip(true); setIsHovered(true); }}
        onMouseLeave={() => { setShowTooltip(false); setIsHovered(false); }}
        className={`
          relative w-20 h-20 md:w-24 md:h-24 rounded-full cursor-pointer
          transition-all duration-300 ease-out
          hover:scale-110
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          doctor-avatar-float
        `}
        aria-label={`Doctor status: ${status}. Click to change status.`}
      >
        {/* Ripple Wave Rings */}
        {status === 'available' && (
          <>
            <span className={`absolute inset-0 rounded-full border-2 ${currentStatus.rippleColor} ripple-wave ripple-wave-1`} />
            <span className={`absolute inset-0 rounded-full border-2 ${currentStatus.rippleColor} ripple-wave ripple-wave-2`} />
            <span className={`absolute inset-0 rounded-full border-2 ${currentStatus.rippleColor} ripple-wave ripple-wave-3`} />
          </>
        )}

        {/* Status Ring */}
        <div
          className={`
            absolute inset-0 rounded-full border-4 transition-all duration-500
            ${currentStatus.color.replace('bg-', 'border-')}
            ${currentStatus.glow}
            ${currentStatus.pulse ? 'doctor-status-pulse' : ''}
          `}
        />

        {/* Avatar Image Container */}
        <div className="absolute inset-1 rounded-full overflow-hidden bg-card shadow-soft">
          <img
            src={doctorHeroImage}
            alt="Doctor Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Status Dot Indicator */}
        <span
          className={`
            absolute bottom-1 right-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-3 border-card
            ${currentStatus.color}
            ${currentStatus.pulse ? 'animate-pulse' : ''}
            transition-colors duration-300
          `}
        />
      </button>

      {/* Status Text Label */}
      <span
        className={`
          text-xs font-medium px-2 py-1 rounded-full bg-card border border-border/50 shadow-sm
          transition-colors duration-300
          ${status === 'available' ? 'text-green-500' : status === 'busy' ? 'text-yellow-500' : 'text-muted-foreground'}
        `}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>

      {/* Doctor Whisper - Reassuring Messages */}
      <DoctorWhisper isPaused={isHovered} />

      {/* Heartbeat Indicator */}
      <HeartbeatIndicator status={status} />

      {/* Consultation Readiness Meter */}
      <ConsultationMeter />
    </div>
  );
};

export default DoctorAvatarStatus;
