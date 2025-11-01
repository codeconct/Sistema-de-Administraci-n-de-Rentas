import React from "react";


const Viviendas = () => {
  const propiedades = [
    {
      id: 1,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: "$6,000 mn",
      arrendatario: "José Eduardo Amaya",
      fechaPago: "15 de Noviembre del 2025",
    },
    {
      id: 2,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: "$6,000 mn",
      arrendatario: "Pendiente",
      fechaPago: "-",
    },
    {
      id: 3,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: "$6,000 mn",
      arrendatario: "José Eduardo Amaya",
      fechaPago: "19 de Diciembre del 2025",
    },
  ];

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
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src="https://cdn-icons-png.flaticon.com/512/235/235861.png"
              width="40"
              className="me-2"
              alt="Logo"
            />
            <span className="fw-bold">Administración de Rentas</span>
          </a>
          <div className="d-flex align-items-center">
            <a href="#" className="nav-link mx-2 fw-semibold">
              Viviendas
            </a>
            <a href="#" className="nav-link mx-2 fw-semibold">
              Dashboard
            </a>
            <a href="#" className="nav-link mx-2 fw-semibold">
              Incidencias
            </a>
            <button className="btn btn-outline-secondary rounded-circle ms-3">
              <i className="bi bi-gear"></i>
            </button>
            <button className="btn btn-outline-secondary rounded-circle ms-2">
              <i className="bi bi-person"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Search and filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Buscar..."
          />
          <button className="btn btn-primary">+ Nuevo Departamento</button>
        </div>

        {/* Status legend */}
        <div className="mb-3">
          <span className="status-dot status-disponible"></span>Disponible
          <span className="status-dot status-archivado ms-3"></span>Archivado
          <span className="status-dot status-ocupado ms-3"></span>Ocupado
        </div>

        {/* Filter buttons */}
        <div className="filter-btns mb-4">
          <button className="btn btn-outline-dark active">
            Total de Viviendas
          </button>
          <button className="btn btn-outline-dark">Viviendas Ocupadas</button>
          <button className="btn btn-outline-dark">Viviendas Disponibles</button>
          <button className="btn btn-outline-dark">Viviendas Archivadas</button>
        </div>

        {/* Table header */}
        <div className="row table-header mb-2">
          <div className="col-4">Ubicación</div>
          <div className="col-3">Arrendatario</div>
          <div className="col-2">Fecha de Pago</div>
          <div className="col-3 text-end">Acciones</div>
        </div>

        {/* Property list */}
        {propiedades.map((prop) => (
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
                <small>{prop.precio}</small>
              </div>
            </div>

            <div className="col-3 d-flex align-items-center">
              <img
                src="https://via.placeholder.com/40"
                className="tenant-img me-2"
                alt="Arrendatario"
              />
              <span>{prop.arrendatario}</span>
            </div>

            <div className="col-2 d-flex align-items-center">
              <span>{prop.fechaPago}</span>
            </div>

            <div className="col-3 text-end">
              <button className="btn btn-sm btn-outline-primary me-2">
                Editar
              </button>
              <button className="btn btn-sm btn-outline-secondary me-2">
                Archivar
              </button>
              <button
                className={`btn btn-sm ${
                  prop.status === "ocupado"
                    ? "btn-outline-danger"
                    : "btn-outline-success"
                }`}
              >
                {prop.status === "ocupado" ? "Ocupado" : "Disponible"}
              </button>
              <a
                href="#"
                className="ms-3 text-decoration-none fw-semibold text-dark"
              >
                Contrato
              </a>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item active">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <span className="page-link">...</span>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                10
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Inline CSS for custom styling */}
      <style>{`
        .status-dot {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
        }
        .status-disponible { background-color: #28a745; }
        .status-ocupado { background-color: #dc3545; }
        .status-archivado { background-color: #6c757d; }
        .property-card {
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 0;
          align-items: center;
        }
        .property-img {
          width: 100px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
        }
        .tenant-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .filter-btns .btn {
          border-radius: 20px;
          margin-right: 5px;
        }
        .table-header {
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
          padding-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Viviendas;
