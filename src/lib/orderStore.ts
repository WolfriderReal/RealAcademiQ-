import { adminDb } from './firebaseAdmin'
import { randomBytes } from 'crypto'

const fallbackOrders = new Map<string, StoredOrder>()

type OrderPhase = {
  phase: number
  name: string
  completed: boolean
  completedAt?: string
  description: string
}

export type AdminReply = {
  id: string
  adminName: string
  message: string
  createdAt: string
}

export type StoredOrder = {
  id: string
  trackingToken: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  topic: string
  description: string
  pageCount: number
  deadline: string
  formatStyle: string
  estimatedPrice: number
  totalPrice: number
  totalPaid: number
  paymentStatus: 'pending' | 'partial' | 'completed' | 'failed'
  status: 'pending_review' | 'reviewed_awaiting_payment' | 'payment_confirmation' | 'work_in_progress' | 'completed_ready_to_download'
  currentPhase: number
  phases: OrderPhase[]
  createdAt: string
  updatedAt: string
  notes?: string
  adminReplies?: AdminReply[]
  downloadLink?: string
  previewLink?: string
}

function generateOrderId(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = randomBytes(4).toString('hex').toUpperCase()
  return `ORD-${stamp}-${random}`
}

async function orderIdExists(orderId: string): Promise<boolean> {
  if (fallbackOrders.has(orderId)) {
    return true
  }

  try {
    const doc = await adminDb.collection('orders').doc(orderId).get()
    return doc.exists
  } catch (error) {
    // If Firestore is unavailable, rely on in-memory checks and randomness.
    console.error('Could not verify order ID uniqueness in Firebase:', error)
    return false
  }
}

async function generateUniqueOrderId(maxAttempts = 8): Promise<string> {
  for (let i = 0; i < maxAttempts; i += 1) {
    const candidate = generateOrderId()
    const exists = await orderIdExists(candidate)
    if (!exists) {
      return candidate
    }
  }

  throw new Error('Failed to allocate a unique order ID after multiple attempts')
}

function generateTrackingToken(): string {
  return randomBytes(24).toString('hex')
}

function buildInitialPhases(createdAt: string): OrderPhase[] {
  return [
    {
      phase: 1,
      name: 'Order Initiation',
      completed: true,
      completedAt: createdAt,
      description: 'Your order has been submitted and received.',
    },
    {
      phase: 2,
      name: 'Assessment & Pricing Confirmation',
      completed: false,
      description: 'Our team is reviewing your requirements and confirming the final quote.',
    },
    {
      phase: 3,
      name: 'Payment Processing',
      completed: false,
      description: 'Payment prompt will be completed after quote confirmation.',
    },
    {
      phase: 4,
      name: 'Work in Progress',
      completed: false,
      description: 'Your assigned writer will begin work after payment confirmation.',
    },
    {
      phase: 5,
      name: 'Delivery & Download',
      completed: false,
      description: 'Your completed work will be ready for download.',
    },
  ]
}

export async function createOrder(input: {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  topic: string
  description: string
  pageCount: number
  deadline: string
  formatStyle: string
  estimatedPrice: number
}): Promise<StoredOrder> {
  const now = new Date().toISOString()
  const normalizedPrice = Math.round(input.estimatedPrice * 100) / 100
  const orderId = await generateUniqueOrderId()

  const order: StoredOrder = {
    id: orderId,
    trackingToken: generateTrackingToken(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    serviceType: input.serviceType,
    topic: input.topic,
    description: input.description,
    pageCount: input.pageCount,
    deadline: input.deadline,
    formatStyle: input.formatStyle,
    estimatedPrice: normalizedPrice,
    totalPrice: normalizedPrice,
    totalPaid: 0,
    paymentStatus: 'pending',
    status: 'pending_review',
    currentPhase: 2,
    phases: buildInitialPhases(now),
    createdAt: now,
    updatedAt: now,
    notes: 'Order received. Our team will confirm your final quote and send payment instructions shortly.',
    downloadLink: '',
    previewLink: '',
  }

  try {
    await adminDb.collection('orders').doc(orderId).set(order)
  } catch (error) {
    // Keep order flow operational even if Firebase is temporarily unavailable.
    console.error('Firebase write failed, using in-memory fallback store:', error)
    fallbackOrders.set(orderId, order)
  }

  return order
}

export async function getOrderById(orderId: string): Promise<StoredOrder | null> {
  try {
    const fallbackOrder = fallbackOrders.get(orderId)
    if (fallbackOrder) return fallbackOrder

    const doc = await adminDb.collection('orders').doc(orderId).get()
    if (!doc.exists) return null
    return doc.data() as StoredOrder
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export async function appendAdminReply(input: {
  orderId: string
  adminName: string
  message: string
}): Promise<StoredOrder | null> {
  const order = await getOrderById(input.orderId)
  if (!order) return null

  const now = new Date().toISOString()
  const nextReply: AdminReply = {
    id: `reply-${Date.now()}`,
    adminName: input.adminName,
    message: input.message,
    createdAt: now,
  }

  const updatedOrder: StoredOrder = {
    ...order,
    adminReplies: [...(order.adminReplies || []), nextReply],
    updatedAt: now,
  }

  try {
    await adminDb.collection('orders').doc(input.orderId).set(updatedOrder, { merge: true })
  } catch (error) {
    console.error('Firebase update failed, writing reply to in-memory fallback store:', error)
    fallbackOrders.set(input.orderId, updatedOrder)
  }

  return updatedOrder
}
