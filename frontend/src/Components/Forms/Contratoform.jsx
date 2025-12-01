import react from "react";

const ContratoForm = () => {
  return (
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
                class="btn btn-outline-dark btn-sm px-3 py-1 w-auto custom-upload-btn">
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
  );
};

export default ContratoForm;