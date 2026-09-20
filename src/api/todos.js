/*
 * @Author       : wanglei
 * @Date         : 2026-09-09 16:21:30
 * @LastEditors  : wanglei
 * @LastEditTime : 2026-09-20 10:07:56
 * @FilePath     : /front/src/api/todos.js
 * @description  : 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from './request.js'

const BASE = '/todo'

export function isCompleted(completed) {
  return completed === 1 || completed === true || completed === '1'
}

export function toCompletedFlag(completed) {
  return isCompleted(completed) ? 1 : 0
}

export function normalizeTodo(item) {
  if (!item || typeof item !== 'object') return item
  const id = item.id ?? item.todoId
  return {
    ...item,
    id,
    title: item.title ?? '',
    content: item.content ?? '',
    completed: toCompletedFlag(item.completed),
    expectedCompleteDate: item.expectedCompleteDate || item.expectCompleteDate || '',
  }
}

export const todoApi = {
  list: async () => {
    const data = await request.post('/todo/list')
    return Array.isArray(data) ? data.map(normalizeTodo) : data
  },
  create: async ({ title, content, completed = 0, expectedCompleteDate }) => {
    const created = await request.post('/todo/add', {
      title,
      content,
      completed: toCompletedFlag(completed),
      expectedCompleteDate: expectedCompleteDate || null,
    })
    return normalizeTodo(created)
  },
  update: (id, data) => request.post(`${BASE}/update`, { id, ...data }),
  updateCompleted: (id, completed) =>
    request.post(`${BASE}/updateCompleted`, {
      id,
      completed: toCompletedFlag(completed),
    }),
  remove: (id) => request.post(`${BASE}/delete/${id}`),
  getDetailById: async (id) => {
    const detail = await request.post(`${BASE}/getDetailById/${id}`)
    return normalizeTodo(detail)
  },

}
