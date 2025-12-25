import { useEffect, useState } from 'react'
import api from '../services/api'
import './Uploads.css'

interface Upload {
  id: string
  user_id: string
  user_phone: string
  image_url: string
  status: string
  result: any
  created_at: string
}

export default function Uploads() {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null)

  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      const response = await api.get('/admin/uploads')
      setUploads(response.data)
    } catch (error) {
      console.error('Failed to fetch uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading uploads...</div>
  }

  return (
    <div className="uploads-page">
      <div className="page-header">
        <h1 className="page-title">Farmer Uploads</h1>
        <button className="refresh-btn" onClick={fetchUploads}>Refresh</button>
      </div>

      <div className="uploads-container">
        <div className="uploads-list">
          {uploads.length === 0 ? (
            <div className="empty-state">No uploads found</div>
          ) : (
            uploads.map((upload) => (
              <div
                key={upload.id}
                className={`upload-card ${selectedUpload?.id === upload.id ? 'selected' : ''}`}
                onClick={() => setSelectedUpload(upload)}
              >
                <div className="upload-header">
                  <div>
                    <div className="upload-phone">{upload.user_phone}</div>
                    <div className="upload-date">{new Date(upload.created_at).toLocaleString()}</div>
                  </div>
                  <span className={`status-badge ${upload.status}`}>{upload.status}</span>
                </div>
                {upload.image_url && (
                  <img src={upload.image_url} alt="Upload" className="upload-thumbnail" />
                )}
              </div>
            ))
          )}
        </div>

        {selectedUpload && (
          <div className="upload-details">
            <h2>Upload Details</h2>
            <div className="detail-section">
              <h3>Farmer Information</h3>
              <p><strong>Phone:</strong> {selectedUpload.user_phone}</p>
              <p><strong>Upload ID:</strong> {selectedUpload.id}</p>
              <p><strong>Status:</strong> {selectedUpload.status}</p>
              <p><strong>Date:</strong> {new Date(selectedUpload.created_at).toLocaleString()}</p>
            </div>

            {selectedUpload.image_url && (
              <div className="detail-section">
                <h3>Image</h3>
                <img src={selectedUpload.image_url} alt="Upload" className="detail-image" />
              </div>
            )}

            {selectedUpload.result && (
              <div className="detail-section">
                <h3>Analysis Result</h3>
                <pre className="result-json">{JSON.stringify(selectedUpload.result, null, 2)}</pre>
              </div>
            )}

            <div className="detail-actions">
              <button className="action-btn primary">Follow up with Farmer</button>
              <button className="action-btn">Export Data</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

