import requests
import sys
import json
from datetime import datetime
import uuid

class OrigenesAPITester:
    def __init__(self, base_url="https://farm-analytics-9.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_contact_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)

            print(f"   Status Code: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_create_contact(self):
        """Test creating a new contact"""
        test_data = {
            "name": "Juan Pérez Test",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@ejemplo.com",
            "phone": "300 123 4567",
            "department": "Antioquia",
            "culture": "Café",
            "hectares": 50,
            "message": "Mensaje de prueba para consultoría agrícola. Necesito mejorar el rendimiento de mi cultivo."
        }
        
        success, response = self.run_test(
            "Create Contact",
            "POST",
            "api/contact/",
            201,
            data=test_data
        )
        
        if success and 'id' in response:
            self.created_contact_id = response['id']
            print(f"   Created contact ID: {self.created_contact_id}")
            
            # Validate response structure
            required_fields = ['id', 'name', 'email', 'phone', 'department', 'culture', 'message', 'created_at', 'status']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"⚠️  Warning: Missing fields in response: {missing_fields}")
            else:
                print("✅ Response structure is complete")
                
        return success

    def test_create_contact_without_optional_fields(self):
        """Test creating contact without optional hectares field"""
        test_data = {
            "name": "María González Test",
            "email": f"test_no_hectares_{datetime.now().strftime('%H%M%S')}@ejemplo.com",
            "phone": "310 987 6543",
            "department": "Valle del Cauca",
            "culture": "Aguacate",
            "message": "Consulta sin especificar hectáreas."
        }
        
        success, response = self.run_test(
            "Create Contact (No Hectares)",
            "POST",
            "api/contact/",
            201,
            data=test_data
        )
        return success

    def test_create_contact_validation(self):
        """Test contact creation with invalid data"""
        # Test missing required fields
        invalid_data = {
            "name": "",  # Empty name
            "email": "invalid-email",  # Invalid email
            "phone": "123",  # Too short phone
            "department": "",  # Empty department
            "culture": "",  # Empty culture
            "message": "Hi"  # Too short message
        }
        
        success, response = self.run_test(
            "Create Contact (Invalid Data)",
            "POST",
            "api/contact/",
            422,  # Validation error
            data=invalid_data
        )
        return not success  # We expect this to fail

    def test_get_contacts(self):
        """Test getting all contacts"""
        success, response = self.run_test(
            "Get All Contacts",
            "GET",
            "api/contact/",
            200
        )
        
        if success:
            if isinstance(response, list):
                print(f"   Found {len(response)} contacts")
                if len(response) > 0:
                    print("✅ Contacts list returned successfully")
                else:
                    print("ℹ️  No contacts found (empty list)")
            else:
                print("⚠️  Warning: Response is not a list")
                
        return success

    def test_get_contact_by_id(self):
        """Test getting a specific contact by ID"""
        if not self.created_contact_id:
            print("⚠️  Skipping get contact by ID test - no contact ID available")
            return True
            
        success, response = self.run_test(
            "Get Contact by ID",
            "GET",
            f"api/contact/{self.created_contact_id}",
            200
        )
        
        if success and 'id' in response:
            if response['id'] == self.created_contact_id:
                print("✅ Contact retrieved successfully with correct ID")
            else:
                print(f"⚠️  Warning: ID mismatch - expected {self.created_contact_id}, got {response['id']}")
                
        return success

    def test_get_nonexistent_contact(self):
        """Test getting a contact that doesn't exist"""
        fake_id = str(uuid.uuid4())
        success, response = self.run_test(
            "Get Nonexistent Contact",
            "GET",
            f"api/contact/{fake_id}",
            404
        )
        return not success  # We expect this to fail with 404

    def test_update_contact_status(self):
        """Test updating contact status"""
        if not self.created_contact_id:
            print("⚠️  Skipping update status test - no contact ID available")
            return True
            
        success, response = self.run_test(
            "Update Contact Status",
            "PATCH",
            f"api/contact/{self.created_contact_id}/status?new_status=contacted",
            200
        )
        return success

    def test_health_check(self):
        """Test if the backend server is running"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=5)
            if response.status_code in [200, 404]:  # 404 is OK, means server is running
                print("✅ Backend server is running")
                return True
            else:
                print(f"⚠️  Backend server returned status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Backend server is not accessible: {str(e)}")
            return False

def main():
    print("🚀 Starting ORÍGENES Backend API Tests")
    print("=" * 50)
    
    tester = OrigenesAPITester()
    
    # Test server health first
    if not tester.test_health_check():
        print("\n❌ Backend server is not accessible. Stopping tests.")
        return 1
    
    # Run all tests
    tests = [
        tester.test_create_contact,
        tester.test_create_contact_without_optional_fields,
        tester.test_create_contact_validation,
        tester.test_get_contacts,
        tester.test_get_contact_by_id,
        tester.test_get_nonexistent_contact,
        tester.test_update_contact_status,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("✅ Backend API tests mostly successful")
        return 0
    else:
        print("❌ Backend API tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())