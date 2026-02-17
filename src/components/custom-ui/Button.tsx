"use client";

import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ButtonSize = "s" | "m" | "l";
type ButtonVariant = "default" | "outline" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  s: "px-3 py-1 text-sm",
  m: "px-4 py-2 text-sm ",
  l: "px-6 py-3 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-zinc-600 text-white border border-zinc-700 hover:bg-zinc-700 active:bg-zinc-600",

  outline:
    "bg-transparent text-zinc-200 border border-zinc-600 hover:bg-zinc-600 hover:text-white",

  link: "bg-transparent text-zinc-300 underline underline-offset-4 hover:text-white",
};

export const Button: React.FC<ButtonProps> = ({
  size = "m",
  variant = "default",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center gap-2 justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        "cursor-pointer",
        className,
      )}
      {...props}
    >
      {loading && (
        <AiOutlineLoading3Quarters className="animate-spin mr-2 h-4 w-4" />
      )}
      {children}
    </button>
  );
};
