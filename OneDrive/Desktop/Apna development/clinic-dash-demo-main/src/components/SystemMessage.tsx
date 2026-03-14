/* System Message Component - Doctor Joined/Left Messages */
import React from 'react';
import { Stethoscope, LogOut, AlertCircle, Clock } from 'lucide-react';

type MessageType = 'joined' | 'left' | 'warning' | 'info';

interface SystemMessageProps {
  type: MessageType;
  message: string;
  timestamp?: string;
}

const SystemMessage: React.FC<SystemMessageProps> = ({ type, message, timestamp }) => {
  const getConfig = () => {
    switch (type) {
      case 'joined':
        return {
          icon: Stethoscope,
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          iconColor: 'text-green-500',
          textColor: 'text-green-700 dark:text-green-400',
        };
      case 'left':
        return {
          icon: LogOut,
          bg: 'bg-muted/50',
          border: 'border-border/50',
          iconColor: 'text-muted-foreground',
          textColor: 'text-muted-foreground',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          iconColor: 'text-amber-500',
          textColor: 'text-amber-700 dark:text-amber-400',
        };
      case 'info':
      default:
        return {
          icon: Clock,
          bg: 'bg-primary/10',
          border: 'border-primary/30',
          iconColor: 'text-primary',
          textColor: 'text-primary',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full ${config.bg} border ${config.border} mx-auto max-w-fit animate-fade-in`}>
      <Icon className={`h-4 w-4 ${config.iconColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {message}
      </span>
      {timestamp && (
        <span className="text-xs text-muted-foreground">
          {timestamp}
        </span>
      )}
    </div>
  );
};

export default SystemMessage;
