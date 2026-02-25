import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Componentes
import LoginForm from './Components/LoginForm/LoginForm';
import Navbar from './Components/Navbar/Navbar';
import Dashboard from './Components/Dashboard/Dashboard';
import Viviendas from './Components/AparmentList/AparmentList';
import Incidencias from './Components/Incidencias/Incidencias';
import Contratos from './Components/Contratos/ContractsList'
import ProtectedRoute from "./Components/ProtectedRoute";
import ContratoDetalle from "./Components/ContratoDetalle/ContractDetail";

function App() {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login: Sin Navbar */}
        <Route path="/" element={<LoginForm />} />

        {/* Rutas Privadas: Con Navbar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-vh-100 bg-light">
              <Navbar onOpenConfig={() => setShowConfig(true)} />
              
              <div className="container-fluid py-4">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="viviendas" element={<Viviendas />} />
                  <Route path="incidencias" element={<Incidencias />} />
                  <Route path="contratos" element={<Contratos/>} />
                  <Route path="contratos/:id" element={<ContratoDetalle/>} />
                  {/* Redirección por defecto si no encuentra la ruta */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;