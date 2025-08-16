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
  Briefcase, 
  CreditCard, 
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle,
  AlertCircle
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
    address: ''
  });

  const [documentFiles, setDocumentFiles] = useState({
    identity_card_front: null,
    identity_card_back: null,
    proof_of_residence: null,
    residence_permit: null,
    driving_license: null,
    vehicle_insurance: null,
    criminal_record: null,
    vehicle_registration: null
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
    accepts_privacy_policy: false
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
      title: 'Identité', 
      icon: <FileText className="h-5 w-5" />,
      description: 'Vérification d\'identité'
    },
    { 
      id: 3, 
      title: 'Documents', 
      icon: <Briefcase className="h-5 w-5" />,
      description: 'Documents professionnels'
    },
    { 
      id: 4, 
      title: 'Banque', 
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Coordonnées bancaires'
    },
    { 
      id: 5, 
      title: 'Contrat', 
      icon: <FileCheck className="h-5 w-5" />,
      description: 'Contrat indépendant'
    }
  ];

  const handleFileChange = (documentType, file) => {
    setDocumentFiles(prev => ({
      ...prev,
      [documentType]: file
    }));
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
          
          // Update registration step
          await axios.put(`${API}/drivers/${driverId}`, {
            registration_step: 2
          });
          break;

        case 3:
          // Upload professional documents
          if (documentFiles.driving_license) {
            await uploadDocument('driving_license', documentFiles.driving_license);
          }
          if (documentFiles.vehicle_insurance) {
            await uploadDocument('vehicle_insurance', documentFiles.vehicle_insurance);
          }
          if (documentFiles.criminal_record) {
            await uploadDocument('criminal_record', documentFiles.criminal_record);
          }
          if (documentFiles.vehicle_registration) {
            await uploadDocument('vehicle_registration', documentFiles.vehicle_registration);
          }
          
          await axios.put(`${API}/drivers/${driverId}`, {
            registration_step: 3
          });
          break;

        case 4:
          // Save bank information
          await axios.put(`${API}/drivers/${driverId}`, {
            bank_info: bankData,
            registration_step: 4
          });
          break;

        case 5:
          // Complete registration
          const finalContractData = {
            ...contractData,
            signature_date: new Date().toISOString()
          };
          
          const completedDriver = await axios.put(`${API}/drivers/${driverId}`, {
            contract: finalContractData,
            registration_step: 5,
            status: 'under_review'
          });
          
          onDriverRegistered(completedDriver.data);
          return;
      }

      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Handle error - you might want to show a toast/alert here
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return profileData.firstname && profileData.lastname && profileData.email && profileData.phone && profileData.address;
      case 2:
        return documentFiles.identity_card_front && documentFiles.proof_of_residence;
      case 3:
        return documentFiles.driving_license && documentFiles.vehicle_insurance;
      case 4:
        return bankData.bank_name && bankData.iban && bankData.account_holder_name;
      case 5:
        return contractData.auto_entrepreneur_status && contractData.accepts_cgu && contractData.accepts_privacy_policy;
      default:
        return false;
    }
  };

  const FileUploadArea = ({ documentType, title, required = false, accept = ".jpg,.jpeg,.png,.pdf" }) => {
    const file = documentFiles[documentType];
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className={`file-upload-area p-6 rounded-lg text-center ${file ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom *</Label>
                <Input
                  id="firstname"
                  value={profileData.firstname}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstname: e.target.value }))}
                  placeholder="Votre prénom"
                  required
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète *</Label>
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Numéro, rue, ville, code postal..."
                rows={3}
                required
              />
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
                  <p className="text-sm font-medium text-blue-800">Documents requis</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Carte d'identité (recto-verso) et justificatif de domicile de moins de 3 mois
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
                title="Justificatif de domicile"
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
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Documents professionnels</p>
                  <p className="text-sm text-amber-600 mt-1">
                    Permis de conduire, assurance véhicule et attestation B3 recommandés
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadArea 
                documentType="driving_license"
                title="Permis de conduire"
                required
              />
              <FileUploadArea 
                documentType="vehicle_insurance"
                title="Assurance véhicule"
                required
              />
              <FileUploadArea 
                documentType="criminal_record"
                title="Attestation B3 (casier judiciaire)"
              />
              <FileUploadArea 
                documentType="vehicle_registration"
                title="Carte grise du véhicule"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Informations importantes</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Le permis B est obligatoire pour véhicules légers</li>
                <li>• L'assurance doit couvrir l'usage professionnel</li>
                <li>• L'attestation B3 filtre les antécédents judiciaires</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Paiements sécurisés</p>
                  <p className="text-sm text-green-600 mt-1">
                    Vos informations bancaires sont protégées et chiffrées
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bic">Code BIC/SWIFT</Label>
                <Input
                  id="bic"
                  value={bankData.bic}
                  onChange={(e) => setBankData(prev => ({ ...prev, bic: e.target.value.toUpperCase() }))}
                  placeholder="BNPAFRPPXXX"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-800">Finalisation</p>
                  <p className="text-sm text-indigo-600 mt-1">
                    Dernière étape : acceptez les conditions pour devenir livreur Pikkles
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
                  Je certifie exercer en tant qu'auto-entrepreneur ou avoir les autorisations nécessaires pour cette activité
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
                  <a href="/cgu" target="_blank" className="text-indigo-600 hover:underline">
                    Conditions Générales d'Utilisation
                  </a>
                  {' '}et le contrat de prestation de services
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
                  <a href="/confidentialite" target="_blank" className="text-indigo-600 hover:underline">
                    Politique de Confidentialité
                  </a>
                  {' '}et le traitement de mes données personnelles
                </Label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Prochaines étapes</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Vérification de votre dossier (24-48h)</li>
                <li>2. Validation de vos documents</li>
                <li>3. Activation de votre compte livreur</li>
                <li>4. Accès au dashboard et première mission</li>
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
        <Card className="form-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {steps.find(s => s.id === currentStep)?.icon}
              <span>Étape {currentStep}: {steps.find(s => s.id === currentStep)?.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between pt-8 mt-8 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Précédent</span>
              </Button>

              <Button
                onClick={handleStepSubmit}
                disabled={!canProceedToNext() || loading}
                className="flex items-center space-x-2 btn-primary"
              >
                <span>{currentStep === 5 ? 'Finaliser l\'inscription' : 'Suivant'}</span>
                {currentStep < 5 && <ChevronRight className="h-4 w-4" />}
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