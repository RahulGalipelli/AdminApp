import { useState } from 'react'
import api from '../services/api'
import './Settings.css'

export default function Settings() {
  const [settings, setSettings] = useState({
    payment_gateway: {
      provider: 'razorpay',
      api_key: '',
      api_secret: '',
      enabled: true,
    },
    courier_api: {
      provider: 'shiprocket',
      api_key: '',
      api_secret: '',
      enabled: true,
    },
    push_notifications: {
      fcm_server_key: '',
      enabled: true,
    },
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.put('/admin/settings', settings)
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to save settings')
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="settings-page">
      <h1 className="page-title">Settings & Integrations</h1>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="settings-sections">
        <div className="settings-card">
          <h2>Payment Gateway</h2>
          <div className="form-group">
            <label>Provider</label>
            <select
              value={settings.payment_gateway.provider}
              onChange={(e) => setSettings({
                ...settings,
                payment_gateway: { ...settings.payment_gateway, provider: e.target.value }
              })}
            >
              <option value="razorpay">Razorpay</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div className="form-group">
            <label>API Key</label>
            <input
              type="text"
              value={settings.payment_gateway.api_key}
              onChange={(e) => setSettings({
                ...settings,
                payment_gateway: { ...settings.payment_gateway, api_key: e.target.value }
              })}
              placeholder="Enter API Key"
            />
          </div>
          <div className="form-group">
            <label>API Secret</label>
            <input
              type="password"
              value={settings.payment_gateway.api_secret}
              onChange={(e) => setSettings({
                ...settings,
                payment_gateway: { ...settings.payment_gateway, api_secret: e.target.value }
              })}
              placeholder="Enter API Secret"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.payment_gateway.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  payment_gateway: { ...settings.payment_gateway, enabled: e.target.checked }
                })}
              />
              Enable Payment Gateway
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h2>Courier API</h2>
          <div className="form-group">
            <label>Provider</label>
            <select
              value={settings.courier_api.provider}
              onChange={(e) => setSettings({
                ...settings,
                courier_api: { ...settings.courier_api, provider: e.target.value }
              })}
            >
              <option value="shiprocket">Shiprocket</option>
              <option value="delhivery">Delhivery</option>
              <option value="fedex">FedEx</option>
            </select>
          </div>
          <div className="form-group">
            <label>API Key</label>
            <input
              type="text"
              value={settings.courier_api.api_key}
              onChange={(e) => setSettings({
                ...settings,
                courier_api: { ...settings.courier_api, api_key: e.target.value }
              })}
              placeholder="Enter API Key"
            />
          </div>
          <div className="form-group">
            <label>API Secret</label>
            <input
              type="password"
              value={settings.courier_api.api_secret}
              onChange={(e) => setSettings({
                ...settings,
                courier_api: { ...settings.courier_api, api_secret: e.target.value }
              })}
              placeholder="Enter API Secret"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.courier_api.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  courier_api: { ...settings.courier_api, enabled: e.target.checked }
                })}
              />
              Enable Courier API
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h2>Push Notifications</h2>
          <div className="form-group">
            <label>FCM Server Key</label>
            <input
              type="text"
              value={settings.push_notifications.fcm_server_key}
              onChange={(e) => setSettings({
                ...settings,
                push_notifications: { ...settings.push_notifications, fcm_server_key: e.target.value }
              })}
              placeholder="Enter FCM Server Key"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.push_notifications.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  push_notifications: { ...settings.push_notifications, enabled: e.target.checked }
                })}
              />
              Enable Push Notifications
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

