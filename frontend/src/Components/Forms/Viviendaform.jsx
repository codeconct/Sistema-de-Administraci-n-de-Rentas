import React, { useState } from "react";

const ViviendaForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` // if you use JWT
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error creating apartment");
      }

      const data = await response.json();
      console.log("Created:", data);

      alert("Vivienda creada correctamente");

    } catch (error) {
      console.error(error);
      alert("Error al crear vivienda");
    }
  };

  return (
    <div
      className="modal fade"
      id="nuevaViviendaModal"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 shadow border-0">

          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">Nueva Vivienda</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Dirección
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Estado
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-dark btn-sm">
                  Guardar vivienda
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViviendaForm;