import React, { useState } from "react";

const Incidencias = () => {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // RENOMBRADO: De 'incidencias' a 'propiedades' para coincidir con tu lógica
  const [propiedades, setPropiedades] = useState([
    {
      id: 1,
      status: "ocupado", // Corregido para coincidir con tus filtros (antes 'resuelto')
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-11-15",
    },
    {
      id: 2,
      status: "disponible", // Corregido
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "21 de Marzo 456, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: null,
      fechaPago: null,
    },
    {
      id: 3,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 4,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 5,
      status: "archivado", // Ejemplo de archivado
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion: "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
  ]);

  const cambiarEstado = (id) => {
    setPropiedades((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "ocupado" ? "disponible" : "ocupado",
            }
          : p
      )
    );
  };

  const archivarVivienda = (id) => {
    setPropiedades((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "archivado" ? "disponible" : "archivado",
            }
          : p
      )
    );
  };

  const propiedadesFiltradas = propiedades
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

  const getStatusDot = (status) => {
    switch (status) {
      case "disponible":
        return "status-dot status-disponible";
      case "ocupado":
        return "status-dot status-ocupado";
      case "archivado":
        return "status-dot status-archivado";
      default:
        return "";
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="apartment-page"></div>

      <div className="container py-4">
        {/* Search and filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="search-pill d-flex align-items-center">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-link text-dark contrato-btn fw-semibold"
            data-bs-toggle="modal"
            data-bs-target="#contratosModal"
          >
            Añadir Vivienda
          </button>
        </div>

        {/* Status legend */}
        <div className="mb-3">
          <span className="status-dot status-disponible"></span> Disponible
          <span className="status-dot status-ocupado ms-3"></span> Ocupado
          <span className="status-dot status-archivado ms-3"></span> Archivado
        </div>

        {/* Filter buttons */}
        <div className="filter-btns mb-4">
          <button
            className={`btn btn-outline-dark ${filtroStatus === "todos" ? " active" : ""}`}
            onClick={() => setFiltroStatus("todos")}
          >
            Total de Viviendas
          </button>

          <button
            className={`btn btn-outline-dark ${filtroStatus === "ocupado" ? " active" : ""}`}
            onClick={() => setFiltroStatus("ocupado")}
          >
            Viviendas Ocupadas
          </button>

          <button
            className={`btn btn-outline-dark ${filtroStatus === "disponible" ? " active" : ""}`}
            onClick={() => setFiltroStatus("disponible")}
          >
            Disponibles
          </button>

          <button
            className={`btn btn-outline-dark ${filtroStatus === "archivado" ? " active" : ""}`}
            onClick={() => setFiltroStatus("archivado")}
          >
            Archivadas
          </button>
        </div>

        {/* Table header */}
        <div className="row table-header mb-2">
          <div className="col-4">Ubicación</div>
          <div className="col-3">Arrendatario</div>
          <div className="col-2">Fecha Pago</div>
          <div className="col-3">Acciones</div>
        </div>

        {/* Property list */}
        {propiedadesFiltradas.length > 0 ? (
          propiedadesFiltradas.map((prop) => (
            <div className="row property-card" key={prop.id}>
              <div className="col-4 d-flex align-items-center">
                <span className={getStatusDot(prop.status)}></span>
                <img
                  src={prop.img}
                  className="property-img me-2"
                  alt="Departamento"
                />
                <div>
                  <p className="mb-1 fw-semibold">{prop.ubicacion}</p>
                  <small>${prop.precio}</small>
                </div>
              </div>

              <div className="col-3 d-flex align-items-center justify-content-center flex-column">
                <i className="bi bi-person-circle fs-3 text-secondary"></i>
                <span>{prop.arrendatario || "Sin Inquilino"}</span>
              </div>

              <div className="col-2 d-flex align-items-center">
                <span>{prop.fechaPago || "--"}</span>
              </div>

              {/* Buttons */}
              <div className="col-3 text-start">
                <button
                  className="action-btn me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>

                {prop.status === "archivado" ? (
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => archivarVivienda(prop.id)}
                    title="Desarchivar"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => archivarVivienda(prop.id)}
                    title="Archivar"
                  >
                    <i className="bi bi-eye-slash"></i>
                  </button>
                )}

                {prop.status === "ocupado" ? (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => cambiarEstado(prop.id)}
                    title="Marcar Disponible"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => cambiarEstado(prop.id)}
                    title="Marcar Ocupado"
                  >
                    <i className="bi bi-check-circle"></i>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No se encontraron viviendas con estos filtros.</p>
          </div>
        )}

        {/* Pagination */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Incidencias;