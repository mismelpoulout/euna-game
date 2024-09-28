import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // Para verificar la autenticación
import Home from './Home';
import Trivia from './Trivia';
import Exam from './Exam.jsx';
import History from './History';
import NavigationBar from './components/NavigationBar';
import WelcomeScreen from './components/WelcomeScreen';
import { auth } from './firebase/firebaseConfig.js'; // Importa el auth inicializado en firebase.js
import { Row } from 'react-bootstrap';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial

  // Verificar si el usuario está autenticado cuando la app se carga
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Usuario autenticado
      } else {
        setIsAuthenticated(false); // Usuario no autenticado
      }
      setLoading(false); // Detener la carga una vez que se sabe el estado de autenticación
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar mientras se verifica la autenticación
  }

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <NavigationBar />
          <br />
          <Row className="mb-3 text-center"></Row>
          <Routes>
            {/* Definición de rutas protegidas */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/trivia" element={<Trivia />} />
            <Route path="/examen" element={<Exam />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </>
      ) : (
        <WelcomeScreen setIsAuthenticated={setIsAuthenticated} />
      )}
    </Router>
  );
}

export default App;