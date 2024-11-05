import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase/firebaseConfig';
import TiraInformativa from './components/TiraInformativa';
import AdComponent from './components/AdComponent';
import './Home.css'; // Importa el CSS para el fondo interactivo

const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleStartSimulation = () => navigate('/simulacion180');
  const handleStartTrivia = () => navigate('/trivia');
  const handleStartExamen = () => navigate('/examen');
  const handleViewHistorial = () => navigate('/history');
  const handleStartExamenEspecialidad = () => navigate('/examen-especialidad');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      try {
        const user = auth.currentUser;
        const avatar = user.photoURL || 'https://via.placeholder.com/150';
        const userName = user.displayName || 'Usuario Anónimo';

        await addDoc(collection(db, 'comments'), {
          text: newComment,
          avatar: avatar,
          userName: userName,
          timestamp: new Date(),
        });
        setNewComment('');
      } catch (error) {
        console.error('Error al guardar el comentario: ', error);
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => doc.data());
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, []);

  return (

    <div className="interactive-background text-center">
      <h1 className="display-4 fw-bold text-black" style={{ paddingTop: '100px' }}>MEDSTUDIO +</h1>

      <Container fluid className="p-5 text-center">
        {/* Banner de Cabecera */}
        <div
          style={{
            backgroundImage: `url(${require('./assets/banner.png')})`, // Cambia la ruta a tu imagen de banner
            height: '300px', // Ajusta la altura según sea necesario
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '20px'
          }}
        >
        </div>
        <p className="lead bg-secondary text-black">Prepárate para el EUNACOM con nuestras simulaciones y exámenes</p>


        <TiraInformativa />

        {/* Tarjetas */}
        <Row className="my-4 justify-content-center">
          {[
            {
              title: 'Simulación tipo EUNACOM de 180 preguntas',
              image: require('./assets/simulacion.png'),
              onClick: handleStartSimulation,
              text: 'Practica con preguntas aleatorias en formato tipo examen real con descanso de 30 min .'
            },
            {
              title: 'Simulación tipo TRIVIA',
              image: require('./assets/trivia.png'),
              onClick: handleStartTrivia,
              text: 'Practica con preguntas aleatorias en formato de trivia.'
            },
            {
              title: 'Simulación Exámenes cortos',
              image: require('./assets/examen180.png'),
              onClick: handleStartExamen,
              text: 'Evaluaciones cortas: tu determinas cuanto quieres que dure la evaluacion.'
            },
            {
              title: 'Examen por Especialidad',
              image: require('./assets/specialty_exams.png'),
              onClick: handleStartExamenEspecialidad,
              text: 'Evaluaciones por especialidades: Pediatría, Medicina , Ginecolog.....'
            },
            {
              title: 'Historial',
              image: require('./assets/history.png'),
              onClick: handleViewHistorial,
              text: 'Revisa tu progreso y resultados de simulaciones previas.'
            },
          ].map((card, index) => (
            <Col key={index} xs={12} md={6} lg={3} className="mb-4"> {/* Cambiado lg={4} a lg={3} para 4 cards por fila */}
              <Card
                className="shadow-lg rounded-3 same-height card-bg"
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white'
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="fs-4 text-center text-black"></Card.Title>
                  <Button variant="light" className="mt-3" onClick={card.onClick}>
                    {card.title.includes('Historial') ? 'Historial' : ''}
                    {card.title.includes('Simulación Exámenes cortos') ? ' Exámenes cortos' : ''}
                    {card.title.includes('Simulación tipo EUNACOM de 180 preguntas') ? 'Simulacion' : ''}
                    {card.title.includes('Simulación tipo TRIVIA') ? 'Trivia' : ''}
                    {card.title.includes('Examen por Especialidad') ? 'X Especialidades' : ''}


                  </Button>
                </Card.Body>
                <Card.Text className="text-center bg-info ">{card.text}</Card.Text>

              </Card>
            </Col>
          ))}
        </Row>

        {/* Sección de Comentarios */}
        {isAuthenticated && (
          <div className="my-5 text-black">
            <h3>Deja tu comentario</h3>
            <Form onSubmit={handleCommentSubmit}>
              <Form.Group controlId="formComment" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">Enviar comentario</Button>
            </Form>

            <AdComponent/>
            <div className="mt-5 text-black text-center">
              <h3>Comentarios</h3>
              {comments.length > 0 ? (
                <div className="container">
                  {comments.map((comment, index) => (
                    <div
                      key={index}
                      className="row align-items-center mb-3 p-2 border-bottom"
                    >
                      <div className="col-auto">
                        <img
                          src={comment.avatar}
                          alt="Avatar"
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="col text-start">
                        <p className="mb-0 fw-bold">{comment.userName}</p>
                        <p className="mb-0">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No hay comentarios disponibles.</p>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>

  );
};

export default Home;