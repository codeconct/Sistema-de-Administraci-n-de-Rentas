import React, { useState } from "react";
import ArrendatarioForm from "./ArrendatarioForm";
import AvalForm from "./AvalForm";
import ContratoForm from "./ContratoForm";
import "./ContratoWizardForm.css"

export default function ContractWizardModal({ show, onClose }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    tenant: {
      name: "",
      phone: "",
      email: "",
      address: ""
    },
    guarantor: {
      name: "",
      phone: "",
      email: "",
      address: ""
    },
    contract: {
      price: "",
      startDate: "",
      endDate: ""
    }
  });

  if (!show) return null;

  const updateTenant = (field, value) => {
    setFormData(prev => ({
      ...prev,
      tenant: {
        ...prev.tenant,
        [field]: value
      }
    }));
  };

  const updateGuarantor = (field, value) => {
    setFormData(prev => ({
      ...prev,
      guarantor: {
        ...prev.guarantor,
        [field]: value
      }
    }));
  };

  const updateContract = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contract: {
        ...prev.contract,
        [field]: value
      }
    }));
  };



  const renderStep = () => {
    switch (step) {
      case 1:
        return <ArrendatarioForm
          data={formData.tenant}
          update={updateTenant}
        />;
      case 2:
        return <AvalForm
          data={formData.guarantor}
          update={updateGuarantor}
        />;
      case 3:
        return <ContratoForm
          data={formData.contract}
          update={updateContract}
        />;
      default:
        return null;
    }
  };


  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content border-0 shadow rounded-4">

            <div className="modal-header">
              <h5 className="fw-bold">Datos del Contrato</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body p-0">
              <div className="row g-0">

                {/* SIDEBAR */}
                <div className="col-3 border-end bg-light p-3">

                  <button
                    className={`sidebar-item ${step === 1 ? "active" : ""}`}
                    onClick={() => setStep(1)}
                  >
                    Datos del Arrendatario
                  </button>

                  <button
                    className={`sidebar-item ${step === 2 ? "active" : ""}`}
                    onClick={() => setStep(2)}
                  >
                    Datos del Aval
                  </button>

                  <button
                    className={`sidebar-item ${step === 3 ? "active" : ""}`}
                    onClick={() => setStep(3)}
                  >
                    Datos del Contrato
                  </button>

                </div>

                {/* CONTENT */}
                <div className="col-9 p-4">
                  {renderStep()}

                  <div className="d-flex justify-content-between mt-4">

                    {step > 1 && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(step - 1)}
                      >
                        Atrás
                      </button>
                    )}

                    {step < 3 && (
                      <button
                        className="btn btn-dark"
                        onClick={() => setStep(step + 1)}
                      >
                        Siguiente
                      </button>
                    )}

                    {step === 3 && (
                      <button className="btn btn-success">
                        Guardar contrato
                      </button>
                    )}

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}