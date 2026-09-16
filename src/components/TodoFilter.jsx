const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '未完成' },
  { key: 'completed', label: '已完成' },
]

export default function TodoFilter({ value, onChange, remaining, completedCount, onClearCompleted }) {
  return (
    <div className="todo-filter">
      <span className="remaining">{remaining} 项未完成</span>
      <div className="filter-tabs">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`filter-btn ${value === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-text"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        清除已完成
      </button>
    </div>
  )
}
