import react from "react";
import "./Incidencias.css";
import { useState } from "react";

const Incidencias = () => {

    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [filtroBusqueda, setFiltroBusqueda]= useState("");
    const [ordenPrecio, setOrdenPrecio] = useState("none");
  
    const [propiedades, setPropiedades] = useState([
    {
      id: 1,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "fuga de gas en la cocina",
    },
    {
      id: 2,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: "$6,000 mn",
      arrendatario: "Pendiente",
      fechaPago: "foco fundido en la sala de estar",
    },
    {
      id: 3,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: "$6,000 mn",
      arrendatario: "José Eduardo Amaya",
      fechaPago: "cortina rota en el dormitorio",
    },
      {
      id: 4,
      status: "archivado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "falta de agua caliente",
    },
  ]);

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
        </div>
        {/* Filter buttons */}
        <div className="filter-btns mb-4">
          <button 
            className={'btn btn-outline-dark active${filtroStatus === "todos" ? " active" : ""}'}
            onClick={() => setFiltroStatus("todos")}>
            Total de Incidencias
          </button>

          <button className={'btn btn-outline-dark active${filtroStatus === "disponible" ? " active" : ""}'}
            onClick={() => setFiltroStatus("disponible")}>
            Incidencias Sin Resolver
            </button>

          <button className={'btn btn-outline-dark active${filtroStatus === "ascendente" ? " active" : ""}'}
            onClick={() => setFiltroStatus("ocupado")}>
            Ordenar Ascendente
            </button>
          
          <button className={'btn btn-outline-dark active${filtroStatus === "descendente" ? " active" : ""}'}
            onClick={() => setFiltroStatus("disponible")}>
            Ordenar Descendente
            </button>

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
        {propiedadesFiltradas.map((prop) => (
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