import { adminDb } from './firebaseAdmin'

export type TestimonialReview = {
  id: string
  name: string
  rating: number
  feedback: string
  createdAt: string
}

export type TestimonialReply = {
  id: string
  reviewId: string
  adminName: string
  replyText: string
  createdAt: string
}

const fallbackReviews = new Map<string, TestimonialReview>()
const fallbackReplies = new Map<string, TestimonialReply>()

export async function listTestimonialReviews(): Promise<TestimonialReview[]> {
  const fallbackValues = Array.from(fallbackReviews.values())

  try {
    const snapshot = await adminDb
      .collection('testimonials')
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map((doc) => doc.data() as TestimonialReview)
  } catch (error) {
    console.error('Failed to read testimonial reviews from Firebase, using in-memory fallback:', error)
    return fallbackValues.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export async function createTestimonialReview(input: {
  name: string
  rating: number
  feedback: string
  id?: string
  createdAt?: string
}): Promise<TestimonialReview> {
  const now = new Date().toISOString()
  const createdAt = input.createdAt || now
  const id = input.id || `review-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const nextReview: TestimonialReview = {
    id,
    name: input.name,
    rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
    feedback: input.feedback,
    createdAt,
  }

  try {
    const docRef = adminDb.collection('testimonials').doc(id)
    const existingDoc = await docRef.get()
    if (existingDoc.exists) {
      return existingDoc.data() as TestimonialReview
    }

    await docRef.set(nextReview)
  } catch (error) {
    console.error('Failed to write testimonial review to Firebase, using in-memory fallback:', error)
    const fallbackExisting = fallbackReviews.get(id)
    if (fallbackExisting) {
      return fallbackExisting
    }
    fallbackReviews.set(id, nextReview)
  }

  return nextReview
}

export async function listTestimonialReplies(): Promise<TestimonialReply[]> {
  const fallbackValues = Array.from(fallbackReplies.values())

  try {
    const snapshot = await adminDb
      .collection('testimonialReplies')
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map((doc) => doc.data() as TestimonialReply)
  } catch (error) {
    console.error('Failed to read testimonial replies from Firebase, using in-memory fallback:', error)
    return fallbackValues.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export async function createTestimonialReply(input: {
  reviewId: string
  adminName: string
  replyText: string
  id?: string
  createdAt?: string
}): Promise<TestimonialReply> {
  const now = new Date().toISOString()
  const createdAt = input.createdAt || now
  const id = input.id || `reply-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const nextReply: TestimonialReply = {
    id,
    reviewId: input.reviewId,
    adminName: input.adminName,
    replyText: input.replyText,
    createdAt,
  }

  try {
    const docRef = adminDb.collection('testimonialReplies').doc(id)
    const existingDoc = await docRef.get()
    if (existingDoc.exists) {
      return existingDoc.data() as TestimonialReply
    }

    await docRef.set(nextReply)
  } catch (error) {
    console.error('Failed to write testimonial reply to Firebase, using in-memory fallback:', error)
    const fallbackExisting = fallbackReplies.get(id)
    if (fallbackExisting) {
      return fallbackExisting
    }
    fallbackReplies.set(id, nextReply)
  }

  return nextReply
}
