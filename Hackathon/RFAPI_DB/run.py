#!/usr/bin/env python
"""
Run script for the Face Recognition Exam Monitoring System
"""
import os
import subprocess
import webbrowser
import time

def main():
    print("Starting Face Recognition Exam Monitoring System...")
    
    # Start the Flask WebSocket server in the background
    flask_process = subprocess.Popen(
        ["python", "flaskws.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for server to start
    time.sleep(2)
    
    # Open the client web page
    url = "http://localhost:5000/testws.html"
    print(f"Opening web client at: {url}")
    webbrowser.open(url)
    
    try:
        print("Server running. Press Ctrl+C to stop.")
        # Keep script running until interrupted
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping server...")
        flask_process.terminate()
        flask_process.wait()
        print("Server stopped.")

if __name__ == "__main__":
    main()
