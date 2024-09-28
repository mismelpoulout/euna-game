// ViewCounter.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Verifica que la ruta sea correcta
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewCounter = () => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const docRef = doc(db, 'views', 'viewCount');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setViews(docSnap.data().count);
        } else {
          // Si el documento no existe, lo creamos con un conteo inicial
          await setDoc(docRef, { count: 0 });
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    const incrementViews = async () => {
      try {
        const docRef = doc(db, 'views', 'viewCount');
        await updateDoc(docRef, { count: views + 1 });
        setViews(views + 1);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    };

    fetchViews();
    incrementViews();
  }, [views]);

  return (
    <div className="container bg-dark text-center mt-5">
      <h6>Vistas</h6>
      <p className="display-4">{views}</p>
    </div>
  );
};

export default ViewCounter;