export function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function downloadTemplate(filename: string, path: string): void {
  const link = document.createElement("a");
  link.href = path;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
