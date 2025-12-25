import { useEffect, useState } from 'react'
import api from '../services/api'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './Analytics.css'

interface AnalyticsData {
  region_wise_diseases: Array<{ region: string; diseases: Array<{ name: string; count: number }> }>
  product_conversion: Array<{ product_name: string; views: number; purchases: number; conversion_rate: number }>
  farmer_engagement: Array<{ month: string; active_farmers: number; scans: number; orders: number }>
}

const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics')
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading analytics...</div>
  }

  const regionData = data?.region_wise_diseases || []
  const selectedRegionData = selectedRegion === 'all' 
    ? regionData.flatMap(r => r.diseases.map(d => ({ ...d, region: r.region })))
    : regionData.find(r => r.region === selectedRegion)?.diseases || []

  const pieData = selectedRegionData.slice(0, 6).map(d => ({
    name: d.name,
    value: d.count
  }))

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1 className="page-title">Analytics & Reports</h1>
        <div className="header-actions">
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
          >
            <option value="all">All Regions</option>
            {regionData.map(r => (
              <option key={r.region} value={r.region}>{r.region}</option>
            ))}
          </select>
          <button className="export-btn">Export Report</button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h2>Region-wise Disease Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedRegionData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Disease Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Product Conversion Rates</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.product_conversion || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product_name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="conversion_rate" fill="#2ecc71" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Farmer Engagement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.farmer_engagement || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="active_farmers" stroke="#3498db" name="Active Farmers" />
              <Line type="monotone" dataKey="scans" stroke="#2ecc71" name="Scans" />
              <Line type="monotone" dataKey="orders" stroke="#e74c3c" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

