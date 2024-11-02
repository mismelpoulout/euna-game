import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import Home from './Home';
import Trivia from './Trivia';
import Exam from './Exam.jsx';
import ExamenPorEspecialidad from './Examespecialidad';
import Simulacion180 from './Simulacion';
import History from './History';
import FAQ from './components/FAQ.jsx';
import NavigationBar from './components/NavigationBar';
import WelcomeScreen from './components/WelcomeScreen';
import { auth } from './firebase/firebaseConfig.js';
import { Row } from 'react-bootstrap';
import useSystemTheme from './service/useSystemTheme.jsx'; 
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [loading, setLoading] = useState(true); // Estado de carga
  const [isUnlocked, setIsUnlocked] = useState(true); // Estado de desbloqueo
  const isDarkMode = useSystemTheme(); // Detecta el modo oscuro del dispositivo

  // Verificar si el usuario está autenticado al cargar la app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false); // Detener la carga cuando se sabe el estado de autenticación
    });

    return () => unsubscribe();
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true); // Desbloquear la plataforma
  };

  if (loading) {
    return <div>Cargando...</div>; // Mostrar durante la carga inicial
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}> 
      <Router>
        {isAuthenticated && isUnlocked ? (
          <>
          <NavigationBar />
            <Row className="mb-3 text-center"></Row>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home isAuthenticated={isAuthenticated} />} />
              <Route path="/trivia" element={<Trivia />} />
              <Route path="/examen" element={<Exam />} />
              <Route path="/simulacion180" element={<Simulacion180 />} />
              <Route path="/examen-especialidad" element={<ExamenPorEspecialidad />} />
              <Route path="/history" element={<History />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </>
        ) : (
          <WelcomeScreen setIsAuthenticated={setIsAuthenticated} /> // Bienvenida si no autenticado
        )}
      </Router>
    </div>
  );
}

export default App;