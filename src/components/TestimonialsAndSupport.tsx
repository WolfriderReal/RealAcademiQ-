"use client";

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

type Review = {
  name: string;
  rating: number;
  feedback: string;
  id?: string;
  createdAt?: string;
};

type Reply = {
  id: string;
  reviewId: string;
  adminName: string;
  replyText: string;
  createdAt: string;
};

type TestimonialsAndSupportProps = {
  mode?: 'public' | 'admin';
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

const defaultReplies: Reply[] = [
  {
    id: 'default-reply-0',
    reviewId: 'default-0',
    adminName: 'RealAcademiQ Admin',
    replyText: 'Thank you, Jane. We are glad the support helped you meet your academic goals.',
    createdAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: 'default-reply-1',
    reviewId: 'default-2',
    adminName: 'RealAcademiQ Admin',
    replyText: 'We appreciate your feedback, Amina. It was a pleasure supporting your work from start to finish.',
    createdAt: '2026-03-02T10:30:00.000Z',
  },
  {
    id: 'default-reply-2',
    reviewId: 'default-5',
    adminName: 'RealAcademiQ Admin',
    replyText: 'Thank you, Priya. Timely delivery and clear communication remain a core part of our process.',
    createdAt: '2026-03-03T14:15:00.000Z',
  },
  {
    id: 'default-reply-3',
    reviewId: 'default-10',
    adminName: 'RealAcademiQ Admin',
    replyText: 'Asante sana, Grace. Tunafurahi kuona huduma zetu zinawasaidia wanafunzi kwa matokeo bora.',
    createdAt: '2026-03-04T08:45:00.000Z',
  },
];

const STORAGE_KEY = 'realacademiq_visitor_reviews';
const LEGACY_REVIEWS_MIGRATION_KEY = 'realacademiq_reviews_migrated_v1';
const LEGACY_REPLIES_STORAGE_KEY = 'realacademiq_replies';
const LEGACY_REPLIES_MIGRATION_KEY = 'realacademiq_replies_migrated_v1';
const PUBLIC_REPLIES_FALLBACK_REFRESH_MS = 15000;

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

export default function TestimonialsAndSupport({ mode = 'public' }: TestimonialsAndSupportProps) {
  const [visitorReviews, setVisitorReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminName, setAdminName] = useState('');

  const isAdminMode = mode === 'admin';

  useEffect(() => {
    let active = true;

    fetch('/api/testimonials', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setVisitorReviews(Array.isArray(data.reviews) ? data.reviews : []);
      })
      .catch(() => {
        if (!active) return;
        setVisitorReviews([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const alreadyMigrated = window.localStorage.getItem(LEGACY_REVIEWS_MIGRATION_KEY);
    if (alreadyMigrated === 'true') return;

    const migrateLegacyReviews = async () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          window.localStorage.setItem(LEGACY_REVIEWS_MIGRATION_KEY, 'true');
          return;
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          window.localStorage.setItem(LEGACY_REVIEWS_MIGRATION_KEY, 'true');
          return;
        }

        for (const item of parsed) {
          const name = String(item?.name || '').trim().slice(0, 60);
          const feedback = String(item?.feedback || '').trim().slice(0, 600);
          const rating = Math.min(5, Math.max(1, Number(item?.rating) || 5));
          const id = item?.id ? String(item.id).trim().slice(0, 120) : undefined;

          if (!name || !feedback) {
            continue;
          }

          await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id,
              name,
              feedback,
              rating,
              createdAt: item?.createdAt ? String(item.createdAt).trim().slice(0, 60) : undefined,
            }),
          });
        }

        window.localStorage.setItem(LEGACY_REVIEWS_MIGRATION_KEY, 'true');

        const response = await fetch('/api/testimonials', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.reviews)) {
          setVisitorReviews(data.reviews);
        }
      } catch {
        // Keep public page usable even if migration payload is malformed.
      }
    };

    void migrateLegacyReviews();
  }, []);

  useEffect(() => {
    let active = true;
    let source: EventSource | null = null;

    const fetchReplies = async () => {
      try {
        const response = await fetch('/api/testimonials/replies', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch replies');
        }

        const data = await response.json();
        if (!active) return;
        setReplies(Array.isArray(data.replies) ? data.replies : []);
      } catch {
        if (!active) return;
        setReplies([]);
      }
    };

    void fetchReplies();

    if (!isAdminMode && typeof window !== 'undefined' && 'EventSource' in window) {
      source = new EventSource('/api/testimonials/replies/stream');

      source.onmessage = (event) => {
        if (!active) return;

        try {
          const payload = JSON.parse(event.data);
          setReplies(Array.isArray(payload.replies) ? payload.replies : []);
        } catch {
          // Ignore malformed stream payloads and continue with fallback polling.
        }
      };

      source.onerror = () => {
        // Keep fallback polling active if stream disconnects.
      };
    }

    const intervalId = window.setInterval(() => {
      if (!isAdminMode) {
        void fetchReplies();
      }
    }, PUBLIC_REPLIES_FALLBACK_REFRESH_MS);

    const onFocus = () => {
      if (!isAdminMode) {
        void fetchReplies();
      }
    };

    const onVisibilityChange = () => {
      if (!isAdminMode && document.visibilityState === 'visible') {
        void fetchReplies();
      }
    };

    const onOnline = () => {
      if (!isAdminMode) {
        void fetchReplies();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', onOnline);

    return () => {
      active = false;
      if (source) {
        source.close();
      }
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', onOnline);
    };
  }, [isAdminMode]);

  useEffect(() => {
    if (!isAdminMode) return;

    const alreadyMigrated = window.localStorage.getItem(LEGACY_REPLIES_MIGRATION_KEY);
    if (alreadyMigrated === 'true') return;

    const migrateLegacyReplies = async () => {
      try {
        const raw = window.localStorage.getItem(LEGACY_REPLIES_STORAGE_KEY);
        if (!raw) {
          window.localStorage.setItem(LEGACY_REPLIES_MIGRATION_KEY, 'true');
          return;
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          window.localStorage.setItem(LEGACY_REPLIES_MIGRATION_KEY, 'true');
          return;
        }

        for (const item of parsed) {
          const reviewId = String(item?.reviewId || '').trim().slice(0, 120);
          const adminName = String(item?.adminName || '').trim().slice(0, 80);
          const replyText = String(item?.replyText || '').trim().slice(0, 1200);

          if (!reviewId || !adminName || !replyText) {
            continue;
          }

          await fetch('/api/admin/testimonials/replies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reviewId,
              adminName,
              replyText,
              id: item?.id ? String(item.id).trim().slice(0, 120) : undefined,
              createdAt:
                typeof item?.timestamp === 'number'
                  ? new Date(item.timestamp).toISOString()
                  : item?.createdAt
                    ? String(item.createdAt).trim().slice(0, 60)
                    : undefined,
            }),
          });
        }

        window.localStorage.setItem(LEGACY_REPLIES_MIGRATION_KEY, 'true');

        const response = await fetch('/api/testimonials/replies', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.replies)) {
          setReplies(data.replies);
        }
      } catch {
        // Keep admin page usable even if migration payload is malformed.
      }
    };

    void migrateLegacyReplies();
  }, [isAdminMode]);

  const allTestimonials = useMemo(
    () => [
      ...visitorReviews.map((review, idx) => ({
        ...review,
        id: review.id || `visitor-${idx}`,
      })),
      ...defaultTestimonials.map((review, idx) => ({
        ...review,
        id: `default-${idx}`,
      })),
    ],
    [visitorReviews]
  );

  const allReplies = useMemo(() => {
    const replyMap = new Map<string, Reply>()

    for (const reply of defaultReplies) {
      replyMap.set(reply.id, reply)
    }

    for (const reply of replies) {
      replyMap.set(reply.id, reply)
    }

    return Array.from(replyMap.values())
  }, [replies]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const safeName = name.trim().slice(0, 60);
    const safeFeedback = feedback.trim().slice(0, 600);
    const safeRating = Math.min(5, Math.max(1, Number(rating) || 5));

    if (!safeName || !safeFeedback) {
      setSubmitMessage('Please add your name and review.');
      return;
    }

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `review-${Date.now()}`,
          name: safeName,
          rating: safeRating,
          feedback: safeFeedback,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.review) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setVisitorReviews((current) => [data.review, ...current].slice(0, 30));
      setName('');
      setRating(5);
      setFeedback('');
      setSubmitMessage('Thank you. Your review has been added.');
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to submit review.');
    }
  };

  const handleReply = async (reviewerName: string, reviewId: string) => {
    const safeReplyText = adminReplyText.trim().slice(0, 600);
    const safeAdminName = adminName.trim().slice(0, 60);

    if (!safeReplyText || !safeAdminName) {
      alert('Please enter your name and reply.');
      return;
    }

    try {
      const saveResponse = await fetch('/api/admin/testimonials/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          adminName: safeAdminName,
          replyText: safeReplyText,
        }),
      });

      const saveData = await saveResponse.json().catch(() => ({}));
      if (!saveResponse.ok || !saveData?.reply) {
        throw new Error(saveData.error || 'Failed to save admin reply.');
      }

      setReplies((current) => [saveData.reply, ...current]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save admin reply.');
      return;
    }

    // Send WhatsApp notifications
    try {
      await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName,
          adminName: safeAdminName,
          replyText: safeReplyText,
          notifyAdmin: true,
          notifyClient: true,
        }),
      });
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
    }

    setAdminReplyText('');
    setAdminName('');
    setReplyingToId(null);
    alert('Reply posted and notifications sent on WhatsApp!');
  };

  const getRepliesForReview = (reviewId: string, legacyReviewId: string) => {
    return allReplies.filter((r) => r.reviewId === reviewId || r.reviewId === legacyReviewId);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Testimonials</h2>
          <p className="mt-3 text-center text-sm text-slate-600">
            {isAdminMode
              ? 'Admin moderation view. Reply controls are enabled only here.'
              : 'Public review page. Customers can leave reviews and read admin responses.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href="/testimonials"
              className={`rounded-full px-4 py-2 font-medium transition-colors ${
                isAdminMode
                  ? 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              Customer Testimonials Link
            </Link>
            {isAdminMode && (
              <Link
                href="/admin/testimonials"
                className="rounded-full px-4 py-2 font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800"
              >
                Admin Reply Link
              </Link>
            )}
          </div>
        </div>

        {!isAdminMode && (
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
        )}
        <div className="space-y-8">
          {allTestimonials.map((t, idx) => {
            const reviewId = t.id || '';
            const legacyReviewId = `review-${idx}`;
            const reviewReplies = getRepliesForReview(reviewId, legacyReviewId);
            return (
              <div key={reviewId || t.name} className="bg-white border border-slate-200 p-6 rounded-xl shadow-xl shadow-black/20 text-left">
                <p className="font-semibold text-slate-900">{t.name}</p>
                <div className="mt-2">
                  <StarRating rating={t.rating} />
                </div>
                <p className="mt-4 text-lg italic text-slate-700">&quot;{t.feedback}&quot;</p>

                {/* Display replies */}
                {reviewReplies.length > 0 && (
                  <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                    {reviewReplies.map((reply) => (
                      <div key={reply.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-emerald-900">{reply.adminName} (RealAcademiQ)</p>
                        <p className="text-sm text-emerald-700 mt-2">&quot;{reply.replyText}&quot;</p>
                        <p className="text-xs text-emerald-600 mt-2">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply form */}
                {isAdminMode && replyingToId === reviewId ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Admin Reply</h4>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      maxLength={60}
                      placeholder="Your name (admin)"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      maxLength={600}
                      rows={3}
                      placeholder="Your reply..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(t.name, reviewId)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-2 transition-colors text-sm"
                      >
                        Post Reply & Notify
                      </button>
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="bg-slate-300 hover:bg-slate-400 text-slate-900 font-medium rounded-lg px-4 py-2 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : isAdminMode ? (
                  <button
                    onClick={() => setReplyingToId(reviewId)}
                    className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Reply (Admin)
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
