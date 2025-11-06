import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import Home from './Components/Home/Home';
import Viviendas from './Components/AparmentList/AparmentList';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal (login) */}
        <Route path="/" element={<LoginForm />} />

        {/*Esta por verse a donde se debe redirigir*/}
        <Route path="/home" element={<Home />} />

        {/* Página a la que se redirige luego del login */}
        <Route path="/viviendas" element={<Viviendas />} />


      </Routes>
    </Router>
  );
}

export default App;
