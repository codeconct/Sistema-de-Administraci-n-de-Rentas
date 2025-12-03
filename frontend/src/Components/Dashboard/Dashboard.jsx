import React, { useState, useEffect } from "react";
import "./Dashboard.css";

import {LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend} from "recharts";

// Sample data for the line chart
const dataMensual = [
  { name: "Jan", a: 40, b: 30, c: 20 },
  { name: "Feb", a: 55, b: 45, c: 25 },
  { name: "Mar", a: 30, b: 50, c: 20 },
  { name: "Apr", a: 60, b: 40, c: 30 },
  { name: "May", a: 35, b: 25, c: 20 }
];
// Sample data for the pie chart
const incidencias = [
  { name: "Por Resolver", value: 20 },
  { name: "Resueltas", value: 40 },
  { name: "Pendientes", value: 15 }
];


const dataPagos = [
  {
    nombre: "Juan Perez",
    departamento: "101",
    telefono: "555-1234",
    ubicacion: "Zona A",
    estatus: "Pagado",
    recibo: "#"
  },  
  {
    nombre: "Jose Gomez",
    departamento: "165",
    telefono: "555-12785",
    ubicacion: "Zona b",
    estatus: "Pendiente",
    recibo: "#"
  },
  {
    nombre: "Ana Martinez",
    departamento: "210",
    telefono: "555-9876",
    ubicacion: "Zona C",
    estatus: "Vencido",
    recibo: "#"
  },
    {
    nombre: "Juan Perez",
    departamento: "101",
    telefono: "555-1234",
    ubicacion: "Zona A",
    estatus: "Pagado",
    recibo: "#"
  },  
  {
    nombre: "Jose Gomez",
    departamento: "165",
    telefono: "555-12785",
    ubicacion: "Zona b",
    estatus: "Pendiente",
    recibo: "#"
  },
  {
    nombre: "Ana Martinez",
    departamento: "210",
    telefono: "555-9876",
    ubicacion: "Zona C",
    estatus: "Vencido",
    recibo: "#"
  },
];



const colors = ["#5f2db5ff", "#b893d8ff", "#896bbcff"];

const Dashboard = () => {

const [paginaActual, setPaginaActual] = useState(1);
const registrosPorPagina = 5;//change if you want to show more or less items in the table

const ultimoIndex = paginaActual * registrosPorPagina;
const primerIndex = ultimoIndex - registrosPorPagina;
const registrosActuales = dataPagos.slice(primerIndex, ultimoIndex);
const totalPaginas = Math.ceil(dataPagos.length / registrosPorPagina);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      
      {/*top cards*/}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="shadow-sm p-3 bg-white rounded">
            <small>Ganancia Mensual</small>
            <h2>$15,568</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="shadow-sm p-3 bg-white rounded">
            <small>Viviendas Ocupadas</small>
            <h2>250 / 500</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="shadow-sm p-3 bg-white rounded">
            <small>Facturas Vencidas</small>
            <h2>7 / 250</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="shadow-sm p-5 bg-white rounded" ></div>
        </div>
      </div>

      {/*  line chart */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="shadow-sm p-3 bg-white rounded">
            <h6>Ingreso Mensual</h6>
            <LineChart width={990} height={250} data={dataMensual}>
              <Line type="monotone" dataKey="a" stroke="#7e57c2" strokeWidth={2} />
              <Line type="monotone" dataKey="b" stroke="#ce93d8" strokeWidth={2} />
              <Line type="monotone" dataKey="c" stroke="#6e41baff" strokeWidth={2} />
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        </div>

        {/* pie chart */}
        <div className="col-md-4">
          <div className="shadow-sm p-3 bg-white rounded text-center">
            <h6>Incidencias</h6>
            <PieChart width={500} height={250}>
              <Pie
                data={incidencias}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
              >
                {incidencias.map((entry, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>

      {/*Payment Table*/}
      <div className="shadow-sm p-3 bg-white rounded">
        <h6>Registro de pago</h6>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número de Departamento</th>
              <th>Teléfono</th>
              <th>Localización</th>
              <th>Estatus</th>
              <th>Recibo</th>
            </tr>
          </thead>
          <tbody>
            {registrosActuales.map((pago, index) => (
              <tr key={index}>
                <td>{pago.nombre}</td>
                <td>{pago.departamento}</td>
                <td>{pago.telefono}</td>
                <td>{pago.ubicacion}</td>
                <td>{pago.estatus}</td>
                <td><a href={pago.recibo}>Ver Recibo</a></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination buttons */}
        <div className="d-flex justify-content-center mt-3 pagination-btns">
          {Array.from({ length: totalPaginas}, (_, i) => (
            <button key={i} className={`btn btn-outline-dark mx-1 ${paginaActual === i + 1 ? "active" : ""}`}
              onClick={() => setPaginaActual(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;