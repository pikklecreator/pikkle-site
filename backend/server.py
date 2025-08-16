from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, date
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create uploads directory if it doesn't exist
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Driver Models
class DriverProfile(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    phone: str
    date_of_birth: Optional[str] = None
    address: str

class DriverDocuments(BaseModel):
    identity_card_front: Optional[str] = None
    identity_card_back: Optional[str] = None
    proof_of_residence: Optional[str] = None
    residence_permit: Optional[str] = None
    civil_liability_insurance: Optional[str] = None
    vehicle_insurance: Optional[str] = None
    vehicle_contract: Optional[str] = None
    kbis_document: Optional[str] = None

class DriverBusinessInfo(BaseModel):
    siret: str
    company_name: str
    business_address: str
    vehicle_type: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None
    siret_verified: bool = False

class DriverBankInfo(BaseModel):
    bank_name: str
    iban: str
    bic: str
    account_holder_name: str

class DriverContract(BaseModel):
    auto_entrepreneur_status: bool = False
    accepts_cgu: bool = False
    accepts_privacy_policy: bool = False
    accepts_app_download: bool = False
    signature_date: Optional[datetime] = None
    kyc_contract_generated: bool = False
    kyc_contract_sent_date: Optional[datetime] = None
    kyc_contract_signed: bool = False
    kyc_contract_received_date: Optional[datetime] = None
    commission_rate: float = 15.0  # % de commission par défaut

class Driver(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    profile: Optional[DriverProfile] = None
    documents: Optional[DriverDocuments] = None
    business_info: Optional[DriverBusinessInfo] = None
    bank_info: Optional[DriverBankInfo] = None
    contract: Optional[DriverContract] = None
    registration_step: int = 1
    status: str = "pending"  # pending, under_review, approved, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DriverUpdate(BaseModel):
    profile: Optional[DriverProfile] = None
    documents: Optional[DriverDocuments] = None
    business_info: Optional[DriverBusinessInfo] = None
    bank_info: Optional[DriverBankInfo] = None
    contract: Optional[DriverContract] = None
    registration_step: Optional[int] = None
    status: Optional[str] = None

# Payment Models (placeholder for future Stripe integration)
class PaymentHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    driver_id: str
    amount: float
    currency: str = "EUR"
    payment_method: str  # apple_pay, google_pay, bank_transfer
    status: str  # completed, pending, failed
    delivery_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Driver Routes
@api_router.post("/drivers", response_model=Driver)
async def create_driver(driver_data: DriverUpdate):
    """Create a new driver account"""
    driver_dict = {
        "id": str(uuid.uuid4()),
        "registration_step": 1,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Add provided data
    if driver_data.profile:
        driver_dict["profile"] = driver_data.profile.dict()
    if driver_data.documents:
        driver_dict["documents"] = driver_data.documents.dict()
    if driver_data.business_info:
        driver_dict["business_info"] = driver_data.business_info.dict()
    if driver_data.bank_info:
        driver_dict["bank_info"] = driver_data.bank_info.dict()
    if driver_data.contract:
        driver_dict["contract"] = driver_data.contract.dict()
    if driver_data.registration_step:
        driver_dict["registration_step"] = driver_data.registration_step
    
    driver_obj = Driver(**driver_dict)
    await db.drivers.insert_one(driver_obj.dict())
    return driver_obj

@api_router.get("/drivers/{driver_id}", response_model=Driver)
async def get_driver(driver_id: str):
    """Get driver by ID"""
    driver = await db.drivers.find_one({"id": driver_id})
    if not driver:
        raise HTTPException(status_code=404, detail="Livreur non trouvé")
    return Driver(**driver)

@api_router.put("/drivers/{driver_id}", response_model=Driver)
async def update_driver(driver_id: str, driver_update: DriverUpdate):
    """Update driver information"""
    driver = await db.drivers.find_one({"id": driver_id})
    if not driver:
        raise HTTPException(status_code=404, detail="Livreur non trouvé")
    
    update_data = {"updated_at": datetime.utcnow()}
    
    if driver_update.profile:
        update_data["profile"] = driver_update.profile.dict()
    if driver_update.documents:
        update_data["documents"] = driver_update.documents.dict()
    if driver_update.business_info:
        update_data["business_info"] = driver_update.business_info.dict()
    if driver_update.bank_info:
        update_data["bank_info"] = driver_update.bank_info.dict()
    if driver_update.contract:
        update_data["contract"] = driver_update.contract.dict()
    if driver_update.registration_step:
        update_data["registration_step"] = driver_update.registration_step
    if driver_update.status:
        update_data["status"] = driver_update.status
    
    await db.drivers.update_one(
        {"id": driver_id},
        {"$set": update_data}
    )
    
    updated_driver = await db.drivers.find_one({"id": driver_id})
    return Driver(**updated_driver)

@api_router.post("/drivers/{driver_id}/upload-document")
async def upload_document(driver_id: str, document_type: str, file: UploadFile = File(...)):
    """Upload a document for a driver"""
    driver = await db.drivers.find_one({"id": driver_id})
    if not driver:
        raise HTTPException(status_code=404, detail="Livreur non trouvé")
    
    # Validate document type
    valid_document_types = [
        "identity_card_front", "identity_card_back", "proof_of_residence",
        "residence_permit", "civil_liability_insurance", "vehicle_insurance", 
        "vehicle_contract", "kbis_document"
    ]
    
    if document_type not in valid_document_types:
        raise HTTPException(status_code=400, detail="Type de document invalide")
    
    # Create driver-specific upload directory
    driver_upload_dir = UPLOAD_DIR / driver_id
    driver_upload_dir.mkdir(exist_ok=True)
    
    # Save file
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    filename = f"{document_type}.{file_extension}"
    file_path = driver_upload_dir / filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update driver documents
    documents = driver.get("documents", {})
    documents[document_type] = str(file_path.relative_to(ROOT_DIR))
    
    await db.drivers.update_one(
        {"id": driver_id},
        {"$set": {"documents": documents, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Document uploadé avec succès", "filename": filename}

@api_router.post("/drivers/{driver_id}/generate-kyc-contract")
async def generate_kyc_contract(driver_id: str):
    """Générer le contrat KYC personnalisé pour le livreur"""
    driver = await db.drivers.find_one({"id": driver_id})
    if not driver:
        raise HTTPException(status_code=404, detail="Livreur non trouvé")
    
    # Vérifier que tous les documents sont validés
    if driver.get("status") != "approved":
        raise HTTPException(status_code=400, detail="Documents non validés")
    
    # Extraire les données du livreur
    profile = driver.get("profile", {})
    business = driver.get("business_info", {})
    contract_data = driver.get("contract", {})
    
    # Template du contrat KYC avec variables
    contract_template = {
        "full_name": f"{profile.get('firstname', '')} {profile.get('lastname', '')}",
        "address": f"{profile.get('street_number', '')} {profile.get('street_name', '')}, {profile.get('postal_code', '')} {profile.get('city', '')}, {profile.get('country', 'France')}",
        "tax_id": business.get("siret", ""),
        "vehicle_type": business.get("vehicle_type", "À préciser"),
        "insurance_provider": business.get("insurance_provider", "À préciser"),
        "insurance_number": business.get("insurance_number", "À préciser"),
        "commission_rate": contract_data.get("commission_rate", 15.0),
        "date": datetime.utcnow().strftime("%d/%m/%Y"),
        "contract_id": f"PKL-{driver_id[:8].upper()}-{datetime.utcnow().strftime('%Y%m%d')}"
    }
    
    # Marquer le contrat comme généré
    await db.drivers.update_one(
        {"id": driver_id},
        {
            "$set": {
                "contract.kyc_contract_generated": True,
                "contract.kyc_contract_sent_date": datetime.utcnow(),
                "status": "contract_pending"
            }
        }
    )
    
    return {
        "message": "Contrat KYC généré avec succès",
        "contract_data": contract_template,
        "status": "contract_sent"
    }

@api_router.post("/drivers/{driver_id}/confirm-kyc-signature")
async def confirm_kyc_signature(driver_id: str):
    """Confirmer la réception du contrat KYC signé"""
    driver = await db.drivers.find_one({"id": driver_id})
    if not driver:
        raise HTTPException(status_code=404, detail="Livreur non trouvé")
    
    # Marquer le contrat comme signé et reçu
    await db.drivers.update_one(
        {"id": driver_id},
        {
            "$set": {
                "contract.kyc_contract_signed": True,
                "contract.kyc_contract_received_date": datetime.utcnow(),
                "status": "active"
            }
        }
    )
    
    return {"message": "Contrat KYC validé - Compte livreur activé"}

@api_router.get("/drivers/{driver_id}/kyc-status")
async def get_kyc_status(driver_id: str):
    """Récupérer le statut KYC du livreur"""
    driver = await db.drivers.find_one({"id": driver_id})
    if not driver:
        raise HTTPException(status_code=404, detail="Livreur non trouvé")
    
    contract = driver.get("contract", {})
    
    return {
        "kyc_status": {
            "contract_generated": contract.get("kyc_contract_generated", False),
            "contract_sent_date": contract.get("kyc_contract_sent_date"),
            "contract_signed": contract.get("kyc_contract_signed", False),
            "contract_received_date": contract.get("kyc_contract_received_date"),
            "account_status": driver.get("status", "pending")
        }
    }

# Statistics and Dashboard Routes
@api_router.get("/drivers/{driver_id}/payments", response_model=List[PaymentHistory])
async def get_driver_payments(driver_id: str):
    """Get payment history for a driver"""
    payments = await db.payments.find({"driver_id": driver_id}).to_list(100)
    return [PaymentHistory(**payment) for payment in payments]

# General Routes
@api_router.get("/")
async def root():
    return {"message": "API Pikkles - Plateforme de Livraison"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()