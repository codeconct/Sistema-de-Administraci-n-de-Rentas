import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { FaUser, FaBell, FaCog } from "react-icons/fa";
import logo from './../Assets/casa.png'; 

const Navbar = () => {
  return (
    <nav className="navbar p-2">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <h2>Administración <br /> de Rentas</h2>
      </div>

      <ul className="navbar-center mb-0 p-0">
        <li><Link to="/viviendas">Viviendas</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/incidencias">Incidencias</Link></li>
      </ul>

      <div className="navbar-right">
        <FaUser className="navbar-icon" />
        <FaCog className="navbar-icon" />
        <FaBell className="navbar-icon" />
        <div className="user-avatar"></div>
      </div>
    </nav>
  );
};

export default Navbar;