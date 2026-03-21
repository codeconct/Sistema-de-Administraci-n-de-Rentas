import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
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
const LIMITE_ARCHIVO_MB = 10;
const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const HomeIncidencias = () => {
  const navigate = useNavigate();
  const [incidenciasData, setIncidenciasData] = useState(incidenciasBase);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [orden, setOrden] = useState("recientes");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [erroresArchivos, setErroresArchivos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

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
    setArchivosSeleccionados((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });
    setErroresArchivos([]);
    setSubiendo(false);
  };

  const validarArchivos = (files) => {
    const errores = [];
    const aceptados = [];

    for (const file of files) {
      if (!TIPOS_PERMITIDOS.includes(file.type)) {
        errores.push(`${file.name}: tipo no permitido`);
        continue;
      }
      if (file.size > LIMITE_ARCHIVO_MB * 1024 * 1024) {
        errores.push(`${file.name}: excede ${LIMITE_ARCHIVO_MB}MB`);
        continue;
      }
      aceptados.push(file);
    }

    return { aceptados, errores };
  };

  const manejarSeleccionArchivos = (event) => {
    const files = Array.from(event.target.files || []);
    const { aceptados, errores } = validarArchivos(files);

    setErroresArchivos(errores);
    const nuevos = aceptados.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setArchivosSeleccionados((prev) => [...prev, ...nuevos]);
    event.target.value = "";
  };

  const eliminarArchivo = (indice) => {
    setArchivosSeleccionados((prev) => {
      const item = prev[indice];
      if (item?.url) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((_, index) => index !== indice);
    });
  };

  const subirArchivos = async (ticketId, archivos) => {
    if (!archivos.length) return [];

    const resultados = [];
    for (const item of archivos) {
      const archivo = item.file;
      const formData = new FormData();
      formData.append("media", archivo);

      const response = await fetch(api(`/tickets/${ticketId}/media`), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje || "Error subiendo archivo");
      }

      resultados.push(await response.json());
    }

    return resultados;
  };

  const crearIncidencia = async () => {
    const descripcion = nuevaDescripcion.trim();

    if (!descripcion) {
      return;
    }

    const ubicacionBase =
      "Departamento Corredor Privada, Puerta Norte, Int. 109, 34155, Jardines de Durango.";

    try {
      setSubiendo(true);
      const response = await fetch(api("/tickets"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion,
          apartmentLabel: ubicacionBase,
        }),
      });

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje || "Error creando ticket");
      }

      const ticket = await response.json();
      let mediaSubida = [];

      if (archivosSeleccionados.length) {
        mediaSubida = await subirArchivos(ticket.id, archivosSeleccionados);
      }

      const nuevaIncidencia = {
        id: ticket.id,
        status: "pendiente",
        fecha: new Date().toISOString(),
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
        ubicacion: ubicacionBase,
        arrendatario: "Pendiente",
        avatar: null,
        descripcion,
        media: mediaSubida,
      };

      setIncidenciasData((prev) => [nuevaIncidencia, ...prev]);
      setFiltroEstado("todas");
      setOrden("recientes");
      cerrarModal();
    } catch (error) {
      setErroresArchivos((prev) => [
        ...prev,
        error.message || "No se pudo guardar la incidencia",
      ]);
    } finally {
      setSubiendo(false);
    }
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

              <div className="home-incidencias-upload">
                <label className="home-incidencias-modal-label">
                  Adjuntar imagenes o videos
                </label>
                <label className="home-incidencias-upload-box">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={manejarSeleccionArchivos}
                  />
                  <div>
                    <strong>Selecciona archivos</strong>
                    <p>
                      Max {LIMITE_ARCHIVO_MB}MB por archivo. JPG, PNG, WEBP, GIF,
                      MP4, WEBM o MOV.
                    </p>
                  </div>
                </label>

                {erroresArchivos.length > 0 && (
                  <ul className="home-incidencias-upload-errors">
                    {erroresArchivos.map((error, index) => (
                      <li key={`${error}-${index}`}>{error}</li>
                    ))}
                  </ul>
                )}

                {archivosSeleccionados.length > 0 && (
                  <div className="home-incidencias-upload-list">
                    {archivosSeleccionados.map((archivo, index) => {
                      const esVideo = archivo.file.type.startsWith("video/");

                      return (
                        <div
                          className="home-incidencias-upload-item"
                          key={archivo.url}
                        >
                          {esVideo ? (
                            <video src={archivo.url} controls />
                          ) : (
                            <img src={archivo.url} alt={archivo.file.name} />
                          )}
                          <div>
                            <p>{archivo.file.name}</p>
                            <button
                              type="button"
                              onClick={() => eliminarArchivo(index)}
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="home-incidencias-modal-footer">
              <button
                type="button"
                className="home-incidencias-modal-submit"
                onClick={crearIncidencia}
                disabled={!nuevaDescripcion.trim() || subiendo}
              >
                <i className="bi bi-send" />
                {subiendo ? "Subiendo..." : "Enviar incidencia"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomeIncidencias;
