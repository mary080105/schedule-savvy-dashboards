
import { formatTime } from "@/utils/dateUtils";

interface Event {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

interface EventListProps {
  events: Event[];
  title: string;
  optimized?: boolean;
}

const EventList = ({ events, title, optimized = false }: EventListProps) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-3 overflow-y-auto max-h-80">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No events found</p>
          ) : (
            events.map(event => (
              <div 
                key={`${optimized ? 'opt-' : ''}${event.id}`}
                className={`bg-white rounded-lg shadow-md p-4 mb-3 transition-all hover:shadow-lg ${
                  optimized ? 'border-l-4 border-green-500' : ''
                }`}
              >
                <h3 className="font-semibold text-gray-800 text-lg">{event.name}</h3>
                <div className="flex flex-col sm:flex-row sm:justify-between mt-2 text-sm">
                  <div className="text-gray-600">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {formatTime(event.start_time)}
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1 sm:mt-0">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formatTime(event.end_time)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;
