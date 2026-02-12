import React, { useState, useEffect, useMemo } from "react";
import "./Dashboard.css";
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Settings, Bell, AlertTriangle, User, DollarSign, Calendar, TrendingUp } from 'lucide-react'; 

// --- 1. COMPONENTE: MODAL DE CONFIGURACIÓN ---
const SettingsModal = ({ 
  isOpen, onClose, appName, setAppName, logo, setLogo,
  tipoMora, setTipoMora, valorMora, setValorMora
}) => {
  const [activeTab, setActiveTab] = useState('app');
  const [tempName, setTempName] = useState(appName);

  useEffect(() => { if (isOpen) setTempName(appName); }, [isOpen, appName]);
  if (!isOpen) return null;

  const handleSave = () => {
    setAppName(tempName);
    onClose();
    alert("✅ Configuración guardada correctamente.");
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  return (
    <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="bg-white rounded shadow-lg d-flex overflow-hidden" style={{width: '750px', height: '550px'}}>
        <div className="bg-light p-4 border-end" style={{width: '220px'}}>
          <h6 className="mb-4 fw-bold text-secondary">CONFIGURACIÓN</h6>
          <div className={`p-3 cursor-pointer rounded mb-2 d-flex align-items-center gap-2 ${activeTab === 'app' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`} onClick={() => setActiveTab('app')}> <Settings size={18}/> General </div>
          <div className={`p-3 cursor-pointer rounded mb-2 d-flex align-items-center gap-2 ${activeTab === 'pago' ? 'bg-white shadow-sm fw-bold text-primary' : 'text-muted'}`} onClick={() => setActiveTab('pago')}> <DollarSign size={18}/> Cobros y Mora </div>
        </div>
        <div className="p-4 flex-grow-1 d-flex flex-column">
          <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
            <h5 className="fw-bold m-0">{activeTab === 'app' ? 'Apariencia' : 'Reglas de Negocio'}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="flex-grow-1 overflow-auto pe-2">
            {activeTab === 'app' && (
              <>
                <div className="mb-4">
                  <label className="form-label fw-bold">Nombre del Edificio</label>
                  <input type="text" className="form-control" value={tempName} onChange={(e) => setTempName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Logotipo</label>
                  <input type="file" className="form-control" onChange={handleLogoChange} accept="image/*"/>
                </div>
              </>
            )}
            {activeTab === 'pago' && (
               <div className="p-3 bg-light rounded border">
                 <h6 className="fw-bold mb-3"><AlertTriangle size={18} className="text-warning"/> Configuración de Mora</h6>
                 <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Tipo</label>
                        <select className="form-select" value={tipoMora} onChange={(e) => setTipoMora(e.target.value)}>
                            <option value="PORCENTAJE">Porcentaje (%)</option>
                            <option value="FIJO">Monto Fijo ($)</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Valor</label>
                        <div className="input-group">
                            <span className="input-group-text">{tipoMora === 'FIJO' ? '$' : '%'}</span>
                            <input type="number" className="form-control" value={valorMora} onChange={(e) => setValorMora(e.target.value)}/>
                        </div>
                    </div>
                 </div>
               </div>
            )}
          </div>
          <div className="text-end mt-3 border-top pt-3">
             <button className="btn btn-primary px-4" onClick={handleSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. DATOS BASE (CON INFORMACIÓN DE CONTRATOS) ---
// Agregamos 'duracionContrato' (meses totales) y 'mesesRestantes' (cuánto falta por cobrar)
const dataBase = [
  { id: 1, nombre: "Juan Perez", departamento: "101", montoOriginal: 5000, estatus: "Pagado", duracionContrato: 12, mesesRestantes: 10 },
  { id: 2, nombre: "Jose Gomez", departamento: "165", montoOriginal: 4500, estatus: "Pendiente", duracionContrato: 6, mesesRestantes: 5 },
  { id: 3, nombre: "Ana Martinez", departamento: "210", montoOriginal: 5200, estatus: "Vencido", duracionContrato: 12, mesesRestantes: 2 },
  { id: 4, nombre: "Carlos Ruiz", departamento: "305", montoOriginal: 5000, estatus: "Vencido", duracionContrato: 6, mesesRestantes: 1 },
  { id: 5, nombre: "Mario Bros", departamento: "101", montoOriginal: 5000, estatus: "Vencido", duracionContrato: 12, mesesRestantes: 11 }, 
];

const dataMensual = [
  { name: "Ene", ingresos: 4000 }, { name: "Feb", ingresos: 3000 }, { name: "Mar", ingresos: 2000 }, 
  { name: "Abr", ingresos: 2780 }, { name: "May", ingresos: 1890 }, { name: "Jun", ingresos: 2390 },
];

const formatoMoneda = (valor) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);

// --- 3. DASHBOARD PRINCIPAL ---
const Dashboard = () => {
  const [appName, setAppName] = useState("Administración de Rentas");
  const [appLogo, setAppLogo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tipoMora, setTipoMora] = useState('PORCENTAJE'); 
  const [valorMora, setValorMora] = useState(10); 
  
  // Cálculo de Mora y Totales
  const datosProcesados = useMemo(() => {
    return dataBase.map(item => {
      let moraCalculada = 0;
      let totalPagar = item.montoOriginal;

      if (item.estatus === 'Vencido') {
        if (tipoMora === 'FIJO') {
          moraCalculada = parseFloat(valorMora) || 0;
        } else {
          moraCalculada = (item.montoOriginal * (parseFloat(valorMora) || 0)) / 100;
        }
        totalPagar = item.montoOriginal + moraCalculada;
      }
      return { ...item, mora: moraCalculada, total: totalPagar };
    });
  }, [tipoMora, valorMora]);

  // KPIs MENSUALES
  const carteraVencidaTotal = datosProcesados.filter(p => p.estatus === 'Vencido').reduce((acc, curr) => acc + curr.total, 0); 
  const totalRecaudado = datosProcesados.filter(p => p.estatus === 'Pagado').reduce((acc, curr) => acc + curr.total, 0);

  // --- LÓGICA NUEVA: INGRESO GLOBAL PENDIENTE (PROYECCIÓN) ---
  // Suma de (Renta Mensual * Meses que faltan en el contrato)
  const ingresoPendienteGlobal = datosProcesados.reduce((acc, curr) => {
    return acc + (curr.montoOriginal * curr.mesesRestantes);
  }, 0);

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column font-sans">
      
      {/* HEADER */}
      <div className="bg-white shadow-sm py-3 px-4 mb-4 d-flex justify-content-between align-items-center sticky-top">
        <div className="d-flex align-items-center gap-3">
            {appLogo ? <img src={appLogo} alt="Logo" style={{height: '40px'}} /> : <span className="fs-2">🏘️</span>}
            <h5 className="m-0 fw-bold text-dark">{appName}</h5>
        </div>
        <div className="d-flex align-items-center gap-4 text-secondary">
             <button className="btn btn-light rounded-circle p-2" onClick={() => setShowSettings(true)}><Settings size={20} /></button>
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>JP</div>
        </div>
      </div>

      <div className="container-fluid px-4">
        
        {/* TARJETAS KPI */}
        <div className="row g-3 mb-4">
          
          {/* NUEVA TARJETA: INGRESO PENDIENTE GLOBAL */}
          <div className="col-md-4">
            <div className="bg-primary text-white p-4 rounded shadow-sm h-100 position-relative overflow-hidden">
               <div className="position-relative z-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <small className="text-uppercase fw-bold text-white-50">Ingreso Global Pendiente</small>
                    <TrendingUp size={16} className="text-white-50"/>
                  </div>
                  <h2 className="fw-bold mb-0">{formatoMoneda(ingresoPendienteGlobal)}</h2>
                  <small className="text-white-50 d-block mt-2" style={{fontSize: '0.85rem'}}>
                    Suma total de meses restantes en contratos activos. Disminuye con el tiempo.
                  </small>
               </div>
               {/* Decoración de fondo */}
               <TrendingUp size={100} className="position-absolute bottom-0 end-0 text-white opacity-10" style={{transform: 'translate(20%, 20%)'}}/>
            </div>
          </div>

          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-sm border-start border-5 border-success h-100">
              <small className="text-uppercase text-muted fw-bold">Recaudado (Mes Actual)</small>
              <h2 className="text-dark fw-bold mb-0 mt-2">{formatoMoneda(totalRecaudado)}</h2>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-sm border-start border-5 border-danger h-100">
              <div className="d-flex align-items-center justify-content-between">
                 <small className="text-uppercase text-muted fw-bold">Cartera Vencida</small>
                 <span className="badge bg-danger rounded-pill">Con Mora</span>
              </div>
              <h2 className="text-danger fw-bold mb-0 mt-2">{formatoMoneda(carteraVencidaTotal)}</h2>
            </div>
          </div>
        </div>

        {/* GRÁFICA Y TABLA */}
        <div className="row">
            <div className="col-lg-8 mb-4">
                <div className="bg-white p-4 rounded shadow-sm h-100">
                    <h6 className="fw-bold mb-4">Proyección Mensual</h6>
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
                    <h6 className="fw-bold mb-4">Resumen de Estatus</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={[
                                    { name: 'Pagado', value: datosProcesados.filter(d=>d.estatus==='Pagado').length },
                                    { name: 'Vencido', value: datosProcesados.filter(d=>d.estatus==='Vencido').length },
                                    { name: 'Pendiente', value: datosProcesados.filter(d=>d.estatus==='Pendiente').length }
                                ]} 
                                innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value"
                            >
                                <Cell fill="#198754" /><Cell fill="#dc3545" /><Cell fill="#ffc107" />
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* TABLA DE CONTRATOS (ACTUALIZADA CON INFORMACIÓN DE TIEMPO) */}
        <div className="bg-white rounded shadow-sm p-4 mb-5">
            <h5 className="fw-bold mb-4">Detalle de Contratos y Pagos</h5>
            <table className="table align-middle table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Inquilino</th>
                        <th>Contrato</th>
                        <th>Meses Restantes</th>
                        <th>Renta Base</th>
                        <th>Total + Mora</th>
                        <th>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {datosProcesados.map((item) => (
                        <tr key={item.id}>
                            <td className="fw-bold text-secondary">{item.nombre} <div className="small text-muted fw-normal">Depto {item.departamento}</div></td>
                            <td><span className="badge bg-light text-dark border">{item.duracionContrato} meses</span></td>
                            
                            {/* Visualización de meses restantes */}
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="progress flex-grow-1" style={{height: '6px', width: '80px'}}>
                                        <div 
                                            className="progress-bar bg-primary" 
                                            style={{width: `${((item.duracionContrato - item.mesesRestantes) / item.duracionContrato) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="small text-muted">{item.mesesRestantes} m</span>
                                </div>
                            </td>

                            <td>{formatoMoneda(item.montoOriginal)}</td>
                            <td className={item.mora > 0 ? "text-danger fw-bold" : "fw-bold"}>{formatoMoneda(item.total)}</td>
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
        isOpen={showSettings} onClose={() => setShowSettings(false)} 
        appName={appName} setAppName={setAppName} logo={appLogo} setLogo={setAppLogo}
        tipoMora={tipoMora} setTipoMora={setTipoMora} valorMora={valorMora} setValorMora={setValorMora}
      />
    </div>
  );
};

export default Dashboard;