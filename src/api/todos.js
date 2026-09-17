/*
 * @Author       : wanglei
 * @Date         : 2026-09-09 16:21:30
 * @LastEditors  : wanglei
 * @LastEditTime : 2026-09-17 14:54:44
 * @FilePath     : /front/src/api/todos.js
 * @description  : 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
  getDetailById: async (id) => {
    const detail = await request.post(`${BASE}/getDetailById/${id}`)
    return normalizeTodo(detail)
  },
}
