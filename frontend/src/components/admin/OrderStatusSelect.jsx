import { ORDER_STATUS, ORDER_STATUS_TRANSITIONS } from '../../constants/orderStatus'

export default function OrderStatusSelect({ status, onChange, disabled }) {
  const options = [status, ...(ORDER_STATUS_TRANSITIONS[status] || [])]

  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-line bg-surface px-2.5 py-1 text-xs font-medium uppercase tracking-wide outline-none transition focus:border-ink disabled:opacity-50 ${
        ORDER_STATUS[status]?.className || 'text-ink-soft'
      }`}
    >
      {options.map((code) => (
        <option key={code} value={code}>
          {ORDER_STATUS[code]?.label || code}
        </option>
      ))}
    </select>
  )
}
