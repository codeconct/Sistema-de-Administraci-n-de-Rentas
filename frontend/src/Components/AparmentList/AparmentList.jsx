import React, { useState, useEffect } from "react";
import "./AparmentList.css";
import ViviendaForm from "../Forms/Viviendaform";
import EditarForm from "../Forms/Editarform";
import ContratoForm from "../Forms/Contratoform";
import { api } from "../../api";

import { jwtDecode } from "jwt-decode";


const Viviendas = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

  // ⬇️ Fetch data from backend on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(api("/viviendas"), {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error loading data");

        const data = await res.json();
        setPropiedades(data);
      } catch (err) {
        console.error(err);
        setError("Error loading viviendas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------------------
  //  Helpers to modify UI locally
  // ------------------------------

  const cambiarEstado = (id) => {
    setPropiedades(prev =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "ocupado" ? "disponible" : "ocupado" }
          : p
      )
    );
  };

  const archivarVivienda = (id) => {
    setPropiedades(prev =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "archivado" ? "disponible" : "archivado" }
          : p
      )
    );
  };

  const agregarPropiedad = (nueva) => {
    setPropiedades(prev => [...prev, nueva]);
  };

  const actualizarPropiedad = (propActualizada) => {
    setPropiedades(prev =>
      prev.map((p) =>
        p.id === propActualizada.id ? propActualizada : p
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
            data-bs-target="#viviendaModal"
          >
            Añadir Vivienda
          </button>

          <ViviendaForm agregarPropiedad={agregarPropiedad} />
          <EditarForm     
            propiedad={propiedadSeleccionada} 
            actualizarPropiedad={actualizarPropiedad}
              />

          <ContratoForm></ContratoForm>

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
            className={'btn btn-outline-dark ${filtroStatus === "todos" ? " active" : ""}'}
            onClick={() => setFiltroStatus("todos")}>
            Total de Viviendas
          </button>

          <button 
            className={'btn btn-outline-dark ${filtroStatus === "ocupado" ? " active" : ""}'}
            onClick={() => setFiltroStatus("ocupado")}>
            Viviendas Ocupadas
            </button>
          
          <button className={'btn btn-outline-dark ${filtroStatus === "disponible" ? " active" : ""}'}
            onClick={() => setFiltroStatus("disponible")}>
            Disponibles
            </button>
          
          <button className={'btn btn-outline-dark ${filtroStatus === "archivado" ? " active" : ""}'}
            onClick={() => setFiltroStatus("archivado")}>
            Archivadas
            </button>
        </div>

        {/* Table header */}
        <div className="row table-header mb-2">
          <div className="col-3">Ubicación</div>
          <div className="col-2">Arrendatario</div>
          <div className="col-2">Fecha de Pago</div>
        </div>

        {/* Property list */}
        {propiedadesFiltradas.map((prop) => (
          <div className="row property-card" key={prop.id}>
            <div className="col-3 d-flex align-items-center">
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

            <div className="col-2 d-flex align-items-center justify-content-center flex-column">
                <i className="bi bi-person-circle fs-3  text-secondary"></i>
                <span>{prop.arrendatario}</span>
            </div>

            <div className="col-1 d-flex align-items-center">
              <span>{prop.fechaPago}</span>
            </div>

            {/* Butons */}
            <div className="col-6 text-end">
              <button className="action-btn" data-bs-toggle="modal" data-bs-target="#editModal"
                onClick={() => setPropiedadSeleccionada(prop)}>
                <i class="bi bi-pencil-square"></i>
                Editar
              </button>

              {prop.status === "archivado" ? (
                <button className="btn-status archivado" onClick={() => archivarVivienda(prop.id)}>
                  <i className="bi bi bi-eye"></i>
                  Archivado
                </button>
              ) : (
                <button className="btn-status desarchivar" onClick={() => archivarVivienda(prop.id)}>
                  <i className="bi bi-eye-slash"></i>
                  Desarchivado
                </button>
              )}

              {prop.status === "ocupado" ? (
                <button className="btn-status ocupado" onClick={() => cambiarEstado(prop.id)}>
                  <i className="bi bi-x-circle"></i>
                  Ocupado
                </button>
              ) : (
                <button className="btn-status disponible" onClick={() => cambiarEstado(prop.id)}>
                  <i className="bi bi-check-circle"></i>
                  Disponible
                </button>
              )}

              <a
                href="#"
                className="action-btn ms-3 fw-semibold text-dark"
                data-bs-toggle="modal" data-bs-target="#contratosModal"
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
