export default function ConfirmDialog({
  open,
  title = '提示',
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="dialog-mask" onClick={onCancel} role="presentation">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn" type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-danger" type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
