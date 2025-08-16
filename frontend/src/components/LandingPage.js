import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Truck, 
  Clock, 
  Shield, 
  CreditCard, 
  Users, 
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
      title: "Paiement Instantané",
      description: "Recevez vos gains immédiatement avec Apple Pay et Google Pay"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Contrat Sécurisé",
      description: "Statut d'indépendant clair avec protection juridique complète"
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Support 7j/7",
      description: "Équipe dédiée disponible tous les jours pour vous accompagner"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Communauté Active",
      description: "Rejoignez des milliers de livreurs qui nous font confiance"
    }
  ];

  const benefits = [
    "Inscription 100% en ligne en 5 minutes",
    "Liberté totale de vos horaires",
    "Rémunération competitive et transparente",
    "Assurance et protection sociale incluses",
    "Formation et équipement fournis",
    "Interface mobile intuitive"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-fade-in text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Livraisons urbaines fiables{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                sans engagement
              </span>
            </h1>
            
            <p className="hero-fade-in-delay text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez la plateforme de livraison qui respecte votre indépendance. 
              Gagnez plus, travaillez mieux, vivez libre.
            </p>

            <div className="hero-fade-in-delay flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/inscription-livreur">
                <Button size="lg" className="btn-primary px-8 py-4 text-lg">
                  <Truck className="mr-2 h-5 w-5" />
                  Devenir Livreur
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="btn-secondary px-8 py-4 text-lg">
                En savoir plus
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">2K+</div>
                <div className="text-gray-600">Livreurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">50K+</div>
                <div className="text-gray-600">Livraisons/mois</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">4.9★</div>
                <div className="text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Pikkles ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous révolutionnons le secteur de la livraison en mettant les livreurs au centre
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover text-center p-6 border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits List */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Vos avantages en un coup d'œil
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            L'inscription ne prend que 5 minutes. Commencez à gagner dès aujourd'hui !
          </p>
          <Link to="/inscription-livreur">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-indigo-600 hover:bg-gray-50">
              S'inscrire maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Des questions ?
            </h2>
            <p className="text-xl text-gray-600">
              Notre équipe est là pour vous accompagner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
                <p className="text-gray-600">01 23 45 67 89</p>
                <p className="text-sm text-gray-500 mt-1">Lun-Dim 9h-20h</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@pikkles.fr</p>
                <p className="text-sm text-gray-500 mt-1">Réponse sous 2h</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">123 Avenue de la République</p>
                <p className="text-sm text-gray-500 mt-1">75011 Paris</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;