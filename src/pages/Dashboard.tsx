
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import EventList from "@/components/EventList";
import DataCharts from "@/components/DataCharts";
import { Event, calculateAnalytics, greedySchedule } from "@/utils/schedulingAlgorithms";

const Dashboard = () => {
  const { scheduleName } = useParams<{ scheduleName: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [optimizedEvents, setOptimizedEvents] = useState<Event[]>([]);
  const [analytics, setAnalytics] = useState<{
    total_events: number;
    avg_duration_minutes: number;
    peak_start_hour: number | null;
    optimized_events: number;
  }>({
    total_events: 0,
    avg_duration_minutes: 0,
    peak_start_hour: null,
    optimized_events: 0
  });
  const [schedules, setSchedules] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>(scheduleName || "");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  // Form state
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (scheduleName) {
      setSelectedSchedule(scheduleName);
      loadScheduleData(scheduleName);
    }
    
    // Load available schedules
    const savedSchedules = localStorage.getItem("schedules");
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    } else {
      // Initialize with some sample schedules
      const initialSchedules = ["Conference 2025", "Team Meeting"];
      localStorage.setItem("schedules", JSON.stringify(initialSchedules));
      setSchedules(initialSchedules);
    }
  }, [scheduleName]);

  const loadScheduleData = (schedule: string) => {
    // Load events from localStorage (in a real app, this would be API calls)
    const savedEvents = localStorage.getItem(`events_${schedule}`);
    const eventsData = savedEvents ? JSON.parse(savedEvents) : [];
    setEvents(eventsData);
    
    // Generate optimized events using greedy algorithm
    setOptimizedEvents(greedySchedule(eventsData));
    
    // Calculate analytics
    const calculatedAnalytics = calculateAnalytics(eventsData);
    setAnalytics(calculatedAnalytics);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName.trim() || !startTime || !endTime) {
      displayToast("Please fill in all fields", "error");
      return;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      displayToast("End time must be after start time", "error");
      return;
    }
    
    // Create new event
    const newEvent: Event = {
      id: events.length + 1,
      name: eventName.trim(),
      start_time: start.toISOString(),
      end_time: end.toISOString()
    };
    
    // Add to events list
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    // Update localStorage
    localStorage.setItem(`events_${selectedSchedule}`, JSON.stringify(updatedEvents));
    
    // Update optimized events
    setOptimizedEvents(greedySchedule(updatedEvents));
    
    // Update analytics
    setAnalytics(calculateAnalytics(updatedEvents));
    
    // Reset form
    setEventName("");
    setStartTime("");
    setEndTime("");
    
    displayToast("Event added successfully", "success");
  };

  const displayToast = (message: string, type: "success" | "error" | "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSchedule = e.target.value;
    if (newSchedule) {
      window.location.href = `/dashboard/${newSchedule}`;
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatHour = (hour: number | null) => {
    if (hour === null) return 'N/A';
    return hour < 12 ? `${hour} AM` : (hour === 12 ? '12 PM' : `${hour - 12} PM`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">
                  EventScheduleSavvy
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="max-w-xs">
                <label htmlFor="schedule-select" className="sr-only">Schedule</label>
                <select
                  id="schedule-select"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedSchedule}
                  onChange={handleScheduleChange}
                >
                  <option value="">Select a schedule</option>
                  {schedules.map((schedule) => (
                    <option key={schedule} value={schedule}>{schedule}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{selectedSchedule}</h1>
          <p className="mt-1 text-lg opacity-90">Event Dashboard</p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Events */}
          <div className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Events
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{analytics.total_events}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Average Duration */}
          <div className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Duration
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{analytics.avg_duration_minutes} mins</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Peak Hour */}
          <div className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Peak Start Hour
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{formatHour(analytics.peak_start_hour)}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Optimized Events */}
          <div className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Optimized Events
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{analytics.optimized_events}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Add Event Form + Event List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Add New Event</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Name</label>
                    <input
                      type="text"
                      name="event-name"
                      id="event-name"
                      placeholder="Conference Talk"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="event-start" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="datetime-local"
                      name="event-start"
                      id="event-start"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="event-end" className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="datetime-local"
                      name="event-end"
                      id="event-end"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <EventList events={events} title="All Events" />
          </div>
          
          {/* Right Column: Charts + Optimized Schedule */}
          <div className="lg:col-span-2">
            {/* Charts */}
            {events.length > 0 ? (
              <DataCharts events={events} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-400">Add events to see charts</p>
                </div>
                <div className="bg-white shadow rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-400">Add events to see charts</p>
                </div>
              </div>
            )}
            
            {/* Optimized Schedule */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Optimized Schedule (Non-overlapping)</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <EventList events={optimizedEvents} title="" optimized={true} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <p className="text-gray-400 text-sm">
                Built with React, Tailwind CSS, and Flask
              </p>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2025 EventScheduleSavvy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 flex items-center p-4 mb-4 rounded-lg shadow ${
          toastType === 'success' ? 'bg-green-100 text-green-800' :
          toastType === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`} role="alert">
          <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg">
            {toastType === 'success' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            )}
            {toastType === 'error' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            )}
            {toastType === 'info' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <div className="ml-3 text-sm font-normal">{toastMessage}</div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
