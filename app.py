
from flask import Flask, render_template, request, jsonify, abort
from flask_cors import CORS
import json
import datetime
import os
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import numpy as np
from collections import Counter

# Create Flask app
app = Flask(__name__)
CORS(app)

# Data storage - In a production app, this would be a database
SCHEDULES = {}

# Helper functions for date handling
def parse_time(time_str):
    return datetime.datetime.strptime(time_str, "%Y-%m-%dT%H:%M")

def format_time(dt):
    return dt.strftime("%Y-%m-%d %H:%M")

# Greedy scheduling algorithm
def greedy_schedule(events):
    if not events:
        return []
        
    # Sort events by end time
    sorted_events = sorted(events, key=lambda x: parse_time(x["end_time"]))
    
    result = [sorted_events[0]]
    last_end_time = parse_time(sorted_events[0]["end_time"])
    
    for event in sorted_events[1:]:
        start_time = parse_time(event["start_time"])
        if start_time >= last_end_time:
            result.append(event)
            last_end_time = parse_time(event["end_time"])
            
    return result

# Analytics functions
def calculate_analytics(events):
    if not events:
        return {
            "total_events": 0,
            "avg_duration_minutes": 0,
            "peak_start_hour": None,
            "optimized_events": 0
        }
    
    # Calculate durations
    durations = []
    start_hours = []
    
    for event in events:
        start_time = parse_time(event["start_time"])
        end_time = parse_time(event["end_time"])
        duration = (end_time - start_time).total_seconds() / 60  # in minutes
        durations.append(duration)
        start_hours.append(start_time.hour)
    
    # Calculate peak start hour
    hour_counts = Counter(start_hours)
    peak_hour = max(hour_counts.items(), key=lambda x: x[1])[0] if hour_counts else None
    
    # Calculate optimized events count
    optimized_events = len(greedy_schedule(events))
    
    return {
        "total_events": len(events),
        "avg_duration_minutes": round(sum(durations) / len(durations), 1) if durations else 0,
        "peak_start_hour": peak_hour,
        "optimized_events": optimized_events
    }

# Generate visualizations
def generate_duration_histogram(events):
    if not events:
        fig, ax = plt.subplots(figsize=(6, 4))
        ax.text(0.5, 0.5, 'No events available', ha='center', va='center')
        plt.close()
        return None
    
    durations = []
    for event in events:
        start_time = parse_time(event["start_time"])
        end_time = parse_time(event["end_time"])
        duration = (end_time - start_time).total_seconds() / 60  # in minutes
        durations.append(duration)
    
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.hist(durations, bins=10, color='#3b82f6', alpha=0.7, edgecolor='black')
    ax.set_xlabel('Duration (minutes)')
    ax.set_ylabel('Frequency')
    ax.set_title('Event Duration Distribution')
    plt.tight_layout()
    
    # Save plot to a bytes buffer
    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=100)
    plt.close(fig)
    buf.seek(0)
    
    # Encode the buffer to base64
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return img_base64

def generate_start_time_barchart(events):
    if not events:
        fig, ax = plt.subplots(figsize=(6, 4))
        ax.text(0.5, 0.5, 'No events available', ha='center', va='center')
        plt.close()
        return None
    
    start_hours = []
    for event in events:
        start_time = parse_time(event["start_time"])
        start_hours.append(start_time.hour)
    
    hour_counts = Counter(start_hours)
    hours = list(range(24))
    counts = [hour_counts.get(hour, 0) for hour in hours]
    
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(hours, counts, color='#10b981', alpha=0.7)
    ax.set_xlabel('Hour of Day')
    ax.set_ylabel('Number of Events')
    ax.set_title('Events by Start Hour')
    ax.set_xticks(range(0, 24, 2))
    plt.tight_layout()
    
    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=100)
    plt.close(fig)
    buf.seek(0)
    
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return img_base64

def generate_event_name_piechart(events):
    if not events:
        fig, ax = plt.subplots(figsize=(6, 4))
        ax.text(0.5, 0.5, 'No events available', ha='center', va='center')
        plt.close()
        return None
    
    event_names = [event["name"] for event in events]
    name_counts = Counter(event_names)
    
    # If there are too many unique events, just take the top 5
    if len(name_counts) > 5:
        top_names = dict(name_counts.most_common(5))
        other_count = sum(count for name, count in name_counts.items() if name not in top_names)
        if other_count > 0:
            top_names['Others'] = other_count
        name_counts = top_names
    
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.pie(name_counts.values(), labels=name_counts.keys(), autopct='%1.1f%%',
           shadow=False, startangle=90, colors=plt.cm.tab10.colors)
    ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
    ax.set_title('Event Name Distribution')
    plt.tight_layout()
    
    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=100)
    plt.close(fig)
    buf.seek(0)
    
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return img_base64

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard/<schedule_name>')
def dashboard(schedule_name):
    if schedule_name not in SCHEDULES:
        SCHEDULES[schedule_name] = []  # Initialize if not exists
    return render_template('dashboard.html', schedule_name=schedule_name)

# API Routes
@app.route('/api/schedules', methods=['GET'])
def get_schedules():
    return jsonify(list(SCHEDULES.keys()))

@app.route('/api/events/<schedule_name>', methods=['GET'])
def get_events(schedule_name):
    if schedule_name not in SCHEDULES:
        SCHEDULES[schedule_name] = []  # Initialize if not exists
    return jsonify(SCHEDULES[schedule_name])

@app.route('/api/events/<schedule_name>', methods=['POST'])
def add_event(schedule_name):
    if schedule_name not in SCHEDULES:
        SCHEDULES[schedule_name] = []  # Initialize if not exists
    
    data = request.json
    if not data or not all(k in data for k in ["name", "start_time", "end_time"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        # Validate times
        start_time = parse_time(data["start_time"])
        end_time = parse_time(data["end_time"])
        
        if end_time <= start_time:
            return jsonify({"error": "End time must be after start time"}), 400
    except ValueError:
        return jsonify({"error": "Invalid time format"}), 400
    
    # Add event
    event_id = len(SCHEDULES[schedule_name]) + 1
    event = {
        "id": event_id,
        "name": data["name"],
        "start_time": data["start_time"],
        "end_time": data["end_time"]
    }
    SCHEDULES[schedule_name].append(event)
    
    return jsonify(event), 201

@app.route('/api/analytics/<schedule_name>', methods=['GET'])
def get_analytics(schedule_name):
    if schedule_name not in SCHEDULES:
        SCHEDULES[schedule_name] = []  # Initialize if not exists
    
    events = SCHEDULES[schedule_name]
    analytics = calculate_analytics(events)
    
    return jsonify(analytics)

@app.route('/api/optimized/<schedule_name>', methods=['GET'])
def get_optimized_schedule(schedule_name):
    if schedule_name not in SCHEDULES:
        SCHEDULES[schedule_name] = []  # Initialize if not exists
    
    events = SCHEDULES[schedule_name]
    optimized = greedy_schedule(events)
    
    return jsonify(optimized)

@app.route('/api/visualizations/<schedule_name>', methods=['GET'])
def get_visualizations(schedule_name):
    if schedule_name not in SCHEDULES:
        SCHEDULES[schedule_name] = []  # Initialize if not exists
    
    events = SCHEDULES[schedule_name]
    
    duration_hist = generate_duration_histogram(events)
    start_time_bar = generate_start_time_barchart(events)
    name_pie = generate_event_name_piechart(events)
    
    return jsonify({
        "duration_histogram": duration_hist,
        "start_time_barchart": start_time_bar,
        "name_piechart": name_pie
    })

if __name__ == '__main__':
    app.run(debug=True)
