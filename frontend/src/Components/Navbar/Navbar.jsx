import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Bell,} from 'lucide-react';
import './Navbar.css'; 
import '../Assets/casa.png'
import Configuracion from '../Forms/Configuracion';


const Navbar = () => {
  const location = useLocation();
  
  // Función auxiliar para saber si el link está activo
  const isActive = (path) => location.pathname === path ? 'text-dark fw-bold' : 'text-muted';

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 px-4 sticky-top shadow-sm" style={{height: '80px'}}>
        <div className="container-fluid p-0">
          
          {/* LOGO */}
            <img src="{casaLogo}" alt="Logo" style={{width: '40px', height: '40px', objectFit: 'contain'}} />

            <div className="d-flex flex-column" style={{lineHeight: '1.1'}}>
              <span className="fw-bold fs-6">Administración</span>
              <span className="text-secondary small">de Rentas</span>
            </div>
          

          {/* MENÚ CENTRAL (Agregado Contratos) */}
          <div className="d-none d-md-flex align-items-center gap-4 mx-auto bg-light px-4 py-2 rounded-pill">
            <Link to="/viviendas" className={`text-decoration-none small ${isActive('/viviendas')}`}>Viviendas</Link>
            <Link to="/dashboard" className={`text-decoration-none small ${isActive('/dashboard')}`}>Dashboard</Link>
            <Link to="/incidencias" className={`text-decoration-none small ${isActive('/incidencias')}`}>Incidencias</Link>
            <Link to="/contratos" className={`text-decoration-none small ${isActive('/contratos')}`}>Contratos</Link>
          </div>

          {/* BOTONES DERECHA (Con estilo circular como pediste) */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/configuracion"
              className="btn btn-light bg-white border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
              style={{width: '40px', height: '40px'}}
              title= "Configuración">
              <Settings size={20} className="text-secondary"/>
            </Link>

            <button className="btn btn-light bg-white border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              <Bell size={20} className="text-secondary"/>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{width:'10px', height:'10px'}}></span>
            </button>

            <div className="d-flex align-items-center gap-2 bg-white border rounded-pill ps-1 pe-3 py-1 shadow-sm cursor-pointer hover-effect">
               <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px', fontSize: '14px'}}>
                 AD
               </div>
               <span className="small fw-bold text-dark"></span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
