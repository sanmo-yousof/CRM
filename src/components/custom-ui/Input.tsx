"use client";

import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // label text
  className?: string; // optional class override
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-800 font-medium mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-md border border-gray-400 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 ${className || ""}`}
        {...props}
      />
    </div>
  );
};
