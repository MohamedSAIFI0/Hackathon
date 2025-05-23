import unittest
import numpy as np
import cv2
import base64
from scan import DocScanner

class TestDocScanner(unittest.TestCase):
    def setUp(self):
        """Initialize the DocScanner for each test"""
        self.scanner = DocScanner()
        
        # Create a simple test image
        self.test_image = np.zeros((500, 500, 3), dtype=np.uint8)
        cv2.rectangle(self.test_image, (100, 100), (400, 400), (255, 255, 255), 2)

    def test_filter_corners(self):
        """Test corner filtering functionality"""
        corners = [(0, 0), (0, 5), (100, 100), (105, 105)]
        filtered = self.scanner.filter_corners(corners, min_dist=10)
        self.assertEqual(len(filtered), 2)
        self.assertIn((0, 0), filtered)
        self.assertIn((100, 100), filtered)

    def test_angle_between_vectors_degrees(self):
        """Test angle calculation between vectors"""
        u = np.array([1, 0])
        v = np.array([0, 1])
        angle = self.scanner.angle_between_vectors_degrees(u, v)
        self.assertAlmostEqual(angle, 90.0)

    def test_is_valid_contour(self):
        """Test contour validation"""
        # Create a valid rectangular contour
        contour = np.array([[[0, 0]], [[0, 100]], [[100, 100]], [[100, 0]]])
        valid = self.scanner.is_valid_contour(contour, 200, 200)
        self.assertTrue(valid)

    def test_base64_conversion(self):
        """Test base64 encoding/decoding"""
        # Convert test image to base64
        encoded = self.scanner.image_to_base64(self.test_image)
        self.assertTrue(isinstance(encoded, str))
        
        # Convert back to image
        decoded = self.scanner.base64_to_image(encoded)
        self.assertEqual(decoded.shape, self.test_image.shape)

    def test_scan_with_invalid_input(self):
        """Test scanning with invalid input"""
        with self.assertRaises(AssertionError):
            self.scanner.scan(None)

if __name__ == '__main__':
    unittest.main()