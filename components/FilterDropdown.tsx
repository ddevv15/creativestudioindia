"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string; count: number };

/**
 * A multi-select checklist behind a button (projects page, after zha.com).
 * Within one dropdown the choices widen the result (OR); ProjectsBrowser ANDs
 * the dropdowns together. Options with no matching project are disabled rather
 * than hidden, so the list never reshuffles under the cursor.
 *
 * Closes on Escape (focus returns to the button) and on any press outside.
 */
export default function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (value: string) =>
    onChange(
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-[44px] w-full items-center justify-between gap-16 border px-16 text-[12px] uppercase tracking-[0.04em] transition-colors duration-200",
          open || selected.length > 0 ? "border-ink text-ink" : "border-ink/25 text-ink hover:border-ink/60"
        )}
      >
        <span>
          {label}
          {selected.length > 0 && <span className="ml-8 font-mono text-stone">{selected.length}</span>}
        </span>
        <ChevronDown
          aria-hidden="true"
          size={14}
          strokeWidth={1.5}
          className={cn("transition-transform duration-200 ease-out", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        role="group"
        aria-label={label}
        // Kept mounted so it can animate out; `invisible` takes it out of the
        // tab order and the accessibility tree while closed.
        className={cn(
          "absolute inset-x-0 top-full z-30 -mt-px max-h-[300px] origin-top overflow-y-auto border border-ink bg-offwhite py-8",
          "transition-[opacity,transform,visibility] duration-150 ease-out",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        )}
      >
        {options.map((option) => {
          const checked = selected.includes(option.value);
          const disabled = option.count === 0 && !checked;
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-[40px] cursor-pointer items-center justify-between gap-16 px-16 text-[12px] uppercase tracking-[0.04em] transition-colors duration-150",
                disabled ? "cursor-default text-ink/30" : "text-ink hover:bg-linen"
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(option.value)}
                className="peer sr-only"
              />
              <span className="peer-focus-visible:underline">
                {option.label}
                <span className="ml-8 font-mono text-stone">{option.count}</span>
              </span>
              <Check
                aria-hidden="true"
                size={14}
                strokeWidth={1.5}
                className={cn("transition-opacity duration-150", checked ? "opacity-100" : "opacity-0")}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
