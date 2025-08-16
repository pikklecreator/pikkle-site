import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Euro,
  Calendar,
  Download,
  Upload,
  Phone,
  Mail
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DriverDashboard = ({ driver }) => {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [driver]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, paymentsResponse] = await Promise.all([
        axios.get(`${API}/drivers/${driver.id}/stats`),
        axios.get(`${API}/drivers/${driver.id}/payments`)
      ]);
      
      setStats(statsResponse.data);
      setPayments(paymentsResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { label: 'En attente', className: 'status-pending' },
      'under_review': { label: 'En cours de vérification', className: 'status-pending' },
      'approved': { label: 'Approuvé', className: 'status-validated' },
      'rejected': { label: 'Rejeté', className: 'status-missing' }
    };

    const badge = badges[status] || badges['pending'];
    return (
      <Badge className={`status-badge ${badge.className}`}>
        {badge.label}
      </Badge>
    );
  };

  const getDocumentStatus = (hasDocument) => {
    if (hasDocument) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bonjour {driver.profile?.firstname} !
              </h1>
              <p className="text-gray-600">
                Bienvenue sur votre espace livreur Pikkles
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {getStatusBadge(driver.status)}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Solde disponible</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats?.current_balance || 0)}
                  </p>
                </div>
                <Euro className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Livraisons</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats?.total_deliveries || 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gains totaux</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(stats?.total_earnings || 0)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prochain virement</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {stats?.next_payout_date || 'À venir'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Alert */}
        {driver.status === 'under_review' && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium text-amber-800">Dossier en cours de vérification</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Notre équipe examine votre dossier. Vous recevrez une notification dès validation (24-48h).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Statut du compte</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Identité vérifiée</span>
                      {stats?.document_status?.identity_verified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Documents complets</span>
                      {stats?.document_status?.documents_complete ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">RIB validé</span>
                      {stats?.document_status?.bank_info_complete ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Contrat signé</span>
                      {stats?.document_status?.contract_signed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger RIB
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Contacter support
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Mes messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Mes documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Documents d'identité</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Carte d'identité (recto)</span>
                        {getDocumentStatus(driver.documents?.identity_card_front)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Carte d'identité (verso)</span>
                        {getDocumentStatus(driver.documents?.identity_card_back)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Justificatif de domicile</span>
                        {getDocumentStatus(driver.documents?.proof_of_residence)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Titre de séjour</span>
                        {getDocumentStatus(driver.documents?.residence_permit)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Statut indépendant</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">SIRET fourni</span>
                        {getDocumentStatus(driver.business_info?.siret)}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">SIRET vérifié</span>
                        {stats?.document_status?.siret_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">K-bis / Attestation URSSAF</span>
                        {getDocumentStatus(driver.documents?.kbis_document)}
                      </div>
                    </div>
                    
                    {driver.business_info && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Entreprise :</strong> {driver.business_info.company_name}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          <strong>SIRET :</strong> {driver.business_info.siret}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Historique des paiements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Aucun paiement pour le moment</p>
                    <p className="text-sm text-gray-500">
                      Vos gains apparaîtront ici après votre première livraison
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.created_at).toLocaleDateString('fr-FR')} • {payment.payment_method}
                          </p>
                        </div>
                        <Badge className={payment.status === 'completed' ? 'status-validated' : 'status-pending'}>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Mon profil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Informations personnelles</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nom complet</label>
                        <p className="mt-1">{driver.profile?.firstname} {driver.profile?.lastname}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="mt-1">{driver.profile?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Téléphone</label>
                        <p className="mt-1">{driver.profile?.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Adresse</label>
                        <p className="mt-1 text-sm">{driver.profile?.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Informations bancaires</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Banque</label>
                        <p className="mt-1">{driver.bank_info?.bank_name || 'Non renseignée'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Titulaire</label>
                        <p className="mt-1">{driver.bank_info?.account_holder_name || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">IBAN</label>
                        <p className="mt-1 font-mono text-sm">
                          {driver.bank_info?.iban ? 
                            `${driver.bank_info.iban.substring(0, 8)}****${driver.bank_info.iban.substring(driver.bank_info.iban.length - 4)}` 
                            : 'Non renseigné'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button variant="outline">
                    Modifier mes informations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboard;