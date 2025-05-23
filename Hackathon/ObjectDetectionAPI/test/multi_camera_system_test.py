import unittest
from unittest.mock import Mock, patch
import queue
import logging
from multi_camera_system import MultiCameraSystem

class TestMultiCameraSystem(unittest.TestCase):
    def setUp(self):
        # Disable logging for tests
        logging.disable(logging.CRITICAL)
        
        # Create system instance for each test
        self.system = MultiCameraSystem()
        
        # Common mocks
        self.mock_camera = Mock()
        self.mock_processor = Mock()
        self.mock_display = Mock()

    def tearDown(self):
        # Re-enable logging
        logging.disable(logging.NOTSET)
        
        # Clean up
        if self.system.running:
            self.system.stop()

    def test_initialization_default_values(self):
        """Test default initialization values"""
        self.assertEqual(self.system.students_dir, 'students_database')
        self.assertEqual(self.system.threshold, 0.7)
        self.assertIsInstance(self.system.frame_queue, queue.Queue)
        self.assertIsInstance(self.system.result_queue, queue.Queue)
        self.assertEqual(self.system.frame_queue.maxsize, 30)
        self.assertFalse(self.system.running)
        self.assertEqual(len(self.system.camera_threads), 0)
        self.assertIsNone(self.system.processor_thread)
        self.assertIsNone(self.system.display_thread)

    def test_initialization_custom_values(self):
        """Test custom initialization values"""
        system = MultiCameraSystem(students_dir='custom_dir', threshold=0.8, queue_size=50)
        self.assertEqual(system.students_dir, 'custom_dir')
        self.assertEqual(system.threshold, 0.8)
        self.assertEqual(system.frame_queue.maxsize, 50)

    @patch('multi_camera_system.RTSPCamera')
    def test_add_camera(self, mock_rtsp):
        """Test adding cameras to the system"""
        # Test adding camera without ID
        camera_id = self.system.add_camera('rtsp://test1')
        self.assertEqual(camera_id, 0)
        self.assertEqual(len(self.system.camera_threads), 1)

        # Test adding camera with custom ID
        camera_id = self.system.add_camera('rtsp://test2', camera_id=5)
        self.assertEqual(camera_id, 5)
        self.assertEqual(len(self.system.camera_threads), 2)

        # Test adding camera with name
        camera_id = self.system.add_camera('rtsp://test3', name='TestCam')
        self.assertEqual(len(self.system.camera_threads), 3)
        mock_rtsp.assert_called_with(
            camera_id=camera_id,
            rtsp_url='rtsp://test3',
            frame_queue=self.system.frame_queue,
            name='TestCam'
        )

    def test_start_no_cameras(self):
        """Test starting system with no cameras"""
        result = self.system.start()
        self.assertFalse(result)
        self.assertFalse(self.system.running)

    @patch('multi_camera_system.RTSPCamera')
    @patch('multi_camera_system.FaceProcessorThread')
    @patch('multi_camera_system.DisplayThread')
    def test_start_system(self, mock_display, mock_processor, mock_camera):
        """Test starting system with cameras"""
        # Add a camera
        self.system.add_camera('rtsp://test')
        
        # Start system
        result = self.system.start()
        self.assertTrue(result)
        self.assertTrue(self.system.running)
        
        # Verify threads started
        mock_camera.return_value.start.assert_called_once()
        mock_processor.return_value.start.assert_called_once()
        mock_display.return_value.start.assert_called_once()

    def test_start_already_running(self):
        """Test starting an already running system"""
        # Add camera and start system
        self.system.add_camera('rtsp://test')
        self.system.start()
        
        # Try starting again
        result = self.system.start()
        self.assertFalse(result)

    @patch('multi_camera_system.RTSPCamera')
    def test_stop_system(self, mock_camera):
        """Test stopping the system"""
        # Add camera and start system
        self.system.add_camera('rtsp://test')
        self.system.start()
        
        # Stop system
        self.system.stop()
        self.assertFalse(self.system.running)
        
        # Verify cleanup
        mock_camera.return_value.stop.assert_called_once()
        self.assertTrue(self.system.frame_queue.empty())
        self.assertTrue(self.system.result_queue.empty())

    def test_context_manager(self):
        """Test context manager functionality"""
        with MultiCameraSystem() as system:
            system.add_camera('rtsp://test')
            system.start()
            self.assertTrue(system.running)
        
        # Verify system stopped after context
        self.assertFalse(system.running)

if __name__ == '__main__':
    unittest.main()