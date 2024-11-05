import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error: ", e.message);
    }
  }, []); // Ejecutar solo una vez al montar el componente

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2272121820065150"
      data-ad-slot="1234567890"
      data-ad-format="auto"
    ></ins>
  );
};

export default AdComponent;