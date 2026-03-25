import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Label
} from 'recharts';
import {
  TrendingUp, Home, FileText, CreditCard, Search, Calendar
} from 'lucide-react';
import './Dashboard.css';

import { api } from '../../api';

// --- defaults will be initialized in state ---


// --- 2. THEME COLORS ---
const THEME = {
  bgApp: '#FFFFFF',          
  bgCard: '#F4F7FE',         
  textDark: '#1B2559',       
  textLight: '#A3AED0',      
  purpleDark: '#4318FF',     
  purpleLight: '#6AD2FF',
  linePink: '#FFB5E8'
};

const Dashboard = () => {
  const [moraSettings, setMoraSettings] = useState({ tipo: 'PORCENTAJE', valor: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState({
    gananciaMensual: 0,
    viviendasOcupadas: 0,
    viviendasTotal: 0,
    facturasVencidas: 0,
    facturasTotal: 0,
    cobroPendiente: 0,
    dataIngresos: [],
    dataIncidencias: [],
    dataBaseInquilinos: []
  });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(api("/dashboard/admin"), {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for configuration changes from the Navbar Modal
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('moraSettings'));
    if (saved) setMoraSettings(saved);
    
    const handleStorage = () => {
       const updated = JSON.parse(localStorage.getItem('moraSettings'));
       if(updated) setMoraSettings(updated);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // --- 3. LOGIC & FILTERING ---
  const datosProcesados = useMemo(() => {
    // 1. Calculate Mora (Late Fees)
    let procesados = dashboardData.dataBaseInquilinos.map(item => {
      let montoFinal = item.montoOriginal;
      let tieneMora = false;
      if (item.estatus === 'Vencido') {
        tieneMora = true;
        montoFinal = moraSettings.tipo === 'PORCENTAJE'
          ? item.montoOriginal + (item.montoOriginal * (moraSettings.valor / 100))
          : item.montoOriginal + moraSettings.valor;
      }
      return { ...item, montoFinal, tieneMora };
    });

    // 2. Apply Search Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      procesados = procesados.filter(item => 
        item.inquilino.toLowerCase().includes(query) || 
        item.departamento.toLowerCase().includes(query) ||
        item.estatus.toLowerCase().includes(query)
      );
    }

    return procesados;
  }, [moraSettings, searchQuery, dashboardData.dataBaseInquilinos]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="min-vh-100 d-flex flex-column font-sans" style={{ backgroundColor: THEME.bgApp }}>
      <div className="container-fluid px-4 py-4">
        
        {/* --- HEADER --- */}
        <div className="mb-4">
          <h1 className="fw-bold m-0" style={{ color: THEME.textDark, fontSize: '34px' }}>Dashboard</h1>
          <p className="m-0 mt-1 fs-6" style={{ color: '#707EAE' }}>
            Consulta estadísticas e información importante de las rentas.
          </p>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <TrendingUp size={18} style={{ color: THEME.textLight }} />
                <span className="fw-medium" style={{ color: THEME.textLight, fontSize: '14px' }}>Ganancia Mensual</span>
              </div>
              <div className="fw-bold" style={{ color: THEME.textDark, fontSize: '24px' }}>{formatCurrency(dashboardData.gananciaMensual)}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Home size={18} style={{ color: THEME.textLight }} />
                <span className="fw-medium" style={{ color: THEME.textLight, fontSize: '14px' }}>Viviendas Ocupadas</span>
              </div>
              <div className="fw-bold" style={{ color: THEME.textDark, fontSize: '24px' }}>
                {dashboardData.viviendasOcupadas} <span className="fs-6 fw-normal" style={{ color: '#05CD99' }}>/ {dashboardData.viviendasTotal}</span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <FileText size={18} style={{ color: THEME.textLight }} />
                <span className="fw-medium" style={{ color: THEME.textLight, fontSize: '14px' }}>Facturas Vencidas</span>
              </div>
              <div className="fw-bold" style={{ color: THEME.textDark, fontSize: '24px' }}>
                {dashboardData.facturasVencidas} <span className="fs-6 fw-normal" style={{ color: '#E31A1A' }}>/ {dashboardData.facturasTotal}</span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <CreditCard size={18} style={{ color: THEME.textLight }} />
                <span className="fw-medium" style={{ color: THEME.textLight, fontSize: '14px' }}>Cobro Pendiente</span>
              </div>
              <div className="fw-bold" style={{ color: THEME.textDark, fontSize: '24px' }}>{formatCurrency(dashboardData.cobroPendiente)}</div>
            </div>
          </div>
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="row g-3 mb-4">
          <div className="col-lg-8">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: THEME.bgCard }}>
              <div className="mb-4">
                 <h5 className="fw-bold m-0" style={{ color: THEME.textDark }}>Ingreso Mensual</h5>
              </div>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={dashboardData.dataIngresos} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} stroke="#E0E5F2" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: THEME.textLight, fontSize: 12 }} dy={10} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="ingreso" stroke={THEME.purpleDark} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="gasto" stroke={THEME.purpleLight} strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="neto" stroke="#E1E9F8" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="p-4 rounded-4 h-100 d-flex flex-column" style={{ backgroundColor: THEME.bgCard }}>
              <div className="mb-2">
                 <h5 className="fw-bold m-0" style={{ color: THEME.textDark }}>Incidencias</h5>
              </div>
              <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center">
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={dashboardData.dataIncidencias} innerRadius={65} outerRadius={85} dataKey="value" stroke="none">
                                {dashboardData.dataIncidencias.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label value={dashboardData.dataIncidencias.reduce((acc, curr) => acc + curr.value, 0)} position="center" fill={THEME.textDark} style={{ fontSize: '32px', fontWeight: 'bold' }} />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="d-flex justify-content-around mt-2 text-center">
                  {dashboardData.dataIncidencias.map((item, index) => (
                      <div key={index} className="d-flex flex-column align-items-center">
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color, marginBottom: 4 }}></div>
                          <span className="fw-bold" style={{ color: THEME.textDark, fontSize: '14px' }}>{item.value}</span>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{item.name}</span>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- DATA TABLE SECTION --- */}
        <div className="card w-100 border-0 rounded-4 overflow-hidden" style={{ backgroundColor: THEME.bgCard }}>
            <div className="card-header bg-transparent p-4 border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h5 className="fw-bold m-0" style={{ color: THEME.textDark }}>Detalle de Contratos</h5>
                    <span style={{ color: THEME.textLight, fontSize: '14px' }}>Gestión y estado de pagos</span>
                </div>
                
                <div className="input-group w-auto bg-white rounded-pill px-3 py-2 shadow-sm border border-light">
                    <Search size={18} style={{ color: THEME.textLight }} className="align-self-center"/>
                    <input 
                        type="text" 
                        className="form-control border-0 shadow-none bg-transparent ms-2" 
                        placeholder="Buscar inquilino o depto..." 
                        style={{ width: '220px', fontSize: '14px', color: THEME.textDark }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="table-responsive px-2 pb-3">
                <table className="table w-100 table-borderless align-middle mb-0">
                    <thead style={{ borderBottom: '1px solid #E0E5F2' }}>
                        <tr>
                            <th className="ps-4 py-3 fw-medium text-uppercase" style={{ color: THEME.textLight, fontSize: '12px' }}>Depto</th>
                            <th className="py-3 fw-medium text-uppercase" style={{ color: THEME.textLight, fontSize: '12px' }}>Inquilino</th>
                            <th className="py-3 fw-medium text-uppercase" style={{ color: THEME.textLight, fontSize: '12px' }}>Monto Total</th>
                            <th className="py-3 fw-medium text-uppercase text-center" style={{ color: THEME.textLight, fontSize: '12px' }}>Estatus</th>
                            <th className="py-3 fw-medium text-uppercase" style={{ color: THEME.textLight, fontSize: '12px' }}>Contrato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosProcesados.length > 0 ? datosProcesados.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #E0E5F2' }}>
                                <td className="ps-4 py-3 fw-bold" style={{ color: THEME.textDark }}>{item.departamento}</td>
                                <td className="py-3 fw-medium" style={{ color: THEME.textDark }}>{item.inquilino}</td>
                                <td className="py-3">
                                    <span className="fw-bold" style={{ color: THEME.textDark }}>{formatCurrency(item.montoFinal)}</span>
                                    {item.tieneMora && (
                                        <span className="ms-2 badge bg-danger text-white rounded-pill shadow-sm" style={{ fontSize: '10px', padding: '4px 8px' }}>
                                            + MORA
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 text-center">
                                    <span className={`badge rounded-pill px-3 py-2 fw-bold ${
                                        item.estatus === 'Pagado' ? 'bg-success bg-opacity-10 text-success' :
                                        item.estatus === 'Vencido' ? 'bg-danger bg-opacity-10 text-danger' :
                                        'bg-warning bg-opacity-10 text-warning'
                                    }`}>
                                        {item.estatus}
                                    </span>
                                </td>
                                <td className="py-3 text-muted small fw-medium">
                                    <div className="d-flex align-items-center gap-2" style={{ color: THEME.textLight }}>
                                        <Calendar size={14}/> {item.mesesRestantes} meses rest.
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5" style={{ color: THEME.textLight }}>
                                    No se encontraron resultados para "{searchQuery}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      {/* 👉 ¡Aquí están los divs que se habían borrado! */}
      </div>
    </div>
  );
};

export default Dashboard;
