import { adminDb } from './firebaseAdmin'

export type TestimonialReply = {
  id: string
  reviewId: string
  adminName: string
  replyText: string
  createdAt: string
}

const fallbackReplies = new Map<string, TestimonialReply>()

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
