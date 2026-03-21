"use client";

import React, { useEffect, useMemo, useState } from 'react';

type Review = {
  name: string;
  rating: number;
  feedback: string;
};

const defaultTestimonials: Review[] = [
  {
    name: 'Jane M',
    rating: 5,
    feedback: 'RealAcademiQ helped me achieve my academic goals. Highly recommended!'
  },
  {
    name: 'John M',
    rating: 4,
    feedback: 'Great platform with excellent support. Would use again.'
  },
  {
    name: 'Amina K.',
    rating: 5,
    feedback: 'The resources and guidance were top-notch. Thank you!'
  },
  {
    name: 'Wanjiku Mwangi',
    rating: 5,
    feedback: 'Nilipata msaada bora sana kwa thesis yangu. Nashukuru RealAcademiQ!'
  },
  {
    name: 'Carlos Rodriguez',
    rating: 4,
    feedback: 'Excellent academic support, especially for my engineering project.'
  },
  {
    name: 'Priya Sharma',
    rating: 5,
    feedback: 'The team was very professional and delivered my assignment on time.'
  },
  {
    name: 'Fatima Hassan',
    rating: 5,
    feedback: 'I improved my grades thanks to their expert guidance.'
  },
  {
    name: 'Liam O’Connor',
    rating: 4,
    feedback: 'Great service and very responsive support.'
  },
  {
    name: 'Wycliffe Otieno',
    rating: 5,
    feedback: 'RealAcademiQ iliniwezesha kumaliza project yangu ya mwisho chuoni. Asante!'
  },
  {
    name: 'Emily Wang',
    rating: 5,
    feedback: 'Very helpful and reliable academic assistance.'
  },
  {
    name: 'Grace Njeri',
    rating: 5,
    feedback: 'Huduma zao ni za kipekee na zinasaidia sana wanafunzi.'
  }
];

const STORAGE_KEY = 'realacademiq_visitor_reviews';

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex text-orange-500">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? '' : 'text-slate-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </span>
  );
}

function StarPicker({ rating, onChange }: { rating: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className="p-0.5"
          role="radio"
          aria-checked={rating === value}
          aria-label={`${value} star${value > 1 ? 's' : ''}`}
        >
          <svg
            className={`w-6 h-6 ${value <= rating ? 'text-orange-500' : 'text-slate-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-slate-600">{rating}/5</span>
    </div>
  );
}

export default function TestimonialsAndSupport() {
  const [visitorReviews, setVisitorReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .filter((item) => item && typeof item.name === 'string' && typeof item.feedback === 'string')
          .map((item) => ({
            name: item.name.trim().slice(0, 60),
            rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
            feedback: item.feedback.trim().slice(0, 600),
          }))
          .filter((item) => item.name && item.feedback);
        setVisitorReviews(cleaned);
      }
    } catch {
      // Ignore malformed local storage data.
    }
  }, []);

  const allTestimonials = useMemo(
    () => [...visitorReviews, ...defaultTestimonials],
    [visitorReviews]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const safeName = name.trim().slice(0, 60);
    const safeFeedback = feedback.trim().slice(0, 600);
    const safeRating = Math.min(5, Math.max(1, Number(rating) || 5));

    if (!safeName || !safeFeedback) {
      setSubmitMessage('Please add your name and review.');
      return;
    }

    const next = [{ name: safeName, rating: safeRating, feedback: safeFeedback }, ...visitorReviews].slice(0, 30);
    setVisitorReviews(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setName('');
    setRating(5);
    setFeedback('');
    setSubmitMessage('Thank you. Your review has been added.');
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Testimonials</h2>
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 text-left">Leave a Review</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="review-name" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                id="review-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <StarPicker rating={rating} onChange={setRating} />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="review-feedback" className="block text-sm font-medium text-slate-700 mb-2">Review</label>
            <textarea
              id="review-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={600}
              rows={4}
              placeholder="Share your experience"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-2 transition-colors">
              Post Review
            </button>
            {submitMessage && <p className="text-sm text-slate-600">{submitMessage}</p>}
          </div>
        </form>
        <div className="space-y-8">
          {allTestimonials.map((t, idx) => (
            <div key={`${t.name}-${idx}`} className="bg-white border border-slate-200 p-6 rounded-xl shadow-xl shadow-black/20 text-left">
              <p className="font-semibold text-slate-900">{t.name}</p>
              <div className="mt-2">
                <StarRating rating={t.rating} />
              </div>
              <p className="mt-4 text-lg italic text-slate-700">&quot;{t.feedback}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
