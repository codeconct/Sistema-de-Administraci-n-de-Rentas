import React from "react";

const EditarForm = () => {
  const [formData, setFormData] = useState({
    zipcode: "",
    estado: "",
    municipio: "",
    domicilio: "",
    precio_renta: "",
    tenant_name: "",
    tenant_phone: "",
    tenant_email: "",
    tenant_address: "",
    aval_name: "",
    aval_phone: "",
    aval_email: "",
    aval_address: "",
    fecha_firma: "",
    fecha_pago: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/viviendas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) alert("Guardado!");
    else alert("Error al guardar");
  };

  return (
    
    <div
      className="modal fade"
      id="editModal"
      tabIndex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content contratos-modal">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold fs-5" id="editModalLabel">
              Editar Viviendas
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          {/* FORMULARIO */}
          <form className="p-4">
            <h6 className="fw-bold mt-4 mb-3 fs-3"> Informacion General de la Vivienda</h6>

            <div className="mb-3">
              <label className="form-label fw-semibold">Código Postal</label>
              <input type="tel" className="form-control form-control-sm custom-input" placeholder="Ejem. 34000" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Estado</label>
              <input type="text" className="form-control form-control-sm custom-input" placeholder="Ejem. Durango" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Municipio</label>
              <input type="text" className="form-control form-control-sm custom-input" placeholder="Ejem. Durango" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Domicilio</label>
              <input type="text" className="form-control form-control-sm custom-input" placeholder="Ejem. Calle, fracc, num 123" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Precio de Renta</label>
              <input type="tel" className="form-control form-control-sm custom-input" placeholder="Ejem. $3500" />
            </div>

            <h6 className="fw-bold mt-4 mb-3">Datos del Arrendatario</h6>

            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre Completo</label>
              <input type="text" className="form-control form-control-sm custom-input" placeholder="Ejem. Joseph Joestar" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Numero de Teléfono</label>
              <input type="tel" className="form-control form-control-sm custom-input" placeholder="Ejem. 618-123-4567" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Correo Electrónico</label>
              <input type="email" className="form-control form-control-sm custom-input" placeholder="Ejem. jorge@gmail.com" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Domicilio (Opcional)</label>
              <input type="text" className="form-control form-control-sm custom-input" placeholder="Ejem. Calle, fracc, num 123" />
            </div>

            <h6 className="fw-bold mt-4 mb-3">Datos del Aval</h6>

            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre Completo</label>
              <input type="text" className="form-control form-control-sm custom-input" placeholder="Ejem. Joseph Joestar" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Número de Teléfono</label>
              <input type="tel" className="form-control form-control-sm custom-input" placeholder="Ejem. 618-123-4567" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Correo Electrónico</label>
              <input type="email" className="form-control form-control-sm custom-input" placeholder="Ejem. jorge@gmail.com" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Domicilio</label>
              <input type="text" className="form-control form-control-sm custom-input" placeholder="Ejem. Calle, fracc, num 123" />
            </div>

            <h6 className="fw-bold mt-4 mb-3">Contrato</h6>

            <div className="mb-4">
              <label className="form-label fw-semibold">Fecha de Firma</label>
              <input type="date" className="form-control form-control-sm custom-input" />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Fecha de Pago</label>
              <input type="date" className="form-control form-control-sm custom-input" />
            </div>

            <div className="d-flex flex-column align-items-start gap-2">
              <label className="form-label fw-semibold">Descargar Contrato de la Vivienda</label>
              <button type="button" className="btn btn-outline-dark btn-sm px-3 py-1 w-auto">
                Descargar Documento PDF
              </button>

              <label className="form-label fw-semibold mt-3">Subir Contrato Firmado</label>
              <button type="button" className="btn btn-outline-dark btn-sm px-3 py-1 w-auto">
                Subir Documento PDF
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-sm px-4 py-1 mt-3 w-auto">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarForm;