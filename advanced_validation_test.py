import requests
import sys
import json
from datetime import datetime

class AdvancedValidationTester:
    def __init__(self, base_url="https://driver-signup.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, data=None) -> tuple:
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2, default=str)[:300]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")

            return success, response.json() if response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_siret_validation_api(self):
        """Test the SIRET validation API endpoint with various cases"""
        print("\n🔍 Testing SIRET Validation API Endpoint...")
        
        # Test cases for SIRET validation
        test_cases = [
            {
                "name": "Valid SIRET (73282932000074)",
                "siret": "73282932000074",
                "expected_valid": True
            },
            {
                "name": "Blacklisted SIRET (12345678901234)",
                "siret": "12345678901234", 
                "expected_valid": False
            },
            {
                "name": "Invalid Format (123456789)",
                "siret": "123456789",
                "expected_valid": False
            },
            {
                "name": "All Zeros (00000000000000)",
                "siret": "00000000000000",
                "expected_valid": False
            },
            {
                "name": "All Ones (11111111111111)",
                "siret": "11111111111111",
                "expected_valid": False
            }
        ]
        
        all_passed = True
        for test_case in test_cases:
            success, response = self.run_test(
                f"SIRET API - {test_case['name']}",
                "GET",
                f"validate-siret/{test_case['siret']}",
                200
            )
            
            if success:
                is_valid = response.get('isValid', False)
                is_active = response.get('isActive', False)
                expected = test_case['expected_valid']
                
                if (is_valid and is_active) == expected:
                    print(f"   ✅ Validation result correct: {is_valid and is_active}")
                else:
                    print(f"   ❌ Validation result incorrect: got {is_valid and is_active}, expected {expected}")
                    all_passed = False
            else:
                all_passed = False
        
        return all_passed

    def test_advanced_email_validation(self):
        """Test advanced email validation with disposable email domains"""
        print("\n🔍 Testing Advanced Email Validation...")
        
        disposable_emails = [
            "test@10minutemail.com",
            "user@guerrillamail.com", 
            "fake@tempmail.org",
            "test@fake-domain-xyz.com"
        ]
        
        all_passed = True
        for email in disposable_emails:
            test_data = {
                "profile": {
                    "firstname": "Jean",
                    "lastname": "Dupont",
                    "email": email,
                    "phone": "0612345678",
                    "address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            # This should fail if advanced validation is implemented
            success, response = self.run_test(
                f"Disposable Email - {email}",
                "POST",
                "drivers",
                400,  # Should be rejected
                data=test_data
            )
            
            if not success:
                # If it doesn't fail with 400, check if it's accepted (which would be wrong)
                success2, response2 = self.run_test(
                    f"Disposable Email Check - {email}",
                    "POST", 
                    "drivers",
                    200,  # Check if it's wrongly accepted
                    data=test_data
                )
                if success2:
                    print(f"   ⚠️  WARNING: Disposable email {email} was accepted!")
                    all_passed = False
        
        return all_passed

    def test_advanced_phone_validation(self):
        """Test advanced French phone validation"""
        print("\n🔍 Testing Advanced Phone Validation...")
        
        test_cases = [
            # Valid cases
            {"phone": "0612345678", "expected": True, "type": "Mobile 06"},
            {"phone": "0787654321", "expected": True, "type": "Mobile 07"},
            {"phone": "0123456789", "expected": True, "type": "Landline 01"},
            {"phone": "0445678901", "expected": True, "type": "Landline 04"},
            
            # Invalid cases - Premium numbers (08)
            {"phone": "0812345678", "expected": False, "type": "Premium 08"},
            {"phone": "0823456789", "expected": False, "type": "Premium 08"},
            
            # Invalid cases - International
            {"phone": "+33612345678", "expected": False, "type": "International"},
            {"phone": "0033612345678", "expected": False, "type": "International format"},
        ]
        
        all_passed = True
        for test_case in test_cases:
            test_data = {
                "profile": {
                    "firstname": "Jean",
                    "lastname": "Dupont",
                    "email": "jean.dupont@gmail.com",
                    "phone": test_case["phone"],
                    "address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            expected_status = 200 if test_case["expected"] else 400
            success, response = self.run_test(
                f"Phone {test_case['type']} - {test_case['phone']}",
                "POST",
                "drivers",
                expected_status,
                data=test_data
            )
            
            if not success:
                print(f"   ❌ Phone validation failed for {test_case['type']}")
                all_passed = False
            else:
                print(f"   ✅ Phone validation correct for {test_case['type']}")
        
        return all_passed

    def test_luhn_algorithm_siret(self):
        """Test SIRET validation using Luhn algorithm"""
        print("\n🔍 Testing SIRET Luhn Algorithm...")
        
        # Test with known valid SIRET that should pass Luhn
        valid_siret = "73282932000074"
        success, response = self.run_test(
            "Luhn Algorithm - Valid SIRET",
            "GET",
            f"validate-siret/{valid_siret}",
            200
        )
        
        if success:
            is_valid = response.get('isValid', False)
            message = response.get('message', '')
            print(f"   Luhn validation result: {is_valid}")
            print(f"   Message: {message}")
            return is_valid
        
        return False

def main():
    print("🚀 Starting Advanced Validation Tests for Pikkles")
    print("=" * 60)
    
    tester = AdvancedValidationTester()
    
    # Test Phase 1: SIRET Validation API
    print("\n📋 PHASE 1: SIRET Validation API Tests")
    siret_passed = tester.test_siret_validation_api()
    
    # Test Phase 2: Advanced Email Validation  
    print("\n📋 PHASE 2: Advanced Email Validation Tests")
    email_passed = tester.test_advanced_email_validation()
    
    # Test Phase 3: Advanced Phone Validation
    print("\n📋 PHASE 3: Advanced Phone Validation Tests") 
    phone_passed = tester.test_advanced_phone_validation()
    
    # Test Phase 4: Luhn Algorithm
    print("\n📋 PHASE 4: SIRET Luhn Algorithm Tests")
    luhn_passed = tester.test_luhn_algorithm_siret()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 ADVANCED VALIDATION TEST RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"SIRET API: {'✅ PASS' if siret_passed else '❌ FAIL'}")
    print(f"Email Validation: {'✅ PASS' if email_passed else '❌ FAIL'}")
    print(f"Phone Validation: {'✅ PASS' if phone_passed else '❌ FAIL'}")
    print(f"Luhn Algorithm: {'✅ PASS' if luhn_passed else '❌ FAIL'}")
    
    if tester.tests_passed == tester.tests_run and all([siret_passed, email_passed, phone_passed, luhn_passed]):
        print("🎉 All advanced validation tests passed!")
        return 0
    else:
        print(f"⚠️  Some advanced validation features need attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())