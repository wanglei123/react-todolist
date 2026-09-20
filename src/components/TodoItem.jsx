import { isCompleted } from '../api/todos.js'

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const title = todo.title || '无标题'
  const content = todo.content || ''
  const expectedCompleteDate = todo.expectedCompleteDate
  const done = isCompleted(todo.completed)

  return (
    <li className={`todo-item ${done ? 'completed' : ''}`}>
      <div className="todo-check">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(todo)}
          aria-label={`完成 ${title}`}
        />
      </div>
      <div className="todo-main" onDoubleClick={() => onEdit(todo)}>
        <span className="todo-title">{title}</span>
        {content ? <span className="todo-content">{content}</span> : null}
        <span className={`todo-date ${expectedCompleteDate ? '' : 'unset'}`}>
          预计完成：{expectedCompleteDate || '未设置'}
        </span>
      </div>
      <div className="todo-actions">
        <button className="btn btn-text" type="button" onClick={() => onEdit(todo)}>
          编辑
        </button>
        <button className="btn btn-danger" type="button" onClick={() => onDelete(todo)}>
          删除
        </button>
      </div>
    </li>
  )
}
