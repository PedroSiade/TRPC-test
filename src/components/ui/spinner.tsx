type SpinnerTone = "dark" | "light" | "danger";

const toneClasses: Record<SpinnerTone, string> = {
  dark: "border-[#d5dbe5] border-t-primary",
  light: "border-white/35 border-t-white",
  danger: "border-danger-line border-t-danger",
};

export function Spinner({ tone = "dark" }: { tone?: SpinnerTone }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 ${toneClasses[tone]}`}
    />
  );
}
