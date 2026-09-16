import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

function unwrap(payload) {
  if (payload == null || typeof payload !== 'object') {
    return payload
  }

  if (!Object.prototype.hasOwnProperty.call(payload, 'code')) {
    return payload
  }

  const ok = payload.code === 0 || payload.code === 200
  if (!ok) {
    const error = new Error(payload.message || '请求失败')
    error.code = payload.code
    throw error
  }

  return payload.data
}

request.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return null
    }
    return unwrap(response.data)
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        localStorage.removeItem('token')
      }
      const message = data?.message || `请求失败（${status}）`
      return Promise.reject(new Error(message))
    }

    if (error.request) {
      return Promise.reject(new Error('网络异常，无法连接服务器'))
    }

    return Promise.reject(error)
  },
)

export default request
