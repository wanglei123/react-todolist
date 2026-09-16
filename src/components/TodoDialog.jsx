import { useEffect, useState } from 'react'

export default function TodoDialog({ open, mode = 'add', todo, saving, onCancel, onSave }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const isEdit = mode === 'edit'

  useEffect(() => {
    if (!open) return
    if (isEdit && todo) {
      setTitle(todo.title || '')
      setContent(todo.content || '')
      return
    }
    setTitle('')
    setContent('')
  }, [open, isEdit, todo])

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextTitle = title.trim()
    const nextContent = content.trim()
    if (!nextTitle || !nextContent || saving) return
    onSave({ title: nextTitle, content: nextContent })
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
        <label className="dialog-field">
          <span>标题</span>
          <input
            className="dialog-text"
            value={title}
            autoFocus
            placeholder="请输入标题"
            disabled={saving}
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
            disabled={saving}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onCancel()
            }}
          />
        </label>
        <div className="dialog-actions">
          <button className="btn" type="button" onClick={onCancel} disabled={saving}>
            取消
          </button>
          <button className="btn btn-primary" type="submit" disabled={saving || !title.trim() || !content.trim()}>
            {saving ? '保存中...' : isEdit ? '保存' : '添加'}
          </button>
        </div>
      </form>
    </div>
  )
}
