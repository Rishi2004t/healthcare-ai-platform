import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SettingToggleProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-soft transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${checked ? 'gradient-hero shadow-soft' : 'bg-muted'}`}>
          <Icon className={`h-5 w-5 transition-colors duration-300 ${checked ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
};

export default SettingToggle;
