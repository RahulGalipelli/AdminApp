import { useEffect, useState } from 'react'
import api from '../services/api'
import { Upload, ShoppingCart, Phone, TrendingUp } from 'lucide-react'
import './Dashboard.css'

interface DashboardStats {
  total_uploads: number
  total_orders: number
  total_calls: number
  top_diseases: Array<{ name: string; count: number }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3498db' }}>
            <Upload size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_uploads || 0}</div>
            <div className="stat-label">Uploads Processed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#2ecc71' }}>
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_orders || 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e74c3c' }}>
            <Phone size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_calls || 0}</div>
            <div className="stat-label">Support Calls</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f39c12' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.top_diseases?.length || 0}</div>
            <div className="stat-label">Disease Types</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Top Detected Diseases</h2>
          <div className="disease-list">
            {stats?.top_diseases && stats.top_diseases.length > 0 ? (
              stats.top_diseases.map((disease, index) => (
                <div key={index} className="disease-item">
                  <span className="disease-rank">#{index + 1}</span>
                  <span className="disease-name">{disease.name}</span>
                  <span className="disease-count">{disease.count} cases</span>
                </div>
              ))
            ) : (
              <div className="empty-state">No disease data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

