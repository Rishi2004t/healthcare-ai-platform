/* Feedback Rating Component */
import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';

interface FeedbackRatingProps {
  onClose?: () => void;
}

const FeedbackRating: React.FC<FeedbackRatingProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true);
      setTimeout(() => {
        onClose?.();
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 bg-card border border-border rounded-2xl shadow-card text-center animate-modal-scale">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Thank You!</h3>
        <p className="text-sm text-muted-foreground">
          Your feedback helps us improve our service.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-card">
      <h3 className="text-lg font-bold text-foreground mb-2 text-center">
        Rate Your Experience
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        How was your chat with MediBot?
      </p>

      {/* Star Rating */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          rating > 0
            ? 'gradient-hero text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackRating;
