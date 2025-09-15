import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dropsRef = useRef([]);
  const columnsRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastMatrixUpdate = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateMatrixColumns();
    };

    const updateMatrixColumns = () => {
      const fontSize = Math.max(12, Math.min(16, window.innerWidth / 100));
      columnsRef.current = Math.floor(canvas.width / fontSize);
      
      if (dropsRef.current.length !== columnsRef.current) {
        dropsRef.current = [];
        for (let i = 0; i < columnsRef.current; i++) {
          dropsRef.current[i] = Math.random() * -100;
        }
      }
    };

    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾛﾜﾝ';
    
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const fontSize = Math.max(12, Math.min(16, window.innerWidth / 100));
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < dropsRef.current.length && i < columnsRef.current; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;
        
        const gradient = ctx.createLinearGradient(0, y - fontSize * 5, 0, y);
        gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(0, 255, 0, 0.4)');
        gradient.addColorStop(0.7, 'rgba(0, 255, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 1)');
        ctx.fillStyle = gradient;
        
        ctx.fillText(char, x, y);
        
        if (dropsRef.current[i] * fontSize > 0 && Math.random() > 0.9) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff00';
          ctx.fillStyle = '#88ff88';
          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;
        }
        
        if (dropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      }
    };

    const animateMatrix = (timestamp) => {
      if (timestamp - lastMatrixUpdate >= 35) {
        drawMatrix();
        lastMatrixUpdate = timestamp;
      }
      animationRef.current = requestAnimationFrame(animateMatrix);
    };

    resizeCanvas();

    const handleResize = () => {
      clearTimeout(window.matrixResizeTimeout);
      window.matrixResizeTimeout = setTimeout(resizeCanvas, 150);
    };

    const handleOrientationChange = () => {
      setTimeout(resizeCanvas, 300);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Start animation
    animationRef.current = requestAnimationFrame(animateMatrix);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (window.matrixResizeTimeout) {
        clearTimeout(window.matrixResizeTimeout);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.3
      }}
    />
  );
};

export default MatrixBackground;