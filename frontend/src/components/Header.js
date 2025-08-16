import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { User, LogOut, Truck } from 'lucide-react';

const Header = ({ currentDriver, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo avec image cornichon */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="https://customer-assets.emergentagent.com/job_driver-signup/artifacts/7fbxvm54_PIKKLES.webp" 
                alt="Pikkles Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold pickle-text-gradient">
                Pikkles
              </span>
              <p className="text-xs text-green-600 -mt-1">Livraison verte</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Accueil
            </Link>
            <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Qui sommes-nous
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Comment ça marche
            </a>
            <a href="#contact" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-6">
            {currentDriver ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">
                    {currentDriver.profile?.firstname} {currentDriver.profile?.lastname}
                  </span>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="flex items-center space-x-2 border-green-300 text-green-600 hover:bg-green-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/inscription-livreur">
                  <Button size="sm" className="btn-primary px-6 py-2">
                    Devenir Livreur Pikkles
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;