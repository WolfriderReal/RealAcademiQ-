// Order Related Types
export type OrderStatus =
  | 'pending_review'
  | 'reviewed_awaiting_payment'
  | 'payment_confirmation'
  | 'work_in_progress'
  | 'completed_ready_to_download'

export type PaymentMethod = 'paypal' | 'mpesa_stk' | 'mpesa_paybill'

export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'failed'

export interface OrderDocument {
  name: string
  url: string
  uploadedAt: Date
}

export interface PaymentRecord {
  id: string
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  transactionId?: string
  date: Date
  reference?: string
}

export interface Order {
  id: string // Unique order ID (e.g., ORD-20250317-XXX)
  customerId: string
  customerEmail: string
  customerPhone: string
  customerName: string
  
  // Order Details
  serviceType: 'assignment' | 'thesis' | 'project' | 'proposal'
  topic: string
  description: string
  pageCount: number
  deadline: Date
  formatStyle: string
  
  // Required Files
  documents: OrderDocument[]
  
  // Pricing
  estimatedPrice: number
  currency: string
  discountCode?: string
  discountAmount?: number
  finalPrice: number
  
  // Payment Tracking
  payments: PaymentRecord[]
  totalPaid: number
  paymentStatus: PaymentStatus
  
  // Order Status
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
  completionNotes?: string
  
  // Delivery
  completedFiles?: OrderDocument[]
  downloadLink?: string
  accessKey?: string // For unlock/download control
}

export interface OrderResponse {
  success: boolean
  message: string
  orderId?: string
  order?: Order
  paymentLink?: string
}

export interface CreateOrderRequest {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: 'assignment' | 'thesis' | 'project' | 'proposal'
  topic: string
  description: string
  pageCount: number
  deadline: string
  formatStyle: string
  estimatedPrice: number
}
