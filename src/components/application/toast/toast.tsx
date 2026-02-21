"use client";

import { useEffect } from "react";
import { CheckCircle, XClose, AlertCircle } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cx(
        "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg shadow-lg p-4 min-w-[320px] max-w-md",
        "animate-in slide-in-from-top-5 fade-in duration-300",
        "border",
        type === "success" && "bg-success-primary border-success-500",
        type === "error" && "bg-error-primary border-error"
      )}
    >
      <div className="shrink-0">
        {type === "success" ? (
          <CheckCircle className="size-5 text-success-primary" />
        ) : (
          <AlertCircle className="size-5 text-error-primary" />
        )}
      </div>
      <p className={cx("text-sm flex-1", type === "success" ? "text-success-primary" : "text-error-primary")}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={cx(
          "shrink-0 rounded-lg p-1 transition-colors",
          type === "success" && "text-success-primary hover:bg-success-secondary",
          type === "error" && "text-error-primary hover:bg-error-secondary"
        )}
      >
        <XClose className="size-4" />
      </button>
    </div>
  );
}
