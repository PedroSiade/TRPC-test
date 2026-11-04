import { forwardRef, type ButtonHTMLAttributes } from "react";

type IconButtonTone = "neutral" | "danger";

type IconButtonOptions = {
  tone?: IconButtonTone;
  /** Renders a 1px border (used on the detail page). */
  bordered?: boolean;
};

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  IconButtonOptions & {
    /** Required accessible label since the button only renders an icon. */
    label: string;
  };

const toneClasses: Record<IconButtonTone, string> = {
  neutral: "hover:bg-primary-soft hover:text-primary",
  danger: "hover:bg-danger-soft hover:text-danger",
};

const borderedToneClasses: Record<IconButtonTone, string> = {
  neutral: "border border-line hover:border-primary hover:text-primary",
  danger: "border border-line hover:border-[#ebc5c1] hover:text-danger",
};

/** Shared class string so links can be styled as icon buttons. */
export function iconButtonClasses({
  tone = "neutral",
  bordered = false,
}: IconButtonOptions = {}) {
  return `inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded bg-transparent text-muted transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed ${
    bordered ? borderedToneClasses[tone] : toneClasses[tone]
  }`;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, tone, bordered, className = "", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={`${iconButtonClasses({ tone, bordered })} ${className}`}
        {...props}
      />
    );
  },
);
