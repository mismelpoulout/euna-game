import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import { Button } from 'react-bootstrap';
import './App.css'; // Asegúrate de crear este archivo CSS

const History = () => {
  const [evaluations, setEvaluations] = useState([]);

  // Función para obtener el historial de evaluaciones
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const userHistoryRef = collection(db, 'userEvaluations'); // Nombre de la colección en Firestore
        const snapshot = await getDocs(userHistoryRef);
        const evaluationsData = snapshot.docs.map(doc => doc.data()); // Obtener los datos de cada documento
        setEvaluations(evaluationsData); // Actualizar el estado con los datos obtenidos
      } catch (error) {
        console.error('Error obteniendo el historial de evaluaciones:', error);
      }
    };

    fetchEvaluations();
  }, []);

  // Función para compartir el historial en WhatsApp
  const shareOnWhatsApp = () => {
    let message = 'Historial de Evaluaciones:\n';
    evaluations.forEach((evaluation, index) => {
      message += `Evaluación ${index + 1}:\n`;
      message += `Correctas: ${evaluation.correctas}, Incorrectas: ${evaluation.incorrectas}\n`;
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div>
      <h1>Historial de Evaluaciones</h1>
      {evaluations.length === 0 ? (
        <p>No hay evaluaciones registradas.</p>
      ) : (
        evaluations.map((evaluation, index) => (
          <div key={index}>
            <h3>Evaluación {index + 1}</h3>
            <p>Correctas: {evaluation.correctas}</p>
            <p>Incorrectas: {evaluation.incorrectas}</p>
          </div>
        ))
      )}
      <div className="button-container">
        <Button variant="success" onClick={shareOnWhatsApp}>
          Compartir en WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default History;