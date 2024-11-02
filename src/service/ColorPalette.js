// src/components/ColorPalette.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const ColorPalette = ({ onColorChange }) => {
  const [navbarColor, setNavbarColor] = useState('#ffffff');
  const [buttonColor, setButtonColor] = useState('#0d6efd');
  const [backgroundColor, setBackgroundColor] = useState('#f8f9fa');

  const user = auth.currentUser;

  // Cargar los colores guardados en Firebase
  useEffect(() => {
    const fetchColors = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNavbarColor(data.navbarColor || '#ffffff');
          setButtonColor(data.buttonColor || '#0d6efd');
          setBackgroundColor(data.backgroundColor || '#f8f9fa');
          onColorChange(data); // Aplicar los colores guardados
        }
      }
    };
    fetchColors();
  }, [user, onColorChange]);

  // Guardar los colores en Firebase
  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        navbarColor,
        buttonColor,
        backgroundColor,
      }, { merge: true });
      onColorChange({ navbarColor, buttonColor, backgroundColor });
    }
  };

  return (
    <div className="color-palette">
      <Row className="mb-3">
        <Col>
          <Form.Label>Color de la Barra de Navegación</Form.Label>
          <Form.Control
            type="color"
            value={navbarColor}
            onChange={(e) => setNavbarColor(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Label>Color de los Botones</Form.Label>
          <Form.Control
            type="color"
            value={buttonColor}
            onChange={(e) => setButtonColor(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Label>Color del Fondo</Form.Label>
          <Form.Control
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </Col>
      </Row>
      <Button variant="primary" onClick={handleSave}>
        Guardar Preferencias
      </Button>
    </div>
  );
};

export default ColorPalette;