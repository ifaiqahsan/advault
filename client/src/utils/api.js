// Small fetch wrapper: adds the JWT and turns error responses into thrown Errors
export const API_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'advault_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let payload = body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload })
  } catch {
    throw new Error('Cannot reach the server. Is it running on port 5000?')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.message || `Request failed (${res.status})`)
    error.status = res.status
    throw error
  }
  return data
}

// Uploads one PNG/JPG and returns its URL, e.g. "/uploads/ad-123.png"
export async function uploadImage(file) {
  const form = new FormData()
  form.append('image', file)
  const data = await api('/bookings/upload', { method: 'POST', body: form })
  return data.url
}
