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
    "bg-primary text-white border border-transparent hover:bg-primary/90",
  outline:
    "bg-transparent text-primary border hover:text-white border-primary hover:bg-primary",
  link: "bg-transparent text-primary underline hover:text-primary",
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
