import react from "react";
import "./Incidencias.css";

const Incidencias = () => {
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
      
      
      <div className="apartment-page"></div>

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
          <div className=" col-1"></div>
          <div className="col-3">Ubicación</div>
          <div className="col-2">Arrendatario</div>
          <div className="col-4">Incidencia</div>
          <div className="col-1 ">Resuelto</div>
        </div>

        {/* Property list */}
        {propiedades.map((prop) => (
          <div className="row property-card" key={prop.id}>
            <div className="col-4 d-flex align-items-center">
              <img
                src={prop.img}
                className="property-img me-2"
                alt="Departamento"
              />
              <div>
                <p className="mb-1 fw-semibold">{prop.ubicacion}</p>
              </div>
            </div>

            <div className="col-2 d-flex align-items-center justify-content-center flex-column">
                <i className="bi bi-person-circle fs-3  text-secondary"></i>
                <span>{prop.arrendatario}</span>
            </div>

            <div className="col-4 d-flex align-items-center ">
              <span>{prop.fechaPago}</span>
            </div>

            <div className="col-1 text-center">
                {prop.status === "ocupado" ? <>
                <i class="bi bi-check2-square fs-4"></i>
                <br />
                Resuelto
                </> : 
                <>
                <i class="bi bi-square fs-4"></i>
                <br />
                Sin resolver
                </>}
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
    </div>
  );
};



export default Incidencias;