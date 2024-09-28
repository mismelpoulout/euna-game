// src/components/Register.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { auth, googleProvider, facebookProvider, appleProvider } from '../firebase/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

const Register = () => {

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user); // Usuario autenticado
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log(result.user); // Usuario autenticado
    } catch (error) {
      console.error(error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      console.log(result.user); // Usuario autenticado
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container text-center p-4">
    <h2 className="mb-4">Regístrate</h2>
    
    <Button 
      variant="danger" 
      onClick={handleGoogleSignIn} 
      className="d-flex align-items-center justify-content-center mb-3 w-100"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <i className="fab fa-google me-2"></i>
      con Google
    </Button>
    
    <Button 
      variant="primary" 
      onClick={handleFacebookSignIn} 
      className="d-flex align-items-center justify-content-center mb-3 w-100"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <i className="fab fa-facebook-f me-2"></i>
      con Facebook
    </Button>
    
    <Button 
      variant="dark" 
      onClick={handleAppleSignIn} 
      className="d-flex align-items-center justify-content-center w-100"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <i className="fab fa-apple me-2"></i>
         con Apple
    </Button>
  </div>
  );
};

export default Register;