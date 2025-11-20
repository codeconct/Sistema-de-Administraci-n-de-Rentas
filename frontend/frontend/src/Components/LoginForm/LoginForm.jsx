import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaEnvelope } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

    const [action, setAction] = useState('');
    const navigate = useNavigate();

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

     const handleLogin = (e) => {
    e.preventDefault();
    navigate('/viviendas');
    };

    return(
    <div className='login-page'>
        <div className={`wrapper${action}`}>
            <div className='form-box login'>
                <form onSubmit={handleLogin}>
                    <h1>Administracion de Rentas</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required/> <FaUser className='icon'/>
                    </div> 

                    <div className="input-box">
                        <input type="password" placeholder='Password' required/> <FaLock className='icon'/>
                    </div> 
                    <div className="remember-forgot">
                        <label><input type='checkbox'/>Remember me</label>
                        <a href='#'> </a>
                    </div>

                   <button type="submit" className="btn btn-dark w-100">Login</button>

                    <div className="register-link">
                        <p> <a href='#' onClick={registerLink}> </a>
                       </p>
                    </div>
                    <div className="input-fuaq">
                        <p>By continuing, you agree to Administracion de Rentas Terms of Service and acknowledge that you have read our Privacy Policy. Information Collection Notice.
                       </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default LoginForm;