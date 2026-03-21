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
}): Promise<TestimonialReply> {
  const now = new Date().toISOString()
  const id = `reply-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const nextReply: TestimonialReply = {
    id,
    reviewId: input.reviewId,
    adminName: input.adminName,
    replyText: input.replyText,
    createdAt: now,
  }

  try {
    await adminDb.collection('testimonialReplies').doc(id).set(nextReply)
  } catch (error) {
    console.error('Failed to write testimonial reply to Firebase, using in-memory fallback:', error)
    fallbackReplies.set(id, nextReply)
  }

  return nextReply
}
