import React from "react";
import "./Home.css";
import { FileText, CreditCard, AlertCircle, FileDown } from "lucide-react";

const Home = () => {
  const recibos = [
    "Enero 2026",
    "Febrero 2026",
    "Marzo 2026",
    "Abril 2026",
    "Mayo 2026",
    "Junio 2026"
  ];

  return (
    <div className="home-container">
      <h4 className="title">¡Bienvenido de vuelta!</h4>
      <p className="subtitle" >¿Qué deseas hacer hoy?</p>

      <div className="cards-container">
        
        {/* Acciones rápidas */}
        <div className="card">
          <h3>Acciones rápidas</h3>
          <div className="actions">
            
            <div className="action-item green">
              <CreditCard size={28} />
              <span>Pagar</span>
            </div>

            <div className="action-item blue">
              <FileText size={28} />
              <span>Ver Contrato</span>
            </div>

            <div className="action-item orange">
              <AlertCircle size={28} />
              <span>Incidencias</span>
            </div>

          </div>
        </div>

        {/* Información del cliente */}
        <div className="card">
          <h4>Información del cliente</h4>
          <p className="address">
            C.Cipreces 109 Fracc. Los Álamos,<br />
            Durango, Dgo.
          </p>

          <div className="info-row">
            <span>Monto total a pagar</span>
            <strong>$4500</strong>
          </div>

          <div className="info-row">
            <span>Mensualidad a pagar</span>
            <strong>Enero</strong>
          </div>

          <div className="info-row">
            <span>Fecha límite de pago</span>
            <strong>25 de enero del 2026</strong>
          </div>

          <div className="info-row">
            <span>Estado del pago</span>
            <strong className="paid">Pagado</strong>
          </div>
        </div>

        {/* Recibos */}
        <div className="card">
          <h3>Recibos</h3>
          <div className={`receipts-scroll ${recibos.length > 5 ? "limit-5" : ""}`}>
            {recibos.map((mes, index) => (
              <div key={index} className="receipt-row">
                <span>{mes}</span>
                <button className="pdf-btn">
                  <FileDown size={16} />
                  Descargar PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
