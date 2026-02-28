import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Bell, X } from 'lucide-react';
import './Navbar.css';
import casaLogo from '../Assets/casa.png';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? 'text-dark fw-bold' : 'text-muted');

  // --- MODAL & SETTINGS STATE ---
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pagos'); // 'pagos' or 'mora'

  const [paymentKeys, setPaymentKeys] = useState({
    stripe: '',
    conekta: '',
    mercadoPago: '',
    openpayId: '',
    openpayKey: ''
  });

  const [moraSettings, setMoraSettings] = useState({ tipo: 'PORCENTAJE', valor: 10 });

  // Load existing settings when modal opens
  useEffect(() => {
    const savedKeys = JSON.parse(localStorage.getItem('paymentKeys'));
    const savedMora = JSON.parse(localStorage.getItem('moraSettings'));
    if (savedKeys) setPaymentKeys(savedKeys);
    if (savedMora) setMoraSettings(savedMora);
  }, [showModal]);

  const handlePaymentChange = (e) => {
    setPaymentKeys({ ...paymentKeys, [e.target.name]: e.target.value });
  };

  const handleMoraChange = (e) => {
    setMoraSettings({ ...moraSettings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save to local storage
    localStorage.setItem('paymentKeys', JSON.stringify(paymentKeys));
    localStorage.setItem('moraSettings', JSON.stringify({
      tipo: moraSettings.tipo,
      valor: parseFloat(moraSettings.valor) || 0
    }));
    
    // Trigger storage event so Dashboard updates in real-time
    window.dispatchEvent(new Event('storage'));
    setShowModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 px-4 sticky-top shadow-sm" style={{ height: '80px', zIndex: 1000 }}>
        <div className="container-fluid p-0">
          
          {/* LOGO */}
          <div className="d-flex align-items-center">
            <img src={casaLogo} alt="Logo" style={{ width: '52px', height: '52px', objectFit: 'contain', marginRight: '10px' }} />
            <div className="d-flex flex-column" style={{ lineHeight: '1.1' }}>
              <span className="fw-bold fs-6">Administración</span>
              <span className="text-secondary small">de Rentas</span>
            </div>
          </div>

          {/* MENÚ CENTRAL */}
          <div className="d-none d-md-flex align-items-center gap-4 mx-auto bg-light px-4 py-2 rounded-pill">
            <Link to="/viviendas" className={`text-decoration-none small ${isActive('/viviendas')}`}>Viviendas</Link>
            <Link to="/dashboard" className={`text-decoration-none small ${isActive('/dashboard')}`}>Dashboard</Link>
            <Link to="/incidencias" className={`text-decoration-none small ${isActive('/incidencias')}`}>Incidencias</Link>
            <Link to="/contratos" className={`text-decoration-none small ${isActive('/contratos')}`}>Contratos</Link>
          </div>

          {/* BOTONES DERECHA */}
          <div className="d-flex align-items-center gap-3">
            {/* Changed from Link to Button to trigger Modal */}
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-light bg-white border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              title="Configuración"
            >
              <Settings size={20} className="text-secondary" />
            </button>

            <button className="btn btn-light bg-white border rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center position-relative" style={{ width: '40px', height: '40px' }}>
              <Bell size={20} className="text-secondary" />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ width: '10px', height: '10px' }} />
            </button>

            <div className="d-flex align-items-center gap-2 bg-white border rounded-pill ps-1 pe-3 py-1 shadow-sm cursor-pointer hover-effect">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                AD
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- CONFIGURATION MODAL OVERLAY --- */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="bg-white rounded-4 shadow-lg d-flex flex-column" style={{ width: '800px', maxWidth: '95%', maxHeight: '90vh' }}>
            
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h4 className="fw-bold m-0" style={{ color: '#1B2559' }}>Configuración</h4>
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-light rounded-circle p-2">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body with Sidebar */}
            <div className="d-flex flex-grow-1 overflow-hidden">
              {/* Sidebar */}
              <div className="bg-light border-end" style={{ width: '250px' }}>
                <ul className="list-unstyled p-0 m-0">
                  <li>
                    <button 
                      className={`w-100 text-start px-4 py-3 border-0 ${activeTab === 'pagos' ? 'bg-white fw-bold border-start border-primary border-4' : 'bg-transparent text-muted'}`}
                      onClick={() => setActiveTab('pagos')}
                    >
                      Información de Pago
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-100 text-start px-4 py-3 border-0 ${activeTab === 'mora' ? 'bg-white fw-bold border-start border-primary border-4' : 'bg-transparent text-muted'}`}
                      onClick={() => setActiveTab('mora')}
                    >
                      Cobros y Mora
                    </button>
                  </li>
                </ul>
              </div>

              {/* Content Area */}
              <div className="flex-grow-1 p-4 overflow-auto">
                
                {/* TAB: PAGOS (Includes Openpay) */}
                {activeTab === 'pagos' && (
                  <div>
                    <h5 className="fw-bold mb-4" style={{ color: '#1B2559' }}>Integración de Pagos</h5>
                    <div className="alert alert-info d-flex align-items-center mb-4 border-0" style={{ backgroundColor: '#E0F7FA', color: '#006064' }}>
                      <span className="me-2">✓</span> Ingrese sus llaves de prueba (Sandbox/Test)
                    </div>

                    <div className="mb-3 p-3 border rounded">
                      <label className="form-label fw-bold" style={{ color: '#4318FF' }}>Stripe (Tarjetas)</label>
                      <input type="text" name="stripe" className="form-control" placeholder="pk_test_..." value={paymentKeys.stripe} onChange={handlePaymentChange} />
                    </div>

                    <div className="mb-3 p-3 border rounded">
                      <label className="form-label fw-bold" style={{ color: '#05CD99' }}>Conekta (OXXO Pay)</label>
                      <input type="text" name="conekta" className="form-control" placeholder="key_..." value={paymentKeys.conekta} onChange={handlePaymentChange} />
                    </div>

                    <div className="mb-3 p-3 border rounded">
                      <label className="form-label fw-bold" style={{ color: '#009EE3' }}>MercadoPago (QR/SPEI)</label>
                      <input type="text" name="mercadoPago" className="form-control" placeholder="TEST-..." value={paymentKeys.mercadoPago} onChange={handlePaymentChange} />
                    </div>

                    {/* NEW: OPENPAY */}
                    <div className="mb-4 p-3 border rounded border-primary bg-light">
                      <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>Openpay (BBVA)</label>
                      <div className="d-flex gap-2">
                        <input type="text" name="openpayId" className="form-control w-50" placeholder="Merchant ID" value={paymentKeys.openpayId} onChange={handlePaymentChange} />
                        <input type="text" name="openpayKey" className="form-control w-50" placeholder="Private Key (sk_test_...)" value={paymentKeys.openpayKey} onChange={handlePaymentChange} />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: MORA */}
                {activeTab === 'mora' && (
                  <div>
                    <h5 className="fw-bold mb-4" style={{ color: '#1B2559' }}>Cobros y Mora</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tipo de recargo</label>
                        <select name="tipo" className="form-select" value={moraSettings.tipo} onChange={handleMoraChange}>
                          <option value="PORCENTAJE">Porcentaje (%)</option>
                          <option value="FIJO">Monto Fijo ($)</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Valor</label>
                        <input type="number" name="valor" className="form-control" value={moraSettings.valor} onChange={handleMoraChange} />
                      </div>
                    </div>
                    <p className="text-muted small mt-2">
                      * Este valor se aplicará automáticamente a los inquilinos con estatus "Vencido" en el Dashboard.
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-top d-flex justify-content-end gap-2 bg-light rounded-bottom-4">
              <button className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary px-4" onClick={handleSave} style={{ backgroundColor: '#4318FF', border: 'none' }}>Guardar</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;