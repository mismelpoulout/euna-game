import React from 'react';
import '../style.css'; // Archivo CSS con los estilos de la tira móvil

const InfoStrip = ({ message }) => {
  return (
    <div className="info-strip">
      <div className="marquee">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default InfoStrip;