import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { User, LogOut, Truck } from 'lucide-react';

const Header = ({ currentDriver, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pikkles
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Accueil
            </Link>
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Avantages
            </a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {currentDriver ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
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
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/inscription-livreur">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription-livreur">
                  <Button size="sm" className="btn-primary">
                    Devenir Livreur
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