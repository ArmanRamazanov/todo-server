export function isValid(dateString: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(dateString)) {
    return "Due date must be in YYYY-MM-DD format";
  } else {
    const [year, month, day] = dateString.split("-") as [
      string,
      string,
      string,
    ];

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return "Due date is inaccurate";
    }

    if (date.getTime() < Date.now()) {
      return "Due date cannot be a past date";
    }
  }
}
