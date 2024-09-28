import React, { useState, useEffect } from 'react';
import { Container, Card, Navbar, Nav } from 'react-bootstrap';

const VisitCounter = () => {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    // Obtener el número de visitas almacenado en el almacenamiento local
    let visitCount = parseInt(localStorage.getItem('visitCount'), 10);

    if (isNaN(visitCount)) {
      visitCount = 0; // Si no hay contador, inicializarlo en 0
    }

    // Incrementar el contador
    visitCount += 1;

    // Guardar el contador actualizado en el almacenamiento local
    localStorage.setItem('visitCount', visitCount);

    // Actualizar el estado con el nuevo valor
    setVisits(visitCount);
  }, []);

  return (
    <>
     

      {/* Contador de Visitas */}
          <Card.Body>
            <Card.Text as="h3">
            <p>Visitas</p>
            <div id="sfct8j9gsstj35lf7k1gmsl944r25yylgmr"></div> 
            </Card.Text>
          </Card.Body>
    </>
  );
};

export default VisitCounter;