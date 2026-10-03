import axios from 'axios'
import { USE_MOCK_DATA } from '../firebase/config'
import * as mock from './mockData'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Every function below hits the real FastAPI backend, but transparently
// falls back to local mock data when VITE_USE_MOCK_DATA=true (default),
// so the UI is fully explorable without any backend running.

export async function fetchDonations(params = {}) {
  if (USE_MOCK_DATA) return simulate(mock.donations)
  const { data } = await api.get('/donations', { params })
  return data
}

export async function fetchNgos() {
  if (USE_MOCK_DATA) return simulate(mock.ngos)
  const { data } = await api.get('/ngos')
  return data
}

export async function fetchVolunteers() {
  if (USE_MOCK_DATA) return simulate(mock.volunteers)
  const { data } = await api.get('/volunteers')
  return data
}

export async function fetchNotifications() {
  if (USE_MOCK_DATA) return simulate(mock.notifications)
  const { data } = await api.get('/notifications')
  return data
}

export async function fetchAnalytics() {
  if (USE_MOCK_DATA) return simulate(mock.analytics)
  const { data } = await api.get('/analytics')
  return data
}

export async function createDonation(payload) {
  if (USE_MOCK_DATA) {
    return simulate({ id: `FD-${Math.floor(Math.random() * 9000 + 1000)}`, status: 'available', createdAt: new Date().toISOString(), ...payload })
  }
  const { data } = await api.post('/donations', payload)
  return data
}

export async function updateDonationStatus(id, status) {
  if (USE_MOCK_DATA) return simulate({ id, status })
  const { data } = await api.patch(`/donations/${id}/status`, { status })
  return data
}

function simulate(value, delay = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay))
}

export default api
