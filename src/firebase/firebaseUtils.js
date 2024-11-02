import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';

// Función para guardar el resultado en Firestore asociado a un usuario
const saveEvaluationToFirestore = async (correctas, incorrectas, totalPreguntas, tipoEvaluacion) => {
  const auth = getAuth();
  const user = auth.currentUser; // Obtener el usuario autenticado

  if (user) {
    const newEvaluation = {
      correctas,
      incorrectas,
      totalPreguntas,
      tipoEvaluacion,
      fecha: new Date(),
      userId: user.uid, // Asociar evaluación con el UID del usuario
    };

    // Guardar en Firestore
    try {
      await addDoc(collection(db, 'history'), newEvaluation);
      console.log('Resultado guardado en Firestore');
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
    }
  } else {
    console.error('No hay usuario autenticado.');
  }
};