import { useEffect, useState } from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { isCompleted, toCompletedFlag } from '../api/todos.js'

function toDayjs(value) {
  if (!value) return null
  const date = dayjs(value)
  return date.isValid() ? date : null
}

export default function TodoDialog({
  open,
  mode = 'add',
  todo,
  loading = false,
  saving,
  onCancel,
  onSave,
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [completed, setCompleted] = useState(0)
  const [expectedCompleteDate, setExpectedCompleteDate] = useState(null)
  const isEdit = mode === 'edit'
  const disabled = saving || loading

  useEffect(() => {
    if (!open) return
    if (isEdit && loading) {
      setTitle('')
      setContent('')
      setCompleted(0)
      setExpectedCompleteDate(null)
      return
    }
    if (isEdit && todo && !loading) {
      setTitle(todo.title || '')
      setContent(todo.content || '')
      setCompleted(toCompletedFlag(todo.completed))
      setExpectedCompleteDate(toDayjs(todo.expectedCompleteDate))
      return
    }
    if (!isEdit) {
      setTitle('')
      setContent('')
      setCompleted(0)
      setExpectedCompleteDate(null)
    }
  }, [open, isEdit, todo, loading])

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextTitle = title.trim()
    const nextContent = content.trim()
    if (!nextTitle || !nextContent || saving || loading) return
    onSave({
      title: nextTitle,
      content: nextContent,
      completed,
      expectedCompleteDate: expectedCompleteDate
        ? expectedCompleteDate.format('YYYY-MM-DD')
        : null,
    })
  }

  return (
    <div className="dialog-mask" onClick={onCancel} role="presentation">
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-dialog-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3 id="todo-dialog-title">{isEdit ? '编辑待办' : '新增待办'}</h3>
        {loading && <p className="dialog-loading">正在加载详情...</p>}
        <label className="dialog-field">
          <span>标题</span>
          <input
            className="dialog-text"
            value={title}
            autoFocus
            placeholder="请输入标题"
            disabled={disabled}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onCancel()
            }}
          />
        </label>
        <label className="dialog-field">
          <span>内容</span>
          <textarea
            className="dialog-input"
            value={content}
            rows={4}
            placeholder="请输入内容"
            disabled={disabled}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onCancel()
            }}
          />
        </label>
        <label className="dialog-field">
          <span>预计完成日期</span>
          <DatePicker
            value={expectedCompleteDate}
            onChange={setExpectedCompleteDate}
            placeholder="请选择预计完成日期"
            disabled={disabled}
            allowClear
            style={{ width: '100%' }}
          />
        </label>
        <label className="dialog-check">
          <input
            type="checkbox"
            checked={isCompleted(completed)}
            disabled={disabled}
            onChange={(event) => setCompleted(event.target.checked ? 1 : 0)}
          />
          <span>已完成</span>
        </label>
        <div className="dialog-actions">
          <button className="btn" type="button" onClick={onCancel} disabled={saving}>
            取消
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={disabled || !title.trim() || !content.trim()}
          >
            {loading ? '加载中...' : saving ? '保存中...' : isEdit ? '保存' : '添加'}
          </button>
        </div>
      </form>
    </div>
  )
}
