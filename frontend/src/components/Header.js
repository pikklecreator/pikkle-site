import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ currentDriver, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-center items-center h-18 py-2">
          {/* Navigation centrée */}
          <nav className="flex items-center space-x-10">
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
            {currentDriver && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={onLogout}
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Déconnexion
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;