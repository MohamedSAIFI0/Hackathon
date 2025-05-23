import cv2
import numpy as np
import os
import time
import logging
import torch
from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1
import mysql.connector
import io

logger = logging.getLogger(__name__)

class FaceRecognizer:
    def __init__(self, students_dir='students_database', threshold=0.8, device=None):
        """
        Initialize face recognizer with FaceNet and MTCNN
        
        Args:
            students_dir (str): Directory containing student face images
            threshold (float): Recognition threshold (higher is stricter)
            device (str): Device to use ('cpu' or 'cuda')
        """
        logger.info("Initializing face recognition system...")
        
        # Set device (GPU if available, otherwise CPU)
        self.device = device if device else ('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")
        
        # Initialize MTCNN for face detection
        self.detector = MTCNN(
            image_size=160, margin=0, min_face_size=20,
            thresholds=[0.6, 0.7, 0.7], factor=0.709, post_process=True,
            device=self.device
        )
        
        # Initialize FaceNet model for face recognition
        self.recognizer = InceptionResnetV1(pretrained='vggface2').eval().to(self.device)
        
        # Configuration
        self.students_dir = students_dir
        self.threshold = threshold
        
        # Storage for known faces
        self.known_face_encodings = []
        self.known_face_names = []
        
        # Performance tracking
        self.fps = 0
        self.frame_times = []
        self.last_fps_update = time.time()
        
        # Load known faces
        self.load_known_faces()
        
        logger.info("Face recognition system initialized")

    def load_known_faces(self):
        """Load known faces from the MySQL database"""
        try:
            conn = mysql.connector.connect(
                host='localhost',
                user='root',  
                password='',  
                database='academguard'
            )
            cursor = conn.cursor()
            cursor.execute("SELECT Nom, Prenom, Photo FROM etudiant WHERE Photo IS NOT NULL")
            rows = cursor.fetchall()
            logger.info(f"Loading known faces from MySQL: {len(rows)} found")
            for nom, prenom, photo_blob in rows:
                name = f"{prenom} {nom}".title()
                try:
                    img = Image.open(io.BytesIO(photo_blob))
                    face = self.detector(img)
                    if face is not None:
                        with torch.no_grad():
                            face_encoding = self.recognizer(face.unsqueeze(0).to(self.device))
                        self.known_face_encodings.append(face_encoding.cpu())
                        self.known_face_names.append(name)
                        logger.info(f"Loaded face: {name}")
                    else:
                        logger.warning(f"No face detected for {name}")
                except Exception as e:
                    logger.error(f"Error processing {name}: {e}")
            cursor.close()
            conn.close()
        except Exception as e:
            logger.error(f"Error connecting to MySQL: {e}")

    def recognize_face(self, frame, camera_id=None):
        """
        Perform face recognition on a frame
        
        Args:
            frame: Input frame from camera
            camera_id: Optional camera identifier for display
        
        Returns:
            Processed frame with recognition results
        """
        start_time = time.time()

        # Convert frame for MTCNN
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb_frame)

        try:
            # Detect faces
            boxes, _ = self.detector.detect(pil_img)
            
            if boxes is not None:
                for box in boxes:
                    # Get face coordinates
                    x1, y1, x2, y2 = [int(b) for b in box]
                    
                    # Extract face
                    face_img = pil_img.crop((x1, y1, x2, y2))
                    face = self.detector(face_img)
                    
                    if face is not None:
                        # Get face encoding and compare
                        with torch.no_grad():
                            face_encoding = self.recognizer(face.unsqueeze(0).to(self.device))
                        
                        # Compare with known faces
                        max_similarity = 0
                        best_match = None
                        
                        for i, known_encoding in enumerate(self.known_face_encodings):
                            # Calculate cosine similarity
                            similarity = torch.cosine_similarity(
                                face_encoding, known_encoding, dim=1
                            ).item()
                            
                            if similarity > max_similarity:
                                max_similarity = similarity
                                best_match = self.known_face_names[i]
                        
                        # Draw results
                        if max_similarity > self.threshold:
                            # Known face - green box
                            color = (0, 255, 0)
                            label = f"{best_match} ({max_similarity:.2f})"
                            logger.info(f"Recognized: {best_match} ({max_similarity:.2f})")
                        else:
                            # Unknown face - red box
                            color = (0, 0, 255)
                            label = f"Unknown ({max_similarity:.2f})"
                          # Draw rectangle and label
                        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                        cv2.putText(frame, label, (x1, y1-10), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
                        
                        # Eye detection
                        face_roi = frame[y1:y2, x1:x2]
                        gray_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
                        
                        # Use Haar cascade classifier for eye detection
                        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
                        eyes = eye_cascade.detectMultiScale(gray_roi, 1.1, 3)
                        
                        # Track and draw rectangles around eyes
                        for (ex, ey, ew, eh) in eyes:
                            # Draw rectangle around each eye
                            cv2.rectangle(face_roi, (ex, ey), (ex + ew, ey + eh), (255, 0, 0), 2)
                            
                            # Get center of eye for tracking
                            eye_center_x = x1 + ex + ew // 2
                            eye_center_y = y1 + ey + eh // 2
                            
                            # Mark eye center
                            cv2.circle(frame, (eye_center_x, eye_center_y), 2, (0, 255, 255), -1)

        except Exception as e:
            logger.error(f"Error during recognition: {e}")

        

        

        return frame