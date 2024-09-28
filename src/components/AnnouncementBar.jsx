import React from 'react';
import { Container } from 'react-bootstrap';
import './ztyle.css';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <Container>
        <div className="announcement-text">
        <h1>+ de 400 preguntas de EUNACOM pasados, que se mostraran de forma <strong>aleatoria</strong> al igual que las opciones.</h1>
        </div>
      </Container>
    </div>
  );
};

export default AnnouncementBar;