import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Label
} from 'recharts';
import {
  TrendingUp, Home, FileText, CreditCard
} from 'lucide-react';
import './Dashboard.css';

// --- 1. DATOS FICTICIOS PARA IGUALAR TU DISEÑO ---
// Datos para la gráfica de ondas (Ingreso Mensual con 3 líneas como la imagen)
const dataIngresos = [
  { name: 'Jan', ingreso: 4000, gasto: 2400, neto: 1400 },
  { name: 'Feb', ingreso: 5000, gasto: 1398, neto: 2210 },
  { name: 'Mar', ingreso: 2000, gasto: 3800, neto: 2290 },
  { name: 'Apr', ingreso: 2780, gasto: 3908, neto: 2000 },
  { name: 'May', ingreso: 1890, gasto: 4800, neto: 2181 },
  { name: 'Jun', ingreso: 2390, gasto: 3800, neto: 2500 },
];

// Datos para la gráfica de dona (Incidencias)
const dataIncidencias = [
  { name: 'Por resolver', value: 11, color: '#F4C8FC' }, // Rosa claro
  { name: 'Resueltas', value: 8, color: '#3A2C60' },    // Morado oscuro
  { name: 'Pendientes', value: 5, color: '#A685FA' }    // Lila
];

// Estilos de colores extraídos de tu imagen
const THEME = {
  bgApp: '#FFFFFF',          // Fondo blanco general
  bgCard: '#F4F7FE',         // Color gris azulado de las tarjetas
  textDark: '#2B3674',       // Azul oscuro para textos
  textLight: '#A3AED0',      // Gris para subtítulos
  purpleDark: '#4318FF',     
  purpleLight: '#6AD2FF',
  linePurple: '#4318FF',
  linePink: '#FFB5E8'
};

const Dashboard = () => {
  // Lógica de configuración (se mantiene funcional pero invisible)
  const [moraSettings, setMoraSettings] = useState({ tipo: 'PORCENTAJE', valor: 10 });

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

  // Formateador de moneda
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="min-vh-100 d-flex flex-column font-sans" style={{ backgroundColor: THEME.bgApp }}>
      
      <div className="container-fluid px-4 py-4">
        
        {/* --- TÍTULO Y SUBTÍTULO --- */}
        <div className="mb-4">
          <h1 className="fw-bold m-0" style={{ color: '#1B2559', fontSize: '34px' }}>Dashboard</h1>
          <p className="m-0 mt-1 fs-6" style={{ color: '#707EAE' }}>
            Consulta estadísticas e información importante de las rentas.
          </p>
        </div>

        {/* --- TARJETAS SUPERIORES (KPIs) --- */}
        {/* Se usa el color de fondo exacto #F4F7FE y bordes redondeados suaves */}
        <div className="row g-3 mb-4">
          
          {/* Card 1: Ganancia Mensual */}
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <TrendingUp size={18} style={{ color: '#A3AED0' }} />
                <span className="fw-medium" style={{ color: '#A3AED0', fontSize: '14px' }}>Ganancia Mensual</span>
              </div>
              <div className="fw-bold" style={{ color: '#1B2559', fontSize: '24px' }}>$15,568</div>
            </div>
          </div>

          {/* Card 2: Viviendas Ocupadas */}
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Home size={18} style={{ color: '#A3AED0' }} />
                <span className="fw-medium" style={{ color: '#A3AED0', fontSize: '14px' }}>Viviendas Ocupadas</span>
              </div>
              <div className="fw-bold" style={{ color: '#1B2559', fontSize: '24px' }}>
                250 <span className="fs-6 fw-normal" style={{ color: '#05CD99' }}>/ 500</span>
              </div>
            </div>
          </div>

          {/* Card 3: Facturas Vencidas */}
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <FileText size={18} style={{ color: '#A3AED0' }} />
                <span className="fw-medium" style={{ color: '#A3AED0', fontSize: '14px' }}>Facturas Vencidas</span>
              </div>
              <div className="fw-bold" style={{ color: '#1B2559', fontSize: '24px' }}>
                7 <span className="fs-6 fw-normal" style={{ color: '#05CD99' }}>/ 250</span>
              </div>
            </div>
          </div>

          {/* Card 4: Cobro Pendiente */}
          <div className="col-md-3">
            <div className="h-100 p-3 rounded-4 d-flex flex-column justify-content-center" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <CreditCard size={18} style={{ color: '#A3AED0' }} />
                <span className="fw-medium" style={{ color: '#A3AED0', fontSize: '14px' }}>Cobro Pendiente</span>
              </div>
              <div className="fw-bold" style={{ color: '#1B2559', fontSize: '24px' }}>$10,220</div>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN DE GRÁFICAS --- */}
        <div className="row g-3">
          
          {/* Gráfica Izquierda: Ingreso Mensual (Ondas) */}
          <div className="col-lg-8">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: THEME.bgCard }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                   <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                      <TrendingUp size={16}/> Estadísticas
                   </div>
                   <h5 className="fw-bold m-0" style={{ color: '#1B2559' }}>Ingreso Mensual</h5>
                </div>
              </div>
              
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={dataIngresos} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} stroke="#E0E5F2" strokeDasharray="0" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#A3AED0', fontSize: 12 }} 
                        dy={10} 
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                        cursor={{ stroke: '#E0E5F2', strokeWidth: 2 }} 
                    />
                    {/* Líneas suavizadas (type="monotone") para el efecto de ondas */}
                    <Line type="monotone" dataKey="ingreso" stroke="#4318FF" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="gasto" stroke="#6AD2FF" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="neto" stroke="#E1E9F8" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gráfica Derecha: Incidencias (Dona) */}
          <div className="col-lg-4">
            <div className="p-4 rounded-4 h-100 d-flex flex-column" style={{ backgroundColor: THEME.bgCard }}>
              <div className="mb-2">
                 <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                    <TrendingUp size={16}/> Estadísticas
                 </div>
                 <h5 className="fw-bold m-0" style={{ color: '#1B2559' }}>Incidencias</h5>
              </div>

              <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center">
                 <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie 
                                data={dataIncidencias} 
                                innerRadius={65} 
                                outerRadius={85} 
                                dataKey="value" 
                                paddingAngle={0}
                                stroke="none"
                            >
                                {dataIncidencias.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                {/* Texto central Total */}
                                <Label 
                                    value="24" 
                                    position="center" 
                                    fill="#1B2559" 
                                    style={{ fontSize: '32px', fontWeight: 'bold' }}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Leyenda Personalizada */}
              <div className="d-flex justify-content-around mt-2 text-center">
                  {dataIncidencias.map((item, index) => (
                      <div key={index} className="d-flex flex-column align-items-center">
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color, marginBottom: 4 }}></div>
                          <span className="fw-bold" style={{ color: '#1B2559', fontSize: '14px' }}>{item.value}</span>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{item.name}</span>
                      </div>
                  ))}
              </div>

            </div>
          </div>

        </div>

        {/* Tabla opcional (si la necesitas abajo, descomenta esta sección, 
            pero la imagen original cortaba aquí) */}
        {/* <div className="mt-4"> ...Tabla... </div> */}

      </div>
    </div>
  );
};

export default Dashboard;