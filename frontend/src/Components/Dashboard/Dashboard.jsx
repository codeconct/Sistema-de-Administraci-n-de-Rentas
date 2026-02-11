import React, { useState, useEffect, useMemo } from "react";
import "./Dashboard.css";
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Settings, Bell, AlertTriangle, User } from 'lucide-react'; 

// --- 1. COMPONENTE: MODAL DE CONFIGURACIÓN (SIMPLIFICADO) ---
const SettingsModal = ({ isOpen, onClose, appName, setAppName, logo, setLogo }) => {
  const [activeTab, setActiveTab] = useState('app');
  const [tempName, setTempName] = useState(appName);

  useEffect(() => { if (isOpen) setTempName(appName); }, [isOpen, appName]);
  if (!isOpen) return null;

  const handleSave = () => {
    setAppName(tempName);
    onClose();
    alert("✅ Configuración visual actualizada.");
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  return (
    <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="bg-white rounded shadow-lg d-flex overflow-hidden" style={{width: '700px', height: '500px'}}>
        {/* Sidebar */}
        <div className="bg-light p-4 border-end" style={{width: '200px'}}>
          <h6 className="mb-4 fw-bold">Ajustes</h6>
          <div className={`p-2 cursor-pointer rounded mb-2 ${activeTab === 'app' ? 'bg-white shadow-sm fw-bold' : ''}`} onClick={() => setActiveTab('app')}>Personalización</div>
          <div className={`p-2 cursor-pointer rounded mb-2 ${activeTab === 'pago' ? 'bg-white shadow-sm fw-bold' : ''}`} onClick={() => setActiveTab('pago')}>Pagos</div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow-1 d-flex flex-column">
          <div className="d-flex justify-content-between mb-4">
            <h5>{activeTab === 'app' ? 'Apariencia' : 'Configuración de Cobro'}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            {activeTab === 'app' && (
              <>
                <div className="mb-3">
                  <label className="form-label">Nombre del Edificio / Dashboard</label>
                  <input type="text" className="form-control" value={tempName} onChange={(e) => setTempName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Logotipo</label>
                  <input type="file" className="form-control" onChange={handleLogoChange} accept="image/*"/>
                </div>
              </>
            )}
            {activeTab === 'pago' && (
               <div className="alert alert-info">Aquí podrías configurar tus llaves de Stripe o PayPal para recibir los pagos de renta.</div>
            )}
          </div>
          
          <div className="text-end mt-3 border-top pt-3">
             <button className="btn btn-primary" onClick={handleSave}>Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. DATOS BASE ---
const dataBase = [
  { id: 1, nombre: "Juan Perez", departamento: "101", montoOriginal: 5000, estatus: "Pagado", fecha: "2023-10-01" },
  { id: 2, nombre: "Jose Gomez", departamento: "165", montoOriginal: 4500, estatus: "Pendiente", fecha: "2023-10-05" },
  { id: 3, nombre: "Ana Martinez", departamento: "210", montoOriginal: 5200, estatus: "Vencido", fecha: "2023-09-15" },
  { id: 4, nombre: "Carlos Ruiz", departamento: "305", montoOriginal: 5000, estatus: "Vencido", fecha: "2023-10-02" },
  { id: 5, nombre: "Mario Bros", departamento: "101", montoOriginal: 5000, estatus: "Vencido", fecha: "2023-08-01" }, 
];

const dataMensual = [
  { name: "Ene", ingresos: 4000 }, { name: "Feb", ingresos: 3000 }, { name: "Mar", ingresos: 2000 }, 
  { name: "Abr", ingresos: 2780 }, { name: "May", ingresos: 1890 }, { name: "Jun", ingresos: 2390 },
];

const formatoMoneda = (valor) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);

// --- 3. DASHBOARD PRINCIPAL ---
const Dashboard = () => {
  // Configuración Global
  const [appName, setAppName] = useState("Administración de Rentas");
  const [appLogo, setAppLogo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Estados de Lógica de Negocio (Mora)
  const [tipoMora, setTipoMora] = useState('PORCENTAJE'); // 'FIJO' o 'PORCENTAJE'
  const [valorMora, setValorMora] = useState(10); // Valor por defecto 10%
  
  // Estado derivado: Calcula los pagos aplicando la mora en tiempo real
  const datosProcesados = useMemo(() => {
    return dataBase.map(item => {
      let moraCalculada = 0;
      let totalPagar = item.montoOriginal;

      // LÓGICA: Solo aplicamos mora si está Vencido
      if (item.estatus === 'Vencido') {
        if (tipoMora === 'FIJO') {
          moraCalculada = parseFloat(valorMora) || 0;
        } else {
          moraCalculada = (item.montoOriginal * (parseFloat(valorMora) || 0)) / 100;
        }
        totalPagar = item.montoOriginal + moraCalculada;
      }

      return {
        ...item,
        mora: moraCalculada,
        total: totalPagar
      };
    });
  }, [tipoMora, valorMora]);

  // Cálculos de KPI
  const carteraVencidaTotal = datosProcesados
    .filter(p => p.estatus === 'Vencido')
    .reduce((acc, curr) => acc + curr.total, 0); 

  const totalRecaudado = datosProcesados
    .filter(p => p.estatus === 'Pagado')
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column font-sans">
      
      {/* HEADER */}
      <div className="bg-white shadow-sm py-3 px-4 mb-4 d-flex justify-content-between align-items-center sticky-top">
        <div className="d-flex align-items-center gap-3">
            {appLogo ? <img src={appLogo} alt="Logo" style={{height: '40px'}} /> : <span className="fs-2">🏘️</span>}
            <h5 className="m-0 fw-bold text-dark">{appName}</h5>
        </div>
        <div className="d-flex align-items-center gap-4 text-secondary">
            <span className="btn btn-link text-decoration-none text-secondary fw-bold">Dashboard</span>
            <div className="border-start ps-4 d-flex gap-3">
                <button className="btn btn-light rounded-circle p-2" onClick={() => setShowSettings(true)} title="Configuración">
                    <Settings size={20} />
                </button>
                <button className="btn btn-light rounded-circle p-2 position-relative">
                    <Bell size={20} />
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                </button>
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>JP</div>
            </div>
        </div>
      </div>

      <div className="container-fluid px-4">
        
        {/* TARJETAS KPI */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-sm border-start border-5 border-success h-100">
              <small className="text-uppercase text-muted fw-bold">Recaudado (Sin Mora)</small>
              <h2 className="text-dark fw-bold mb-0">{formatoMoneda(totalRecaudado)}</h2>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-sm border-start border-5 border-danger h-100">
              <div className="d-flex justify-content-between">
                  <small className="text-uppercase text-muted fw-bold">Cartera Vencida (Con Mora)</small>
                  <AlertTriangle size={20} className="text-danger"/>
              </div>
              <h2 className="text-danger fw-bold mb-0">{formatoMoneda(carteraVencidaTotal)}</h2>
              <small className="text-danger">Incluye penalizaciones aplicadas</small>
            </div>
          </div>

          {/* TARJETA CONFIGURACIÓN MORA (FUNCIONAL) */}
          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-sm border-start border-5 border-primary h-100">
               <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-uppercase text-primary fw-bold">Configuración de Penalización</small>
                  <Settings size={16} className="text-muted"/>
               </div>
               
               <div className="row g-2 align-items-center">
                   <div className="col-5">
                       <select className="form-select form-select-sm" value={tipoMora} onChange={(e) => setTipoMora(e.target.value)}>
                           <option value="PORCENTAJE">Porcentaje (%)</option>
                           <option value="FIJO">Monto Fijo ($)</option>
                       </select>
                   </div>
                   <div className="col-7">
                       <div className="input-group input-group-sm">
                           <span className="input-group-text">{tipoMora === 'FIJO' ? '$' : '%'}</span>
                           <input 
                                type="number" 
                                className="form-control" 
                                value={valorMora} 
                                onChange={(e) => setValorMora(e.target.value)}
                           />
                       </div>
                   </div>
               </div>
               <small className="text-muted mt-2 d-block fst-italic">
                   *Cambiar esto actualiza la deuda en tiempo real.
               </small>
            </div>
          </div>
        </div>

        {/* GRÁFICA Y TABLA */}
        <div className="row">
            <div className="col-lg-8 mb-4">
                <div className="bg-white p-4 rounded shadow-sm h-100">
                    <h6 className="fw-bold mb-4">Proyección de Ingresos</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dataMensual}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="ingresos" stroke="#6e41ba" strokeWidth={3} dot={{r:6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-lg-4 mb-4">
                <div className="bg-white p-4 rounded shadow-sm h-100">
                    <h6 className="fw-bold mb-4">Resumen de Pagos</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={[
                                    { name: 'Pagado', value: datosProcesados.filter(d=>d.estatus==='Pagado').length },
                                    { name: 'Vencido', value: datosProcesados.filter(d=>d.estatus==='Vencido').length },
                                    { name: 'Pendiente', value: datosProcesados.filter(d=>d.estatus==='Pendiente').length }
                                ]} 
                                innerRadius={60} 
                                outerRadius={80} 
                                fill="#8884d8" 
                                dataKey="value"
                            >
                                <Cell fill="#198754" />
                                <Cell fill="#dc3545" />
                                <Cell fill="#ffc107" />
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* TABLA DE PAGOS (SIN COLUMNA DE FACTURAS) */}
        <div className="bg-white rounded shadow-sm p-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Estado de Cuenta Mensual</h5>
                <span className="badge bg-light text-dark border">Octubre 2023</span>
            </div>
            
            <table className="table align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Inquilino</th>
                        <th>Renta Base</th>
                        <th>Penalización</th>
                        <th>Total a Pagar</th>
                        <th>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {datosProcesados.map((item) => (
                        <tr key={item.id}>
                            <td className="fw-bold text-secondary">{item.nombre} <br/><span className="small text-muted fw-normal">Depto {item.departamento}</span></td>
                            <td>{formatoMoneda(item.montoOriginal)}</td>
                            <td>
                                {item.mora > 0 ? (
                                    <span className="text-danger fw-bold">+{formatoMoneda(item.mora)}</span>
                                ) : (
                                    <span className="text-muted">-</span>
                                )}
                            </td>
                            <td className="fw-bold">{formatoMoneda(item.total)}</td>
                            <td>
                                <span className={`badge rounded-pill ${
                                    item.estatus === 'Pagado' ? 'bg-success' : 
                                    item.estatus === 'Vencido' ? 'bg-danger' : 'bg-warning text-dark'
                                }`}>
                                    {item.estatus}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        appName={appName} setAppName={setAppName}
        logo={appLogo} setLogo={setAppLogo}
      />
    </div>
  );
};

export default Dashboard;