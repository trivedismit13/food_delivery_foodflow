import { format, formatDistanceToNow, parseISO, isAfter } from 'date-fns'

// All backend dates come as ISO 8601 strings
// Always use parseISO before any date-fns function

export const formatDate = (isoString: string): string => {
  return format(parseISO(isoString), 'dd MMM yyyy')
  // "10 May 2026"
}

export const formatDateTime = (isoString: string): string => {
  return format(parseISO(isoString), 'dd MMM yyyy, hh:mm a')
  // "10 May 2026, 08:00 PM"
}

export const formatTime = (isoString: string): string => {
  return format(parseISO(isoString), 'hh:mm a')
  // "08:00 PM"
}

export const timeAgo = (isoString: string): string => {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
  // "2 hours ago"
}

export const isDropOpen = (cutoffIso: string): boolean => {
  return isAfter(parseISO(cutoffIso), new Date())
}

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`
  // ₹1,24,500
}

export const formatPickupWindow = (
  startIso: string | null, 
  endIso: string | null
): string => {
  if (!startIso || !endIso) return 'Not set'
  return `${formatTime(startIso)} – ${formatTime(endIso)}`
  // "12:00 PM – 2:00 PM"
}
