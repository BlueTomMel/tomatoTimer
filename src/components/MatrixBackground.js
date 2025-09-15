import React, { useEffect, useRef, useMemo } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dropsRef = useRef([]);
  const columnsRef = useRef(0);
  
  // Detect high-performance devices to reduce CPU usage
  const isHighPerformanceDevice = useMemo(() => {
    const cores = window.navigator.hardwareConcurrency || 4;
    const memory = window.navigator.deviceMemory || 4;
    return cores > 8 || memory > 8; // M4 Mac has 10+ cores
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastMatrixUpdate = 0;
    
    // Adaptive frame rate based on device performance
    const targetFPS = isHighPerformanceDevice ? 15 : 25; // Lower FPS for M4
    const frameInterval = 1000 / targetFPS;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateMatrixColumns();
    };

    const updateMatrixColumns = () => {
      const fontSize = Math.max(12, Math.min(16, window.innerWidth / 100));
      // Reduce particle density on high-performance devices
      const densityMultiplier = isHighPerformanceDevice ? 0.5 : 1;
      columnsRef.current = Math.floor((canvas.width / fontSize) * densityMultiplier);
      
      if (dropsRef.current.length !== columnsRef.current) {
        dropsRef.current = [];
        for (let i = 0; i < columnsRef.current; i++) {
          dropsRef.current[i] = Math.random() * -100;
        }
      }
    };

    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾛﾜﾝ';
    
    const drawMatrix = () => {
      // Optimize fade effect for performance
      ctx.fillStyle = isHighPerformanceDevice ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const fontSize = Math.max(12, Math.min(16, window.innerWidth / 100));
      ctx.font = fontSize + 'px monospace';
      
      // Limit processing for high-performance devices
      const maxChars = isHighPerformanceDevice ? 
        Math.min(dropsRef.current.length, 30) : dropsRef.current.length;
      
      for (let i = 0; i < maxChars && i < columnsRef.current; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;
        
        // Simplified rendering - no gradients on high-performance devices
        if (isHighPerformanceDevice) {
          // Simple rendering for better performance
          const opacity = Math.max(0.3, 1 - (y / canvas.height));
          ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
          ctx.fillText(char, x, y);
          
          // Reduce glow effects
          if (Math.random() > 0.98) {
            ctx.fillStyle = '#88ff88';
            ctx.fillText(char, x, y);
          }
        } else {
          // Full effects for lower-performance devices
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
        }
        
        if (dropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      }
    };

    const animateMatrix = (timestamp) => {
      if (timestamp - lastMatrixUpdate >= frameInterval) {
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
  }, [isHighPerformanceDevice]);

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