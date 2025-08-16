import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Components
import LandingPage from "./components/LandingPage";
import DriverRegistration from "./components/DriverRegistration";
import DriverDashboard from "./components/DriverDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentDriver, setCurrentDriver] = useState(null);

  useEffect(() => {
    // Check if driver is logged in (simple session check)
    const driverId = localStorage.getItem('driverId');
    if (driverId) {
      fetchDriverData(driverId);
    }
  }, []);

  const fetchDriverData = async (driverId) => {
    try {
      const response = await axios.get(`${API}/drivers/${driverId}`);
      setCurrentDriver(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du livreur:', error);
      localStorage.removeItem('driverId');
    }
  };

  const handleDriverRegistered = (driver) => {
    setCurrentDriver(driver);
    localStorage.setItem('driverId', driver.id);
  };

  const handleLogout = () => {
    setCurrentDriver(null);
    localStorage.removeItem('driverId');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header currentDriver={currentDriver} onLogout={handleLogout} />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/inscription-livreur" 
                element={
                  currentDriver ? 
                  <Navigate to="/dashboard" replace /> : 
                  <DriverRegistration onDriverRegistered={handleDriverRegistered} />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  currentDriver ? 
                  <DriverDashboard driver={currentDriver} /> : 
                  <Navigate to="/inscription-livreur" replace />
                } 
              />
              <Route path="/cgu" element={<div className="container mx-auto py-16 px-4"><h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1><p>Contenu des CGU à venir...</p></div>} />
              <Route path="/confidentialite" element={<div className="container mx-auto py-16 px-4"><h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1><p>Contenu RGPD à venir...</p></div>} />
              <Route path="/contrat-type" element={<div className="container mx-auto py-16 px-4"><h1 className="text-3xl font-bold mb-8">Contrat Indépendant Type</h1><p>Modèle de contrat à venir...</p></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;