/* Follow-Up Recommendation */
import React, { useState } from 'react';
import { Calendar, Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FollowUpRecommendation: React.FC = () => {
  const [reminderSet, setReminderSet] = useState(false);

  const handleSetReminder = () => {
    // Store in localStorage (UI simulation only)
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);
    
    localStorage.setItem('followup_reminder', JSON.stringify({
      date: followUpDate.toISOString(),
      set: true,
    }));
    
    setReminderSet(true);
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Follow-Up Recommended</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your consultation, a follow-up in <strong>7 days</strong> is recommended
            to monitor your condition.
          </p>
          <div className="mt-3">
            {!reminderSet ? (
              <Button
                size="sm"
                onClick={handleSetReminder}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                Set Reminder
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Check className="h-4 w-4" />
                <span>Reminder set for {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpRecommendation;
