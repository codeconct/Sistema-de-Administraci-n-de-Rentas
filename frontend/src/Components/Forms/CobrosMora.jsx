import React, { useState } from 'react';

const CobrosMoraSettings = () => {
  const [mora, setMora] = useState(
    JSON.parse(localStorage.getItem('moraSettings')) || 
    { tipo: 'PORCENTAJE', valor: 10 }
  );

  const handleSave = () => {
    localStorage.setItem('moraSettings', JSON.stringify(mora));
    alert("Configuración de mora guardada");
  };

  return (
    <div>
      <h4>Cobros y Mora</h4>

      <div className="row">
        <div className="col-md-6">
          <label>Tipo</label>
          <select
            className="form-select"
            value={mora.tipo}
            onChange={(e) => setMora({ ...mora, tipo: e.target.value })}
          >
            <option value="PORCENTAJE">Porcentaje (%)</option>
            <option value="FIJO">Monto Fijo ($)</option>
          </select>
        </div>

        <div className="col-md-6">
          <label>Valor</label>
          <input
            type="number"
            className="form-control"
            value={mora.valor}
            onChange={(e) => setMora({ ...mora, valor: Number(e.target.value) })}
          />
        </div>
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Guardar
      </button>
    </div>
  );
};

export default CobrosMoraSettings;
