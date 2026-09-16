export default function TodoForm({ onAdd, disabled }) {
  return (
    <div className="todo-form">
      <button className="btn btn-primary" type="button" onClick={onAdd} disabled={disabled}>
        添加待办
      </button>
    </div>
  )
}
