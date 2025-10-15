import React from "react";
import './LoginForm.css';

const LoginForm = () => {
  return (
    <div className="Wrapper">
        <form>
        <h1>Login</h1>
        <div className="inputbox">
             <input type="text" placeholder="Username" required/>
            </div>
            <div className="inputbox">
                 <input type="password" placeholder="Password" required/>
            </div>


            <div className="remember-forgot">
                <label><input type="checkbox" />Remember me</label>
                <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Login</button>
        </form>
    </div>
  );
}

export default LoginForm;