export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return {
    year: date.toLocaleString("en-US", { year: "numeric" }),
    month: date.toLocaleString("en-US", { month: "short" }),
    day: date.toLocaleString("en-US", { day: "2-digit" }),
  };
}
