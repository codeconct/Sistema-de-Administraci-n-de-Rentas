import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./HomeIncidencias.css";

const LIMITE_DESCRIPCION = 220;

const leerRespuesta = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
};

const normalizarIncidencia = (incidencia) => ({
  id: incidencia?.id ?? incidencia?.requestid ?? Date.now(),
  status:
    incidencia?.status === "resuelta" ||
    String(incidencia?.status || "").toUpperCase() === "COMPLETED"
      ? "resuelta"
      : "pendiente",
  fecha:
    incidencia?.fecha ||
    incidencia?.requestdate ||
    incidencia?.request_date ||
    new Date().toISOString(),
  img:
    incidencia?.img ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  ubicacion:
    incidencia?.ubicacion ||
    incidencia?.apartment_address ||
    "Sin ubicacion",
  arrendatario:
    incidencia?.arrendatario ||
    incidencia?.tenant_name ||
    "Sin asignar",
  avatar: incidencia?.avatar || null,
  descripcion:
    incidencia?.descripcion ||
    incidencia?.description ||
    "Sin descripcion",
});

const HomeIncidencias = () => {
  const navigate = useNavigate();
  const [incidenciasData, setIncidenciasData] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [orden, setOrden] = useState("recientes");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const cargarIncidencias = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(api("/maintenancerequests"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await leerRespuesta(response);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              (data?.raw?.startsWith("<!DOCTYPE") ? "La API devolvio HTML y no JSON. Revisa la ruta desplegada." : null) ||
              "No se pudieron cargar las incidencias"
          );
        }

        setIncidenciasData(Array.isArray(data) ? data.map(normalizarIncidencia) : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "No se pudieron cargar las incidencias");
      } finally {
        setLoading(false);
      }
    };

    cargarIncidencias();
  }, []);

  const restablecerFiltros = () => {
    setFiltroBusqueda("");
    setFiltroEstado("todas");
    setOrden("recientes");
  };

  const actualizarEstado = async (id, status) => {
    const token = localStorage.getItem("token");

    try {
      setError("");

      const response = await fetch(api(`/maintenancerequests/${id}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await leerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            (data?.raw?.startsWith("<!DOCTYPE") ? "La ruta para actualizar estado no existe en la API desplegada." : null) ||
            "No se pudo actualizar la incidencia"
        );
      }

      setIncidenciasData((prev) =>
        prev.map((incidencia) =>
          incidencia.id === id ? normalizarIncidencia(data) : incidencia
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo actualizar la incidencia");
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevaDescripcion("");
    setError("");
  };

  const crearIncidencia = async () => {
    const descripcion = nuevaDescripcion.trim();

    if (!descripcion || enviando) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const decoded = token ? jwtDecode(token) : null;
      const tenantid = decoded?.id;

      setEnviando(true);
      setError("");

      const response = await fetch(api("/maintenancerequests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantid,
          requestdate: new Date().toISOString().slice(0, 10),
          description: descripcion,
          status: "PENDING",
        }),
      });

      const data = await leerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            (data?.raw?.startsWith("<!DOCTYPE") ? "La API devolvio HTML y no JSON. Revisa la ruta desplegada." : null) ||
            "No se pudo crear la incidencia"
        );
      }

      setIncidenciasData((prev) => [normalizarIncidencia(data), ...prev]);
      setFiltroEstado("todas");
      setOrden("recientes");
      cerrarModal();
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo crear la incidencia");
    } finally {
      setEnviando(false);
    }
  };

  const incidencias = useMemo(() => {
    const texto = filtroBusqueda.trim().toLowerCase();

      const filtradas = incidenciasData.filter((incidencia) => {
      const ubicacion = String(incidencia.ubicacion || "").toLowerCase();
      const arrendatario = String(incidencia.arrendatario || "").toLowerCase();
      const descripcion = String(incidencia.descripcion || "").toLowerCase();

      const coincideBusqueda =
        ubicacion.includes(texto) ||
        arrendatario.includes(texto) ||
        descripcion.includes(texto);

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
              {loading ? (
                <div className="home-incidencias-empty-state">
                  Cargando incidencias...
                </div>
              ) : null}

              {!loading && error ? (
                <div className="home-incidencias-empty-state home-incidencias-empty-state--error">
                  {error}
                </div>
              ) : null}

              {!loading && !error && incidencias.length === 0 ? (
                <div className="home-incidencias-empty-state">
                  Aun no has reportado incidencias.
                </div>
              ) : null}

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
              {error ? (
                <div className="home-incidencias-modal-error">{error}</div>
              ) : null}

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
                disabled={!nuevaDescripcion.trim() || enviando}
              >
                <i className="bi bi-send" />
                {enviando ? "Enviando..." : "Enviar incidencia"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomeIncidencias;
