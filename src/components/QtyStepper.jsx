import { Minus, Plus } from 'lucide-react';

export function QtyStepper({ value, min = 0, max = 99, disabled = false, onChange, label }) {
  function parse(raw) {
    const n = Number.parseInt(String(raw).replace(/\D/g, ''), 10);
    if (Number.isNaN(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  return (
    <div className={`qty-stepper ${disabled ? 'is-disabled' : ''}`}>
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="إنقاص"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={value}
        aria-label={label || 'العدد'}
        onChange={(e) => onChange(parse(e.target.value))}
      />
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="زيادة"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
