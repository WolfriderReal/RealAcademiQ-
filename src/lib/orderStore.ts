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

const orders = new Map<string, StoredOrder>()

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

function seedSampleOrder() {
  const sampleId = 'ORD-20250317-ABC123'
  if (orders.has(sampleId)) return

  orders.set(sampleId, {
    id: sampleId,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '254700000000',
    serviceType: 'assignment',
    topic: 'The Impact of Artificial Intelligence on Modern Education',
    description: 'Research assignment with references and in-text citations.',
    pageCount: 10,
    deadline: '2025-03-25',
    formatStyle: 'APA',
    estimatedPrice: 150,
    totalPrice: 165,
    totalPaid: 100,
    paymentStatus: 'partial',
    status: 'work_in_progress',
    currentPhase: 4,
    phases: [
      {
        phase: 1,
        name: 'Order Initiation',
        completed: true,
        completedAt: '2025-03-10T10:30:00Z',
        description: 'Your order has been submitted and received.',
      },
      {
        phase: 2,
        name: 'Assessment & Pricing Confirmation',
        completed: true,
        completedAt: '2025-03-10T14:00:00Z',
        description: 'Our team reviewed your requirements and confirmed pricing.',
      },
      {
        phase: 3,
        name: 'Payment Processing',
        completed: true,
        completedAt: '2025-03-11T09:10:00Z',
        description: 'Partial payment received. Waiting for final payment confirmation.',
      },
      {
        phase: 4,
        name: 'Work in Progress',
        completed: false,
        description: 'Your assigned writer is currently working on your assignment.',
      },
      {
        phase: 5,
        name: 'Delivery & Download',
        completed: false,
        description: 'Your completed work will be ready for download.',
      },
    ],
    createdAt: '2025-03-10T10:00:00Z',
    updatedAt: '2025-03-12T11:00:00Z',
    notes: 'Your assignment is progressing well. We expect to have the first draft ready within 2 days for your review.',
  })
}

seedSampleOrder()

export function createOrder(input: {
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
}): StoredOrder {
  const now = new Date().toISOString()
  const normalizedPrice = Math.round(input.estimatedPrice * 100) / 100

  const order: StoredOrder = {
    id: generateOrderId(),
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
  }

  orders.set(order.id, order)
  return order
}

export function getOrderById(orderId: string): StoredOrder | undefined {
  return orders.get(orderId)
}
