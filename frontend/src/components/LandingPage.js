import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Smartphone, 
  FileText, 
  Shield, 
  CreditCard, 
  Users, 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Download,
  Truck
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Smartphone className="h-8 w-8 text-green-600" />,
      title: "App Mobile Dédiée",
      description: "Toutes vos livraisons gérées depuis votre téléphone"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      title: "Paiement Sécurisé",
      description: "RIB sécurisé et virements automatiques chaque semaine"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Statut Indépendant",
      description: "Travaillez avec votre SIRET en toute légalité"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Communauté Verte",
      description: "Rejoignez des milliers de livreurs éco-responsables"
    }
  ];

  const benefits = [
    "Inscription 100% en ligne",
    "Application mobile intuitive",
    "Liberté totale de vos horaires", 
    "Rémunération transparente",
    "Support dédié 7j/7",
    "Écologie au cœur de notre mission"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Inscription Web",
      description: "Créez votre compte livreur avec vos documents (SIRET obligatoire)",
      icon: <FileText className="h-6 w-6" />
    },
    {
      step: "2", 
      title: "Téléchargez l'App",
      description: "Installez notre application mobile dédiée aux livraisons",
      icon: <Download className="h-6 w-6" />
    },
    {
      step: "3",
      title: "Commencez à livrer",
      description: "Acceptez les courses et livrez en toute autonomie",
      icon: <Truck className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="https://customer-assets.emergentagent.com/job_driver-signup/artifacts/7fbxvm54_PIKKLES.webp" 
                alt="Pikkles - Cornichons Livreurs"
                className="h-24 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-6xl">🥒🥒</div>
            </div>
            
            <h1 className="hero-fade-in text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Livraisons vertes{' '}
              <span className="pickle-text-gradient">
                avec Pikkles
              </span>
            </h1>
            
            <p className="hero-fade-in-delay text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez la révolution de la livraison éco-responsable. 
              <br/>
              <strong>Site = Inscription • App Mobile = Livraisons</strong>
            </p>

            <div className="hero-fade-in-delay flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/inscription-livreur">
                <Button size="lg" className="btn-primary px-8 py-4 text-lg">
                  <FileText className="mr-2 h-5 w-5" />
                  S'inscrire comme livreur
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="btn-secondary px-8 py-4 text-lg">
                <Download className="mr-2 h-5 w-5" />
                Télécharger l'app
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1K+</div>
                <div className="text-gray-600">Livreurs Pikkles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">25K+</div>
                <div className="text-gray-600">Livraisons vertes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
                <div className="text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Qui sommes-nous ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pikkles est une plateforme de livraison urbaine qui connecte les livreurs indépendants 
              avec une mission claire : <strong className="text-green-600">révolutionner la livraison de manière éco-responsable</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover text-center p-6 border-0 shadow-sm hover:shadow-lg">
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

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Notre mission 🌱
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Nous croyons en une livraison plus humaine, plus verte et plus juste. 
                Chaque livreur Pikkles est un <strong>travailleur indépendant respecté</strong> 
                avec son propre SIRET, ses propres horaires et sa liberté d'entreprendre.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
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

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              3 étapes simples pour devenir livreur Pikkles
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <div className="bg-green-100 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-green-800 mb-2">
                  📱 Important à retenir
                </h4>
                <p className="text-green-700">
                  <strong>Ce site web</strong> sert uniquement à l'inscription des livreurs.
                  <br/>
                  <strong>Toute la gestion des livraisons</strong> se fait sur l'application mobile dédiée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pickle-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Rejoignez la révolution verte ! 🥒
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Devenez livreur indépendant Pikkles et participez à une livraison plus responsable
          </p>
          <Link to="/inscription-livreur">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-green-600 hover:bg-green-50">
              Commencer mon inscription
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une question ?
            </h2>
            <p className="text-xl text-gray-600">
              Notre équipe Pikkles vous accompagne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Renseignements</h3>
                <p className="text-gray-600">07 81 90 96 73</p>
                <p className="text-sm text-gray-500 mt-1">Lun-Ven 9h-18h</p>
                <p className="text-xs text-amber-600 mt-2">Pour questions générales et inscription</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">pikkles.delivery@gmail.com</p>
                <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                <p className="text-xs text-amber-600 mt-2">Pour candidatures et partenariats</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                📞 Support Livreur Dédié
              </h4>
              <p className="text-green-700">
                <strong>Disponible uniquement après validation de votre inscription</strong>
                <br/>
                Accès 7j/7 via votre dashboard livreur pour toute assistance technique
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;