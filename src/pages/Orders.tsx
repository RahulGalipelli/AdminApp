import { useEffect, useState } from 'react'
import api from '../services/api'
import './Orders.css'

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  address: string
  payment_method: string
  created_at: string
  items: OrderItem[]
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase())

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Order & Shipment Management</h1>
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">All Orders</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-container">
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">No orders found</div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{order.id.slice(0, 8)}</div>
                    <div className="order-date">{new Date(order.created_at).toLocaleString()}</div>
                  </div>
                  <span className={`status-badge ${order.status}`}>{order.status}</span>
                </div>
                <div className="order-summary">
                  <div className="order-total">₹{order.total_amount}</div>
                  <div className="order-items">{order.items.length} items</div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedOrder && (
          <div className="order-details">
            <h2>Order Details</h2>
            
            <div className="detail-section">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Status:</strong> 
                <select 
                  value={selectedOrder.status} 
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className="status-select"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </p>
              <p><strong>Payment:</strong> {selectedOrder.payment_method}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total_amount}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
            </div>

            <div className="detail-section">
              <h3>Delivery Address</h3>
              <p>{selectedOrder.address || 'No address provided'}</p>
            </div>

            <div className="detail-section">
              <h3>Order Items</h3>
              <div className="items-list">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-name">{item.product_name}</div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                    <div className="item-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-actions">
              <button className="action-btn primary">Update Courier Info</button>
              <button className="action-btn">Export Invoice</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

