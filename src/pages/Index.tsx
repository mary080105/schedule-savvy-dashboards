
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [schedules, setSchedules] = useState<string[]>([]);
  const [newScheduleName, setNewScheduleName] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    // This would normally fetch from our Flask backend
    // For demo purposes, we'll use localStorage to persist schedules
    const savedSchedules = localStorage.getItem("schedules");
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    } else {
      // Initialize with some sample schedules
      const initialSchedules = ["Conference 2025", "Team Meeting"];
      localStorage.setItem("schedules", JSON.stringify(initialSchedules));
      setSchedules(initialSchedules);
    }
  }, []);

  const createNewSchedule = () => {
    if (!newScheduleName.trim()) {
      displayToast("Please enter a schedule name", "error");
      return;
    }

    if (schedules.includes(newScheduleName)) {
      displayToast("Schedule already exists", "error");
      return;
    }

    const updatedSchedules = [...schedules, newScheduleName];
    setSchedules(updatedSchedules);
    localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
    setNewScheduleName("");
    displayToast(`Schedule '${newScheduleName}' created`, "success");
  };

  const displayToast = (message: string, type: "success" | "error" | "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">
                  EventScheduleSavvy
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Optimize Your Event Scheduling
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl">
              Create multiple schedules, analyze event patterns, and optimize your time with our powerful scheduling algorithm.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get Started</h2>
          
          {/* Schedule Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="schedule-select" className="block text-sm font-medium text-gray-700 mb-2">Select Existing Schedule</label>
              <select 
                id="schedule-select" 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
              >
                <option value="">Select a schedule</option>
                {schedules.map((schedule) => (
                  <option key={schedule} value={schedule}>{schedule}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="new-schedule-name" className="block text-sm font-medium text-gray-700 mb-2">Or Create New Schedule</label>
              <div className="flex">
                <input 
                  type="text" 
                  id="new-schedule-name" 
                  className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="Conference 2025"
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                />
                <button 
                  onClick={createNewSchedule}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link 
              to={selectedSchedule ? `/dashboard/${selectedSchedule}` : "#"}
              onClick={(e) => {
                if (!selectedSchedule) {
                  e.preventDefault();
                  displayToast("Please select or create a schedule first", "error");
                }
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Multiple Schedules</h3>
              <p className="text-gray-600">
                Create and manage multiple independent schedules for different events, teams, or purposes.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Gain insights from your scheduling patterns with visualizations and key performance indicators.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Greedy Optimization</h3>
              <p className="text-gray-600">
                Automatically find the optimal non-overlapping event selection for maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
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

export default Index;
