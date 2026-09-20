const STORAGE_KEY = 'local-todos'

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStore(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  return todos
}

export const localTodoApi = {
  async list() {
    return readStore().map((item) => ({
      ...item,
      completed: item.completed === 1 || item.completed === true ? 1 : 0,
    }))
  },
  async create({ title, content, completed = 0, expectedCompleteDate = null }) {
    const todos = readStore()
    const todo = {
      id: Date.now(),
      title,
      content,
      completed: completed === 1 ? 1 : 0,
      expectedCompleteDate: expectedCompleteDate || '',
      createdAt: new Date().toISOString(),
    }
    writeStore([todo, ...todos])
    return todo
  },
  async update(id, data) {
    const todos = readStore()
    const next = todos.map((item) =>
      String(item.id) === String(id) ? { ...item, ...data } : item,
    )
    writeStore(next)
    return next.find((item) => String(item.id) === String(id))
  },
  async updateCompleted(id, completed) {
    return this.update(id, { completed: completed === 1 ? 1 : 0 })
  },
  async remove(id) {
    writeStore(readStore().filter((item) => String(item.id) !== String(id)))
    return null
  },
  async getDetailById(id) {
    return readStore().find((item) => String(item.id) === String(id)) || null
  },
}
