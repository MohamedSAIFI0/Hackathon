import base64
import cv2
import numpy as np
import socketio
import eventlet
import logging
from flask import Flask
from objectDetection import ObjectDetector

# Set up logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ObjectDetectionWebSocket")

sio = socketio.Server(cors_allowed_origins="*")
app = Flask(__name__)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# Initialize object detector
detector = ObjectDetector(
    model_path='efficientdet_lite0.tflite',
    score_threshold=0.5,
    max_results=5,
    exclude_categories=None  # Will be updated based on client request
)

@sio.on('connect')
def connect(sid, environ):
    logger.info(f"Client connected: {sid}")

@sio.on('config')
def handle_config(sid, data):
    exclude_list = data.get("exclude_categories", [])
    if exclude_list:
        # Update detector with excluded categories
        detector.exclude_categories = [cat.lower() for cat in exclude_list]
        logger.info(f"Updated excluded categories: {detector.exclude_categories}")
    
    return {"status": "success", "excluded": detector.exclude_categories}

@sio.on('frame')
def handle_frame(sid, data):
    img_data = data["image"].split(',')[1]
    img_bytes = base64.b64decode(img_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    # Process frame using object detector
    processed_frame = detector.detect_objects(frame)
    
    # Get detected objects from detector
    detected_objects = detector.last_detections
    
    # Encode frame to send back
    _, buffer = cv2.imencode('.jpg', processed_frame)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
    
    # Send processed frame and detection info back to client
    sio.emit("response", {
        "image": "data:image/jpeg;base64," + jpg_as_text, 
        "detected": detected_objects,
        "excluded": detector.exclude_categories
    }, to=sid)

@sio.on('disconnect')
def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")

# Add a route to serve a simple test client
@app.route('/')
def index():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Object Detection Demo</title>
        <script src="https://cdn.socket.io/4.4.1/socket.io.min.js"></script>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            #videoContainer { margin-bottom: 15px; }
            #controls { margin-bottom: 15px; }
            #videoElement { border: 1px solid #ccc; }
            #detectedObjects { margin-top: 10px; }
            .button {
                padding: 8px 15px;
                background: #4e73df;
                color: white;
                border: none;
                cursor: pointer;
                margin-right: 5px;
                border-radius: 3px;
            }
            .checkbox-container {
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <h1>Real-time Object Detection</h1>
        
        <div id="controls">
            <div class="checkbox-container">
                <input type="checkbox" id="excludePerson" checked>
                <label for="excludePerson">Exclude Person</label>
            </div>
            <button class="button" id="startButton">Start Camera</button>
            <button class="button" id="stopButton" disabled>Stop Camera</button>
        </div>
        
        <div id="videoContainer">
            <video id="videoElement" width="640" height="480" autoplay></video>
            <canvas id="canvasElement" width="640" height="480" style="display:none;"></canvas>
        </div>
        
        <div id="resultContainer">
            <img id="resultImage" width="640" height="480">
            <div id="detectedObjects"></div>
        </div>
        
        <script>
            const socket = io.connect(window.location.origin);
            const video = document.getElementById('videoElement');
            const canvas = document.getElementById('canvasElement');
            const context = canvas.getContext('2d');
            const resultImage = document.getElementById('resultImage');
            const detectedObjects = document.getElementById('detectedObjects');
            const startButton = document.getElementById('startButton');
            const stopButton = document.getElementById('stopButton');
            const excludePersonCheckbox = document.getElementById('excludePerson');
            
            let stream;
            let intervalId;
            
            // Socket.IO event handlers
            socket.on('connect', () => {
                console.log('Connected to server');
                updateConfig();
            });
            
            socket.on('response', (data) => {
                resultImage.src = data.image;
                
                // Display detected objects
                let html = '<p>Excluded categories: ' + 
                    (data.excluded && data.excluded.length > 0 ? data.excluded.join(', ') : 'None') + '</p>';
                
                if (data.detected && data.detected.length > 0) {
                    html += '<h4>Detected Objects:</h4><ul>';
                    data.detected.forEach(obj => {
                        html += `<li>${obj.category} (confidence: ${(obj.score * 100).toFixed(1)}%)</li>`;
                    });
                    html += '</ul>';
                } else {
                    html += '<p>No objects detected</p>';
                }
                
                detectedObjects.innerHTML = html;
            });
            
            // Update configuration based on UI settings
            function updateConfig() {
                const excludeCategories = [];
                if (excludePersonCheckbox.checked) {
                    excludeCategories.push('person');
                }
                
                socket.emit('config', {
                    exclude_categories: excludeCategories
                });
            }
            
            // Start capturing and processing frames
            function startCapturing() {
                if (!stream) return;
                
                intervalId = setInterval(() => {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.toDataURL('image/jpeg');
                    socket.emit('frame', { image: imageData });
                }, 100);  // Send 10 frames per second
            }
            
            // Button event handlers
            startButton.addEventListener('click', async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { width: 640, height: 480 } 
                    });
                    video.srcObject = stream;
                    startButton.disabled = true;
                    stopButton.disabled = false;
                    startCapturing();
                } catch (err) {
                    console.error('Error accessing camera:', err);
                    alert('Could not access the camera. Please make sure it is connected and permissions are allowed.');
                }
            });
            
            stopButton.addEventListener('click', () => {
                clearInterval(intervalId);
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    stream = null;
                }
                video.srcObject = null;
                resultImage.src = '';
                startButton.disabled = false;
                stopButton.disabled = true;
            });
            
            excludePersonCheckbox.addEventListener('change', updateConfig);
        </script>
    </body>
    </html>
    """

if __name__ == '__main__':
    print("Object Detection WebSocket Server running on port 5000")
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
