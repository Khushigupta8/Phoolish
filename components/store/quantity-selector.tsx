"use client";
import { Minus, Plus } from "lucide-react";
export function QuantitySelector({
  value,
  max,
  onChange,
  label = "Quantity",
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        type="button"
        disabled={value <= 1}
        aria-label={`Decrease ${label.toLowerCase()}`}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
