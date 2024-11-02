import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase/firebaseConfig';
import './App.css';

// Función para guardar una evaluación en localStorage y Firestore
const saveEvaluation = async (correctas, incorrectas, tipoEvaluacion) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error('No hay usuario autenticado');
    return;
  }

  const newEvaluation = {
    correctas,
    incorrectas,
    tipoEvaluacion,
    fecha: new Date(),
    userId: user.uid,
  };

  // Guardar en localStorage
  const currentEvaluations = JSON.parse(localStorage.getItem('userEvaluations')) || [];
  currentEvaluations.push(newEvaluation);
  localStorage.setItem('userEvaluations', JSON.stringify(currentEvaluations));
  console.log('Evaluación guardada en localStorage');

  // Guardar en Firestore
  try {
    await addDoc(collection(db, 'userEvaluations'), newEvaluation);
    console.log('Evaluación guardada en Firestore');
  } catch (error) {
    console.error('Error al guardar la evaluación en Firestore:', error);
  }
};

// Componente principal para manejar el historial de evaluaciones
const History = () => {
  const [evaluations, setEvaluations] = useState([]);

  // Función para obtener el historial de evaluaciones desde Firestore y localStorage
  useEffect(() => {
    const fetchEvaluations = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const evaluationsRef = collection(db, 'userEvaluations');
        const q = query(evaluationsRef, where('userId', '==', user.uid));
        try {
          const querySnapshot = await getDocs(q);
          const firestoreEvaluations = querySnapshot.docs.map((doc) => doc.data());

          const localStorageEvaluations = JSON.parse(localStorage.getItem('userEvaluations')) || [];

          const filteredLocalStorageEvaluations = localStorageEvaluations.filter(
            (evaluation) => evaluation.userId === user.uid
          );

          setEvaluations([...firestoreEvaluations, ...filteredLocalStorageEvaluations]);
        } catch (error) {
          console.error('Error obteniendo evaluaciones de Firestore:', error);
        }
      }
    };

    fetchEvaluations();
  }, []);

  // Función para compartir el historial en WhatsApp
  const shareOnWhatsApp = () => {
    let message = 'Historial de Evaluaciones:\n';
    evaluations.forEach((evaluation, index) => {
      message += `Evaluación ${index + 1} (${evaluation.tipoEvaluacion}):\n`;
      message += `Correctas: ${evaluation.correctas}, Incorrectas: ${evaluation.incorrectas}\n`;
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Función para filtrar las evaluaciones por tipo
  const filterByType = (type) => {
    return evaluations.filter((evaluation) => evaluation.tipoEvaluacion === type);
  };

  return (
    <Container className="mt-5">
      <Row className="text-center mb-4">
        <Col>
          <h1>Historial de Evaluaciones</h1>
        </Col>
      </Row>

      {evaluations.length === 0 ? (
        <Row className="text-center">
          <Col>
            <p>No hay evaluaciones registradas.</p>
          </Col>
        </Row>
      ) : (
        <Row className="g-3">
          <Col xs={12}>
            <h2>Exámenes</h2>
            {filterByType('examen').length === 0 ? (
              <p>No hay exámenes registrados.</p>
            ) : (
              filterByType('examen').map((evaluation, index) => (
                <Card className="mb-3 shadow-sm" key={index}>
                  <Card.Body>
                    <Card.Title>Examen {index + 1}</Card.Title>
                    <Card.Text>
                      <strong>Correctas:</strong> {evaluation.correctas} <br />
                      <strong>Incorrectas:</strong> {evaluation.incorrectas}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>

          <Col xs={12}>
            <h2>Trivias</h2>
            {filterByType('trivia').length === 0 ? (
              <p>No hay trivias registradas.</p>
            ) : (
              filterByType('trivia').map((evaluation, index) => (
                <Card className="mb-3 shadow-sm" key={index}>
                  <Card.Body>
                    <Card.Title>Trivia {index + 1}</Card.Title>
                    <Card.Text>
                      <strong>Correctas:</strong> {evaluation.correctas} <br />
                      <strong>Incorrectas:</strong> {evaluation.incorrectas}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>

          <Col xs={12}>
            <h2>Evaluaciones por Especialidad</h2>
            {['Pediatría', 'Cirugía', 'Oftalmología', 'Salud Pública', 'Otorrinolaringología', 'Psiquiatría', 'Ginecología y Obstetricia', 'Medicina Interna'].map((especialidad) => (
              <div key={especialidad}>
                <h3>{especialidad}</h3>
                {filterByType(especialidad).length === 0 ? (
                  <p>No hay evaluaciones registradas para {especialidad}.</p>
                ) : (
                  filterByType(especialidad).map((evaluation, index) => (
                    <Card className="mb-3 shadow-sm" key={index}>
                      <Card.Body>
                        <Card.Title>{especialidad} - Evaluación {index + 1}</Card.Title>
                        <Card.Text>
                          <strong>Correctas:</strong> {evaluation.correctas} <br />
                          <strong>Incorrectas:</strong> {evaluation.incorrectas}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            ))}
          </Col>
        </Row>
      )}

      {/* Botón para compartir en WhatsApp */}
      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="success" onClick={shareOnWhatsApp} className="shadow-sm">
            Compartir en WhatsApp
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default History;