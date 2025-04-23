
# Event Scheduling Analytics Application

A clean, interactive event scheduling and analytics web application using Flask for the backend and Tailwind CSS + vanilla JavaScript for the frontend. The app supports multiple independent event schedules via route parameters.

## Features

- **Multiple Schedule Management:** Create and switch between different event schedules via route parameters
- **Event Creation:** Add events with name, start time, and end time
- **Greedy Scheduling Algorithm:** Automatically select non-overlapping events for optimal schedule
- **Analytics Dashboard:** View key metrics for each schedule
- **Data Visualizations:** View charts of event durations, start times, and name frequencies
- **Responsive Design:** Optimized for both mobile and desktop views

## Technical Stack

- **Backend:** Flask (Python)
- **Frontend:** Tailwind CSS + Vanilla JavaScript
- **Visualizations:** Matplotlib (Python)
- **Styling:** Responsive design with Tailwind CSS

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:
   ```
   python app.py
   ```

## Usage

1. Access the application at `http://127.0.0.1:5000`
2. Create a new schedule or select an existing one
3. Add events to your schedule
4. View analytics and visualizations on the dashboard

## API Endpoints

- `GET /api/schedules` - Get all schedules
- `GET /api/events/<schedule_name>` - Get all events for a schedule
- `POST /api/events/<schedule_name>` - Add an event to a schedule
- `GET /api/analytics/<schedule_name>` - Get analytics for a schedule
- `GET /api/optimized/<schedule_name>` - Get optimized (non-overlapping) events
- `GET /api/visualizations/<schedule_name>` - Get data visualizations for a schedule

## Deployment

The application can be deployed on any platform that supports Python applications:

1. Set up dependencies with `pip install -r requirements.txt`
2. Use the provided Procfile for platforms like Heroku
3. Configure environment variables as needed

## License

MIT License
