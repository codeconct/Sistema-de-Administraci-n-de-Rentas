import "./Incidencias.css";
import React, { useState, useEffect } from "react";

const Incidencias = () => {

    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [filtroBusqueda, setFiltroBusqueda]= useState("");
      useEffect(() => {
        setPaginaActual(1); // Reset to first page on filter change
      }, [filtroStatus, filtroBusqueda]);
      
      {/* in this part you can change the number of items that appears in one page */}
      const [paginaActual, setPaginaActual] = useState(1);
      const itemsPorPagina = 5;
  
    const [incidencias, setPropiedades] = useState([
    {
      id: 1,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      arrendatario: "José Eduardo Amaya",
      descripcion: "fuga de gas en la cocina",

    },
    {
      id: 2,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Privada Puerta Norte Int. 199, 34155 Jardines Dgo",
      arrendatario: "Javier Hernández López",
      descripcion: "foco fundido en la sala de estar",
      resuelto: true,
    },
    {
      id: 3,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      arrendatario: "José Eduardo Amaya",
      descripcion: "cortina rota en el dormitorio",
      resuelto: false,
    },
      {
      id: 4,
      status: "archivado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      arrendatario: "José Eduardo Amaya",
      descripcion: "falta de agua caliente",
      resuelto: true,
    },
  ]);
const incidenciasFiltradas = incidencias.filter((i) => {
  if (filtroStatus === "todos") return true;
  return i.status === filtroStatus;
}).filter((i) => {
  const texto = filtroBusqueda.toLowerCase();
  return (
    i.ubicacion.toLowerCase().includes(texto) ||
    (i.arrendatario && i.arrendatario.toLowerCase().includes(texto)) ||
    i.id.toString().includes(texto)
  );
});

  const getStatusDot = (status) => {
    switch (status) {
      case "resuelto":
        return "status-dot status-resuelto";
      case "sin resolver":
        return "status-dot status-sin-resolver";
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
            className={'btn btn-outline-dark ${filtroStatus === "todos" ? " active" : ""}'}
            onClick={() => setFiltroStatus("todos")}>
            Total de Incidencias
          </button>

          <button className={'btn btn-outline-dark ${filtroStatus === "sinResolver" ? " active" : ""}'}
            onClick={() => setFiltroStatus("sinResolver")}>
            Incidencias Sin Resolver
            </button>

          <button className={'btn btn-outline-dark ${filtroStatus === "resuelto" ? " active" : ""}'}
            onClick={() => setFiltroStatus("resuelto")}>
            Incidencias Resueltas
            </button>
        </div>

        {/* Table header */}
        <div className="row table-header mb-2">
          <div className=" col-1"></div>
          <div className="col-3">Ubicación</div>
          <div className="col-2">Arrendatario</div>
          <div className="col-4">Incidencia</div>
          <div className="col-1 "></div>
        </div>

        {/* Property list */}
        {incidenciasFiltradas.map((prop) => (
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
          <ul className="pagination justify-content-center custom-pagination">
            {Array.from(
              {length: Math.ceil(incidenciasFiltradas.length / itemsPorPagina)},
              (_, idx) => (
                <li
                  key={idx + 1}
                    className={`page-item ${paginaActual === idx + 1 ? "active" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(idx + 1)}>
                      {idx + 1}
                  </button>
                </li> 
              ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};



export default Incidencias;