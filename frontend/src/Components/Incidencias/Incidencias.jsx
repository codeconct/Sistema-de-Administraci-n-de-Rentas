import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";
import "./Incidencias.css";

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

const Incidencias = () => {
  const [incidenciasData, setIncidenciasData] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [orden, setOrden] = useState("recientes");
  const [loading, setLoading] = useState(true);
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
    <div className="incidencias-page">
      <div className="container-fluid px-4 px-lg-5 py-4 py-lg-5">
        <div className="incidencias-shell">
          <div className="incidencias-header">
            <div>
              <h1 className="incidencias-title">Incidencias</h1>
              <p className="incidencias-subtitle">
                Consulta aqui todas las incidencias reportadas en el sistema.
              </p>
            </div>
          </div>

          <div className="incidencias-toolbar">
            <label className="incidencias-search">
              <i className="bi bi-search" />
              <input
                type="text"
                placeholder="Buscar una incidencia..."
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
              />
            </label>

            <div className="incidencias-sort-group">
              <button
                type="button"
                className={`incidencias-sort-btn ${orden === "recientes" ? "is-active" : ""}`}
                onClick={() => setOrden("recientes")}
              >
                <i className="bi bi-calendar4-week" />
                Mas recientes primero
              </button>
              <button
                type="button"
                className={`incidencias-sort-btn ${orden === "antiguas" ? "is-active" : ""}`}
                onClick={() => setOrden("antiguas")}
              >
                <i className="bi bi-calendar4-event" />
                Mas antiguas primero
              </button>
            </div>
          </div>

          <div className="incidencias-filters">
            <button
              type="button"
              className={`incidencias-filter-btn ${filtroEstado === "todas" ? "is-active" : ""}`}
              onClick={restablecerFiltros}
            >
              Todas
            </button>
            <button
              type="button"
              className={`incidencias-filter-btn ${filtroEstado === "resuelta" ? "is-active is-success" : ""}`}
              onClick={() => setFiltroEstado("resuelta")}
            >
              Resueltas
            </button>
            <button
              type="button"
              className={`incidencias-filter-btn ${filtroEstado === "pendiente" ? "is-active is-warning" : ""}`}
              onClick={() => setFiltroEstado("pendiente")}
            >
              Pendientes
            </button>
          </div>

          <div className="incidencias-table-card">
            <div className="incidencias-table-head">
              <span>Imagen</span>
              <span>Ubicacion</span>
              <span>Arrendatario</span>
              <span>Incidencia</span>
              <span>Estado</span>
            </div>

            <div className="incidencias-table-body">
              {loading ? (
                <div className="incidencias-empty-state">Cargando incidencias...</div>
              ) : null}

              {!loading && error ? (
                <div className="incidencias-empty-state incidencias-empty-state--error">
                  {error}
                </div>
              ) : null}

              {!loading && !error && incidencias.length === 0 ? (
                <div className="incidencias-empty-state">
                  No hay incidencias registradas para este arrendador.
                </div>
              ) : null}

              {incidencias.map((incidencia) => (
                <article className="incidencias-row" key={incidencia.id}>
                  <div className="incidencias-cell incidencias-image-cell">
                    <span className="incidencias-mobile-label">Imagen</span>
                    <img
                      src={incidencia.img}
                      alt="Vivienda"
                      className="incidencias-image"
                    />
                  </div>

                  <div className="incidencias-cell">
                    <span className="incidencias-mobile-label">Ubicacion</span>
                    <p className="incidencias-location">{incidencia.ubicacion}</p>
                  </div>

                  <div className="incidencias-cell">
                    <span className="incidencias-mobile-label">Arrendatario</span>
                    <div className="incidencias-tenant">
                      {incidencia.avatar ? (
                        <img
                          src={incidencia.avatar}
                          alt={incidencia.arrendatario}
                          className="incidencias-avatar"
                        />
                      ) : (
                        <div className="incidencias-avatar incidencias-avatar--placeholder">
                          <i className="bi bi-person-fill" />
                        </div>
                      )}
                      <span>{incidencia.arrendatario}</span>
                    </div>
                  </div>

                  <div className="incidencias-cell">
                    <span className="incidencias-mobile-label">Incidencia</span>
                    <div className="incidencias-description-box">
                      {incidencia.descripcion}
                    </div>
                  </div>

                  <div className="incidencias-cell">
                    <span className="incidencias-mobile-label">Estado</span>
                    <span
                      className={`incidencias-status-badge ${
                        incidencia.status === "resuelta" ? "is-success" : "is-warning"
                      }`}
                    >
                      {incidencia.status === "resuelta" ? "Resuelta" : "Pendiente"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incidencias;
