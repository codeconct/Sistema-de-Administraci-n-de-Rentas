import React, { useState } from 'react';
import './Configuracion.css';

import AppSettings from './AppSettings';
import PagSettings from './PagSettings';
import ArrendadorSettings from './ArrendadorSettings';

const Configuracion = ({ onClose }) => {
  const [seccion, setSeccion] = useState('app');

  return (
    <div className="modal-overlay">
      <div className="modal-content config-modal">

        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="config-title">Configuración</h2>

        <div className="config-body">

          <div className="config-menu">
            <button
              className={seccion === 'app' ? 'active' : ''}
              onClick={() => setSeccion('app')}
            >
              Configuración de la App
            </button>

            <button
              className={seccion === 'pago' ? 'active' : ''}
              onClick={() => setSeccion('pago')}
            >
              Información de Pago
            </button>

            <button
              className={seccion === 'arrendador' ? 'active' : ''}
              onClick={() => setSeccion('arrendador')}
            >
              Datos del Arrendador
            </button>
          </div>

          <div className="config-content">
            {seccion === 'app' && <AppSettings />}
            {seccion === 'pago' && <PagSettings />}
            {seccion === 'arrendador' && <ArrendadorSettings />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Configuracion;
