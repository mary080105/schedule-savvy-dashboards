
import { calculateDuration } from './dateUtils';

export interface Event {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

export interface Analytics {
  total_events: number;
  avg_duration_minutes: number;
  peak_start_hour: number | null;
  optimized_events: number;
}

/**
 * Greedy scheduling algorithm to find non-overlapping events
 * @param events List of events
 * @returns Optimized list of non-overlapping events
 */
export const greedySchedule = (events: Event[]): Event[] => {
  if (!events.length) return [];
  
  // Sort events by end time
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
  );
  
  const result: Event[] = [sortedEvents[0]];
  let lastEndTime = new Date(sortedEvents[0].end_time);
  
  for (let i = 1; i < sortedEvents.length; i++) {
    const startTime = new Date(sortedEvents[i].start_time);
    if (startTime >= lastEndTime) {
      result.push(sortedEvents[i]);
      lastEndTime = new Date(sortedEvents[i].end_time);
    }
  }
  
  return result;
};

/**
 * Calculate analytics from a list of events
 * @param events List of events
 * @returns Analytics object with metrics
 */
export const calculateAnalytics = (events: Event[]): Analytics => {
  if (!events.length) {
    return {
      total_events: 0,
      avg_duration_minutes: 0,
      peak_start_hour: null,
      optimized_events: 0
    };
  }
  
  // Calculate total events
  const totalEvents = events.length;
  
  // Calculate average duration
  let totalDurationMinutes = 0;
  const startHours: number[] = [];
  
  events.forEach(event => {
    const durationMinutes = calculateDuration(event.start_time, event.end_time);
    totalDurationMinutes += durationMinutes;
    
    const start = new Date(event.start_time);
    startHours.push(start.getHours());
  });
  
  const avgDurationMinutes = Math.round(totalDurationMinutes / totalEvents * 10) / 10;
  
  // Calculate peak hour
  const hourCounts: {[key: number]: number} = {};
  startHours.forEach(hour => {
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  let peakHour = null;
  let maxCount = 0;
  
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      peakHour = parseInt(hour);
      maxCount = count;
    }
  });
  
  // Calculate optimized events
  const optimizedCount = greedySchedule(events).length;
  
  return {
    total_events: totalEvents,
    avg_duration_minutes: avgDurationMinutes,
    peak_start_hour: peakHour,
    optimized_events: optimizedCount
  };
};
