import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig'; // Configuración de Firebase
import { doc, updateDoc, getDoc, setDoc, increment } from 'firebase/firestore';

const VisitCounter = () => {
  const [dailyVisits, setDailyVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [lastVisitDate, setLastVisitDate] = useState(null);

  // Función para obtener la fecha actual solo con día, mes y año (sin hora)
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString(); // Retorna la fecha en formato DD/MM/YYYY
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      const currentDate = getTodayDate(); // Obtener la fecha actual sin horas
      const docRef = doc(db, 'siteStatistics', 'stats'); // Referencia al documento en Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalVisits(data.totalVisits || 0); // Inicializa el total de visitas
        setDailyVisits(data.dailyVisits || 0); // Inicializa las visitas diarias
        setRegisteredUsers(data.registeredUsers || 0); // Inicializa el número de usuarios
        setTotalExams(data.totalExams || 0); // Inicializa el total de exámenes realizados
        setLastVisitDate(data.lastVisitDate || currentDate); // Fecha del último reinicio

        // Si es un nuevo día, reiniciar el contador diario
        if (currentDate !== data.lastVisitDate) {
          setDailyVisits(0); // Reinicia las visitas diarias
          setLastVisitDate(currentDate); // Actualiza la última fecha registrada
          await updateDoc(docRef, {
            dailyVisits: 0,
            lastVisitDate: currentDate,
          });
        }
      } else {
        // Si no existe el documento, lo creamos con valores iniciales
        await setDoc(docRef, {
          totalVisits: 0,
          dailyVisits: 0,
          registeredUsers: 0,
          totalExams: 0,
          lastVisitDate: currentDate,
        });
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const updateStatistics = async () => {
      const docRef = doc(db, 'siteStatistics', 'stats');
      await updateDoc(docRef, {
        totalVisits: totalVisits,
        dailyVisits: dailyVisits,
      });
    };
    if (dailyVisits !== 0 || totalVisits !== 0) {
      updateStatistics();
    }
  }, [dailyVisits, totalVisits]);

  const handleNewVisit = async () => {
    setDailyVisits((prevDaily) => prevDaily + 1);
    setTotalVisits((prevTotal) => prevTotal + 1);

    const docRef = doc(db, 'siteStatistics', 'stats');
    await updateDoc(docRef, {
      totalVisits: increment(1),
      dailyVisits: increment(1),
    });
  };

  return (
    <div>
      <h1>Estadísticas del Sitio</h1>
      <div className="statistics-container">
        <div className="stat-box">
          <p>Total de visitas: <strong>{totalVisits}</strong></p>
        </div>
        <div className="stat-box">
          <p>Visitas de hoy: <strong>{dailyVisits}</strong></p>
        </div>
        <div className="stat-box">
          <p>Usuarios registrados: <strong>{registeredUsers}</strong></p>
        </div>
        <div className="stat-box">
          <p>Total de exámenes realizados: <strong>{totalExams}</strong></p>
        </div>
      </div>
      <button onClick={handleNewVisit}>Registrar nueva visita</button>
    </div>
  );
};

export default VisitCounter;