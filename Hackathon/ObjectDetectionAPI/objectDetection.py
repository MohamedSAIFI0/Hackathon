import cv2
import numpy as np
import logging
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import os
import urllib.request

logger = logging.getLogger(__name__)

class ObjectDetector:
    def __init__(self, model_path='efficientdet_lite0.tflite', score_threshold=0.5, max_results=5, exclude_categories=None):
        """
        Initialize object detector with MediaPipe
        
        Args:
            model_path (str): Path to the detection model
            score_threshold (float): Minimum confidence threshold for detections
            max_results (int): Maximum number of detection results
            exclude_categories (list): List of category names to exclude from detection results
        """
        logger.info("Initializing object detection system...")
        
        # Configuration
        self.model_path = model_path
        self.score_threshold = score_threshold
        self.max_results = max_results
        self.exclude_categories = exclude_categories or []
        
        # Convert exclude_categories to lowercase for case-insensitive comparison
        self.exclude_categories = [cat.lower() for cat in self.exclude_categories]
        
        logger.info(f"Excluding categories: {self.exclude_categories}")
        
        # Check if model exists and download if needed
        self.download_model()
        
        # Initialize MediaPipe object detector
        base_options = python.BaseOptions(model_asset_path=self.model_path)
        options = vision.ObjectDetectorOptions(
            base_options=base_options,
            score_threshold=self.score_threshold,
            max_results=self.max_results
        )
        self.detector = vision.ObjectDetector.create_from_options(options)
        
        # To store last detections for the web interface
        self.last_detections = []
        
        logger.info("Object detection system initialized")

    def detect_objects(self, frame):
        """
        Perform object detection on a frame
        
        Args:
            frame: Input frame from camera
        
        Returns:
            Processed frame with detection results
        """
        # Clear previous detections
        self.last_detections = []

        # Convert the frame to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Create MediaPipe image
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        
        try:
            # Detect objects
            detection_result = self.detector.detect(mp_image)
            
            # Process and draw results
            for detection in detection_result.detections:
                # Get bounding box
                bbox = detection.bounding_box
                x1 = bbox.origin_x
                y1 = bbox.origin_y
                x2 = x1 + bbox.width
                y2 = y1 + bbox.height
                
                # Get category
                category = detection.categories[0]
                category_name = category.category_name
                score = category.score
                
                # Exclude specified categories
                if category_name.lower() in self.exclude_categories:
                    continue
                
                # Store detection info
                self.last_detections.append({
                    "category": category_name,
                    "score": score,
                    "bbox": [x1, y1, x2, y2]
                })
                
                # Draw bounding box and label
                color = (0, 255, 0)  # Green
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                
                # Format and display label
                label = f"{category_name} ({score:.2f})"
                cv2.putText(frame, label, (x1, y1-10), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
                
                logger.debug(f"Detected: {category_name} ({score:.2f})")

        except Exception as e:
            logger.error(f"Error during detection: {e}")

        # Add header info
        cv2.putText(frame, "Object Detection", (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

        return frame
    
    def download_model(self):
        """
        Download the model if it doesn't exist locally
        """
        if not os.path.exists(self.model_path):
            logger.info(f"Downloading model to {self.model_path}...")
            model_url = "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite"
            urllib.request.urlretrieve(model_url, self.model_path)
            logger.info("Model downloaded successfully")
        else:
            logger.info(f"Model already exists at {self.model_path}")