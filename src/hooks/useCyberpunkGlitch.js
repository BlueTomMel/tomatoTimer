import { useEffect, useCallback, useMemo } from 'react';

export const useCyberpunkGlitch = () => {
  // Detect high-performance devices and reduce glitch frequency
  const isHighPerformanceDevice = useMemo(() => {
    const cores = window.navigator.hardwareConcurrency || 4;
    const memory = window.navigator.deviceMemory || 4;
    return cores > 8 || memory > 8;
  }, []);
  const triggerRandomGlitch = useCallback(() => {
    const digits = document.querySelectorAll('.digit');
    if (digits.length === 0) return;
    
    // Randomly select 1-2 digits to flicker like fluorescent tubes
    const flickerCount = Math.random() < 0.8 ? 1 : 2;
    const selectedDigits = [];
    
    for (let i = 0; i < flickerCount; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * digits.length);
      } while (selectedDigits.includes(randomIndex));
      
      selectedDigits.push(randomIndex);
      const digit = digits[randomIndex];
      
      // Remove any existing fluorescent classes
      digit.classList.remove('fluorescent-flicker', 'fluorescent-buzz', 'fluorescent-startup');
      
      // Randomly choose fluorescent tube effect type
      const fluorescentTypes = ['fluorescent-flicker', 'fluorescent-buzz', 'fluorescent-startup'];
      const weights = [0.5, 0.3, 0.2]; // Flicker most common, startup least common
      
      let randomValue = Math.random();
      let selectedEffect;
      
      if (randomValue < weights[0]) {
        selectedEffect = fluorescentTypes[0]; // flicker
      } else if (randomValue < weights[0] + weights[1]) {
        selectedEffect = fluorescentTypes[1]; // buzz
      } else {
        selectedEffect = fluorescentTypes[2]; // startup
      }
      
      // Apply fluorescent tube effect
      digit.classList.add(selectedEffect);
      
      // Remove effect after animation completes
      const duration = selectedEffect === 'fluorescent-startup' ? 1200 : 
                      selectedEffect === 'fluorescent-flicker' ? 1000 : 800;
      
      setTimeout(() => {
        digit.classList.remove(selectedEffect);
      }, duration);
    }
  }, []);

  const startCyberpunkGlitches = useCallback(() => {
    // Reduce glitch frequency on high-performance devices
    const baseDelay = isHighPerformanceDevice ? 8000 : 4000; // 8-16s vs 4-10s
    const variableDelay = isHighPerformanceDevice ? 8000 : 6000;
    
    function scheduleNextGlitch() {
      const delay = Math.random() * variableDelay + baseDelay;
      setTimeout(() => {
        triggerRandomGlitch();
        scheduleNextGlitch();
      }, delay);
    }
    
    // Longer initial delay for high-performance devices
    setTimeout(() => {
      scheduleNextGlitch();
    }, isHighPerformanceDevice ? 5000 : 3000);
  }, [triggerRandomGlitch, isHighPerformanceDevice]);

  useEffect(() => {
    startCyberpunkGlitches();
  }, [startCyberpunkGlitches]);

  return {
    triggerGlitch: triggerRandomGlitch
  };
};