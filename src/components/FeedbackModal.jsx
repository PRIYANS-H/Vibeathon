import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FeedbackModal = () => {
  const { feedbackModalOpen, setFeedbackModalOpen, submitFeedback, activeCustomerOrder } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!feedbackModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFeedback(rating, comment, activeCustomerOrder?.items[0]?.name);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setFeedbackModalOpen(false);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
        <button
          onClick={() => setFeedbackModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-bold font-display text-white text-center">Post-Meal Feedback Loop</h3>
        <p className="text-xs text-slate-400 text-center">Your ratings feed directly into our AI Captain recommendation algorithms!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-2 transition-transform hover:scale-110"
              >
                <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Your Review</label>
            <textarea
              required
              rows={3}
              placeholder="Tell us about food quality, prep speed, or AI Captain accuracy..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};
