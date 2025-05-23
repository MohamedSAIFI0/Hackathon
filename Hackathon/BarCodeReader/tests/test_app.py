import unittest
import json
from app import app

class TestFlaskApp(unittest.TestCase):
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True

    def test_404_handler(self):
        """Test 404 error handler"""
        response = self.app.get('/nonexistent-route')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertEqual(data['error'], 'Not found')

if __name__ == '__main__':
    unittest.main()