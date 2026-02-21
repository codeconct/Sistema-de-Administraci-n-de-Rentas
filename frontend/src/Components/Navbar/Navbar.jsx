import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Bell, User, X, TrendingUp, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import './Navbar.css'; // Asegurar de que exista o usa estilos en línea

// --- 1. MODAL DE CONFIGURACIÓN (Movido al Navbar para que funcione el botón de arriba) ---
const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('app');
  // Usamos localStorage para guardar cambios y que el Dashboard los pueda leer
  const [appName, setAppName] = useState(localStorage.getItem('appName') || "Administración de Rentas");
  const [mora, setMora] = useState(JSON.parse(localStorage.getItem('moraSettings')) || { tipo: 'PORCENTAJE', valor: 10 });

  const handleSave = () => {
    localStorage.setItem('appName', appName);
    localStorage.setItem('moraSettings', JSON.stringify(mora));
    // Disparamos un evento para avisar al Dashboard que los datos cambiaron
    window.dispatchEvent(new Event('storage'));
    alert("✅ Configuración guardada. Recarga la página para ver cambios en cálculos.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000}}>
      <div className="bg-white rounded-4 shadow-lg d-flex overflow-hidden" style={{width: '800px', height: '600px'}}>
        {/* Sidebar del Modal */}
        <div className="bg-light p-4 border-end" style={{width: '240px'}}>
          <h6 className="mb-4 fw-bold text-secondary small">CONFIGURACIÓN</h6>
          <div className={`p-3 cursor-pointer rounded-3 mb-2 d-flex align-items-center gap-2 ${activeTab === 'app' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`} onClick={() => setActiveTab('app')}>
            <Settings size={18}/> General
          </div>
          <div className={`p-3 cursor-pointer rounded-3 mb-2 d-flex align-items-center gap-2 ${activeTab === 'pago' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`} onClick={() => setActiveTab('pago')}>
            <TrendingUp size={18}/> Cobros y Mora
          </div>
          <div className={`p-3 cursor-pointer rounded-3 mb-2 d-flex align-items-center gap-2 ${activeTab === 'pasarelas' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`} onClick={() => setActiveTab('pasarelas')}>
            <CreditCard size={18}/> Pasarelas Pago
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="p-4 flex-grow-1 d-flex flex-column font-sans text-start">
          <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
            <h5 className="fw-bold m-0">Ajustes del Sistema</h5>
            <button className="btn btn-link text-dark p-0" onClick={onClose}><X size={24}/></button>
          </div>

          <div className="flex-grow-1 overflow-auto pe-2">
            {activeTab === 'app' && (
              <div className="mb-4">
                <label className="form-label fw-bold small">Nombre del Edificio</label>
                <input type="text" className="form-control" value={appName} onChange={(e) => setAppName(e.target.value)} />
              </div>
            )}
            {activeTab === 'pago' && (
               <div className="p-3 bg-warning bg-opacity-10 rounded-3 border border-warning">
                 <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark"><AlertCircle size={18}/> Cálculo de Recargos</h6>
                 <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Tipo</label>
                        <select className="form-select" value={mora.tipo} onChange={(e) => setMora({...mora, tipo: e.target.value})}>
                            <option value="PORCENTAJE">Porcentaje (%)</option>
                            <option value="FIJO">Monto Fijo ($)</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Valor</label>
                        <input type="number" className="form-control" value={mora.valor} onChange={(e) => setMora({...mora, valor: Number(e.target.value)})}/>
                    </div>
                 </div>
               </div>
            )}
            {activeTab === 'pasarelas' && (
                <div className="alert alert-info small d-flex align-items-center gap-2 rounded-3">
                    <CheckCircle size={16}/> <span>Configuración de Stripe, Conekta y MercadoPago disponible próximamente.</span>
                </div>
            )}
          </div>
          <div className="text-end mt-4 pt-3 border-top">
             <button className="btn btn-light border me-2 fw-bold" onClick={onClose}>Cancelar</button>
             <button className="btn btn-primary fw-bold" onClick={handleSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. COMPONENTE NAVBAR PRINCIPAL ---
const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  
  // Función auxiliar para saber si el link está activo
  const isActive = (path) => location.pathname === path ? 'text-dark fw-bold' : 'text-muted';

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 px-4 sticky-top shadow-sm" style={{height: '80px'}}>
        <div className="container-fluid p-0">
          
          {/* LOGO */}
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="bg-success rounded-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              <HomeIcon /> 
            </div>
            <div className="d-flex flex-column" style={{lineHeight: '1.1'}}>
              <span className="fw-bold fs-6">Administración</span>
              <span className="text-secondary small">de Rentas</span>
            </div>
          </Link>

          {/* MENÚ CENTRAL (Agregado Contratos) */}
          <div className="d-none d-md-flex align-items-center gap-4 mx-auto bg-light px-4 py-2 rounded-pill">
            <Link to="/viviendas" className={`text-decoration-none small ${isActive('/viviendas')}`}>Viviendas</Link>
            <Link to="/dashboard" className={`text-decoration-none small ${isActive('/dashboard')}`}>Dashboard</Link>
            <Link to="/incidencias" className={`text-decoration-none small ${isActive('/incidencias')}`}>Incidencias</Link>
            <Link to="/contratos" className={`text-decoration-none small ${isActive('/contratos')}`}>Contratos</Link>
          </div>

          {/* BOTONES DERECHA (Con estilo circular como pediste) */}
          <div className="d-flex align-items-center gap-3">
            <button 
                className="btn btn-light bg-white border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center position-relative"
                style={{width: '40px', height: '40px'}}
                onClick={() => setShowSettings(true)}
                title="Configuración"
            >
              <Settings size={20} className="text-secondary"/>
            </button>

            <button className="btn btn-light bg-white border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              <Bell size={20} className="text-secondary"/>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{width:'10px', height:'10px'}}></span>
            </button>

            <div className="d-flex align-items-center gap-2 bg-white border rounded-pill ps-1 pe-3 py-1 shadow-sm cursor-pointer hover-effect">
               <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px', fontSize: '14px'}}>
                 AD
               </div>
               <span className="small fw-bold text-dark">Admin</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Renderizamos el Modal aquí */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

// Icono simple para el logo
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white" width="24" height="24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

export default Navbar;