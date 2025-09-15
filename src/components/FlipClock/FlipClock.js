import React, { useState, useEffect, useRef } from 'react';
import './FlipClock.css';
import { useCyberpunkGlitch } from '../../hooks/useCyberpunkGlitch';

const FlipClock = ({ time, mode }) => {
  const [prevDigits, setPrevDigits] = useState([null, null, null, null, null, null]);
  const flipClockRef = useRef(null);
  const { triggerGlitch } = useCyberpunkGlitch();

  const pad = (num) => num.toString().padStart(2, '0');

  const renderDigit = (container, value, prevValue) => {
    if (!container) return;
    
    container.innerHTML = '';
    
    const top = document.createElement('div');
    top.className = 'top';
    const topSpan = document.createElement('span');
    topSpan.textContent = value;
    top.appendChild(topSpan);
    
    const bottom = document.createElement('div');
    bottom.className = 'bottom';
    const bottomSpan = document.createElement('span');
    bottomSpan.textContent = value;
    bottom.appendChild(bottomSpan);
    
    container.appendChild(top);
    container.appendChild(bottom);
    
    if (prevValue !== undefined && prevValue !== value) {
      const flip = document.createElement('div');
      flip.className = 'flip';
      const flipSpan = document.createElement('span');
      flipSpan.textContent = prevValue;
      flip.appendChild(flipSpan);
      container.appendChild(flip);
      
      flip.addEventListener('animationend', () => {
        flip.remove();
      });
      
      setTimeout(() => {
        if (flip.parentNode) {
          flip.remove();
        }
      }, 600);
    }
  };

  const ensureMobileFit = () => {
    const flipClock = flipClockRef.current;
    const container = flipClock?.parentElement;
    
    if (!flipClock || !container) return;
    
    const clockWidth = flipClock.scrollWidth;
    const containerWidth = container.clientWidth - 10;
    
    if (clockWidth > containerWidth) {
      const scale = Math.min(containerWidth / clockWidth, 0.98);
      flipClock.style.transform = `scale(${scale})`;
      flipClock.style.transformOrigin = 'center center';
    } else {
      const utilizationRatio = clockWidth / containerWidth;
      if (utilizationRatio < 0.8) {
        const maxScale = containerWidth / clockWidth;
        const optimalScale = Math.min(maxScale * 0.95, 1.2);
        if (optimalScale > 1.05) {
          flipClock.style.transform = `scale(${optimalScale})`;
          flipClock.style.transformOrigin = 'center center';
        }
      }
    }
  };

  useEffect(() => {
    if (!flipClockRef.current) return;

    const { hours, minutes, seconds } = time;
    const timeStr = pad(hours) + pad(minutes) + pad(seconds);
    const container = flipClockRef.current;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
      const digit = document.createElement('div');
      digit.className = 'digit';
      renderDigit(digit, timeStr[i], prevDigits[i]);
      container.appendChild(digit);
      
      if (i === 1 || i === 3) {
        const colon = document.createElement('div');
        colon.className = 'colon';
        colon.textContent = ':';
        container.appendChild(colon);
      }
    }
    
    setPrevDigits(timeStr.split(''));
    
    // Trigger mobile fit check
    setTimeout(() => {
      ensureMobileFit();
    }, 50);
  }, [time, prevDigits]);

  return (
    <div className="flip-clock-container">
      <div ref={flipClockRef} className="flip-clock" />
    </div>
  );
};

export default FlipClock;