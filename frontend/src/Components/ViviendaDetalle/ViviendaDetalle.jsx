import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { LuHand, LuHouse, LuInfo, LuSettings } from "react-icons/lu";
import EditarForm from "../Forms/Editarform";
import { REACT_APP_API_URL } from "../../config";
import "./ViviendaDetalle.css";


const token = localStorage.getItem("token");

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-MX");
};

const statusLabel = (status) => {
  if (status === "AVAILABLE") return "Disponible";
  if (status === "OCCUPIED") return "Ocupada";
  if (status === "ARCHIVED") return "Archivada";
  return status || "-";
};

const statusClass = (status) => {
  if (status === "AVAILABLE") return "is-available";
  if (status === "OCCUPIED") return "is-occupied";
  if (status === "ARCHIVED") return "is-archived";
  return "";
};

export default function ViviendaDetalle() {
  const { id } = useParams();
  const { state } = useLocation();
  const [vivienda, setVivienda] = useState(state?.propiedad || null);
  const [loading, setLoading] = useState(!state?.propiedad);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (vivienda && String(vivienda.id) === String(id)) return;

    const fetchVivienda = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${REACT_APP_API_URL}/apartments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("No se pudo cargar la vivienda");

        const data = await res.json();
        setVivienda(data);
      } catch (err) {
        console.error(err);
        setError("No fue posible cargar los detalles de la vivienda.");
      } finally {
        setLoading(false);
      }
    };

    fetchVivienda();
  }, [id, vivienda]);

  if (loading) return <div className="text-center py-5">Cargando detalles...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  const cambiarEstado = () => {
    setVivienda((prev) => ({
      ...prev,
      status: prev.status === "OCCUPIED" ? "AVAILABLE" : "OCCUPIED"
    }));
  };

  const archivarVivienda = () => {
    setVivienda((prev) => ({
      ...prev,
      status: prev.status === "ARCHIVED" ? "AVAILABLE" : "ARCHIVED"
    }));
  };

  const mainImage =
    vivienda?.main_image ||
    vivienda?.image ||
    "https://th.bing.com/th/id/OIP.6XIv3DVREt05mi0sSNtUDgHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3";
  const isArchived = vivienda?.status === "ARCHIVED";
  const isOccupied = vivienda?.status === "OCCUPIED";

  return (
    <div className="vivienda-detail-page">
      <div className="container py-4">
        <div className="vivienda-detail-head mb-4">
          <div>
            <h2 className="vivienda-title">Viviendas</h2>
            <p className="vivienda-subtitle">
              Visualiza las viviendas registradas en el sistema facil y rapidamente.
            </p>
          </div>
          <button type="button" className="manage-landlord-btn">
            <LuSettings size={15} />
            Gestionar cuenta de arrendatario
          </button>
        </div>

        <div className="vivienda-breadcrumb mb-4">
          <Link to="/viviendas" className="breadcrumb-link">
            Todas las Viviendas
          </Link>
          <span className="breadcrumb-separator">{">"}</span>
          <span className="breadcrumb-active">Detalles de la Vivienda</span>
        </div>

        <div className="row g-4">
          <div className="col-xl-8">
            <section className="detail-card">
              <h4 className="detail-card-title">
                <LuHouse size={20} />
                Datos Generales
              </h4>

              <p className="detail-label">Direccion:</p>
              <p className="detail-value">{vivienda?.address || "-"}</p>

              <p className="detail-label mt-4">Imagen principal:</p>
              <div className="main-image-wrap">
                <img src={mainImage} alt="Vivienda" className="main-image" />
              </div>
            </section>
          </div>

          <div className="col-xl-4">
            <section className="detail-card mb-4">
              <h4 className="detail-card-title">
                <LuInfo size={20} />
                Informacion de la Vivienda
              </h4>

              <div className="info-row">
                <span className="info-key">Precio de renta</span>
                <span className="info-value text-success fw-bold">
                  {vivienda?.depositamount ? `$${vivienda.depositamount.toLocaleString("en-US")}` : "-"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-key">Arrendatario</span>
                <span className="info-value">{vivienda?.tenant_name || "-"}</span>
              </div>

              <div className="info-row">
                <span className="info-key">Fecha de pago</span>
                <span className="info-value">{formatDate(vivienda?.latest_due_date)}</span>
              </div>

              <div className="info-row">
                <span className="info-key">Estado</span>
                <span className={`status-pill ${statusClass(vivienda?.status)}`}>
                  <span className="status-solid-dot"></span>
                  {statusLabel(vivienda?.status)}
                </span>
              </div>
            </section>

            <section className="detail-card">
              <h4 className="detail-card-title">
                <LuHand size={20} />
                Acciones
              </h4>

              <div className="actions-row">
                <button
                  type="button"
                  className="small-action-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                >
                  <i className="bi bi-pencil-square"></i>
                  Editar
                </button>
                <button
                  type="button"
                  className={`small-action-btn status-action-btn ${vivienda?.status === "ARCHIVED" ? "is-active archived" : ""}`}
                  onClick={archivarVivienda}
                >
                  <i className={`bi ${vivienda?.status === "ARCHIVED" ? "bi-eye" : "bi-eye-slash"}`}></i>
                  {vivienda?.status === "ARCHIVED" ? "Desarchivar" : "Archivar"}
                </button>
                <button
                  type="button"
                  className={`small-action-btn status-action-btn ${isArchived ? "is-active archived" : isOccupied ? "is-active occupied" : "is-active available"
                    }`}
                  onClick={() => {
                    if (isArchived) return;
                    cambiarEstado();
                  }}
                  disabled={isArchived}
                >
                  <i
                    className={`bi ${isArchived ? "bi-eye-slash" : isOccupied ? "bi-x-circle" : "bi-check-circle"
                      }`}
                  ></i>
                  {isArchived ? "Archivada" : isOccupied ? "Ocupada" : "Disponible"}
                </button>
              </div>
            </section>
          </div>
        </div>

        <Link to="/viviendas" className="back-link">
          Volver a viviendas
        </Link>
        <EditarForm
          propiedad={vivienda}
          actualizarPropiedad={setVivienda}
        />
      </div>
    </div>
  );
}
