const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
