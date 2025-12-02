import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Viviendas from './Components/AparmentList/AparmentList';
import Dashboard from './Components/Dashboard/Dashboard';
import Incidencias from './Components/Incidencias/Incidencias';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>

      {/* Rutas SIN navbar */}
      <Routes>
        <Route path="/" element={<LoginForm />} />

        {/* Rutas CON navbar */}
        <Route path="/*" element={
          <>
            <Navbar />   {/* en esta parte de aca se pueden acomodar las diversas paginas y a donde deberian de ir */}
            <Routes>
              <Route path="viviendas" element={<ProtectedRoute> <Viviendas /> </ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
              <Route path="incidencias" element={<ProtectedRoute> <Incidencias /> </ProtectedRoute>} />
            </Routes>
          </>
        } />

        {/* en caso de que la ruta no exista */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>
  );
}
export default App;
