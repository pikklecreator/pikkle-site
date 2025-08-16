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
        """Test creating a driver with step 1 data (profile with detailed address)"""
        profile_data = {
            "profile": {
                "firstname": "Jean",
                "lastname": "Dupont",
                "email": "jean.dupont@test.com",
                "phone": "0612345678",
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

    def test_update_driver_step3_insurance(self):
        """Test updating driver with step 3 data (insurance documents)"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        insurance_data = {
            "documents": {
                "civil_liability_insurance": "uploads/test/civil_liability.pdf",
                "vehicle_insurance": "uploads/test/vehicle_insurance.pdf",
                "vehicle_contract": "uploads/test/vehicle_contract.pdf"
            },
            "registration_step": 3
        }
        
        return self.run_test(
            "Update Driver - Step 3 (Insurance Documents)",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=insurance_data
        )[0]

    def test_update_driver_step4_siret(self):
        """Test updating driver with step 4 data (SIRET business info)"""
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
            "registration_step": 4
        }
        
        return self.run_test(
            "Update Driver - Step 4 (SIRET Business Info)",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=business_data
        )[0]

    def test_update_driver_step5_bank(self):
        """Test updating driver with step 5 data (bank info)"""
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
            "registration_step": 5
        }
        
        return self.run_test(
            "Update Driver - Step 5 (Bank Info)",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=bank_data
        )[0]

    def test_update_driver_step6_final(self):
        """Test updating driver with step 6 data (contract with app download)"""
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
            "registration_step": 6,
            "status": "under_review"
        }
        
        return self.run_test(
            "Update Driver - Step 6 (Final Contract with App Download)",
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

    def test_siret_validation(self):
        """Test SIRET validation functionality"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        # Test with invalid SIRET (too short)
        invalid_siret_data = {
            "business_info": {
                "siret": "123456789",  # Only 9 digits instead of 14
                "company_name": "Test Company",
                "business_address": "Test Address"
            }
        }
        
        # This should succeed as backend doesn't validate SIRET format yet
        success, _ = self.run_test(
            "SIRET Validation - Invalid Format",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=invalid_siret_data
        )
        
        # Test with valid SIRET format
        valid_siret_data = {
            "business_info": {
                "siret": "12345678901234",  # 14 digits
                "company_name": "Valid Company",
                "business_address": "Valid Address"
            }
        }
        
        success2, _ = self.run_test(
            "SIRET Validation - Valid Format",
            "PUT",
            f"drivers/{self.driver_id}",
            200,
            data=valid_siret_data
        )
        
        return success and success2

    def test_insurance_document_upload(self):
        """Test insurance document upload endpoints"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        # Test civil liability insurance upload endpoint
        success1 = self.run_test(
            "Civil Liability Insurance Upload Endpoint",
            "POST",
            f"drivers/{self.driver_id}/upload-document?document_type=civil_liability_insurance",
            422,  # Should fail without actual file
        )[0]
        
        # Test vehicle insurance upload endpoint
        success2 = self.run_test(
            "Vehicle Insurance Upload Endpoint",
            "POST",
            f"drivers/{self.driver_id}/upload-document?document_type=vehicle_insurance",
            422,  # Should fail without actual file
        )[0]
        
        # Test vehicle contract upload endpoint
        success3 = self.run_test(
            "Vehicle Contract Upload Endpoint",
            "POST",
            f"drivers/{self.driver_id}/upload-document?document_type=vehicle_contract",
            422,  # Should fail without actual file
        )[0]
        
        return success1 and success2 and success3

    def test_validation_email_invalid(self):
        """Test email validation - should reject invalid emails"""
        invalid_emails = ["test", "test@", "@test.com", "test.com", "test@test"]
        
        for email in invalid_emails:
            invalid_data = {
                "profile": {
                    "firstname": "Jean",
                    "lastname": "Dupont", 
                    "email": email,
                    "phone": "0612345678",
                    "address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            success, response = self.run_test(
                f"Email Validation - Invalid: {email}",
                "POST",
                "drivers",
                422,  # Pydantic validation returns 422
                data=invalid_data
            )
            
            if success and "email" in str(response):
                print(f"✅ Email validation working for: {email}")
            else:
                print(f"❌ Email validation failed for: {email}")
                return False
        
        return True

    def test_validation_disposable_emails(self):
        """Test disposable email validation - should reject disposable emails"""
        disposable_emails = [
            "test@10minutemail.com",
            "user@guerrillamail.com", 
            "fake@tempmail.org",
            "test@mailinator.com",
            "user@yopmail.com",
            "test@fake-domain-xyz.com"
        ]
        
        for email in disposable_emails:
            invalid_data = {
                "profile": {
                    "firstname": "Jean",
                    "lastname": "Dupont",
                    "email": email,
                    "phone": "0612345678", 
                    "address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            success, response = self.run_test(
                f"Disposable Email Validation - Should Reject: {email}",
                "POST",
                "drivers",
                400,  # Backend validation returns 400
                data=invalid_data
            )
            
            if success and "jetable" in str(response):
                print(f"✅ Disposable email blocked: {email}")
            else:
                print(f"❌ Disposable email validation failed for: {email}")
                return False
        
        return True

    def test_validation_phone_invalid(self):
        """Test phone validation - should reject non-French phones and 08 numbers"""
        invalid_phones = [
            "123", 
            "+33123456789", 
            "1234567890", 
            "0812345678",  # Surtaxé 08
            "0823456789",  # Surtaxé 08
            "0834567890",  # Surtaxé 08
            "0012345678"
        ]
        
        for phone in invalid_phones:
            invalid_data = {
                "profile": {
                    "firstname": "Jean",
                    "lastname": "Dupont",
                    "email": "jean@test.com",
                    "phone": phone,
                    "address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            success, response = self.run_test(
                f"Phone Validation - Invalid: {phone}",
                "POST", 
                "drivers",
                400,  # Backend validation returns 400
                data=invalid_data
            )
            
            if success and "téléphone" in str(response):
                print(f"✅ Phone validation working for: {phone}")
            else:
                print(f"❌ Phone validation failed for: {phone}")
                return False
        
        return True

    def test_validation_phone_valid(self):
        """Test phone validation - should accept valid French phones"""
        valid_phones = [
            "0612345678",  # Mobile 06
            "0787654321",  # Mobile 07
            "0123456789",  # Fixe 01
            "0445678901",  # Fixe 04
            "0987654321"   # Fixe 09
        ]
        
        for phone in valid_phones:
            valid_data = {
                "profile": {
                    "firstname": "Jean",
                    "lastname": "Dupont",
                    "email": "jean@test.com",
                    "phone": phone,
                    "address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            success, response = self.run_test(
                f"Phone Validation - Valid: {phone}",
                "POST",
                "drivers",
                200,  # Should succeed
                data=valid_data
            )
            
            if success and 'id' in response:
                print(f"✅ Valid phone accepted: {phone}")
            else:
                print(f"❌ Valid phone validation failed for: {phone}")
                return False
        
        return True

    def test_validation_names_too_short(self):
        """Test name validation - should reject names < 2 chars"""
        invalid_names = [
            {"firstname": "A", "lastname": "Dupont"},
            {"firstname": "Jean", "lastname": "B"},
            {"firstname": "", "lastname": "Dupont"},
            {"firstname": "Jean", "lastname": ""}
        ]
        
        for names in invalid_names:
            invalid_data = {
                "profile": {
                    "firstname": names["firstname"],
                    "lastname": names["lastname"],
                    "email": "jean@test.com",
                    "phone": "0612345678",
                    "address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            success, response = self.run_test(
                f"Name Validation - Invalid: {names['firstname']}/{names['lastname']}",
                "POST",
                "drivers", 
                400,  # Backend validation returns 400
                data=invalid_data
            )
            
            if success and ("prénom" in str(response) or "nom" in str(response)):
                print(f"✅ Name validation working for: {names}")
            else:
                print(f"❌ Name validation failed for: {names}")
                return False
        
        return True

    def test_validation_siret_invalid(self):
        """Test SIRET validation - should reject invalid SIRETs"""
        if not self.driver_id:
            print("❌ No driver ID available for testing")
            return False
            
        invalid_sirets = ["123456789", "12345678901234567", "abcd1234567890", "123 456 789"]
        
        for siret in invalid_sirets:
            invalid_data = {
                "business_info": {
                    "siret": siret,
                    "company_name": "Test Company",
                    "business_address": "Test Address"
                }
            }
            
            success, response = self.run_test(
                f"SIRET Validation - Invalid: {siret}",
                "PUT",
                f"drivers/{self.driver_id}",
                400,
                data=invalid_data
            )
            
            if success and "SIRET" in str(response):
                print(f"✅ SIRET validation working for: {siret}")
            else:
                print(f"❌ SIRET validation failed for: {siret}")
                return False
        
        return True

    def test_validation_positive_cases(self):
        """Test that valid data passes validation"""
        valid_data = {
            "profile": {
                "firstname": "Jean",
                "lastname": "Dupont",
                "email": "jean.dupont@gmail.com", 
                "phone": "0612345678",
                "address": "123 Rue de la Paix, 75001 Paris"
            }
        }
        
        success, response = self.run_test(
            "Valid Data - Should Pass",
            "POST",
            "drivers",
            200,
            data=valid_data
        )
        
        if success and 'id' in response:
            # Test valid SIRET update
            valid_siret_data = {
                "business_info": {
                    "siret": "12345678901234",
                    "company_name": "Jean Dupont Auto-Entrepreneur", 
                    "business_address": "123 Rue de la Paix, 75001 Paris"
                }
            }
            
            success2, _ = self.run_test(
                "Valid SIRET - Should Pass",
                "PUT",
                f"drivers/{response['id']}",
                200,
                data=valid_siret_data
            )
            
            return success2
        
        return False

    def test_bypass_prevention(self):
        """Test that validation cannot be bypassed"""
        # Try to create with random data like "aaa", "bbb", "ccc"
        bypass_data = {
            "profile": {
                "firstname": "aaa",
                "lastname": "bbb", 
                "email": "ccc",
                "phone": "ddd",
                "address": "fake address"
            }
        }
        
        success, response = self.run_test(
            "Bypass Prevention - Random Data",
            "POST",
            "drivers",
            422,  # Should fail with validation error
            data=bypass_data
        )
        
        if success and "email" in str(response):
            print("✅ Bypass prevention working - random data rejected")
            return True
        else:
            print("❌ Bypass prevention failed - random data accepted")
            return False

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
    print("\n📋 PHASE 2: Driver CRUD Tests - 6 Steps Flow")
    if tester.test_create_driver_step1():
        tester.test_get_driver()
        tester.test_update_driver_step2()
        tester.test_update_driver_step3_insurance()
        tester.test_update_driver_step4_siret()
        tester.test_update_driver_step5_bank()
        tester.test_update_driver_step6_final()
        
        # Test dashboard endpoints with insurance info
        print("\n📋 PHASE 3: Dashboard API Tests")
        tester.test_get_driver_stats()
        tester.test_get_driver_payments()
        
        # Test new insurance and SIRET functionality
        print("\n📋 PHASE 4: New Features Tests")
        tester.test_siret_validation()
        tester.test_insurance_document_upload()
    else:
        print("❌ Driver creation failed, skipping dependent tests")
    
    # Run validation tests
    print("\n📋 PHASE 5: Validation Security Tests")
    tester.test_validation_email_invalid()
    tester.test_validation_phone_invalid()
    tester.test_validation_names_too_short()
    if tester.driver_id:
        tester.test_validation_siret_invalid()
    tester.test_validation_positive_cases()
    tester.test_bypass_prevention()
    
    # Run error handling tests
    print("\n📋 PHASE 6: Error Handling Tests")
    tester.test_get_nonexistent_driver()
    
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