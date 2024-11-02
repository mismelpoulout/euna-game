import React, { useEffect, useRef } from 'react';

const AdComponent = () => {
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Asegurarse de que el anuncio no se cargue en localhost para evitar errores en pruebas locales
    if (window.location.hostname !== 'localhost' && window.adsbygoogle && adRef.current && !isAdLoaded.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true; // Marcar como cargado para evitar recargas
      } catch (e) {
        console.error("Error al cargar el anuncio:", e);
      }
    }
  }, []);

  return (
    <div ref={adRef} style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }} // Cambiado a un objeto para React
           data-ad-client="ca-pub-2272121820065150"
           data-ad-slot="4551469230"
           data-ad-format="auto"
           data-full-width-responsive="true">
      </ins>
    </div>
  );
};

export default AdComponent;