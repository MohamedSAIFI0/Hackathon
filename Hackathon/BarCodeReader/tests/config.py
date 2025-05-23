import os

# Test configuration
TEST_IMAGE_DIR = os.path.join(os.path.dirname(__file__), 'test_images')
SAMPLE_IMAGE_PATH = os.path.join(TEST_IMAGE_DIR, 'sample.jpg')

# Create test directories if they don't exist
os.makedirs(TEST_IMAGE_DIR, exist_ok=True)