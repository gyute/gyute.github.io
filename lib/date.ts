export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return {
    year: date.toLocaleString("en-US", { year: "numeric" }),
    month: date.toLocaleString("en-US", { month: "short" }),
    day: date.toLocaleString("en-US", { day: "2-digit" }),
  };
}

export function postDate(date: Date | string) {
  const locales = "en-US";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  if (date instanceof Date) {
    return date.toLocaleDateString(locales, options);
  }

  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString(locales, options);
}
