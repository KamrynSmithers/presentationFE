// CreateAcc.tsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";import { login, register } from '../api/api.ts';
import '../signIn.css'
import axios from 'axios'


function CreateAcc() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false)

//login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  //register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('')

  //error message state
  const [error, setError] = useState('');

  //handles login form submit
  const handleLogin = async (e:React.SyntheticEvent) => {
    e.preventDefault();
console.log('Login submit');
console.log(loginEmail, loginPassword);
    try {
      const response = await login(loginEmail, loginPassword);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data._id);
      navigate('/choices');
    } catch (err:any) {
          console.log('Error:', err); 

      setError(err.response?.data?.message || 'Login failed');
    }
  };

// handles register form submit
  const handleRegister = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await register(registerName, registerEmail, registerPassword);
      localStorage.setItem('token', response.data.token);
       localStorage.setItem('userId', response.data._id)
      navigate('/choices');
    } catch (err:any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };


const handleForgotPassword = async (email: string) => {
  try {
    await axios.post('http://localhost:4000/password/forgot-password', { email });
    alert('Reset email sent! Check your inbox.');
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to send reset email');
  }
};


return (
  <div className="signin-page">
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
  {/* shows error message if login/register fails */}
        {error && <div style={{color: 'red', textAlign: 'center'}}>{error}</div>}
        <div className="form-container register-container">
<form id="signInForm"onSubmit={handleRegister}>          <h1 id="signInLogin">Sign Up</h1>
          <input type = "text" placeholder="Name" 
          value={registerName} 
            onChange={(e) => setRegisterName(e.target.value)} 
          required/>
          <input type = "email" placeholder="Email"
          value={registerEmail} 
            onChange={(e) => setRegisterEmail(e.target.value)} 
          required/>
          <input type = "password" placeholder="Password" 
           value={registerPassword} 
            onChange={(e) => setRegisterPassword(e.target.value)} 
          required/>
<button type="submit">Register</button>
           <span> or use your acccount</span> 
           <div className="social-container">
          <a href="#" className="social"><i className="lni lni-facebook-fill"></i></a>
          <a href="#" className="social"><i className="lni lni-google"></i></a>
          <a href="#" className="social"><i className="lni lni-linkedin-original"></i></a>
            </div>
          </form>
        </div>
      

      <div className="form-container login-container">
<form onSubmit={handleLogin}>
          <h1 id="signInLogin">Login</h1>
          <input type="email" placeholder="Email"  
          value={loginEmail} 
            onChange={(e) => setLoginEmail(e.target.value)} 
          required/>
          <input type="password" placeholder="Password" 
          value={loginPassword} 


            onChange={(e) => setLoginPassword(e.target.value)} 

          required/>
          <div className="content">
            <div className="checkbox">
              <input type="checkbox" name="checkbox" id="checkbox" />
              <label>Remeber Me</label>
            </div>
            <div className="pass-link">
              <a href="#" onClick={(e) => {
              e.preventDefault();
              const email = prompt("Enter your email:");
              if (email) handleForgotPassword(email);
              }}>Forgot Password?</a>
            </div>
          </div>
          <button type="submit">Login</button>
          <span>or use your account</span>
          <div className="social-container">
          <a href="#" className="social"><i className="lni lni-facebook-fill"></i></a>
          <a href="#" className="social"><i className="lni lni-google"></i></a>
          <a href="#" className="social"><i className="lni lni-linkedin-original"></i></a>
          </div>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="title">Already registered?</h1>
            <p>Login here</p>
<button type="button" className="ghost" onClick={() => setIsActive(false)}>
  Login
  <i className="lni lni-arrow-left login"></i>
</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1 className="title">Start <br/> Reviewing Now</h1>
            <p>New here? Join us and start your journey</p>
<button type = "button" className="ghost" onClick={() => setIsActive(true)}>
  Register
  <i className="lni lni-arrow-right register"></i>
</button>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}

export default CreateAcc;