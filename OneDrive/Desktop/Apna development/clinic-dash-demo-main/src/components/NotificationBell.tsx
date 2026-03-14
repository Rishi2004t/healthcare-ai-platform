/* Notification Bell Component */
import React, { useState } from 'react';
import { Bell, X, Calendar, MessageCircle, AlertCircle } from 'lucide-react';

interface Notification {
  id: number;
  type: 'appointment' | 'message' | 'alert';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const staticNotifications: Notification[] = [
  {
    id: 1,
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Smith is tomorrow at 10:00 AM',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    message: 'Dr. Johnson has responded to your query',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Health Tip',
    message: 'Remember to stay hydrated and get regular check-ups',
    time: '1 day ago',
    unread: false,
  },
];

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(staticNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium animate-notification-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-card z-50 overflow-hidden animate-notification-dropdown">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-primary font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/50 ${
                    notification.unread ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      notification.type === 'appointment' ? 'bg-primary/10 text-primary' :
                      notification.type === 'message' ? 'bg-accent/10 text-accent' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground truncate">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border">
              <button className="w-full text-center text-sm text-primary font-medium hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
