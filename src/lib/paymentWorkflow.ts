export type OrderStatus =
  | 'pending_review'
  | 'reviewed_awaiting_payment'
  | 'awaiting_payment_confirmation'
  | 'work_in_progress'
  | 'completed_ready_to_download'

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending_review: ['reviewed_awaiting_payment'],
  reviewed_awaiting_payment: ['awaiting_payment_confirmation', 'work_in_progress'],
  awaiting_payment_confirmation: ['work_in_progress', 'reviewed_awaiting_payment'],
  work_in_progress: ['completed_ready_to_download'],
  completed_ready_to_download: [],
}

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus): boolean {
  return validTransitions[from].includes(to)
}

export function resolveOrderStatusAfterPayment(args: {
  totalDue: number
  totalPaid: number
  currentStatus: OrderStatus
}): OrderStatus {
  const { totalDue, totalPaid, currentStatus } = args

  if (totalPaid <= 0) {
    return currentStatus
  }

  if (totalPaid < totalDue) {
    return 'work_in_progress'
  }

  return 'work_in_progress'
}

export function normalizeCurrency(input: string | undefined, fallback = 'USD'): string {
  if (!input) return fallback
  return input.trim().toUpperCase()
}

export function assertPositiveAmount(amount: unknown): number {
  const numeric = Number(amount)
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error('Amount must be a positive number.')
  }

  return Math.round(numeric * 100) / 100
}

export function normalizeKenyanPhone(value: string): string {
  const raw = value.replace(/\s+/g, '').replace(/^\+/, '')

  if (/^2547\d{8}$/.test(raw)) return raw
  if (/^07\d{8}$/.test(raw)) return `254${raw.slice(1)}`

  throw new Error('Invalid Safaricom phone number. Use 07XXXXXXXX or 2547XXXXXXXX.')
}
