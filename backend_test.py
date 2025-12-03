import requests
import sys
import json
from datetime import datetime

class TippingAPITester:
    def __init__(self, base_url="https://stripe-tips.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if success:
                try:
                    response_data = response.json()
                    details += f", Response: {json.dumps(response_data, indent=2)[:200]}..."
                except:
                    details += f", Response: {response.text[:100]}..."
            else:
                details += f", Error: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.text else {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_creator_profile_get(self):
        """Test getting creator profile"""
        return self.run_test("Get Creator Profile", "GET", "creator", 200)

    def test_creator_profile_update(self):
        """Test updating creator profile"""
        update_data = {
            "name": "Test Creator",
            "bio": "This is a test bio for the creator",
            "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
        }
        return self.run_test("Update Creator Profile", "POST", "creator", 200, update_data)

    def test_checkout_session_creation(self):
        """Test creating checkout session"""
        checkout_data = {
            "amount": 25.00,
            "message": "Test tip message",
            "tipper_name": "Test Tipper",
            "origin_url": self.base_url
        }
        return self.run_test("Create Checkout Session", "POST", "checkout/session", 200, checkout_data)

    def test_checkout_session_invalid_amount(self):
        """Test creating checkout session with invalid amount"""
        checkout_data = {
            "amount": -5.00,
            "message": "Test tip message",
            "tipper_name": "Test Tipper",
            "origin_url": self.base_url
        }
        success, _ = self.run_test("Create Checkout Session - Invalid Amount", "POST", "checkout/session", 400, checkout_data)
        return success, {}

    def test_checkout_status_invalid_session(self):
        """Test getting status of invalid session"""
        return self.run_test("Get Checkout Status - Invalid Session", "GET", "checkout/status/invalid_session_id", 500)

    def test_recent_tips(self):
        """Test getting recent tips"""
        return self.run_test("Get Recent Tips", "GET", "tips/recent?limit=5", 200)

    def test_recent_tips_with_limit(self):
        """Test getting recent tips with custom limit"""
        return self.run_test("Get Recent Tips - Custom Limit", "GET", "tips/recent?limit=10", 200)

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting API Tests for Tipping Page")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)

        # Test basic endpoints
        self.test_root_endpoint()
        
        # Test creator profile endpoints
        self.test_creator_profile_get()
        self.test_creator_profile_update()
        
        # Test checkout endpoints
        session_success, session_data = self.test_checkout_session_creation()
        self.test_checkout_session_invalid_amount()
        
        # Test checkout status (with invalid session since we can't complete real payment in test)
        self.test_checkout_status_invalid_session()
        
        # Test tips endpoints
        self.test_recent_tips()
        self.test_recent_tips_with_limit()

        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed < self.tests_run:
            print("\n❌ Some tests failed. Check the details above.")
            return 1
        else:
            print("\n✅ All tests passed!")
            return 0

def main():
    tester = TippingAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())