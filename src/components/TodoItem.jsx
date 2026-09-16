export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const title = todo.title || '无标题'
  const content = todo.content || ''

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={Boolean(todo.completed)}
        onChange={() => onToggle(todo)}
        aria-label={`完成 ${title}`}
      />
      <div className="todo-main" onDoubleClick={() => onEdit(todo)}>
        <span className="todo-title">{title}</span>
        {content ? <span className="todo-content">{content}</span> : null}
      </div>
      <button className="btn btn-text" type="button" onClick={() => onEdit(todo)}>
        编辑
      </button>
      <button className="btn btn-danger" type="button" onClick={() => onDelete(todo)}>
        删除
      </button>
    </li>
  )
}
