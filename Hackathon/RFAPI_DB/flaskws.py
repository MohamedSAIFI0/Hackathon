import base64
import cv2
import numpy as np
import socketio
import eventlet
from flask import Flask
from face_recognizer import FaceRecognizer

sio = socketio.Server(cors_allowed_origins="*")
app = Flask(__name__)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# Load face recognition system once
recognizer = FaceRecognizer(students_dir="students_database", threshold=0.7)

# Global variables for cheating detection
class ExamMonitoring:
    def __init__(self):
        self.total_frames = 0
        self.last_detailed_check = 0
        self.is_cheating = False
        self.cheating_history = []  # Store history of potential cheating events
        self.consecutive_not_looking_frames = 0

# Initialize the exam monitoring instance
exam_monitor = ExamMonitoring()

@sio.on('connect')
def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.on('frame')
def handle_frame(sid, data):
    global exam_monitor
    
    # Increment the total frames counter
    exam_monitor.total_frames += 1
    
    # Determine if this frame should be processed in detail
    # Process every frame for first 30 frames, then every 3rd frame
    detailed_check = (exam_monitor.total_frames < 30 or 
                      exam_monitor.total_frames % 3 == 0)
    
    # Parse the image data
    img_data = data["image"].split(',')[1]
    img_bytes = base64.b64decode(img_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    # Process frame using face recognizer
    if detailed_check:
        frame_with_faces = recognizer.recognize_face(frame)
        names = recognizer.known_face_names
        exam_monitor.last_detailed_check = exam_monitor.total_frames
    else:
        # For non-detailed checks, just show the frame without recognition
        frame_with_faces = frame.copy()
        names = []# Get eye positions using Haar cascade for exam monitoring
    eye_positions = []
    looking_at_screen = False
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    
    # Initialize static variable for consecutive frame tracking if not already present
    if not hasattr(handle_frame, "looking_at_screen_count"):
        handle_frame.looking_at_screen_count = 0
    
    # Detect faces with more relaxed parameters for exam monitoring scenario
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)  # More relaxed parameters
    
    # Define a threshold for determining if looking at screen
    frame_height, frame_width = frame.shape[:2]
    center_x = frame_width // 2
    center_y = frame_height // 2
    
    # Face detected flag
    face_detected = len(faces) > 0
    eyes_detected = False
    
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        
        # Use more relaxed parameters for eye detection during exams
        eyes = eye_cascade.detectMultiScale(roi_gray, 1.1, 2, minSize=(20, 20))
        
        # If we found any eyes
        if len(eyes) > 0:
            eyes_detected = True
            
            # Calculate face center
            face_center_x = x + w // 2
            face_center_y = y + h // 2
            
            # An array to store eye centers for gaze analysis
            eye_centers = []
            
            # Store eye positions for visualization
            for (ex, ey, ew, eh) in eyes:
                eye_center_x = x + ex + ew // 2
                eye_center_y = y + ey + eh // 2
                
                eye_positions.append({
                    "x": int(eye_center_x),
                    "y": int(eye_center_y)
                })
                
                eye_centers.append((eye_center_x, eye_center_y))
            
            # For exam monitoring - we're more interested in detecting if the person is looking away
            # from the screen (like looking at someone else's paper) rather than exact gaze direction
            if len(eye_centers) >= 2:
                # Sort eye centers by x-coordinate (left to right)
                eye_centers.sort(key=lambda e: e[0])
                
                # Calculate eye alignment
                left_eye, right_eye = eye_centers[0], eye_centers[1]
                
                # Calculate horizontal distance between eyes
                eye_distance = right_eye[0] - left_eye[0]
                
                # Calculate vertical difference and slope
                eye_vertical_diff = abs(right_eye[1] - left_eye[1])
                eye_slope = eye_vertical_diff / (eye_distance + 0.01)
                
                # Check face rotation - if both eyes are visible and roughly level
                # then the person is likely looking at the screen
                
                # Relaxed slope threshold for natural head positions when viewing screen
                slope_threshold = 0.4  # Increased from 0.2 to allow more natural head positions
                
                # Face size check - make sure face is visible enough (but not too strict)
                face_size_ratio = (w * h) / (frame_width * frame_height)
                min_face_ratio = 0.01  # Reduced for more flexibility
                
                # Conditions for looking at screen (relaxed for exam scenario)
                face_centered = (x > frame_width * 0.1 and x + w < frame_width * 0.9)
                reasonable_eye_distance = (eye_distance > 10)  # Minimum eye separation
                
                if (eye_slope < slope_threshold and  
                    face_size_ratio > min_face_ratio and 
                    face_centered and
                    reasonable_eye_distance):
                    
                    # Increment counter for stable detection
                    handle_frame.looking_at_screen_count += 1
                    if handle_frame.looking_at_screen_count >= 2:  # Require 2 consecutive positive frames
                        looking_at_screen = True
                else:
                    # Decrease counter but don't go below 0
                    handle_frame.looking_at_screen_count = max(0, handle_frame.looking_at_screen_count - 1)
                    if handle_frame.looking_at_screen_count < 2:
                        looking_at_screen = False
            
            # Special case: if only one eye is visible but face is centered,
            # person might still be looking at screen (e.g., with head slightly tilted)
            elif len(eye_centers) == 1 and face_center_x > frame_width * 0.25 and face_center_x < frame_width * 0.75:
                looking_at_screen = True
    
    # If no eyes detected at all in any face, reset the counter
    if not eyes_detected:
        handle_frame.looking_at_screen_count = max(0, handle_frame.looking_at_screen_count - 2)
      # If no face detected, definitely not looking at screen
    if not face_detected:
        looking_at_screen = False
        handle_frame.looking_at_screen_count = 0
        
    # Update cheating detection variables only on detailed checks
    if detailed_check:
        if not looking_at_screen:
            exam_monitor.consecutive_not_looking_frames += 1
            # If not looking at screen for more than 5 consecutive detailed checks
            if exam_monitor.consecutive_not_looking_frames > 5:
                exam_monitor.is_cheating = True
                # Record the cheating event if it's a new one
                if not exam_monitor.cheating_history or exam_monitor.cheating_history[-1][1] != exam_monitor.total_frames - 1:
                    exam_monitor.cheating_history.append((exam_monitor.total_frames, exam_monitor.total_frames))
                else:
                    # Update the end time of the current cheating event
                    exam_monitor.cheating_history[-1] = (exam_monitor.cheating_history[-1][0], exam_monitor.total_frames)
        else:
            # Reset consecutive frame counter if looking at screen
            exam_monitor.consecutive_not_looking_frames = max(0, exam_monitor.consecutive_not_looking_frames - 2)
              # If we've had enough consecutive "looking at screen" frames, mark as not cheating
            if exam_monitor.consecutive_not_looking_frames <= 1:
                exam_monitor.is_cheating = False
    
    # Encode frame to send back
    _, buffer = cv2.imencode('.jpg', frame_with_faces)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
      # Create the simplified response object with only necessary data
    response = {
        "image": "data:image/jpeg;base64," + jpg_as_text,
        "names": names,
        "is_cheating": exam_monitor.is_cheating  # Simple true/false flag
    }
    
    # Send the response
    sio.emit("response", response, to=sid)

@sio.on('disconnect')
def disconnect(sid):
    print(f"Client disconnected: {sid}")

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
