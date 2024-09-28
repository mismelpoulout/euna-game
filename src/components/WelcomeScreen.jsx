import React from 'react';
import { Button } from 'react-bootstrap';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'; // Importa los proveedores de Google y Facebook
import { auth } from '../firebase/firebaseConfig'; // Importa la configuración de Firebase

const WelcomeScreen = ({ setIsAuthenticated }) => {
  
  // Manejo de autenticación con Google
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider(); // Proveedor de Google

    signInWithPopup(auth, provider) // Autenticar con popup
      .then((result) => {
        // Usuario autenticado correctamente
        setIsAuthenticated(true); // Cambiar el estado de autenticación
        window.location.assign('/home'); // Redirigir al home
      })
      .catch((error) => {
        console.error('Error durante la autenticación con Google:', error); // Mostrar error si falla
      });
  };

  // Manejo de autenticación con Facebook
  const handleFacebookSignIn = () => {
    const provider = new FacebookAuthProvider(); // Proveedor de Facebook

    signInWithPopup(auth, provider) // Autenticar con popup
      .then((result) => {
        // Usuario autenticado correctamente
        setIsAuthenticated(true); // Cambiar el estado de autenticación
        window.location.assign('/home'); // Redirigir al home
      })
      .catch((error) => {
        console.error('Error durante la autenticación con Facebook:', error); // Mostrar error si falla
      });
  };

  return (
    <div className="welcome-screen d-flex flex-column justify-content-center align-items-center text-center">
      <h1 className="welcome-title">Bienvenido a la Trivia</h1>
      <br/>
      <br/>
      {/* Botón para autenticación con Google */}
      <Button
        variant="danger"
        size="lg"
        className="welcome-button google-button mb-3"
        onClick={handleGoogleSignIn} // Ejecutar la función de autenticación con Google
      >
        <FaGoogle className="me-2" /> {/* Ícono de Google */}
        Continuar con Google
      </Button>

      {/* Botón para autenticación con Facebook */}
      <Button
        variant="primary"
        size="lg"
        className="welcome-button facebook-button"
        onClick={handleFacebookSignIn} // Ejecutar la función de autenticación con Facebook
      >
        <FaFacebook className="me-2" /> {/* Ícono de Facebook */}
        Continuar con Facebook
      </Button>
      
    </div>
  );
};

export default WelcomeScreen;