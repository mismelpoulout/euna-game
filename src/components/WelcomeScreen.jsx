import React, { useState, useEffect } from 'react';
import { Button, Carousel, Col, Row, Spinner } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './css/welcome.css';
import logo from '../assets/logo.png'; // Asegúrate de tener tu logo en esta ruta

const WelcomeScreen = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loader
  const [showIntro, setShowIntro] = useState(true); // Estado para controlar la pantalla de inicio

  // Obtener comentarios de Firestore
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(doc => doc.data());
        console.log("Comentarios obtenidos:", fetchedComments);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error al recuperar los comentarios: ', error);
      } finally {
        setIsLoading(false); // Dejar de mostrar el loader una vez que se cargan los datos
      }
    };

    fetchComments();
    const timer = setTimeout(() => setShowIntro(false), 60000); // 10 segundos
    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar el componente

  }, []);

  // Manejo de autenticación con Google
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsAuthenticated(true);
        navigate('/home');
      })
      .catch((error) => {
        console.error('Error durante la autenticación con Google:', error);
      });
  };

  return (
    <div className="welcome-screen d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '100vh', overflow: 'auto', padding: '10px' }}>
      {isLoading ? (
        // Mostrar el logo como loader mientras se cargan los comentarios
        <div className="loader d-flex flex-column justify-content-center align-items-center">
          <img src={logo} alt="Logo" style={{ width: '450px', height: '450px', marginBottom: '20px' }} />
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div style={{ marginTop: '5%' }}>
          <h1 className="welcome-title">BIENVENIDO</h1>
          <p className="welcome-description">
            Somos medStudio especialistas en plataformas para estudio y superación.
          </p>
          <br />

          {/* Botón para autenticación con Google */}
          <Button
            variant="danger"
            size="lg"
            className="welcome-button google-button mb-3"
            onClick={handleGoogleSignIn}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            <FaGoogle className="me-2" /> Continuar con Google
          </Button>

          <br />
          <br />
          <hr />

          {/* Mostrar comentarios en un carrusel con avatars */}
          <h3>Comentarios </h3>
          <br />

          {comments.length > 0 ? (
            <Carousel className="mb-4" interval={3000} indicators={true} controls={true}>
              {comments.map((comment, index) => (
                <Carousel.Item key={index}>
                  <Row className="d-flex justify-content-center align-items-center">
                    <Col md={3} sm={12} className="text-center">
                      <img
                        src={comment.avatar}
                        alt="Avatar"
                        className="rounded-circle mb-3"
                        style={{ width: '100px', height: '100px' }}
                      />
                    </Col>
                    <Col md={9} sm={12}>
                      <p className="comment-user"><strong>{comment.userName}</strong></p>
                      <b className="comment-text">{comment.text}</b>
                      <br />
                      <br />
                      <br />
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <p>No hay comentarios disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;