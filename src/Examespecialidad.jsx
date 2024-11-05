import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebaseConfig'; // Importa tu configuración de Firebase
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Para obtener usuario autenticado
import './style.css'; // Archivo CSS con los nuevos estilos

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const ExamenPorEspecialidad = () => {
  const [speciality, setSpecialty] = useState('');
  const [time, setTime] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [examFinished, setExamFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [passStatus, setPassStatus] = useState(null); // Guardar si el usuario aprobó o reprobó

  // Cargar preguntas desde el archivo JSON cuando se selecciona la especialidad
  useEffect(() => {
    if (speciality) {
      fetch('/speciality.json')
        .then((response) => response.json())
        .then((data) => {
          if (data[speciality] && data[speciality].length > 0) {
            const shuffledQuestions = shuffleArray(data[speciality]); // Mezclar preguntas
            const shuffledQuestionsWithShuffledOptions = shuffledQuestions.map((question) => ({
              ...question,
              options: shuffleArray([...question.options]), // Mezclar opciones
            }));
            setQuestions(shuffledQuestionsWithShuffledOptions);
          } else {
            console.error('No hay preguntas disponibles para esta especialidad');
          }
        })
        .catch((error) => {
          console.error('Error al cargar las preguntas:', error);
        });
    }
  }, [speciality]);

  // Iniciar el examen y configurar el cronómetro
  const handleStartExam = () => {
    if (speciality && time && phoneNumber) {
      setIsReady(true);
      setTimeRemaining(parseInt(time) * 60); // Convertir el tiempo en minutos a segundos
    } else {
      alert('Selecciona la especialidad, el tiempo y escribe tu número de celular.');
    }
  };

  // Manejar el cronómetro
  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && isReady) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      calculateResult(); // Finalizar si el tiempo llega a 0
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, isReady]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Manejar la selección de respuestas
  const handleAnswerSelection = (questionIndex, option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = option;
    setSelectedAnswers(updatedAnswers);

    // Verificar si todas las preguntas han sido respondidas
    if (updatedAnswers.filter(answer => answer !== undefined).length === questions.length) {
      calculateResult(); // Finalizar si todas las preguntas han sido respondidas
    }
  };

  // Calcular el resultado y generar feedback
  const calculateResult = () => {
    let correctCount = 0;
    const feedbackData = questions.map((question, index) => {
      const isCorrect = selectedAnswers[index] === question.answer;
      if (isCorrect) {
        correctCount++;
      }
      return {
        question: question.question,
        selectedAnswer: selectedAnswers[index],
        correctAnswer: question.answer,
        isCorrect,
        feedback: question.feedback
      };
    });

    setCorrectAnswersCount(correctCount);
    setFeedback(feedbackData);

    const correctPercentage = ((correctCount / questions.length) * 100).toFixed(2);

    // Determinar si el usuario aprobó o reprobó
    if (correctPercentage >= 51) {
      setPassStatus('Aprobado');
    } else {
      setPassStatus('Reprobado');
    }

    setExamFinished(true);

    // Guardar los resultados en Firestore y localStorage
    saveEvaluationToFirestore(correctCount, questions.length - correctCount, speciality, correctPercentage, passStatus);
  };

  // Guardar los resultados en Firestore
  const saveEvaluationToFirestore = async (correctas, incorrectas, tipoEvaluacion, correctPercentage, passStatus) => {
    const auth = getAuth();
    const user = auth.currentUser; // Obtener el usuario autenticado

    const newEvaluation = {
      correctas,
      incorrectas,
      tipoEvaluacion, // Especialidad
      fecha: new Date(),
      userId: user ? user.uid : 'anónimo',
      correctPercentage,
      passStatus,
    };

    if (user) {
      try {
        await addDoc(collection(db, 'userEvaluations'), newEvaluation);
        console.log('Evaluación guardada en Firestore');
      } catch (error) {
        console.error('Error al guardar en Firestore:', error);
      }
    }

    const storedEvaluations = JSON.parse(localStorage.getItem('historyEvaluations')) || [];
    storedEvaluations.push(newEvaluation);
    localStorage.setItem('historyEvaluations', JSON.stringify(storedEvaluations));
  };

  const handleNextBlock = () => {
    if (currentBlockIndex + 10 < questions.length) {
      setCurrentBlockIndex(currentBlockIndex + 10);
      window.scrollTo(0, 0); // Desplazar hacia el top
    } else {
      calculateResult(); // Finalizar si todas las preguntas han sido respondidas
    }
  };

  const getCurrentBlockQuestions = () => {
    return questions.slice(currentBlockIndex, currentBlockIndex + 10);
  };

  if (examFinished) {
    return (
      <div className="exam-container">
        <div className="exam-box">
          <h1>¡Examen finalizado!</h1>
          <p>Respuestas correctas: <b style={{ color: 'green' }}>{correctAnswersCount} de {questions.length}</b></p>
          <h3 style={{ color: passStatus === 'Aprobado' ? 'green' : 'red' }}>{passStatus}</h3>
          {/* Mostrar feedback detallado */}
          <ul className="feedback-list">
            {feedback.map((item, index) => (
              <React.Fragment key={index}>
                <li className={`feedback-item ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                  <p><strong>Pregunta:</strong> {item.question}</p>
                  <p style={{ color: 'grey' }}><strong>Tu respuesta:</strong> {item.selectedAnswer || 'No respondida'}</p>
                  {!item.isCorrect && <p><strong>Respuesta correcta:</strong> {item.correctAnswer}</p>}
                  <p style={{ color: item.isCorrect ? 'green' : 'red' }}>{item.isCorrect ? 'Correcto' : 'Incorrecto'}</p>
                  <p><strong>Explicación:</strong> {item.feedback}</p>
                </li>
                <hr />
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      {!isReady ? (
        <div className="exam-box">
          <h1 className="title">Examen por Especialidad</h1>

          <div className="form-group">
            <label htmlFor="speciality">Seleccionar Especialidad</label>
            <select
              className="form-control"
              id="speciality"
              onChange={(e) => setSpecialty(e.target.value)}
              value={speciality}
            >
              <option value="">Seleccionar especialidad</option>
              <option value="Pediatría">Pediatría</option>
              <option value="Cirugía">Cirugía</option>
              <option value="Oftalmologia">Oftalmologia</option>
              <option value="Salud Pública">Salud Pública</option>
              <option value="Otorrinolaringología">Otorrinolaringología</option>
              <option value="Psiquiatría">Psiquiatría</option>
              <option value="Ginecología y Obstetricia">Ginecología y Obstetricia</option>
              <option value="Medicina Interna">Medicina Interna</option>
              <option value="Especialidades">Mix-Especialidades</option>
              {/* Agregar más especialidades según sea necesario */}
            </select>


          </div>

          {/* Selector de tiempo */}
          <div className="form-group">
            <label htmlFor="time">Seleccionar Tiempo</label>
            <select
              className="form-control"
              id="time"
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Seleccionar tiempo</option>
              <option value="10">10 minutos</option>
              <option value="20">20 minutos</option>
              <option value="30">30 minutos</option>
              {/* Agregar más opciones de tiempo */}
            </select>
          </div>

          {/* Número de WhatsApp */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Número de WhatsApp</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              placeholder="Número de WhatsApp"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Botón para iniciar examen */}
          <button className="btn btn-primary btn-lg btn-block" onClick={handleStartExam}>
            Iniciar Examen
          </button>
        </div>
      ) : (
        <div className="exam-box">
          {/* Cronómetro */}
          <div className="timer" style={{ position: 'fixed', top: '10px', right: '10px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'white', padding: '5px', borderRadius: '5px', zIndex: 1000 }}>
            Tiempo restante: {formatTime(timeRemaining)}
          </div>

          {questions.length > 0 ? (
            <>
              {getCurrentBlockQuestions().map((question, index) => (
                <div key={currentBlockIndex + index} className="question-block">
                  <p>{question.question}</p>
                  <ul className="options-list">
                    {question.options ? (
                      question.options.map((option, optIndex) => (
                        <li
                          key={optIndex}
                          className={`option-item ${selectedAnswers[currentBlockIndex + index] === option ? 'selected' : ''}`}
                          onClick={() => handleAnswerSelection(currentBlockIndex + index, option)}
                        >
                          {option}
                        </li>
                      ))
                    ) : (
                      <p>No hay opciones disponibles para esta pregunta.</p>
                    )}
                  </ul>
                </div>
              ))}

              <button
                className="btn btn-success"
                onClick={handleNextBlock}
                disabled={selectedAnswers.slice(currentBlockIndex, currentBlockIndex + 10).includes(undefined)}
              >
                Siguiente Bloque
              </button>
            </>
          ) : (
            <p>No hay preguntas para esta especialidad.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamenPorEspecialidad;