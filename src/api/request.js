import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function isSuccessCode(code) {
  return code === 0 || code === 200 || code === '0' || code === '200'
}

function getMessage(payload, fallback = '请求失败') {
  if (payload == null) return fallback
  if (typeof payload === 'string' && payload.trim()) return payload
  return payload.message || payload.msg || fallback
}

export function unwrap(payload) {
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return payload
    }
  }

  if (payload == null || typeof payload !== 'object') {
    return payload
  }

  if (Array.isArray(payload)) {
    return payload
  }

  const hasCode = Object.prototype.hasOwnProperty.call(payload, 'code')
  const hasData = Object.prototype.hasOwnProperty.call(payload, 'data')
  if (!hasCode && !hasData) {
    return payload
  }

  if (hasCode && !isSuccessCode(payload.code)) {
    const error = new Error(getMessage(payload))
    error.code = payload.code
    throw error
  }

  return hasData ? payload.data : payload
}

export function asList(payload) {
  const data = unwrap(payload)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.list)) return data.list
  if (Array.isArray(data?.records)) return data.records
  return []
}

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
      return Promise.reject(new Error(getMessage(data, `请求失败（${status}）`)))
    }

    if (error.message && !error.request && !error.response) {
      return Promise.reject(error)
    }

    if (error.request) {
      return Promise.reject(new Error(error.message || '网络异常，无法连接服务器'))
    }

    return Promise.reject(error)
  },
)

export default request
