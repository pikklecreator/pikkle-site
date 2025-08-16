import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Pikkles</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Plateforme de livraison urbaine qui connecte les livreurs indépendants 
              avec des opportunités de revenus flexibles et sécurisées.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/inscription-livreur" className="text-gray-300 hover:text-white transition-colors">
                  Devenir Livreur
                </Link>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Avantages
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Juridique</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cgu" className="text-gray-300 hover:text-white transition-colors">
                  CGU Livreurs
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-300 hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/contrat-type" className="text-gray-300 hover:text-white transition-colors">
                  Contrat Type
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>contact@pikkles.fr</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Pikkles. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;