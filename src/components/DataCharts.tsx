
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Event } from '@/utils/schedulingAlgorithms';
import { calculateDuration } from '@/utils/dateUtils';

interface DataChartsProps {
  events: Event[];
}

// Color schemes
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

const DataCharts = ({ events }: DataChartsProps) => {
  const [durationData, setDurationData] = useState<any[]>([]);
  const [hourData, setHourData] = useState<any[]>([]);
  const [nameData, setNameData] = useState<any[]>([]);

  useEffect(() => {
    if (events.length) {
      generateDurationChart();
      generateHourChart();
      generateNameChart();
    }
  }, [events]);

  const generateDurationChart = () => {
    // Create duration buckets
    const durations = events.map(event => ({
      name: event.name,
      duration: calculateDuration(event.start_time, event.end_time)
    }));

    // Group into ranges
    const durationRanges: { [key: string]: number } = {
      "0-30 min": 0,
      "30-60 min": 0,
      "1-2 hours": 0,
      "2-4 hours": 0,
      "4+ hours": 0
    };

    durations.forEach(item => {
      if (item.duration <= 30) durationRanges["0-30 min"]++;
      else if (item.duration <= 60) durationRanges["30-60 min"]++;
      else if (item.duration <= 120) durationRanges["1-2 hours"]++;
      else if (item.duration <= 240) durationRanges["2-4 hours"]++;
      else durationRanges["4+ hours"]++;
    });

    const chartData = Object.entries(durationRanges).map(([range, count]) => ({
      range,
      count
    }));

    setDurationData(chartData);
  };

  const generateHourChart = () => {
    // Calculate start hours
    const hours: { [key: number]: number } = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hours[i] = 0;
    }
    
    events.forEach(event => {
      const hour = new Date(event.start_time).getHours();
      hours[hour]++;
    });
    
    const chartData = Object.entries(hours).map(([hour, count]) => ({
      hour: Number(hour),
      count,
      label: `${Number(hour) % 12 === 0 ? 12 : Number(hour) % 12}${Number(hour) < 12 ? 'am' : 'pm'}`
    }));
    
    setHourData(chartData);
  };

  const generateNameChart = () => {
    // Count event names
    const names: { [key: string]: number } = {};
    
    events.forEach(event => {
      names[event.name] = (names[event.name] || 0) + 1;
    });
    
    // Get top 5 event names
    const sortedNames = Object.entries(names)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    // Add "Others" category if needed
    const otherCount = events.length - sortedNames.reduce((sum, [_, count]) => sum + count, 0);
    
    const chartData = sortedNames.map(([name, count]) => ({
      name,
      value: count
    }));
    
    if (otherCount > 0) {
      chartData.push({
        name: 'Others',
        value: otherCount
      });
    }
    
    setNameData(chartData);
  };

  if (!events.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available for charts</p>
        </div>
        <div className="bg-white shadow rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available for charts</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Duration Histogram */}
        <div className="bg-white shadow rounded-lg transition-transform hover:transform hover:scale-105">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Event Durations</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={durationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Start Time Bar Chart */}
        <div className="bg-white shadow rounded-lg transition-transform hover:transform hover:scale-105">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Events by Start Hour</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Name Pie Chart */}
        <div className="bg-white shadow rounded-lg transition-transform hover:transform hover:scale-105">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Event Names</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nameData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {nameData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataCharts;
