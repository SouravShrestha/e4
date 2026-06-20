"use client";

import { useEffect, useRef } from "react";

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus confirm button on mount and trap Escape → cancel
  useEffect(() => {
    confirmRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    // Backdrop
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "var(--scrim)" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* Panel */}
      <div
        className="mx-4 w-fit min-w-64 rounded-xl p-6"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-muted)",
          animation: "slide-up 0.22s ease forwards",
        }}
      >
        <h2
          id="confirm-dialog-title"
          className="mb-2 text-base font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h2>
        <p
          className="mb-6 text-sm leading-relaxed whitespace-pre-line"
          style={{ color: "var(--muted)" }}
        >
          {message}
        </p>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-medium transition hover:opacity-75"
            style={{
              color: "var(--foreground)",
            }}
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-80 active:scale-95"
            style={{
              color: danger ? "var(--danger)" : "var(--foreground)",
              backgroundColor: "var(--surface-muted)",
              border: danger
                ? "1px solid var(--danger-border)"
                : "1px solid var(--divider-strong)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
