import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class PikklesAPITester:
    def __init__(self, base_url="https://driver-signup.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.driver_id = None

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, data: Dict[Any, Any] = None, params: Dict[str, str] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2, default=str)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")

            return success, response.json() if response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test the health endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )

    def test_api_root(self):
        """Test the API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "",
            200
        )

    def test_create_driver_step1(self):
        """Test creating a driver with step 1 data (profile)"""
        profile_data = {
            "profile": {
                "firstname": "Jean",
                "lastname": "Dupont",
                "email": "jean.dupont@test.com",
                "phone": "+33123456789",
                "date_of_birth": "1990-01-15",
                "address": "123 Rue de la Paix, 75001 Paris"
            },
            "registration_step": 1
        }
        
        success, response = self.run_test(
            "Create Driver - Step 1 (Profile)",
            "POST",
            "drivers",
            200,
            data=profile_data
        )
        
        if success and 'id' in response:
            self.driver_id = response['id']
            print(f"   Driver ID: {self.driver_id}")
            return True
        return False

    def test_get_driver(self):
        """Test getting a driver by ID"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        return self.run_test(
            "Get Driver",
            "GET",
            f"drivers/{self.driver_id}",
            200
        )[0]

    def test_update_driver_step2(self):
        """Test updating driver with step 2 data (documents)"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        documents_data = {
            "documents": {
                "identity_card_front": "uploads/test/identity_front.jpg",
                "identity_card_back": "uploads/test/identity_back.jpg",
                "proof_of_residence": "uploads/test/proof_residence.pdf",
                "residence_permit": "uploads/test/residence_permit.jpg"
            },
            "registration_step": 2
        }
        
        return self.run_test(
            "Update Driver - Step 2 (Documents)",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=documents_data
        )[0]

    def test_update_driver_step3(self):
        """Test updating driver with step 3 data (SIRET business info)"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        business_data = {
            "business_info": {
                "siret": "12345678901234",
                "company_name": "Jean Dupont Auto-Entrepreneur",
                "business_address": "123 Rue de la Paix, 75001 Paris",
                "siret_verified": False
            },
            "registration_step": 3
        }
        
        return self.run_test(
            "Update Driver - Step 3 (SIRET Business Info)",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=business_data
        )[0]

    def test_update_driver_step4(self):
        """Test updating driver with step 4 data (bank info)"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        bank_data = {
            "bank_info": {
                "bank_name": "Crédit Agricole",
                "iban": "FR1420041010050500013M02606",
                "bic": "AGRIFRPP",
                "account_holder_name": "Jean Dupont"
            },
            "registration_step": 4
        }
        
        return self.run_test(
            "Update Driver - Step 4 (Bank Info)",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=bank_data
        )[0]

    def test_update_driver_step5(self):
        """Test updating driver with step 5 data (contract with app download)"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        contract_data = {
            "contract": {
                "auto_entrepreneur_status": True,
                "accepts_cgu": True,
                "accepts_privacy_policy": True,
                "accepts_app_download": True,
                "signature_date": datetime.utcnow().isoformat()
            },
            "registration_step": 5,
            "status": "under_review"
        }
        
        return self.run_test(
            "Update Driver - Step 5 (Contract with App Download)",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=contract_data
        )[0]

    def test_get_driver_stats(self):
        """Test getting driver statistics"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        return self.run_test(
            "Get Driver Stats",
            "GET",
            f"drivers/{self.driver_id}/stats",
            200
        )[0]

    def test_get_driver_payments(self):
        """Test getting driver payment history"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        return self.run_test(
            "Get Driver Payments",
            "GET",
            f"drivers/{self.driver_id}/payments",
            200
        )[0]

    def test_get_nonexistent_driver(self):
        """Test getting a non-existent driver (should return 404)"""
        return self.run_test(
            "Get Non-existent Driver",
            "GET",
            "drivers/nonexistent-id-12345",
            404
        )[0]

    def test_invalid_driver_creation(self):
        """Test creating driver with invalid data"""
        invalid_data = {
            "profile": {
                "firstname": "",  # Empty firstname should fail validation
                "email": "invalid-email"  # Invalid email format
            }
        }
        
        # This should either return 422 (validation error) or 400 (bad request)
        success_422, _ = self.run_test(
            "Create Driver - Invalid Data (expecting 422)",
            "POST",
            "drivers",
            422,
            data=invalid_data
        )
        
        if not success_422:
            # Try 400 as alternative
            success_400, _ = self.run_test(
                "Create Driver - Invalid Data (expecting 400)",
                "POST",
                "drivers",
                400,
                data=invalid_data
            )
            return success_400
        
        return success_422

def main():
    print("🚀 Starting Pikkles API Backend Tests")
    print("=" * 50)
    
    # Setup
    tester = PikklesAPITester()
    
    # Run basic endpoint tests
    print("\n📋 PHASE 1: Basic API Tests")
    tester.test_health_check()
    tester.test_api_root()
    
    # Run driver CRUD tests
    print("\n📋 PHASE 2: Driver CRUD Tests")
    if tester.test_create_driver_step1():
        tester.test_get_driver()
        tester.test_update_driver_step2()
        tester.test_update_driver_step3()
        tester.test_update_driver_step4()
        tester.test_update_driver_step5()
        
        # Test dashboard endpoints
        print("\n📋 PHASE 3: Dashboard API Tests")
        tester.test_get_driver_stats()
        tester.test_get_driver_payments()
    else:
        print("❌ Driver creation failed, skipping dependent tests")
    
    # Run error handling tests
    print("\n📋 PHASE 4: Error Handling Tests")
    tester.test_get_nonexistent_driver()
    tester.test_invalid_driver_creation()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())