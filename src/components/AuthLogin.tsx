import React, { useState } from 'react';
import Lottie from "lottie-react";
import SignUp from "../Assets/Signup.json";
import Login from "../Assets/login.json";
import './AuthStyles.css';

interface AuthFormProps {
  onLogin: (username: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleLoginSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (loginData.username && loginData.password) {
      console.log('Login submitted:', loginData);
      onLogin(loginData.username);
    } else {
      alert('Please enter username and password');
    }
  };

  const handleRegisterSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (registerData.username && registerData.email && registerData.password) {
      console.log('Register submitted:', registerData);
      onLogin(registerData.username);
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div className={`container-auth ${isActive ? 'active' : ''}`}>
          {/* Login Form */}
          <div className="form-box login" style={{backgroundColor: "#deeefa"}}>
            <div className="form-content">
              <h1 className="text-3xl font-bold mb-8 text-gray-800">Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <div className="text-left mb-5">
                <a href="#" className="text-sm hover:text-blue-600" style={{ color: '#153d5d' }}>
                  Forgot password?
                </a>
              </div>
              <button onClick={handleLoginSubmit} className="auth-button">
                Login
              </button>
              <p className="text-sm my-5 text-gray-600">or login with social platform</p>
              <div className="social-icons flex justify-center">
                <a href="#"><i className="bx bxl-google"></i></a>
                <a href="#"><i className="bx bxl-facebook"></i></a>
                <a href="#"><i className="bx bxl-github"></i></a>
                <a href="#"><i className="bx bxl-linkedin"></i></a>
              </div>
            </div>
          </div>

          {/* Register Form */}
          <div className="form-box register" style={{backgroundColor: "#deeefa"}}>
            <div className="form-content">
              <h1 className="text-4xl font-bold mb-8 text-gray-800">Register</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <i className="bx bxs-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <button onClick={handleRegisterSubmit} className="auth-button">
                Register
              </button>
              <p className="text-sm my-5 text-gray-600">or register with social platform</p>
              <div className="social-icons flex justify-center">
                <a href="#"><i className="bx bxl-google"></i></a>
                <a href="#"><i className="bx bxl-facebook"></i></a>
                <a href="#"><i className="bx bxl-github"></i></a>
                <a href="#"><i className="bx bxl-linkedin"></i></a>
              </div>
            </div>
          </div>

          {/* Animated Background - Left */}
          <div className="word-box">
            <div className="word-content word-left">
              <div className="w-80 h-80 mx-auto">
                      <Lottie animationData={SignUp} loop={true} />
              </div>
              <p className="mb-6">Don't have an account already?</p>
              <button className="toggle-button" onClick={handleRegisterClick}>
                Register
              </button>
            </div>
          </div>

          {/* Animated Background - Right */}
          <div className="word-box">
            <div className="word-content word-right">
              <div className="w-80 h-80 mx-auto">
                <Lottie animationData={Login} loop={true} />
              </div>
              <p className="mb-6">Already have an account?</p>
              <button className="toggle-button" onClick={handleLoginClick}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;