// Trivia.jsx
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal } from 'react-bootstrap';

const Trivia = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0); // Tiempo en segundos
  const [finished, setFinished] = useState(false);
  const [triviaStarted, setTriviaStarted] = useState(false);
  const [selectedTime, setSelectedTime] = useState(10 * 60); // Tiempo seleccionado por defecto (10 minutos)
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

  useEffect(() => {
    // Cargar y aleatorizar preguntas y opciones
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        const data = await response.json();

        // Filtrar solo las preguntas válidas que tienen opciones definidas
        const validQuestions = data.filter(
          (question) => Array.isArray(question.options) && question.options.length > 0
        );

        // Aleatorizar preguntas y sus opciones
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
    if (triviaStarted && timeRemaining > 0) {
      // Temporizador
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setFinished(true);
            setShowModal(true); // Mostrar el modal al finalizar
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [triviaStarted, timeRemaining]);

  const handleAnswerClick = (option) => {
    const isCorrect = option === questions[currentQuestionIndex]?.answer;
    setScore(score + (isCorrect ? 1 : 0));
    setIncorrectAnswers(incorrectAnswers + (isCorrect ? 0 : 1));

    setUserAnswers([
      ...userAnswers,
      {
        question: questions[currentQuestionIndex]?.question,
        correctAnswer: questions[currentQuestionIndex]?.answer,
        userAnswer: option,
        isCorrect,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setFinished(true);
      setShowModal(true); // Mostrar el modal al finalizar
    }
  };

  const handleStartTrivia = () => {
    setTimeRemaining(selectedTime);
    setTriviaStarted(true);
  };

  const calculatePercentage = () => {
    return (score / (score + incorrectAnswers)) * 100;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFinished(true); // Permite mostrar el feedback al cerrar el modal
  };

  return (
    <Container className="mt-5">
      {!triviaStarted ? (
        <div className="text-center">
          <h2>Configura tu Trivia</h2>
          <Form>
            <Form.Group controlId="formTimeSelect">
              <Form.Label>Selecciona la duración de la trivia:</Form.Label>
              <Form.Control
                as="select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(Number(e.target.value))}
              >
                <option value={10 * 60}>10 minutos</option>
                <option value={20 * 60}>20 minutos</option>
                <option value={30 * 60}>30 minutos</option>
                <option value={70 * 60}>70 minutos</option>
                <option value={90 * 60}>90 minutos</option>
              </Form.Control>
            </Form.Group>
            <br />
            <Button variant="primary" onClick={handleStartTrivia}>
              Comenzar Trivia
            </Button>
          </Form>
        </div>
      ) : finished ? (
        // Mostrar feedback de cada pregunta
        <Container className="text-center mt-5">
          <h2>Feedback de la Trivia</h2>
          <p>Preguntas correctas: {score}</p>
          <p>Preguntas incorrectas: {incorrectAnswers}</p>
          <hr />
          <h4>Detalles de cada pregunta</h4>
          <ul className="text-left">
            {userAnswers.map((answer, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                <strong>Pregunta:</strong> {answer.question} <br />
                <strong>Tu respuesta:</strong> {answer.userAnswer} <br />
                <strong>Respuesta correcta:</strong> {answer.correctAnswer} <br />
                {answer.isCorrect ? (
                  <span style={{ color: 'green' }}>¡Correcto!</span>
                ) : (
                  <span style={{ color: 'red' }}>Incorrecto</span>
                )}
              </li>
            ))}
          </ul>
        </Container>
      ) : (
        <>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title>{questions[currentQuestionIndex]?.question}</Card.Title>
                  {questions[currentQuestionIndex]?.image && (
                    <Card.Img
                      variant="top"
                      src={questions[currentQuestionIndex].image}
                      alt="Imagen de la pregunta"
                    />
                  )}
                  <Row className="mb-3">
                    {questions[currentQuestionIndex]?.options.map((option, index) => (
                      <Col xs={12} key={index} className="mb-2">
                        <Button
                          variant="primary"
                          onClick={() => handleAnswerClick(option)}
                          className="w-100"
                        >
                          {option}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                  <p>Tiempo restante: {formatTime(timeRemaining)}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Modal para mostrar los resultados */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body style={{ backgroundColor: 'white', color: 'black', textAlign: 'center' }}>
          <h2>Examen finalizado</h2>
          <p>Preguntas correctas: {score}</p>
          <p>Preguntas incorrectas: {incorrectAnswers}</p>
          {calculatePercentage() > 51 ? (
            <h3 style={{ color: 'green', fontSize: '2rem' }}>¡Felicidades!</h3>
          ) : (
            <h3 style={{ color: 'red', fontSize: '2rem' }}>¡Ánimo! Sigue estudiando.</h3>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Trivia;