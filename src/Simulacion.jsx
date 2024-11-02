import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Image, Modal } from 'react-bootstrap';
import Timer from './components/Timer';
import AdComponent from './components/AdComponent';


const Simulacion180 = () => {
  const [questions, setQuestions] = useState([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimer, setBreakTimer] = useState(30 * 60); // 30 minutos en segundos
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false); // Mostrar prompt de revisión
  const [summary, setSummary] = useState({});

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);
  

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
        const data = await response.json();
  
        // Seleccionar 180 preguntas aleatorias
        const selectedQuestions = shuffle(data).slice(0, 180);
  
        // Aleatorizar opciones de cada pregunta
        const shuffledQuestions = selectedQuestions.map((q) => ({
          ...q,
          options: shuffle(q.options),
        }));
  
        setQuestions(shuffledQuestions); // Guardar las preguntas seleccionadas
        setQuestionsLoaded(true);
      } catch (error) {
        console.error('Error al cargar las preguntas:', error);
      }
    };
  
    loadQuestions();
  }, []);
    const getCurrentBlockQuestions = () => {
    const start = currentBlockIndex * 90;
    const end = start + 90;
    return questions.slice(start, end);
  };

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: option });
  };

  const handleNextBlock = () => setShowReviewPrompt(true); // Mostrar prompt de revisión al terminar el primer bloque

  const handleReviewDecision = (review) => {
    setShowReviewPrompt(false);
    if (review) return; // Permitir revisión si elige revisar
    handleBreakStart(); // Iniciar descanso si decide no revisar
  };

  const handleBreakStart = () => {
    setIsOnBreak(true); 
    const interval = setInterval(() => {
      setBreakTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(interval);
          setIsOnBreak(false);
          setCurrentBlockIndex(1); // Iniciar el segundo bloque automáticamente
          window.scrollTo(0, 0); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const calculateSummary = () => {
    const totalQuestions = questions.length; // Siempre será 180
    const totalCorrect = questions.filter(
      (q, index) => selectedAnswers[index] === q.answer
    ).length;
    const totalIncorrect = totalQuestions - totalCorrect;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  
    setSummary({
      totalQuestions,
      totalCorrect,
      totalIncorrect,
      percentage,
      passed: percentage >= 51,
    });
  };

  const generateFeedback = () => {
    const feedbackArray = questions.map((question, index) => ({
      question: question.question,
      correctAnswer: question.answer,
      userAnswer: selectedAnswers[index] || 'No respondida',
      feedback: selectedAnswers[index] === question.answer
        ? '¡Correcto!'
        : `Incorrecto. ${question.feedback || ''}`,
    }));
    setFeedback(feedbackArray);
  };

  const finishExam = () => {
    generateFeedback();
    calculateSummary();
    setExamFinished(true);
    setShowSummaryModal(true); // Mostrar modal con resumen
  };

  const handleRestart = () => window.location.reload();
  const handleGoHome = () => (window.location.href = '/');

  const isLastQuestionOfBlock = (index) => {
    const totalQuestionsInBlock = 90;
    const isFirstBlock = currentBlockIndex === 0;
    const isSecondBlock = currentBlockIndex === 1;
  
    return (
      (isFirstBlock && index === totalQuestionsInBlock - 1) ||
      (isSecondBlock && index === totalQuestionsInBlock - 1)
    );
  };

  return (
    <Container className="p-4">
      <h3 className="text-center">Simulación de 180 Preguntas tipo <strong>EUNACOM</strong></h3>

      <Timer initialMinutes={180} onFinish={finishExam} />

      {questions.length === 0 || !questionsLoaded ? (
        <p className="text-center">Cargando preguntas...</p>
      ) : examFinished ? (
        <div>
          <h4>Feedback del Examen</h4>
          {feedback.map((item, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>Pregunta {index + 1}</Card.Title>
                <p><strong>Pregunta:</strong> {item.question}</p>
                <p><strong>Tu Respuesta:</strong> {item.userAnswer}</p>
                <p><strong>Respuesta Correcta:</strong> {item.correctAnswer}</p>
                <p>{item.feedback}</p>
              </Card.Body>
            </Card>
          ))}
          <div className="text-center">
            <Button variant="primary" onClick={handleRestart} className="me-2">Reiniciar</Button>
            <Button variant="secondary" onClick={handleGoHome}>Ir a Home</Button>
          </div>
        </div>
      ) : (
        <>
        <Row>
  {getCurrentBlockQuestions().map((question, index) => (
    <Col key={index} md={12}>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{`${index + 1 + currentBlockIndex * 90}. ${question.question}`}</Card.Title>
          <Form>
            {question.options.map((option, i) => (
              <Form.Check
                key={i}
                type="radio"
                label={option}
                name={`question-${index + currentBlockIndex * 90}`}
                checked={selectedAnswers[index + currentBlockIndex * 90] === option}
                onChange={() => handleAnswerSelect(index + currentBlockIndex * 90, option)}
              />
            ))}
          </Form>
        </Card.Body>
      </Card>
    </Col>
  ))}

  

  {/* Mostrar botón al final del segundo bloque */}
  {questionsLoaded &&
    currentBlockIndex === 1 &&
    getCurrentBlockQuestions().length === 90 && (
      <div className="text-center mt-4">
        <Button variant="danger" onClick={finishExam}>
          Finalizar Examen
        </Button>
      </div>
    )}
</Row>

          {currentBlockIndex === 0 && (
            <div className="text-center mt-4">
              <Button variant="primary" onClick={handleNextBlock}>Terminar Primer Bloque</Button>
            </div>
          )}

          <Modal show={showReviewPrompt} centered>
            <Modal.Header>
              <Modal.Title>¿Quieres revisar tus respuestas?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <p>Has terminado el primer bloque. ¿Deseas revisar tus respuestas o pasar al descanso?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => handleReviewDecision(true)}>Revisar</Button>
              <Button variant="secondary" onClick={() => handleReviewDecision(false)}>Descanso</Button>
            </Modal.Footer>
          </Modal>

          {isOnBreak && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Modal show centered>
                <Modal.Header>
                  <Modal.Title>Descanso de 30 minutos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                  <h3>Tómate un café y organiza tus ideas</h3>
                  <h2 style={{ fontSize: '4rem' }}>
                    {`${Math.floor(breakTimer / 60)}:${(breakTimer % 60).toString().padStart(2, '0')}`}
                  </h2>
                </Modal.Body>
              </Modal>

              <AdComponent />

            </div>
          )}
          
        </>
      )}
      <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>
      {summary.passed ? '¡Felicidades! 🎉' : 'Ánimo, sigue intentándolo 😔'}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Total de preguntas: {summary.totalQuestions}</p>
    <p>Correctas: {summary.totalCorrect}</p>
    <p>Incorrectas: {summary.totalIncorrect}</p>
    <p>Porcentaje: {summary.percentage}%</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
      Ver Feedback
    </Button>
  </Modal.Footer>
</Modal>
    </Container>
  );
};

export default Simulacion180;