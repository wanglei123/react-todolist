import { useCallback, useEffect, useMemo, useState } from 'react'
import { todoApi, isCompleted, toCompletedFlag } from './api/todos.js'
import { localTodoApi } from './api/localTodos.js'
import './App.css'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import TodoFilter from './components/TodoFilter.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import TodoDialog from './components/TodoDialog.jsx'

export default function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('api')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [editor, setEditor] = useState(null)
  const [savingTodo, setSavingTodo] = useState(false)

  const api = mode === 'api' ? todoApi : localTodoApi

  const loadTodos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await todoApi.list()
      setTodos(Array.isArray(data) ? data : [])
      setMode('api')
      setError('')
    } catch (err) {
      const data = await localTodoApi.list()
      setTodos(Array.isArray(data) ? data : [])
      setMode('local')
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((item) => !isCompleted(item.completed))
    if (filter === 'completed') return todos.filter((item) => isCompleted(item.completed))
    return todos
  }, [todos, filter])

  const remaining = todos.filter((item) => !isCompleted(item.completed)).length
  const completedCount = todos.length - remaining

  const handleAdd = () => {
    setEditor({ mode: 'add' })
  }

  const handleToggle = async (todo) => {
    const nextCompleted = isCompleted(todo.completed) ? 0 : 1
    try {
      await api.updateCompleted(todo.id, nextCompleted)
      setTodos((prev) =>
        prev.map((item) =>
          String(item.id) === String(todo.id)
            ? { ...item, completed: nextCompleted }
            : item,
        ),
      )
      setError('')
    } catch (err) {
      setError(err.message || '更新完成状态失败')
    }
  }

  const handleEdit = async (todo) => {
    if (todo?.id == null || todo.id === '') {
      setError('缺少待办 id，无法编辑')
      return
    }
    setEditor({ mode: 'edit', loading: true, todo: { id: todo.id } })
    try {
      const detail = await api.getDetailById(todo.id)
      if (!detail || detail.id == null) {
        setEditor((prev) =>
          prev && String(prev.todo?.id) === String(todo.id) ? null : prev,
        )
        setError('未找到待办详情')
        return
      }
      setEditor((prev) => {
        if (!prev || prev.mode !== 'edit' || String(prev.todo?.id) !== String(todo.id)) {
          return prev
        }
        return { mode: 'edit', todo: detail }
      })
      setError('')
    } catch (err) {
      setEditor((prev) =>
        prev && String(prev.todo?.id) === String(todo.id) ? null : prev,
      )
      setError(err.message || '获取详情失败')
    }
  }

  const closeEditor = () => {
    if (!savingTodo) setEditor(null)
  }

  const saveTodo = async ({ title, content, completed, expectedCompleteDate }) => {
    if (!editor) return
    setSavingTodo(true)
    try {
      const completedFlag = toCompletedFlag(completed)
      const payload = {
        title,
        content,
        completed: completedFlag,
        expectedCompleteDate: expectedCompleteDate || null,
      }
      if (editor.mode === 'add') {
        await todoApi.create(payload)
        const data = await todoApi.list()
        setTodos(Array.isArray(data) ? data : [])
        setMode('api')
      } else {
        const todo = editor.todo
        await api.update(todo.id, payload)
        setTodos((prev) =>
          prev.map((item) =>
            String(item.id) === String(todo.id)
              ? { ...item, ...payload }
              : item,
          ),
        )
      }
      setEditor(null)
      setError('')
    } catch (err) {
      setError(err.message || (editor.mode === 'add' ? '添加失败' : '更新失败'))
    } finally {
      setSavingTodo(false)
    }
  }

  const handleDelete = (todo) => {
    setPendingDelete(todo)
  }

  const confirmDelete = async () => {
    const todo = pendingDelete
    setPendingDelete(null)
    const id = todo?.id
    if (id == null || id === '') {
      setError('缺少待办 id，无法删除')
      return
    }
    try {
      await api.remove(id)
      setTodos((prev) => prev.filter((item) => String(item.id) !== String(id)))
      setError('')
    } catch (err) {
      setError(err.message || '删除失败')
    }
  }

  const handleClearCompleted = async () => {
    const done = todos.filter((item) => isCompleted(item.completed))
    try {
      await Promise.all(done.map((item) => api.remove(item.id)))
      setTodos((prev) => prev.filter((item) => !isCompleted(item.completed)))
    } catch (err) {
      setError(err.message || '清除失败')
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Todo List</h1>
          <p>对接 Java 后端的练习项目</p>
        </div>
        <span className={`badge ${mode}`}>
          {mode === 'api' ? '已连接后端' : '本地模式'}
        </span>
      </header>

      <section className="card">
        {mode === 'local' && (
          <p className="hint">
            未检测到 Java 服务，数据暂存在浏览器。启动后端（默认 8080）后刷新即可对接
            <code>/api/todos</code>。
          </p>
        )}
        {error && <p className="error">{error}</p>}
        <TodoForm onAdd={handleAdd} disabled={loading} />
        {loading ? (
          <p className="todo-empty">加载中...</p>
        ) : (
          <TodoList
            todos={visibleTodos}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        <TodoFilter
          value={filter}
          onChange={setFilter}
          remaining={remaining}
          completedCount={completedCount}
          onClearCompleted={handleClearCompleted}
        />
      </section>

      <TodoDialog
        open={Boolean(editor)}
        mode={editor?.mode}
        todo={editor?.todo}
        loading={Boolean(editor?.loading)}
        saving={savingTodo}
        onCancel={closeEditor}
        onSave={saveTodo}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="确认删除"
        message={`确定删除「${pendingDelete?.title || pendingDelete?.content || '这条待办'}」吗？删除后无法恢复。`}
        confirmText="确定删除"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
