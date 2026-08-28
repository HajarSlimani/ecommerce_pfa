import { ORDER_STATUS, ORDER_STATUS_TRANSITIONS } from '../../constants/orderStatus'

export default function OrderStatusSelect({ status, onChange, disabled }) {
  const options = [status, ...(ORDER_STATUS_TRANSITIONS[status] || [])]
  const meta = ORDER_STATUS[status]

  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide outline-none transition focus:ring-2 focus:ring-brand-100 disabled:opacity-50 ${
        meta?.badgeClassName || 'bg-surface-sunken text-ink-soft border-line'
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
