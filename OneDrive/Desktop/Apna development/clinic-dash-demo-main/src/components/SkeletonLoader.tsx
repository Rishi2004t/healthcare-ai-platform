/* Skeleton Loader Components */
import React from 'react';

// Dashboard Card Skeleton
export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-muted skeleton-shimmer" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-muted skeleton-shimmer" />
          <div className="h-3 w-24 rounded bg-muted skeleton-shimmer" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-16 rounded-xl bg-muted skeleton-shimmer" />
        <div className="h-16 rounded-xl bg-muted skeleton-shimmer" />
        <div className="h-16 rounded-xl bg-muted skeleton-shimmer" />
      </div>
    </div>
  );
};

// Chat Message Skeleton
export const ChatMessageSkeleton: React.FC = () => {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-muted skeleton-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted skeleton-shimmer" />
        <div className="h-4 w-1/2 rounded bg-muted skeleton-shimmer" />
      </div>
    </div>
  );
};

// Doctor Card Skeleton
export const DoctorCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-card">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-muted skeleton-shimmer" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-muted skeleton-shimmer" />
          <div className="h-3 w-24 rounded bg-muted skeleton-shimmer" />
        </div>
      </div>
      <div className="h-10 rounded-lg bg-muted skeleton-shimmer" />
    </div>
  );
};

export default DashboardCardSkeleton;
