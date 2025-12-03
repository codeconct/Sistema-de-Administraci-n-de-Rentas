<<<<<<< HEAD
import React, { use } from "react";
import "./AparmentList.css";
import "../Forms/Viviendaform"
import "../Forms/Editarform"
import "../Forms/Contratoform"
import { useState, useEffect } from "react";
=======
import React, { useState, useEffect } from "react";
import "./AparmentList.css";
>>>>>>> ff79c1a540492ed17b0ea8e9db5a0052979b42a1
import ViviendaForm from "../Forms/Viviendaform";
import EditarForm from "../Forms/Editarform";
import ContratoForm from "../Forms/Contratoform";
import {REACT_APP_API_URL} from '../../config'

const token = localStorage.getItem("token");

<<<<<<< HEAD
const Viviendas = () => { 
  
=======
const Viviendas = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

>>>>>>> ff79c1a540492ed17b0ea8e9db5a0052979b42a1
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  
  useEffect(() => {
    setPaginaActual(1); // Reset to first page on filter change
  }, [filtroStatus, filtroBusqueda]);
  
  {/* in this part you can change the number of items that appears in one page */}
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5; //only you need to change this number

<<<<<<< HEAD
{/* this part you need it because with this the state of the building change */}
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
=======
  // ⬇️ Fetch data from backend on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${REACT_APP_API_URL}/apartments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
>>>>>>> ff79c1a540492ed17b0ea8e9db5a0052979b42a1

        if (!res.ok) throw new Error("Error loading data");

<<<<<<< HEAD
{/* propierty list */}
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
        "21 de Marzo 456, Col. Centro, 34000 Durango, Dgo.",
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
        {
      id: 4,
      status: "archivado",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 5,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 6,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 7,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 8,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
    {
      id: 9,
      status: "disponible",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      ubicacion:
        "Cipreces 123, Col. Centro, 34000 Durango, Dgo.",
      precio: 6000,
      arrendatario: "José Eduardo Amaya",
      fechaPago: "2025-12-01",
    },
 
  ]);
  
const agregarPropiedad = (nuevaPropiedad) => {
  const nextId = propiedades.length ? Math.max(...propiedades.map(p => p.id)) + 1 : 1;
    setPropiedades(prev => [...prev, { id: nextId, ...nuevaPropiedad }]);
  };

const actualizarPropiedad = (propiedadActualizada) => {
  setPropiedades(prev =>
    prev.map(p => p.id == propiedadActualizada.id ? propiedadActualizada : p)
  );
};


// Filtering and pagination
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

const indexInicio = (paginaActual - 1) * itemsPorPagina;
const indexFin = indexInicio + itemsPorPagina;
const propiedadesPaginadas = propiedadesFiltradas.slice(indexInicio, indexFin);
const totalPaginas = Math.ceil(propiedadesFiltradas.length / itemsPorPagina);


  

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
=======
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
          ? { ...p, status: p.status === "OCCUPAID" ? "ARCHIVED" : "OCCUPAID" }
          : p
      )
    );
>>>>>>> ff79c1a540492ed17b0ea8e9db5a0052979b42a1
  };

  const archivarVivienda = (id) => {
    setPropiedades(prev =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "ARCHIVED" ? "AVALAIBLE" : "ARCHIVED" }
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

  // ------------------------------
  //  Filtering logic
  // ------------------------------

  const propiedadesFiltradas = propiedades
    .filter((p) => filtroStatus === "todos" || p.status === filtroStatus)
    .filter((p) => {
      const texto = filtroBusqueda.toLowerCase();
      return (
        p.address.toLowerCase().includes(texto) ||
        p.id.toString().includes(texto)
      );
    });

  // ------------------------------
  //  UI States: Loading and Error
  // ------------------------------

  if (loading) return <div className="text-center py-5">Cargando datos...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  // ------------------------------
  //  NORMAL RENDER
  // ------------------------------

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">

        {/* Search + Add */}
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
          <ContratoForm />
        </div>

        {/* STATUS INDICATORS */}
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
        {propiedadesPaginadas.map((prop) => (
          <div className="row property-card" key={prop.id}>
            <div className="col-3 d-flex align-items-center">
              <span className={prop.status}></span>
              <img
                src="https://th.bing.com/th/id/OIP.6XIv3DVREt05mi0sSNtUDgHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
                className="property-img me-2"
                alt="Departamento"
              />
              <div>
                <p className="mb-1 fw-semibold">{prop.address}</p>
                <small>{prop.monthlyrent.toLocaleString('en-US')}$</small>
              </div>
            </div>

            <div className="col-2 d-flex align-items-center justify-content-center flex-column">
                <i className="bi bi-person-circle fs-3  text-secondary"></i>
                <span></span>
            </div>

            <div className="col-1 d-flex align-items-center">
              <span>{prop.monthlyrent}</span>
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
          <ul className="pagination justify-content-center custom-pagination">
            {Array.from(
              {length: Math.ceil(propiedadesFiltradas.length / itemsPorPagina)},
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

export default Viviendas;
