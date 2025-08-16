import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { 
  User, 
  FileText, 
  CreditCard, 
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Building,
  Banknote
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DriverRegistration = ({ onDriverRegistered }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [driverId, setDriverId] = useState(null);
  
  // Form data states
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    street_number: '',
    street_name: '',
    city: '',
    postal_code: '',
    country: 'France'
  });

  const [documentFiles, setDocumentFiles] = useState({
    identity_card_front: null,
    identity_card_back: null,
    proof_of_residence: null,
    residence_permit: null,
    civil_liability_insurance: null,
    vehicle_insurance: null,
    vehicle_contract: null
  });

  const [businessData, setBusinessData] = useState({
    siret: '',
    company_name: '',
    business_address: '',
    vehicle_type: '',
    insurance_provider: '',
    insurance_number: '',
    kbis_document: null
  });

  const [bankData, setBankData] = useState({
    bank_name: '',
    iban: '',
    bic: '',
    account_holder_name: ''
  });

  const [contractData, setContractData] = useState({
    auto_entrepreneur_status: false,
    accepts_cgu: false,
    accepts_privacy_policy: false,
    accepts_app_download: false
  });

  const steps = [
    { 
      id: 1, 
      title: 'Profil', 
      icon: <User className="h-5 w-5" />,
      description: 'Informations personnelles'
    },
    { 
      id: 2, 
      title: 'Documents', 
      icon: <FileText className="h-5 w-5" />,
      description: 'Pièces d\'identité'
    },
    { 
      id: 3, 
      title: 'Assurances', 
      icon: <Building className="h-5 w-5" />,
      description: 'Documents assurance'
    },
    { 
      id: 4, 
      title: 'SIRET', 
      icon: <Building className="h-5 w-5" />,
      description: 'Statut indépendant'
    },
    { 
      id: 5, 
      title: 'RIB', 
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Coordonnées bancaires'
    },
    { 
      id: 6, 
      title: 'Validation', 
      icon: <FileCheck className="h-5 w-5" />,
      description: 'Finalisation'
    }
  ];

  const validateSIRET = (siret) => {
    // Remove spaces and check if it's 14 digits
    const cleanSiret = siret.replace(/\s/g, '');
    return /^\d{14}$/.test(cleanSiret);
  };

  const handleFileChange = (documentType, file) => {
    if (documentType === 'kbis_document') {
      setBusinessData(prev => ({
        ...prev,
        kbis_document: file
      }));
    } else {
      setDocumentFiles(prev => ({
        ...prev,
        [documentType]: file
      }));
    }
  };

  const uploadDocument = async (documentType, file) => {
    if (!driverId || !file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API}/drivers/${driverId}/upload-document?document_type=${documentType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur upload ${documentType}:`, error);
      return null;
    }
  };

  const handleStepSubmit = async () => {
    setLoading(true);
    
    try {
      switch (currentStep) {
        case 1:
          // Create driver with profile data
          const driverResponse = await axios.post(`${API}/drivers`, {
            profile: profileData,
            registration_step: 1
          });
          setDriverId(driverResponse.data.id);
          break;

        case 3:
          // Upload insurance documents
          if (documentFiles.civil_liability_insurance) {
            await uploadDocument('civil_liability_insurance', documentFiles.civil_liability_insurance);
          }
          if (documentFiles.vehicle_insurance) {
            await uploadDocument('vehicle_insurance', documentFiles.vehicle_insurance);
          }
          if (documentFiles.vehicle_contract) {
            await uploadDocument('vehicle_contract', documentFiles.vehicle_contract);
          }
          
          await axios.put(`${API}/drivers/${driverId}`, {
            registration_step: 3
          });
          break;

        case 2:
          // Upload identity documents
          if (documentFiles.identity_card_front) {
            await uploadDocument('identity_card_front', documentFiles.identity_card_front);
          }
          if (documentFiles.identity_card_back) {
            await uploadDocument('identity_card_back', documentFiles.identity_card_back);
          }
          if (documentFiles.proof_of_residence) {
            await uploadDocument('proof_of_residence', documentFiles.proof_of_residence);
          }
          if (documentFiles.residence_permit) {
            await uploadDocument('residence_permit', documentFiles.residence_permit);
          }
          
          await axios.put(`${API}/drivers/${driverId}`, {
            registration_step: 2
          });
          break;

        case 4:
          // Save business data (SIRET)
          if (businessData.kbis_document) {
            await uploadDocument('kbis_document', businessData.kbis_document);
          }
          
          await axios.put(`${API}/drivers/${driverId}`, {
            business_info: {
              siret: businessData.siret,
              company_name: businessData.company_name,
              business_address: businessData.business_address,
              vehicle_type: businessData.vehicle_type,
              insurance_provider: businessData.insurance_provider,
              insurance_number: businessData.insurance_number
            },
            registration_step: 4
          });
          break;

        case 5:
          // Save bank information
          await axios.put(`${API}/drivers/${driverId}`, {
            bank_info: bankData,
            registration_step: 5
          });
          break;

        case 6:
          // Complete registration
          const finalContractData = {
            ...contractData,
            signature_date: new Date().toISOString()
          };
          
          const completedDriver = await axios.put(`${API}/drivers/${driverId}`, {
            contract: finalContractData,
            registration_step: 6,
            status: 'under_review'
          });
          
          onDriverRegistered(completedDriver.data);
          return;
      }

      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return profileData.firstname && profileData.lastname && profileData.email && profileData.phone && 
               profileData.street_number && profileData.street_name && profileData.city && profileData.postal_code;
      case 2:
        return documentFiles.identity_card_front && documentFiles.identity_card_back && documentFiles.proof_of_residence;
      case 3:
        return documentFiles.civil_liability_insurance && documentFiles.vehicle_insurance && documentFiles.vehicle_contract;
      case 4:
        return businessData.siret && validateSIRET(businessData.siret) && businessData.company_name && 
               businessData.business_address && businessData.vehicle_type && businessData.insurance_provider && 
               businessData.insurance_number;
      case 5:
        return bankData.bank_name && bankData.iban && bankData.account_holder_name;
      case 6:
        return contractData.auto_entrepreneur_status && contractData.accepts_cgu && contractData.accepts_privacy_policy && contractData.accepts_app_download;
      default:
        return false;
    }
  };

  const FileUploadArea = ({ documentType, title, required = false, accept = ".jpg,.jpeg,.png,.pdf" }) => {
    const file = documentType === 'kbis_document' ? businessData.kbis_document : documentFiles[documentType];
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className={`file-upload-area p-6 rounded-lg text-center border-2 ${file ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-dashed border-gray-300'}`}>
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(documentType, e.target.files[0])}
            className="hidden"
            id={documentType}
          />
          <label htmlFor={documentType} className="cursor-pointer">
            {file ? (
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <p className="text-sm text-green-700 font-medium">{file.name}</p>
                <p className="text-xs text-green-600">Fichier sélectionné</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">Cliquez pour sélectionner</p>
                <p className="text-xs text-gray-500">JPG, PNG ou PDF • Max 5MB</p>
              </div>
            )}
          </label>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Livreur Indépendant Pikkles</p>
                  <p className="text-sm text-green-600 mt-1">
                    Remplissez tous les champs obligatoires pour votre inscription
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom *</Label>
                <Input
                  id="firstname"
                  value={profileData.firstname}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstname: e.target.value }))}
                  placeholder="Votre prénom"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nom *</Label>
                <Input
                  id="lastname"
                  value={profileData.lastname}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastname: e.target.value }))}
                  placeholder="Votre nom"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="votre@email.com"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date de naissance</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={profileData.date_of_birth}
                onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Adresse détaillée */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-4">Adresse personnelle *</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street_number">Numéro *</Label>
                  <Input
                    id="street_number"
                    value={profileData.street_number}
                    onChange={(e) => setProfileData(prev => ({ ...prev, street_number: e.target.value }))}
                    placeholder="123"
                    required
                    className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street_name">Nom de la rue *</Label>
                  <Input
                    id="street_name"
                    value={profileData.street_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, street_name: e.target.value }))}
                    placeholder="Rue de la Paix"
                    required
                    className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Code postal *</Label>
                  <Input
                    id="postal_code"
                    value={profileData.postal_code}
                    onChange={(e) => setProfileData(prev => ({ ...prev, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                    placeholder="75001"
                    required
                    className="focus:border-green-500 focus:ring-green-500"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Paris"
                    required
                    className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={profileData.country}
                  onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="France"
                  className="focus:border-green-500 focus:ring-green-500"
                  disabled
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Documents d'identité requis</p>
                  <p className="text-sm text-blue-600 mt-1">
                    CNI recto-verso obligatoire + justificatif de domicile récent
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadArea 
                documentType="identity_card_front"
                title="Carte d'identité (recto)"
                required
              />
              <FileUploadArea 
                documentType="identity_card_back"
                title="Carte d'identité (verso)"
                required
              />
              <FileUploadArea 
                documentType="proof_of_residence"
                title="Justificatif de domicile (< 3 mois)"
                required
              />
              <FileUploadArea 
                documentType="residence_permit"
                title="Titre de séjour (si applicable)"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Documents d'assurance obligatoires</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Responsabilité civile, assurance véhicule et contrat véhicule requis
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadArea 
                documentType="civil_liability_insurance"
                title="Assurance Responsabilité Civile"
                required
              />
              <FileUploadArea 
                documentType="vehicle_insurance"
                title="Assurance du Véhicule"
                required
              />
              <FileUploadArea 
                documentType="vehicle_contract"
                title="Contrat Signé du Véhicule"
                required
              />
            </div>

            {/* Section Partenaires */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-4">🤝 Nos Partenaires Assurance</h4>
              <p className="text-sm text-green-700 mb-4">
                Pas encore assuré ? Nos partenaires offrent des tarifs préférentiels pour les livreurs Pikkles :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-2xl mb-2">🚗</div>
                  <h5 className="font-semibold text-gray-800">AssurPlus</h5>
                  <p className="text-sm text-gray-600">Assurance véhicule</p>
                  <p className="text-xs text-green-600 font-semibold">-20% pour Pikkles</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Devis gratuit
                  </Button>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-2xl mb-2">🛡️</div>
                  <h5 className="font-semibold text-gray-800">RC-Pro Direct</h5>
                  <p className="text-sm text-gray-600">Responsabilité civile</p>
                  <p className="text-xs text-green-600 font-semibold">-15% pour Pikkles</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Souscrire en ligne
                  </Button>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <h5 className="font-semibold text-gray-800">LeaseMax</h5>
                  <p className="text-sm text-gray-600">Location véhicule</p>
                  <p className="text-xs text-green-600 font-semibold">Offres spéciales</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Voir catalogue
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600">
                  💡 <strong>Astuce :</strong> Mentionnez le code "PIKKLES2024" pour bénéficier des tarifs préférentiels
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Vérification des documents</p>
                  <p className="text-sm text-amber-600 mt-1">
                    Nos équipes vérifieront la conformité et validité de vos assurances
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Statut indépendant obligatoire</p>
                  <p className="text-sm text-green-600 mt-1">
                    SIRET domicilié en France métropolitaine uniquement
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siret">Numéro SIRET *</Label>
                <Input
                  id="siret"
                  value={businessData.siret}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
                    setBusinessData(prev => ({ ...prev, siret: value }));
                  }}
                  placeholder="123 456 789 01234"
                  required
                  className={`focus:border-green-500 focus:ring-green-500 ${
                    businessData.siret && !validateSIRET(businessData.siret) ? 'border-red-500' : ''
                  }`}
                  maxLength={17}
                />
                {businessData.siret && !validateSIRET(businessData.siret) && (
                  <p className="text-sm text-red-600">SIRET invalide (14 chiffres requis)</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Nom de votre entreprise/activité *</Label>
                <Input
                  id="company_name"
                  value={businessData.company_name}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Ex: Jean Dupont Auto-Entrepreneur"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_address">Adresse de domiciliation *</Label>
                <Textarea
                  id="business_address"
                  value={businessData.business_address}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, business_address: e.target.value }))}
                  placeholder="Adresse où votre SIRET est domicilié"
                  rows={3}
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <FileUploadArea 
                documentType="kbis_document"
                title="K-bis ou Attestation URSSAF"
              />
            </div>

            {/* Informations véhicule et assurance pour le contrat KYC */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-4">🚗 Informations Véhicule & Assurance</h4>
              <p className="text-sm text-blue-700 mb-4">
                Ces informations seront intégrées dans votre contrat KYC personnalisé
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Type de véhicule *</Label>
                  <Input
                    id="vehicle_type"
                    value={businessData.vehicle_type}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, vehicle_type: e.target.value }))}
                    placeholder="Ex: Scooter 125cc, Vélo électrique, Voiture"
                    required
                    className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insurance_provider">Fournisseur d'assurance *</Label>
                  <Input
                    id="insurance_provider"
                    value={businessData.insurance_provider}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, insurance_provider: e.target.value }))}
                    placeholder="Ex: MAIF, AssurPlus, RC-Pro Direct"
                    required
                    className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="insurance_number">Numéro de police d'assurance *</Label>
                <Input
                  id="insurance_number"
                  value={businessData.insurance_number}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, insurance_number: e.target.value }))}
                  placeholder="Ex: POL-123456789"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Vérification automatique</p>
                  <p className="text-sm text-amber-600 mt-1">
                    Votre SIRET sera vérifié auprès du répertoire SIRENE
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Banknote className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">RIB sécurisé</p>
                  <p className="text-sm text-green-600 mt-1">
                    Vos gains seront virés chaque semaine sur ce compte
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Nom de la banque *</Label>
                <Input
                  id="bank_name"
                  value={bankData.bank_name}
                  onChange={(e) => setBankData(prev => ({ ...prev, bank_name: e.target.value }))}
                  placeholder="Ex: Crédit Mutuel, BNP Paribas..."
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_holder_name">Nom du titulaire *</Label>
                <Input
                  id="account_holder_name"
                  value={bankData.account_holder_name}
                  onChange={(e) => setBankData(prev => ({ ...prev, account_holder_name: e.target.value }))}
                  placeholder="Nom exact sur le RIB"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">IBAN *</Label>
                <Input
                  id="iban"
                  value={bankData.iban}
                  onChange={(e) => setBankData(prev => ({ ...prev, iban: e.target.value.replace(/\s/g, '').toUpperCase() }))}
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                  required
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bic">Code BIC/SWIFT</Label>
                <Input
                  id="bic"
                  value={bankData.bic}
                  onChange={(e) => setBankData(prev => ({ ...prev, bic: e.target.value.toUpperCase() }))}
                  placeholder="BNPAFRPPXXX"
                  className="focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Dernière étape !</p>
                  <p className="text-sm text-green-600 mt-1">
                    Validez votre inscription et téléchargez l'app mobile
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="auto_entrepreneur"
                  checked={contractData.auto_entrepreneur_status}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, auto_entrepreneur_status: checked }))}
                />
                <Label htmlFor="auto_entrepreneur" className="text-sm leading-5">
                  Je certifie être travailleur indépendant avec un SIRET valide domicilié en France
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="cgu"
                  checked={contractData.accepts_cgu}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, accepts_cgu: checked }))}
                />
                <Label htmlFor="cgu" className="text-sm leading-5">
                  J'accepte les{' '}
                  <a href="/cgu" target="_blank" className="text-green-600 hover:underline">
                    Conditions Générales d'Utilisation Pikkles
                  </a>
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={contractData.accepts_privacy_policy}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, accepts_privacy_policy: checked }))}
                />
                <Label htmlFor="privacy" className="text-sm leading-5">
                  J'accepte la{' '}
                  <a href="/confidentialite" target="_blank" className="text-green-600 hover:underline">
                    Politique de Confidentialité
                  </a>
                  {' '}et le traitement de mes données
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="app_download"
                  checked={contractData.accepts_app_download}
                  onCheckedChange={(checked) => setContractData(prev => ({ ...prev, accepts_app_download: checked }))}
                />
                <Label htmlFor="app_download" className="text-sm leading-5">
                  Je m'engage à télécharger l'application mobile Pikkles pour effectuer mes livraisons
                </Label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Après validation de votre dossier :</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Vérification documents et SIRET (24-48h)</li>
                <li>2. Activation de votre compte livreur</li>
                <li>3. Téléchargement de l'app mobile obligatoire</li>
                <li>4. Formation en ligne et première course</li>
              </ol>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`step-indicator ${
                      currentStep === step.id ? 'active' : 
                      currentStep > step.id ? 'completed' : 'inactive'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="form-slide-in border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center space-x-2 text-green-800">
              {steps.find(s => s.id === currentStep)?.icon}
              <span>Étape {currentStep}: {steps.find(s => s.id === currentStep)?.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between pt-8 mt-8 border-t border-green-200">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 border-green-300 text-green-600 hover:bg-green-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Précédent</span>
              </Button>

              <Button
                onClick={handleStepSubmit}
                disabled={!canProceedToNext() || loading}
                className="flex items-center space-x-2 btn-primary"
              >
                <span>{currentStep === 6 ? 'Finaliser l\'inscription' : 'Suivant'}</span>
                {currentStep < 6 && <ChevronRight className="h-4 w-4" />}
                {loading && <div className="loading-spinner h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegistration;