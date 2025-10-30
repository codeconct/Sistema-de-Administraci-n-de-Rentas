import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import Home from './Components/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal (login) */}
        <Route path="/" element={<LoginForm />} />

        {/* Página a la que se redirige luego del login */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
