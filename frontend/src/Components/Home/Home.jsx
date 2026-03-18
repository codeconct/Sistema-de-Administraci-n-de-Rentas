import React, { useState } from "react";
import "./Home.css";
import { FileText, CreditCard, AlertCircle, FileDown, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { REACT_APP_API_URL } from "../../config";

const Home = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const recibos = [
    "Enero 2026",
    "Febrero 2026",
    "Marzo 2026",
    "Abril 2026",
    "Mayo 2026",
    "Junio 2026",
  ];

  const handlePagar = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await fetch(`${REACT_APP_API_URL}/pagos/openpay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monto: 4500,
          descripcion: "Mensualidad de Enero - C. Cipreces 109",
          cliente: {
            nombre: "Inquilino",
            apellidos: "Ejemplo",
            correo: "inquilino@ejemplo.com",
            telefono: "6181234567",
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        console.error("Error al generar pago:", data);
        alert("Error al generar el pago. Intenta más tarde.");
      }
    } catch (error) {
      console.error("Error conectando con el servidor:", error);
      alert("No se pudo conectar con el servidor. ¿El backend está encendido?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="home-container">
      <h4 className="title">¡Bienvenido de vuelta!</h4>
      <p className="subtitle">¿Qué deseas hacer hoy?</p>

      <div className="cards-container">
        <div className="card">
          <h3>Acciones rápidas</h3>
          <div className="actions">
            <div
              className="action-item green"
              onClick={handlePagar}
              style={{ cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? (
                <Loader size={28} className="animate-spin" />
              ) : (
                <CreditCard size={28} />
              )}
              <span>{isProcessing ? "Cargando..." : "Pagar"}</span>
            </div>

            <div className="action-item blue">
              <FileText size={28} />
              <span>Ver Contrato</span>
            </div>

            <div
              className="action-item orange"
              onClick={() => navigate("/home/incidencias")}
              style={{ cursor: "pointer" }}
            >
              <AlertCircle size={28} />
              <span>Incidencias</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4>Información del cliente</h4>
          <p className="address">
            C.Cipreces 109 Fracc. Los Álamos,
            <br />
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
