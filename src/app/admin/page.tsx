'use client'

import { useState, useEffect } from 'react'
import { StoredOrder } from '@/lib/orderStore'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<StoredOrder['status'], string> = {
    pending_review: 'bg-yellow-100 text-yellow-800',
    reviewed_awaiting_payment: 'bg-blue-100 text-blue-800',
    payment_confirmation: 'bg-purple-100 text-purple-800',
    work_in_progress: 'bg-orange-100 text-orange-800',
    completed_ready_to_download: 'bg-green-100 text-green-800',
  }

  const paymentColors: Record<StoredOrder['paymentStatus'], string> = {
    pending: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-200 text-red-900',
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Order Management Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-slate-600">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Service</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Payment</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Deadline</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-mono text-slate-900">{order.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-slate-900 font-medium">{order.customerName}</div>
                          <div className="text-slate-500 text-xs">{order.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 text-sm capitalize text-slate-600">{order.serviceType}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentColors[order.paymentStatus]}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          ${Math.round(order.totalPrice)}{order.totalPaid > 0 && ` (${order.paymentStatus})`}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.deadline).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedOrder.id}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-slate-400 hover:text-slate-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Customer Name</label>
                    <p className="mt-1 text-slate-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Email</label>
                    <p className="mt-1 text-slate-900">{selectedOrder.customerEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Phone</label>
                    <p className="mt-1 text-slate-900">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Service Type</label>
                    <p className="mt-1 capitalize text-slate-900">{selectedOrder.serviceType}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Topic</label>
                  <p className="mt-1 text-slate-900">{selectedOrder.topic}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Description</label>
                  <p className="mt-1 text-slate-600">{selectedOrder.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Pages</label>
                    <p className="mt-1 text-slate-900">{selectedOrder.pageCount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Deadline</label>
                    <p className="mt-1 text-slate-900">{new Date(selectedOrder.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Format</label>
                    <p className="mt-1 text-slate-900">{selectedOrder.formatStyle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Total Price</label>
                    <p className="mt-1 text-slate-900">${Math.round(selectedOrder.totalPrice)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Paid</label>
                    <p className="mt-1 text-slate-900">${Math.round(selectedOrder.totalPaid)}</p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Notes</label>
                    <p className="mt-1 text-slate-600">{selectedOrder.notes}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Progress</label>
                  <div className="space-y-2">
                    {selectedOrder.phases.map((phase) => (
                      <div key={phase.phase} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${phase.completed ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                          {phase.completed ? '✓' : phase.phase}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{phase.name}</p>
                          <p className="text-xs text-slate-500">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
