import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal } from 'react-bootstrap';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase/firebaseConfig';

// Función IRT para calcular la probabilidad de respuesta correcta
const calculateIRTProbability = (discrimination, difficulty, guessing, userAbility = 1) => {
  const exponent = discrimination * (userAbility - difficulty);
  return guessing + (1 - guessing) * (1 / (1 + Math.exp(-exponent)));
};

// Función para guardar el resultado
const saveTriviaResult = async (correctas, incorrectas, totalPreguntas, tipoEvaluacion) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const newEvaluation = {
    correctas,
    incorrectas,
    totalPreguntas,
    tipoEvaluacion,
    fecha: new Date(),
    userId: user ? user.uid : 'anónimo',
  };

  if (user) {
    try {
      await addDoc(collection(db, 'history'), newEvaluation);
      console.log('Evaluación guardada en Firestore');
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
    }
  }

  const storedEvaluations = JSON.parse(localStorage.getItem('historyEvaluations')) || [];
  storedEvaluations.push(newEvaluation);
  localStorage.setItem('historyEvaluations', JSON.stringify(storedEvaluations));
  console.log('Evaluación guardada en localStorage');
};

const Trivia = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [triviaStarted, setTriviaStarted] = useState(false);
  const [selectedTime, setSelectedTime] = useState(10 * 60);
  const [showModal, setShowModal] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('./questions_IRT.json');
        const data = await response.json();
        const shuffledQuestions = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error('Error al cargar las preguntas:', error);
      }
    };
    loadQuestions();
  }, []);

  useEffect(() => {
    if (triviaStarted && timeRemaining > 0) {
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
  }, [triviaStarted, timeRemaining]);

  const handleAnswerClick = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const { answer, difficulty, discrimination, guessing } = currentQuestion;

    const probability = calculateIRTProbability(discrimination, difficulty, guessing);
    const isCorrect = option === answer && Math.random() <= probability;

    setScore((prev) => prev + (isCorrect ? 1 : 0));
    setIncorrectAnswers((prev) => prev + (isCorrect ? 0 : 1));

    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentQuestion.question,
        correctAnswer: answer,
        userAnswer: option,
        isCorrect,
        feedback: currentQuestion.feedback,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      setShowModal(true);
    }
  };

  const handleStartTrivia = () => {
    setTimeRemaining(selectedTime);
    setTriviaStarted(true);
  };

  const calculatePercentage = () => (score / questions.length) * 100;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (finished) {
      saveTriviaResult(score, incorrectAnswers, questions.length, 'trivia');
    }
  }, [finished]);

  return (
    <Container className="mt-5">
      {!triviaStarted ? (
        <div className="text-center">
          <Form>
            <Form.Group controlId="formTimeSelect">
              <Form.Label className='bg-primary'>Selecciona la duración:</Form.Label>
              <Form.Control
                as="select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(Number(e.target.value))}
              >
                <option value={20 * 60}>20 minutos</option>
                <option value={50 * 60}>50 minutos</option>
                <option value={70 * 60}>70 minutos</option>
                <option value={90 * 60}>90 minutos</option>

              </Form.Control>
            </Form.Group>
            <br/>
            <Button variant="primary" onClick={handleStartTrivia}>
              Comenzar Trivia
            </Button>
          </Form>

        </div>
      ) : finished ? (
        <Container className="mt-5">
          <h2>Resultados</h2>
          <p>Preguntas correctas: {score}</p>
          <p>Preguntas incorrectas: {incorrectAnswers}</p>
          <p>Porcentaje de aciertos: {calculatePercentage().toFixed(2)}%</p>
          <h4>
            {calculatePercentage() >= 51
              ? '¡Felicidades, has aprobado!'
              : '¡Ánimo, sigue estudiando!'}
          </h4>
          <h3>Feedback</h3>
          <ul>
            {userAnswers.map((answer, index) => (
              <li key={index}>
                <strong>Pregunta:</strong> {answer.question} <br />
                <strong>Tu respuesta:</strong> {answer.userAnswer} <br />
                <strong>Respuesta correcta:</strong> {answer.correctAnswer} <br />
                <strong>Feedback:</strong> {answer.feedback} <br />
              </li>
            ))}
          </ul>
        </Container>
      ) : (
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <Card>
              <Card.Body>
                <Card.Title>{questions[currentQuestionIndex]?.question}</Card.Title>
                <Row className="mb-3">
                  {questions[currentQuestionIndex]?.options.map((option, idx) => (
                    <Col xs={12} key={idx} className="mb-2">
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
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body className="text-center">
          <h2>Examen finalizado</h2>
          <p>Correctas: {score}</p>
          <p>Incorrectas: {incorrectAnswers}</p>
          <p>Porcentaje: {calculatePercentage().toFixed(2)}%</p>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Trivia;