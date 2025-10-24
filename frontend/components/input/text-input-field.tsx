"use client";

import type React from "react";
import { ArrowRight } from "lucide-react";

interface TextInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onSubmit: () => void;
  disabled?: boolean;
  testId?: string;
}

const TextInputField = ({
  value,
  onChange,
  placeholder,
  onSubmit,
  disabled,
  testId,
}: TextInputFieldProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="btn-outline">
      <div className="btn-inline">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent placeholder-white/50 outline-none text-sm font-medium ${
            disabled ? "text-white/50" : "text-white"
          }`}
          autoFocus
          disabled={disabled}
          data-testid={testId}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="shrink-0 text-white/70 hover:text-white disabled:opacity-50 transition-colors"
        >
          {!disabled && <ArrowRight size={20} />}
        </button>
      </div>
    </form>
  );
};

export default TextInputField;
