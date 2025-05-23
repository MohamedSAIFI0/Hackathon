# Object Detection WebSocket API

This is a simplified real-time object detection system using MediaPipe and WebSockets. The application allows for real-time object detection from a webcam feed through a web interface.

## Key Features

- Real-time object detection using MediaPipe
- WebSocket-based streaming for low latency
- Web interface for visualization
- Ability to exclude specific object categories (e.g., person, car)
- Automatic model downloading

## Required Files

- `objectDetection.py` - The core object detection implementation
- `flaskws.py` - Flask WebSocket server
- `testws.html` - Web client interface

## Requirements

- Python 3.8+
- Web browser with WebRTC support

### Installation

1. Create and activate a virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
```

2. Install required packages:

```bash
pip install -r requirements.txt
```

## Project Structure

```
ObjectDetectionAPI/
├── objectDetection.py    # Core object detection implementation
├── flaskws.py            # Flask WebSocket server
├── testws.html           # Web client interface
├── run_server.py         # Script to run the server
├── requirements.txt      # Project dependencies
└── efficientdet_lite0.tflite  # ML model (downloaded automatically)
```

## Usage

### Running the Application

Start the WebSocket server:

```bash
python run_server.py
```

Then open a web browser and navigate to:

```
http://localhost:5000
```

Alternatively, you can use the `testws.html` file directly by opening it in a browser (make sure the server is running first).

### Web Interface

1. Click "Start Camera" to activate your webcam
2. Use the checkboxes to exclude specific object categories (like "person" or "car")
3. Click "Update Filters" to apply your exclusion settings
4. View the processed video stream with detection results
5. The detected objects will be listed with their confidence scores

## API Structure

The system is built with a clean separation of concerns:

- **Object Detector**: Handles all ML-related detection using MediaPipe
- **WebSocket Server**: Handles communication between client and detection system
- **Web Client**: Provides user interface and camera access

## System Architecture

- **RTSPCamera**: Handles camera stream capture and frame queuing
- **FaceProcessorThread**: Processes frames for face detection/recognition
- **DisplayThread**: Manages the display of processed frames
- **MultiCameraSystem**: Coordinates all components

## Performance Considerations

- GPU acceleration is automatically used when available
- Frame skipping is implemented to prevent queue overflow
- Configurable recognition threshold for accuracy/speed trade-off
- Multi-threading for optimal resource utilization

## Error Handling

The system includes:

- Automatic camera reconnection
- Queue management to prevent memory issues
- Graceful shutdown on errors
- Comprehensive logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Support

For issues and feature requests, please use the GitHub issue tracker.

## Acknowledgments

- FaceNet for face recognition
- MTCNN for face detection
- OpenCV for image processing
- PyTorch for deep learning framework
