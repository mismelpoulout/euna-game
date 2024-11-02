import React, { useState, useEffect } from 'react';
import {
  Navbar, Nav, NavDropdown, Row, Col, Container, Image,
} from 'react-bootstrap';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './css/navbar.css';

const NavigationBar = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState(null); // Estado para el usuario autenticado
  const [isDaytime, setIsDaytime] = useState(true); // Control de día/noche
  const [expanded, setExpanded] = useState(false); // Control del colapso del menú
  const navigate = useNavigate();

  // Función para obtener los datos del usuario autenticado desde Firebase

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('Usuario autenticado:', currentUser); // Verifica los datos del usuario

        try {
          const userDocRef = doc(db, 'usuarios', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), photoURL: currentUser.photoURL });
          } else {
            setUser({ email: currentUser.email, photoURL: currentUser.photoURL });
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        }
      } else {
        setUser(null); // Limpia el estado si no hay usuario autenticado
      }
    });

    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, []);


  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        navigate('/'); // Redirige a la pantalla de bienvenida
      })
      .catch((error) => console.error('Error cerrando sesión:', error));
  };

  return (
    <>
      <Row style={{ paddingTop: '80px' }}>
        <Navbar
          expand="lg"
          fixed="top"
          expanded={expanded}
          style={{
            backgroundColor: isDaytime ? 'white' : 'black',
            color: isDaytime ? 'black' : 'white',
          }}
        >
          <Container className="bg-dark">
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={() => setExpanded(!expanded)}
            />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link
                  as={Link}
                  to="/"
                  style={{ color: 'white' }}
                  onClick={() => setExpanded(false)}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  style={{ color: 'white' }}
                  onClick={() => setExpanded(false)}
                >
                  Nosotros
                </Nav.Link>
                <Nav.Link
                  style={{ color: 'white' }}
                  onClick={() => setExpanded(false)}
                >
                  Política de Privacidad
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/faq"
                  style={{ color: 'white' }}
                  onClick={() => setExpanded(false)}
                >
                  Preguntas frecuentes
                </Nav.Link>
              </Nav>

              <Nav className="ms-auto align-items-center">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    roundedCircle
                    width={40}
                    height={40}
                    alt="Foto de perfil"
                    className="me-2"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/40'} // Imagen de respaldo si falla
                  />
                ) : (
                  <Image
                    src="https://via.placeholder.com/40"
                    roundedCircle
                    width={40}
                    height={40}
                    alt="Sin foto"
                    className="me-2"
                  />
                )}
                <NavDropdown className="text-secondary" id="user-dropdown">

                  {user ? (
                    <>
                      <Row>
                        <Col>
                          <NavDropdown.Item disabled>
                            <strong>Nombre:</strong> {user.nombre || 'Usuario sin nombre'}
                          </NavDropdown.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <NavDropdown.Item disabled>
                            <strong>Correo:</strong> {user.email || 'Correo no disponible'}
                          </NavDropdown.Item>
                        </Col>
                      </Row>
                      <NavDropdown.Divider />
                      <Row>
                        <Col>
                          <NavDropdown.Item onClick={handleLogout}>
                            Cerrar Sesión
                          </NavDropdown.Item>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <NavDropdown.Item disabled>
                        No hay usuario autenticado
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <Row>
                        <Col>
                          <NavDropdown.Item onClick={handleLogout}>
                            Cerrar Sesión
                          </NavDropdown.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>
    </>
  );
};

export default NavigationBar;