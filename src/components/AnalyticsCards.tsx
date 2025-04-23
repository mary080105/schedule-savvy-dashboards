
import { Analytics } from "@/utils/schedulingAlgorithms";
import { formatHour } from "@/utils/dateUtils";

interface AnalyticsCardsProps {
  analytics: Analytics;
}

const AnalyticsCards = ({ analytics }: AnalyticsCardsProps) => {
  return (
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
  );
};

export default AnalyticsCards;
