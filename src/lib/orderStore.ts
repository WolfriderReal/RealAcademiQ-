import { adminDb } from './firebaseAdmin'

type OrderPhase = {
  phase: number
  name: string
  completed: boolean
  completedAt?: string
  description: string
}

export type StoredOrder = {
  id: string
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
  downloadLink?: string
  previewLink?: string
}

function generateOrderId(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ORD-${stamp}-${random}`
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
  const orderId = generateOrderId()

  const order: StoredOrder = {
    id: orderId,
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

  await adminDb.collection('orders').doc(orderId).set(order)
  return order
}

export async function getOrderById(orderId: string): Promise<StoredOrder | null> {
  try {
    const doc = await adminDb.collection('orders').doc(orderId).get()
    if (!doc.exists) return null
    return doc.data() as StoredOrder
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}
