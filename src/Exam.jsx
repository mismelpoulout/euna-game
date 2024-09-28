import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal } from 'react-bootstrap';
import './components/ztyle.css';


const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // Tiempo en segundos
  const [examStarted, setExamStarted] = useState(false);
  const [selectedTime, setSelectedTime] = useState(30 * 60); // Tiempo seleccionado (por defecto 30 minutos)
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [showFeedback, setShowFeedback] = useState(false); // Estado para mostrar el feedback

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        const data = await response.json();

        const validQuestions = data.filter((question) => question.options && question.options.length > 0);
        const shuffledQuestions = validQuestions.sort(() => Math.random() - 0.5);
        const shuffledOptionsQuestions = shuffledQuestions.map((question) => ({
          ...question,
          options: question.options.sort(() => Math.random() - 0.5),
        }));

        setQuestions(shuffledOptionsQuestions);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setFinished(true);
            setShowModal(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining]);

  const handleAnswerChange = (questionIndex, option) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex + 5 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 5);
    } else {
      setFinished(true);
      setShowModal(true);
    }
  };

  const calculateResult = () => {
    // Filtrar solo las preguntas respondidas
    const answeredQuestions = Object.keys(userAnswers);
    let correctCount = 0;

    answeredQuestions.forEach((index) => {
      if (userAnswers[index] === questions[index].answer) {
        correctCount += 1;
      }
    });

    // Calcular el porcentaje solo sobre las respondidas
    return answeredQuestions.length > 0 ? (correctCount / answeredQuestions.length) * 100 : 0;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartExam = () => {
    setTimeRemaining(selectedTime); // Establecer el tiempo restante según la selección del usuario
    setExamStarted(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowFeedback(true); // Mostrar el feedback después de cerrar el modal
  };

  const totalCorrect = Object.keys(userAnswers).filter(
    (index) => userAnswers[index] === questions[index].answer
  ).length;

  const totalIncorrect = Object.keys(userAnswers).length - totalCorrect;

  if (!examStarted) {
    return (
      <Container className="text-center mt-5">
        <h2>Examen</h2>
        <Form>
          <Form.Group controlId="formTimeSelect">
            <Form.Label>Selecciona el tiempo del examen:</Form.Label>
            <Form.Control
              as="select"
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
            >
              <option value={10 * 60}>10 minutos</option>
              <option value={20 * 60}>20 minutos</option>
              <option value={30 * 60}>30 minutos</option>
              <option value={60 * 60}>60 minutos</option>
              <option value={90 * 60}>90 minutos</option>
              <option value={180 * 60}>180 minutos</option>
            </Form.Control>
          </Form.Group>
          <br />
          <Button variant="primary" onClick={handleStartExam}>
            Comenzar Examen
          </Button>
        </Form>
      </Container>
    );
  }

  if (questions.length === 0) {
    return <p>Cargando preguntas...</p>;
  }

  return (
    <Container className="mt-5">
    <Row className="announcement-bar">
      <div className="announcement-text">
          <h6>La opcion de 180 min tiene una pausa de 30 min como en el examen real.</h6>
      </div>
    </Row>
    <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h2>Examen en progreso</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>Tiempo restante: {formatTime(timeRemaining)}</p>
        </Col>
      </Row>
      <Row>
        {questions.slice(currentQuestionIndex, currentQuestionIndex + 5).map((question, index) => (
          <Col md={{ span: 8, offset: 2 }} key={index}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{question.question}</Card.Title>
                {question.image && (
                  <Card.Img
                    variant="top"
                    src={question.image}
                    alt="Imagen de la pregunta"
                  />
                )}
                <Form>
                  {question.options.map((option, idx) => (
                    <Form.Check
                      type="radio"
                      name={`question-${currentQuestionIndex + index}`}
                      id={`question-${currentQuestionIndex + index}-option-${idx}`}
                      label={option}
                      value={option}
                      checked={userAnswers[currentQuestionIndex + index] === option}
                      onChange={() => handleAnswerChange(currentQuestionIndex + index, option)}
                      key={idx}
                    />
                  ))}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-3">
        <Col md={{ span: 8, offset: 2 }}>
          <Button variant="primary" onClick={handleNext} className="w-100">
            Siguiente
          </Button>
        </Col>
      </Row>

      {/* Modal para mostrar los resultados generales */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
          <h2>Examen finalizado</h2>
          <p>Total de preguntas: {questions.length}</p>
          <p>Preguntas respondidas: {Object.keys(userAnswers).length}</p>
          <p>Preguntas correctas: {totalCorrect}</p>
          <p>Preguntas incorrectas: {totalIncorrect}</p>
          <p>Porcentaje de aciertos: {calculateResult().toFixed(2)}%</p>
          {calculateResult() >= 51 ? (
            <h3 style={{ color: 'green', fontSize: '2rem' }}>¡Felicidades! Aprobaste.</h3>
          ) : (
            <div>
              <h3 style={{ color: 'red', fontSize: '2rem' }}>😢</h3>
              <h4>La próxima vez será, persevere que en la perseverancia está la fórmula del éxito.</h4>
            </div>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Body>
      </Modal>

      {/* Mostrar feedback con fondo gris después del modal */}
      {showFeedback && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#d3d3d3', // Fondo gris
          color: 'black',
          overflowY: 'auto',
          padding: '20px'
        }}>
          <Container>
          <br/>
          <br/>
          <br/>

            <h4 className="text-center">Feedback de cada pregunta</h4>
            <ul className="text-left">
              {questions.map((question, index) => (
                <li key={index} style={{ marginBottom: '1rem', padding: '10px', borderBottom: '1px solid #ccc' }}>
                  <strong>Pregunta:</strong> {question.question} <br />
                  <strong>Tu respuesta:</strong> {userAnswers[index] || 'No respondida'} <br />
                  <strong>Respuesta correcta:</strong> {question.answer} <br />
                  {userAnswers[index] === question.answer ? (
                    <span style={{ color: 'green' }}>¡Correcto!</span>
                  ) : (
                    <span style={{ color: 'red' }}>Incorrecto. {question.explanation || 'Revisa el concepto para más detalles.'}</span>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </div>
      )}
    </Container>
  );
};

export default Exam;