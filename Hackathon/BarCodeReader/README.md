# Document Scanner

A Python-based document scanner application that automatically detects, captures, and enhances documents from images. The application uses computer vision techniques to identify document boundaries and applies perspective transformation to create a top-down view of the scanned document.

## Features

- Automatic document boundary detection
- Perspective correction
- Image enhancement
  - Grayscale conversion
  - Sharpening
  - Adaptive thresholding
- RESTful API endpoint for document scanning
- Base64 image support for easy integration

## Requirements

- Python 3.x
- Flask 3.1.0
- OpenCV (cv2) 4.11.0
- NumPy 2.2.4
- SciPy 1.15.2
- Pillow 11.2.1
- pylsd 0.0.2

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ZRouissiya/DocumentScanner.git
cd DocumentScanner
```

2. Create a virtual environment (optional but recommended):

```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### As a REST API

1. Start the Flask server:

```bash
python app.py
```

2. Send a POST request to `/document` endpoint with a JSON payload containing the base64-encoded image:

```bash
curl -X POST http://localhost:5000/document \
     -H "Content-Type: application/json" \
     -d '{"base64": "your_base64_encoded_image"}'
```

### As a Python Module

```python
from scan import DocScanner

# Initialize the scanner
scanner = DocScanner(MIN_QUAD_AREA_RATIO=0.25, MAX_QUAD_ANGLE_RANGE=40)

# Convert your image to base64 if needed
base64_image = scanner.image_to_base64(your_image)

# Scan the document
result = scanner.scan(base64_image)
```

## Configuration

The `DocScanner` class accepts two optional parameters:

- `MIN_QUAD_AREA_RATIO` (default: 0.25): Minimum area ratio threshold for detected quadrilaterals
- `MAX_QUAD_ANGLE_RANGE` (default: 40): Maximum allowed range between interior angles of the detected quadrilateral

## How It Works

1. **Image Preprocessing**

   - Resizes the image while maintaining aspect ratio
   - Converts to grayscale
   - Applies Gaussian blur for noise reduction

2. **Document Detection**

   - Uses the Line Segment Detector (LSD) algorithm to find line segments
   - Groups lines into horizontal and vertical components
   - Identifies document corners through line intersections
   - Validates potential document quadrilaterals

3. **Perspective Transformation**

   - Applies four-point perspective transformation
   - Creates a top-down view of the document

4. **Image Enhancement**
   - Sharpens the image
   - Applies adaptive thresholding for better text contrast

## API Reference

### POST /document

Accepts a JSON payload with a base64-encoded image and returns the processed document image in base64 format.

**Request Body:**

```json
{
  "base64": "base64_encoded_image_string"
}
```

**Response:**

- `200 OK`: Returns base64-encoded processed image
- Error responses for invalid inputs or processing failures



## License

This project is licensed under the MIT License - see the LICENSE file for details.
