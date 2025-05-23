"""
Simple script to run the Object Detection WebSocket server
Dependencies:
- flask
- python-socketio
- eventlet
- opencv-python
- mediapipe
- numpy
"""
import os
import sys

if __name__ == "__main__":
    # Check if required files exist
    required_files = ['objectDetection.py', 'flaskws.py', 'testws.html']
    for file in required_files:
        if not os.path.exists(file):
            print(f"Error: Required file {file} not found!")
            sys.exit(1)

    model_path = 'efficientdet_lite0.tflite'
    print(f"Using model: {model_path}")
    
    # Import and run the flask application
    print("Starting Object Detection WebSocket Server...")
    print("Access the web interface at: http://localhost:5000")
    
    from flaskws import app
    import eventlet
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
