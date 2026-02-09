export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-US", {
    timeZone: "UTC",
  });