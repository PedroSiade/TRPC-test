import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  "primary" | "outline" | "ghost" | "danger" | "danger-outline";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover disabled:bg-primary-muted",
  outline: "border border-primary bg-white text-primary hover:bg-primary-soft",
  ghost: "border border-line-strong bg-white font-medium text-ink hover:border-primary",
  danger: "bg-danger text-white hover:bg-danger-hover",
  "danger-outline":
    "border border-[#e3b3b3] bg-white text-danger-strong hover:bg-[#fbe6e6]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

/** Shared class string so links can be styled as buttons without nesting. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
});
