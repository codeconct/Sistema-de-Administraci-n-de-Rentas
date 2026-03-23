import React, { useState } from "react";
import ArrendatarioForm from "./ArrendatarioForm";
import AvalForm from "./AvalForm";
import ContratoForm from "./Contratoform";

import { REACT_APP_API_URL } from '../../config'

import "./ContratoWizardForm.css"

async function createContract(data) {
  const response = await fetch(`${REACT_APP_API_URL}/rentalcontracts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}` // if you use auth
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error creating contract");
  }

  return response.json();
}

async function uploadContractDocument(file, contractId) {
  const formData = new FormData();
  formData.append("file", file);

  // 1. Upload to Supabase via our backend
  const uploadRes = await fetch(`${REACT_APP_API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const error = await uploadRes.json();
    throw new Error(error.error || "Error uploading document");
  }

  const uploadData = await uploadRes.json();

  // 2. Save document record in DB
  const docRes = await fetch(`${REACT_APP_API_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contractid: contractId,
      type: "CONTRACT",
      filepath: uploadData.path
    }),
  });

  if (!docRes.ok) {
    const error = await docRes.json();
    throw new Error(error.error || "Error linking document to contract");
  }

  return docRes.json();
}



export default function ContractWizardModal({ show, onClose, selectedApartmentId }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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
      monthlyAmount: "",
      file: null
    }
  });


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        apartmentid: selectedApartmentId, // you must have this
        tenant: formData.tenant,
        guarantor: formData.guarantor,
        startdate: formData.contract.startDate,
        monthlyAmount: formData.contract.monthlyAmount,
        depositamount: formData.contract.price,
        status: "ACTIVE"
      };

      const result = await createContract(payload);
      console.log("Contract created:", result);

      // If a file was selected, upload it and link to the contract
      if (formData.contract.file) {
        await uploadContractDocument(formData.contract.file, result.id);
        console.log("Document uploaded and linked.");
      }

      // Close modal
      onClose();

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                      <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                      >
                        {loading ? "Guardando..." : "Guardar contrato"}
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