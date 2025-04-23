
/**
 * Format date string to a readable format
 * @param timeString ISO date string
 * @returns Formatted date string
 */
export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

/**
 * Format hour to AM/PM format
 * @param hour Hour in 24-hour format
 * @returns Hour in AM/PM format
 */
export const formatHour = (hour: number | null): string => {
  if (hour === null) return 'N/A';
  return hour < 12 ? `${hour} AM` : (hour === 12 ? '12 PM' : `${hour - 12} PM`);
};

/**
 * Calculate duration between two datetime strings in minutes
 * @param startTime Start time ISO string
 * @param endTime End time ISO string
 * @returns Duration in minutes
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60);
};
