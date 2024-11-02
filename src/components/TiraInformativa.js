import React, { useState } from 'react';
import '../components/css/tirainformativa.css'; // Asegúrate de importar el CSS

const TiraInformativa = () => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false); // Ocultar la tira al hacer clic en el botón de cerrar
  };

  return (
    visible && (
      <div className="tira-informativa">
        <span>⚠️ Recuerda revisar tus respuestas antes de finalizar el bloque.</span>
        <button onClick={handleClose}>&times;</button>
      </div>
    )
  );
};

export default TiraInformativa;