import { useEffect, useState } from 'react'
import api from '../services/api'
import { Phone, CheckCircle } from 'lucide-react'
import './Support.css'

interface SupportCall {
  id: string
  user_id: string
  user_phone: string
  status: string
  assigned_to: string | null
  created_at: string
  resolved_at: string | null
  notes: string | null
}

export default function Support() {
  const [calls, setCalls] = useState<SupportCall[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<SupportCall | null>(null)

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      const response = await api.get('/admin/support/calls')
      setCalls(response.data)
    } catch (error) {
      console.error('Failed to fetch support calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const assignCall = async (callId: string, staffId: string) => {
    try {
      await api.put(`/admin/support/calls/${callId}/assign`, { staff_id: staffId })
      fetchCalls()
    } catch (error) {
      console.error('Failed to assign call:', error)
    }
  }

  const resolveCall = async (callId: string) => {
    try {
      await api.put(`/admin/support/calls/${callId}/resolve`, {})
      fetchCalls()
    } catch (error) {
      console.error('Failed to resolve call:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading support calls...</div>
  }

  return (
    <div className="support-page">
      <div className="page-header">
        <h1 className="page-title">Support Calls & Logs</h1>
        <button className="refresh-btn" onClick={fetchCalls}>Refresh</button>
      </div>

      <div className="support-container">
        <div className="calls-list">
          {calls.length === 0 ? (
            <div className="empty-state">No support calls found</div>
          ) : (
            calls.map((call) => (
              <div
                key={call.id}
                className={`call-card ${selectedCall?.id === call.id ? 'selected' : ''}`}
                onClick={() => setSelectedCall(call)}
              >
                <div className="call-header">
                  <div className="call-icon">
                    <Phone size={20} />
                  </div>
                  <div className="call-info">
                    <div className="call-phone">{call.user_phone}</div>
                    <div className="call-date">{new Date(call.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <div className="call-status">
                  <span className={`status-badge ${call.status}`}>{call.status}</span>
                  {call.assigned_to && (
                    <span className="assigned-badge">Assigned</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedCall && (
          <div className="call-details">
            <h2>Call Details</h2>
            
            <div className="detail-section">
              <h3>Call Information</h3>
              <p><strong>Call ID:</strong> {selectedCall.id}</p>
              <p><strong>Farmer Phone:</strong> {selectedCall.user_phone}</p>
              <p><strong>Status:</strong> {selectedCall.status}</p>
              <p><strong>Created:</strong> {new Date(selectedCall.created_at).toLocaleString()}</p>
              {selectedCall.resolved_at && (
                <p><strong>Resolved:</strong> {new Date(selectedCall.resolved_at).toLocaleString()}</p>
              )}
              {selectedCall.assigned_to && (
                <p><strong>Assigned To:</strong> {selectedCall.assigned_to}</p>
              )}
            </div>

            {selectedCall.notes && (
              <div className="detail-section">
                <h3>Notes</h3>
                <p>{selectedCall.notes}</p>
              </div>
            )}

            <div className="detail-actions">
              {!selectedCall.assigned_to && (
                <button 
                  className="action-btn primary"
                  onClick={() => assignCall(selectedCall.id, 'current_user')}
                >
                  Assign to Me
                </button>
              )}
              {selectedCall.status !== 'resolved' && (
                <button 
                  className="action-btn success"
                  onClick={() => resolveCall(selectedCall.id)}
                >
                  <CheckCircle size={16} />
                  Mark as Resolved
                </button>
              )}
              <button className="action-btn">Add Notes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

