import React, { useEffect, useRef } from 'react';

const AdComponent = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (window.adsbygoogle && adRef.current) {
      // Reactivar el anuncio cuando se monta el componente
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Error al cargar el anuncio:", e);
      }
    }
  }, []);

  return (
    <div ref={adRef} style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1123494976117313"
        data-ad-slot="1507439270"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;