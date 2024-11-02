import React, { useState, useEffect } from 'react';
import './css/ztyle.css'; // Asegúrate de tener esta hoja de estilos si decides usar estilos personalizados

const Timer = ({ onBreakStart, onFinish }) => {
  const [time, setTime] = useState(90 * 60); // Comienza con 90 minutos (en segundos)
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [block, setBlock] = useState(1);

  useEffect(() => {
    let interval = null;

    if (!isPaused && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0 && block === 1) {
      setIsPaused(true);
      setIsBreak(true);
      onBreakStart();

      setTimeout(() => {
        setTime(90 * 60);
        setIsPaused(false);
        setIsBreak(false);
        setBlock(2);
      }, 30 * 60 * 1000);
    } else if (time === 0 && block === 2) {
      clearInterval(interval);
      onFinish();
    }

    return () => clearInterval(interval);
  }, [time, isPaused, block, onBreakStart, onFinish]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="timer bg-primary text-white p-6 text-center rounded">
      <h2>Tiempo restante: {formatTime(time)}</h2>
      {isBreak && <p>Break de 30 minutos en progreso...</p>}
    </div>
  );
};

export default Timer;