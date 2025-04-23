
import { useState } from "react";

interface EventFormProps {
  onAddEvent: (name: string, startTime: string, endTime: string) => void;
}

const EventForm = ({ onAddEvent }: EventFormProps) => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !startTime || !endTime) {
      return;
    }
    
    // Call parent handler
    onAddEvent(name, startTime, endTime);
    
    // Reset form
    setName("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Add New Event</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Name</label>
            <input 
              type="text" 
              name="event-name" 
              id="event-name" 
              placeholder="Conference Talk" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
  );
};

export default EventForm;
