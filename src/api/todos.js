import request from './request.js'

const BASE = '/todo'

export function normalizeTodo(item) {
  if (!item || typeof item !== 'object') return item
  const id = item.id ?? item.todoId
  return {
    ...item,
    id,
    title: item.title ?? '',
    content: item.content ?? '',
  }
}

export const todoApi = {
  list: async () => {
    const data = await request.post('/todo/list')
    return Array.isArray(data) ? data.map(normalizeTodo) : data
  },
  create: async ({ title, content }) => {
    const created = await request.post('/todo/add', { title, content })
    return normalizeTodo(created)
  },
  update: (id, data) => request.post(`${BASE}/update`, { id, ...data }),
  remove: (id) => request.post(`${BASE}/delete/${id}`),
}
