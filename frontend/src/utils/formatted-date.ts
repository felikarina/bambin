export function formattedDate(date?: string) {
  if (!date) return ''
  return date.slice(0, 10)
}
