import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaEnvelope } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";

const LoginForm = () => {

    const [action, setAction] = useState('');

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    return(
        <div className={`wrapper${action}`}>
            <div className='form-box login'>
                <form>
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

                    <button type='submit' className='btn'>Login</button>

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


            <div className='form-box register'>
                <form>
                    <h1>Register in LobsterGeek</h1>
                    <div className="input-box">
                        <input type="text" placeholder='First Name' required/> <FaUser className='icon'/>
                    </div> 
                    <div className="input-box">
                        <input type="text" placeholder='Second Name' required/> 
                    </div> 
                    <div className="input-box">
                        <input type="text" placeholder='E-mail' required/> <FaEnvelope  className='icon'/>
                    </div> 


                    <div className="input-box">
                        <input type="password" placeholder='Password' required/> <FaLock className='icon'/>
                    </div> 
                    <div className="input-box">
                        <input type="password" placeholder='Confirm Password' required/> 
                    </div> 
                    <div className="remember-forgot">
                        <label><input type='checkbox'/>I agree to the terms & conditions</label>
                        <a href='#'></a>
                    </div>

                    <button type='submit' className='btn'>Register</button>

                    <div className="register-link">
                        <p>Already have an account? <a href='#' onClick={loginLink}>Login</a>
                       </p>
                    </div>
                    <div className="input-fuaq">
                        <p>By continuing, you agree to Lobster Geek’s Terms of Service and acknowledge that you have read our Privacy Policy. Information Collection Notice.
                       </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;