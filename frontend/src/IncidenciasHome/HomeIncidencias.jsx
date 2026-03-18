import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeIncidencias.css";

const incidenciasBase = [
  {
    id: 1,
    status: "resuelta",
    fecha: "2026-01-15T09:30:00",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    ubicacion: "Departamento Corredor Privada, Puerta Norte, Int. 109, 34155, Jardines de Durango.",
    arrendatario: "Jose",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
    descripcion:
      "El inquilino reporta una fuga constante de agua en la llave del lavabo, el goteo es continuo y ha provocado humedad en la parte inferior del mueble.",
  },
  {
    id: 2,
    status: "pendiente",
    fecha: "2026-07-10T16:45:00",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    ubicacion: "Departamento Corredor Privada, Puerta Norte, Int. 109, 34155, Jardines de Durango.",
    arrendatario: "joaquin",
    avatar: null,
    descripcion:
      "Reporte sin asignar a un responsable. Se requiere revision del area comun lo antes posible.",
  },
  {
    id: 3,
    status: "pendiente",
    fecha: "2026-03-06T11:20:00",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    ubicacion: "Departamento Corredor Privada, Puerta Norte, Int. 109, 34155, Jardines de Durango.",
    arrendatario: "Pendiente",
    avatar: null,
    descripcion:
      "Se detecto humedad en una pared del dormitorio y se solicita inspeccion tecnica.",
  },
  {
    id: 4,
    status: "resuelta",
    fecha: "2026-02-28T08:15:00",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    ubicacion: "Departamento Corredor Privada, Puerta Norte, Int. 109, 34155, Jardines de Durango.",
    arrendatario: " Amaya",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
    descripcion:
      "La cerradura de la puerta principal presentaba fallas y ya fue atendida por mantenimiento.",
  },
];

const LIMITE_DESCRIPCION = 220;

const HomeIncidencias = () => {
  const navigate = useNavigate();
  const [incidenciasData, setIncidenciasData] = useState(incidenciasBase);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [orden, setOrden] = useState("recientes");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  const restablecerFiltros = () => {
    setFiltroBusqueda("");
    setFiltroEstado("todas");
    setOrden("recientes");
  };

  const actualizarEstado = (id, status) => {
    setIncidenciasData((prev) =>
      prev.map((incidencia) =>
        incidencia.id === id ? { ...incidencia, status } : incidencia
      )
    );
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevaDescripcion("");
  };

  const crearIncidencia = () => {
    const descripcion = nuevaDescripcion.trim();

    if (!descripcion) {
      return;
    }

    const nuevaIncidencia = {
      id: Date.now(),
      status: "pendiente",
      fecha: new Date().toISOString(),
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privada, Puerta Norte, Int. 109, 34155, Jardines de Durango.",
      arrendatario: "Pendiente",
      avatar: null,
      descripcion,
    };

    setIncidenciasData((prev) => [nuevaIncidencia, ...prev]);
    setFiltroEstado("todas");
    setOrden("recientes");
    cerrarModal();
  };

  const incidencias = useMemo(() => {
    const texto = filtroBusqueda.trim().toLowerCase();

    const filtradas = incidenciasData.filter((incidencia) => {
      const coincideBusqueda =
        incidencia.ubicacion.toLowerCase().includes(texto) ||
        incidencia.arrendatario.toLowerCase().includes(texto) ||
        incidencia.descripcion.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "todas" ? true : incidencia.status === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });

    return [...filtradas].sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();

      if (orden === "recientes") {
        return fechaB - fechaA;
      }

      return fechaA - fechaB;
    });
  }, [filtroBusqueda, filtroEstado, incidenciasData, orden]);

  return (
    <div className="home-incidencias-page">
      <div className="container-fluid px-4 px-lg-5 py-4 py-lg-5">
        <div className="home-incidencias-shell">
          <button
            type="button"
            className="home-incidencias-back-btn"
            onClick={() => navigate("/home")}
          >
            <i className="bi bi-arrow-left" />
            Volver al inicio
          </button>

          <div className="home-incidencias-header">
            <div>
              <h1 className="home-incidencias-title">Incidencias</h1>
              <p className="home-incidencias-subtitle">
                Consulta aqui todas las incidencias reportadas en el sistema.
              </p>
            </div>

            <button
              type="button"
              className="home-incidencias-create-btn"
              onClick={() => setMostrarModal(true)}
            >
              <span>+</span>
              Nueva incidencia
            </button>
          </div>

          <div className="home-incidencias-toolbar">
            <label className="home-incidencias-search">
              <i className="bi bi-search" />
              <input
                type="text"
                placeholder="Buscar una incidencia..."
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
              />
            </label>

            <div className="home-incidencias-sort-group">
              <button
                type="button"
                className={`home-incidencias-sort-btn ${orden === "recientes" ? "is-active" : ""}`}
                onClick={() => setOrden("recientes")}
              >
                <i className="bi bi-calendar4-week" />
                Mas recientes primero
              </button>
              <button
                type="button"
                className={`home-incidencias-sort-btn ${orden === "antiguas" ? "is-active" : ""}`}
                onClick={() => setOrden("antiguas")}
              >
                <i className="bi bi-calendar4-event" />
                Mas antiguas primero
              </button>
            </div>
          </div>

          <div className="home-incidencias-filters">
            <button
              type="button"
              className={`home-incidencias-filter-btn ${filtroEstado === "todas" ? "is-active" : ""}`}
              onClick={restablecerFiltros}
            >
              Todas
            </button>
            <button
              type="button"
              className={`home-incidencias-filter-btn ${filtroEstado === "resuelta" ? "is-active is-success" : ""}`}
              onClick={() => setFiltroEstado("resuelta")}
            >
              Resueltas
            </button>
            <button
              type="button"
              className={`home-incidencias-filter-btn ${filtroEstado === "pendiente" ? "is-active is-warning" : ""}`}
              onClick={() => setFiltroEstado("pendiente")}
            >
              Pendientes
            </button>
          </div>

          <div className="home-incidencias-table-card">
            <div className="home-incidencias-table-head">
              <span>Imagen</span>
              <span>Ubicacion</span>
              <span>Arrendatario</span>
              <span>Incidencia</span>
              <span>Estado</span>
            </div>

            <div className="home-incidencias-table-body">
              {incidencias.map((incidencia) => (
                <article className="home-incidencias-row" key={incidencia.id}>
                  <div className="home-incidencias-cell home-incidencias-image-cell">
                    <span className="home-incidencias-mobile-label">Imagen</span>
                    <img src={incidencia.img} alt="Vivienda" className="home-incidencias-image" />
                  </div>

                  <div className="home-incidencias-cell">
                    <span className="home-incidencias-mobile-label">Ubicacion</span>
                    <p className="home-incidencias-location">{incidencia.ubicacion}</p>
                  </div>

                  <div className="home-incidencias-cell">
                    <span className="home-incidencias-mobile-label">Arrendatario</span>
                    <div className="home-incidencias-tenant">
                      {incidencia.avatar ? (
                        <img
                          src={incidencia.avatar}
                          alt={incidencia.arrendatario}
                          className="home-incidencias-avatar"
                        />
                      ) : (
                        <div className="home-incidencias-avatar home-incidencias-avatar--placeholder">
                          <i className="bi bi-person-fill" />
                        </div>
                      )}
                      <span>{incidencia.arrendatario}</span>
                    </div>
                  </div>

                  <div className="home-incidencias-cell">
                    <span className="home-incidencias-mobile-label">Incidencia</span>
                    <div className="home-incidencias-description-box">
                      {incidencia.descripcion}
                    </div>
                  </div>

                  <div className="home-incidencias-cell">
                    <span className="home-incidencias-mobile-label">Estado</span>
                    <div className="home-incidencias-status-group">
                      <button
                        type="button"
                        className={`home-incidencias-status-pill ${
                          incidencia.status === "resuelta" ? "is-success" : "is-muted"
                        }`}
                        onClick={() => actualizarEstado(incidencia.id, "resuelta")}
                      >
                        Resuelta
                      </button>
                      <button
                        type="button"
                        className={`home-incidencias-status-pill ${
                          incidencia.status === "pendiente" ? "is-warning" : "is-muted"
                        }`}
                        onClick={() => actualizarEstado(incidencia.id, "pendiente")}
                      >
                        Pendiente
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {mostrarModal ? (
        <div className="home-incidencias-modal-overlay" onClick={cerrarModal}>
          <div
            className="home-incidencias-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="home-incidencias-modal-header">
              <h2>Nueva Incidencia</h2>
              <button
                type="button"
                className="home-incidencias-modal-close"
                onClick={cerrarModal}
                aria-label="Cerrar modal"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="home-incidencias-modal-body">
              <label
                htmlFor="nueva-incidencia-descripcion"
                className="home-incidencias-modal-label"
              >
                Descripcion
              </label>
              <textarea
                id="nueva-incidencia-descripcion"
                className="home-incidencias-modal-textarea"
                placeholder="Ingresa brevemente la incidencia que quieres reportar."
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                maxLength={LIMITE_DESCRIPCION}
                rows={6}
              />
              <div className="home-incidencias-modal-counter">
                {nuevaDescripcion.length}/{LIMITE_DESCRIPCION}
              </div>
            </div>

            <div className="home-incidencias-modal-footer">
              <button
                type="button"
                className="home-incidencias-modal-submit"
                onClick={crearIncidencia}
                disabled={!nuevaDescripcion.trim()}
              >
                <i className="bi bi-send" />
                Enviar incidencia
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomeIncidencias;
