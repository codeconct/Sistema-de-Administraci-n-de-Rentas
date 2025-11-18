import React from "react";
import "./AparmentList.css";
import { useState } from "react";


const Viviendas = () => {

  const [filtroStatus, setFiltroStatus] = useState("todos");
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
      fechaPago: "2025-11-15",
    },
    {
      id: 2,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: null,
      fechaPago: null,
    },
    {
      id: 3,
      status: "ocupado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Departamento Corredor Privado Puerta Norte Int. 199, 34155 Jardines Dgo",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
  ]);

  const propiedadesFiltradas = propiedades.filter((p) => {
    if (filtroStatus === "todos") return true;
    return p.status === filtroStatus;

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
          <input
            type="text"
            className="form-control w-25"
            placeholder="Buscar..."
          />
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#contratosModal"
          >
            Crear contrato
          </button>
<div
  class="modal fade"
  id="contratosModal"
  tabindex="-1"
  aria-labelledby="contratosModalLabel"
  aria-hidden="true"
>z
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content contratos-modal">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-bold" id="contratosModalLabel">
          Contratos
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <div class="modal-body">
        <form>
          <div class="mb-4">
            <label class="form-label fw-semibold">Fecha de Firma</label>
            <input
              type="date"
              class="form-control form-control-sm custom-input"
              placeholder="Selecciona el día"
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Nombre Completo</label>
            <input
              type="text"
              class="form-control form-control-sm custom-input"
              placeholder="Ejem. Jorge Lupin"
            />
          </div>

          <h6 class="fw-bold mt-4 mb-3">Revisar Contratos Pasados</h6>

          <div class="mb-3">
            <label class="form-label fw-semibold">Número de Teléfono</label>
            <input
              type="tel"
              class="form-control form-control-sm custom-input"
              placeholder="Ejem. 6181234567"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              class="form-control form-control-sm custom-input"
              placeholder="Ejem. jorge@email.com"
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Domicilio</label>
            <input
              type="text"
              class="form-control form-control-sm custom-input"
              placeholder="Ejem. Calle, fracc, num 123"
            />
          </div>

          <div class="mt-4">
            <label class="form-label fw-semibold">Subir Contrato</label>
            <div class="d-flex flex-column align-items-start gap-2">
              <button
                type="button"
                class="btn btn-outline-dark btn-sm px-3 py-1 w-auto custom-upload-btn"
              >
                Subir Documento en PDF
              </button>
              <button type="submit" class="btn btn-primary btn-sm px-4 py-1 w-auto">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

        </div>

        {/* Status legend */}
        <div className="mb-3">
          <span className="status-dot status-disponible"></span>Disponible
          <span className="status-dot status-archivado ms-3"></span>Archivado
          <span className="status-dot status-ocupado ms-3"></span>Ocupado
        </div>

        {/* Filter buttons */}
        <div className="filter-btns mb-4">
          <button 
            className={'btn btn-outline-dark active${filtroStatus === "todos" ? " active" : ""}'}
            onClick={() => setFiltroStatus("todos")}>
            Total de Viviendas
          </button>

          <button 
            className={'btn btn-outline-dark active${filtroStatus === "ocupado" ? " active" : ""}'}
            onClick={() => setFiltroStatus("ocupado")}>
            Viviendas Ocupadas
            </button>
          
          <button className={'btn btn-outline-dark active${filtroStatus === "disponible" ? " active" : ""}'}
            onClick={() => setFiltroStatus("disponible")}>
            Viviendas Disponibles
            </button>
          
          <button className={'btn btn-outline-dark active${filtroStatus === "archivado" ? " active" : ""}'}
            onClick={() => setFiltroStatus("archivado")}>
            Viviendas Archivadas
            </button>
        </div>

        {/* Table header */}
        <div className="row table-header mb-2">
          <div className="col-4">Ubicación</div>
          <div className="col-3">Arrendatario</div>
          <div className="col-2">Fecha de Pago</div>
          <div className="col-3 text-end">Acciones</div>
        </div>

        {/* Property list */}
        {propiedadesFiltradas.map((prop) => (
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
                <i className="bi bi-person-circle fs-4 me-2 text-secondary"></i>
                <span>{prop.arrendatario}</span>
            </div>

            <div className="col-2 d-flex align-items-center">
              <span>{prop.fechaPago}</span>
            </div>

            <div className="col-3 text-start">
              <button className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#contratosModal">
                <i class="bi bi-pencil-square"></i>
                <br />
                Editar
              </button>
              <button className="btn btn-sm btn-outline-secondary me-2">
                <i class="bi bi-eye-slash"></i>
                <br />
                Archivar
              </button>
              <button
                className={`btn btn-sm ${
                  prop.status === "ocupado"
                    ? "btn-outline-danger"
                    : "btn-outline-success"
                }`}
              >
                <i class="bi bi-check2-square"></i>
                <br />
                {prop.status === "ocupado" ? "Ocupado" : "Disponible"}
              </button>
              <a
                href="#"
                className="ms-3 fw-semibold text-dark"
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
    </div>
  );
};

export default Viviendas;
