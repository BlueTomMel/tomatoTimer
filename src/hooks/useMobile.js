import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    (window.innerWidth <= 768) ||
                    ('ontouchstart' in window);
      
      const landscapeMobile = mobile && 
                             (window.innerWidth > window.innerHeight) && 
                             (window.innerHeight <= 500);
      
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                  /CriOS|FxiOS|EdgiOS/.test(navigator.userAgent) ||
                  (window.navigator.standalone !== undefined);

      setIsMobile(mobile);
      setIsLandscapeMobile(landscapeMobile);
      setIsIOS(ios);
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const calculateOptimalSizes = () => {
      if (!isMobile) return null;

      const availableWidth = window.innerWidth * 0.98;
      const availableHeight = isLandscapeMobile ? window.innerHeight * 0.75 : window.innerHeight * 0.5;
      const totalElements = 8;

      let digitWidth, digitHeight, fontSize, colonSize, gap;

      if (isLandscapeMobile) {
        const maxElementWidth = availableWidth / totalElements;
        const maxDigitHeight = availableHeight * 0.9;
        
        digitWidth = Math.max(50, maxElementWidth * 0.85);
        digitHeight = Math.min(maxDigitHeight, digitWidth * 1.8);
        
        if (digitHeight < maxDigitHeight * 0.8) {
          const heightBasedWidth = maxDigitHeight / 1.8;
          if (heightBasedWidth * totalElements <= availableWidth) {
            digitWidth = Math.min(heightBasedWidth, digitWidth * 1.3);
            digitHeight = digitWidth * 1.8;
          }
        }
        
        fontSize = digitHeight * 0.65;
        colonSize = fontSize * 0.75;
        gap = Math.max(2, digitWidth * 0.06);
      } else {
        const maxElementWidth = availableWidth / totalElements;
        const maxDigitHeight = availableHeight * 0.85;
        
        digitWidth = Math.max(60, maxElementWidth * 0.9);
        digitHeight = Math.min(maxDigitHeight, digitWidth * 1.4);
        
        if (digitHeight < maxDigitHeight * 0.8) {
          const heightBasedWidth = maxDigitHeight / 1.4;
          if (heightBasedWidth * totalElements <= availableWidth) {
            digitWidth = Math.min(heightBasedWidth, digitWidth * 1.2);
            digitHeight = digitWidth * 1.4;
          }
        }
        
        fontSize = digitHeight * 0.6;
        colonSize = fontSize * 0.8;
        gap = Math.max(3, digitWidth * 0.08);
      }

      return {
        digitWidth: Math.floor(digitWidth),
        digitHeight: Math.floor(digitHeight),
        fontSize: Math.floor(fontSize),
        colonSize: Math.floor(colonSize),
        gap: Math.floor(gap),
        borderRadius: Math.max(8, Math.floor(digitWidth * 0.12))
      };
    };

    const applySizes = (sizes) => {
      if (!sizes) return;
      
      const root = document.documentElement;
      root.style.setProperty('--digit-width', sizes.digitWidth + 'px');
      root.style.setProperty('--digit-height', sizes.digitHeight + 'px');
      root.style.setProperty('--digit-font-size', sizes.fontSize + 'px');
      root.style.setProperty('--colon-size', sizes.colonSize + 'px');
      root.style.setProperty('--gap', sizes.gap + 'px');
      root.style.setProperty('--border-radius', sizes.borderRadius + 'px');
    };

    const handleResize = () => {
      checkMobile();
      const sizes = calculateOptimalSizes();
      applySizes(sizes);
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        checkMobile();
        const sizes = calculateOptimalSizes();
        applySizes(sizes);
      }, 300);
    };

    checkMobile();
    const sizes = calculateOptimalSizes();
    applySizes(sizes);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile, isLandscapeMobile]);

  return {
    isMobile,
    isLandscapeMobile,
    isIOS,
    screenSize
  };
};