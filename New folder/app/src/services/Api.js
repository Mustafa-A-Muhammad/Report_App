import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/auth',
  timeout: 10000
})

// Attach JWT token automatically (except for login route)
api.interceptors.request.use(config => {
  if (!config.url?.includes('/login')) {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api