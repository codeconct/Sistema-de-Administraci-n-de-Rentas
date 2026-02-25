import { useEffect, useState } from "react";
import "./Incidencias.css";

const Incidencias = () => {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      status: "resuelto",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: "Jose Eduardo Amaya",
      fechaPago: "2025-11-15",
    },
    {
      id: 2,
      status: "resuelto",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "21 de Marzo 456, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: null,
      fechaPago: null,
    },
    {
      id: 3,
      status: "pendiente",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: "Jose Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 4,
      status: "pendiente",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "Jose Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 5,
      status: "resuelto",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "Jose Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
  ]);

  const cambiarEstado = (id) => {
    setIncidencias((prev) =>
      prev.map((p) => {
        if (p.id !== id || p.status === "archivado") return p;
        return {
          ...p,
          status: p.status === "pendiente" ? "resuelto" : "pendiente",
        };
      })
    );
  };

  const incidenciasFiltradas = incidencias
    .filter((p) => {
      if (filtroStatus === "todos") return true;
      return p.status === filtroStatus;
    })
    .filter((p) => {
      const texto = filtroBusqueda.toLowerCase();
      return (
        p.ubicacion.toLowerCase().includes(texto) ||
        (p.arrendatario && p.arrendatario.toLowerCase().includes(texto)) ||
        p.id.toString().includes(texto)
      );
    });

  const totalPaginas = Math.max(
    1,
    Math.ceil(incidenciasFiltradas.length / elementosPorPagina)
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroStatus, filtroBusqueda]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const inicio = (paginaActual - 1) * elementosPorPagina;
  const incidenciasPaginadas = incidenciasFiltradas.slice(
    inicio,
    inicio + elementosPorPagina
  );

  const getStatusDot = (status) => {
    switch (status) {
      case "resuelto":
        return "status-dot status-disponible";
      case "pendiente":
        return "status-dot status-ocupado";
      default:
        return "";
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="apartment-page" />

      <div className="container py-4">
        <div className="d-flex align-items-center mb-3">
          <div className="search-pill d-flex align-items-center">
            <i className="bi bi-search search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3">
          <span className="status-dot status-disponible" /> Resuelta
          <span className="status-dot status-ocupado ms-3" /> Pendiente
        </div>

        <div className="filter-btns incidencias-filter-btns mb-4">
          <button
            className={`btn incidencia-filter-btn${filtroStatus === "todos" ? " is-active" : ""}`}
            onClick={() => setFiltroStatus("todos")}
          >
            Todas
          </button>

          <button
            className={`btn incidencia-filter-btn${filtroStatus === "resuelto" ? " is-active" : ""}`}
            onClick={() => setFiltroStatus("resuelto")}
          >
            Resueltas
          </button>

          <button
            className={`btn incidencia-filter-btn${filtroStatus === "pendiente" ? " is-active" : ""}`}
            onClick={() => setFiltroStatus("pendiente")}
          >
            Pendientes
          </button>
        </div>

        <div className="row table-header mb-2">
          <div className="col-4">Ubicacion</div>
          <div className="col-3">Arrendatario</div>
          <div className="col-2">Fecha</div>
        </div>

        {incidenciasPaginadas.map((prop) => (
          <div className="row property-card" key={prop.id}>
            <div className="col-4 d-flex align-items-center">
              <span className={getStatusDot(prop.status)} />
              <img src={prop.img} className="property-img me-2" alt="Departamento" />
              <div>
                <p className="mb-1 fw-semibold">{prop.ubicacion}</p>
                <small>{prop.precio}</small>
              </div>
            </div>

            <div className="col-3 d-flex align-items-center justify-content-center flex-column">
              <i className="bi bi-person-circle fs-3 text-secondary" />
              <span>{prop.arrendatario || "Sin asignar"}</span>
            </div>

            <div className="col-2 d-flex align-items-center">
              <span>{prop.fechaPago || "-"}</span>
            </div>

            <div className="col-3 text-start">
              {prop.status === "resuelto" ? (
                <button className="btn-status ocupado" onClick={() => cambiarEstado(prop.id)}>
                  <i className="bi bi-x-circle" />
                  Resuelta
                </button>
              ) : (
                <button
                  className="btn-status disponible"
                  onClick={() => cambiarEstado(prop.id)}
                >
                  <i className="bi bi-check-circle" />
                  Pendiente
                </button>
              )}
            </div>
          </div>
        ))}

        <nav className="mt-4">
          <ul className="pagination justify-content-center custom-pagination">
            {Array.from({ length: totalPaginas }, (_, index) => {
              const numeroPagina = index + 1;
              return (
                <li
                  key={numeroPagina}
                  className={`page-item${
                    paginaActual === numeroPagina ? " active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setPaginaActual(numeroPagina)}
                  >
                    {numeroPagina}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Incidencias;
