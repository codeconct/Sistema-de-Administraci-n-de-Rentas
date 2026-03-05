import react from "react";

const ContratoForm = () => {
  return (
    <div
      className="modal fade"
      id="contratosModal"
      tabIndex="-1"
      aria-labelledby="contratosModalLabel"
      aria-hidden="true"
    >z
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content contratos-modal">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold" id="contratosModalLabel">
              Contratos
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form>
              <div className="mb-4">
                <label className="form-label fw-semibold">Fecha de Firma</label>
                <input
                  type="date"
                  className="form-control form-control-sm custom-input"
                  placeholder="Selecciona el día"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control form-control-sm custom-input"
                  placeholder="Ejem. Jorge Lupin"
                />
              </div>

              <h6 className="fw-bold mt-4 mb-3">Revisar Contratos Pasados</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold">Número de Teléfono</label>
                <input
                  type="tel"
                  className="form-control form-control-sm custom-input"
                  placeholder="Ejem. 6181234567"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-sm custom-input"
                  placeholder="Ejem. jorge@email.com"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Domicilio</label>
                <input
                  type="text"
                  className="form-control form-control-sm custom-input"
                  placeholder="Ejem. Calle, fracc, num 123"
                />
              </div>

              <div className="mt-4">
                <label className="form-label fw-semibold">Subir Contrato</label>
                <div className="d-flex flex-column align-items-start gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm px-3 py-1 w-auto custom-upload-btn">
                    Subir Documento en PDF
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4 py-1 w-auto">
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoForm;