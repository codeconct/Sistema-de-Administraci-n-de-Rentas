import React from 'react';
import './Navbar.css';
import { FaUser, FaBell, FaCog } from "react-icons/fa";
import logo from './../Assets/casa.png'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <h2>Administración <br /> de Rentas</h2>
      </div>

      <ul className="navbar-center">
        <li><a href="#">Viviendas</a></li>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Incidencias</a></li>
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