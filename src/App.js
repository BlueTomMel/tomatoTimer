import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import MatrixBackground from './components/MatrixBackground';
import FlipClock from './components/FlipClock/FlipClock';
import Controls from './components/Controls/Controls';
import EffectiveTime from './components/EffectiveTime/EffectiveTime';
import { useMobile } from './hooks/useMobile';
import { useFullscreen } from './hooks/useFullscreen';
import { useCyberpunkGlitch } from './hooks/useCyberpunkGlitch';

function App() {
  const [mode, setMode] = useState('countdown');
  const [time, setTime] = useState({ hours: 0, minutes: 30, seconds: 0 });
  const [countdownTime, setCountdownTime] = useState({ hours: 0, minutes: 30, seconds: 0 });
  const [countdown, setCountdown] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [effectiveTime, setEffectiveTime] = useState(0);
  const [pendingTime, setPendingTime] = useState(0);
  const [timerTag, setTimerTag] = useState('');
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState(null);

  const { isMobile, isIOS } = useMobile();
  const { isFullscreen, toggleFullscreen } = useFullscreen(isIOS);
  useCyberpunkGlitch();

  // Clock mode - show current time
  useEffect(() => {
    if (mode === 'clock') {
      const clockInterval = setInterval(() => {
        const now = new Date();
        setTime({
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds()
        });
      }, 1000);

      return () => clearInterval(clockInterval);
    }
  }, [mode]);

  // Countdown mode
  useEffect(() => {
    if (isCountdownRunning && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCountdownRunning(false);
            setPendingTime(countdownTime.hours * 3600 + countdownTime.minutes * 60 + countdownTime.seconds);
            playNotificationSound();
            showControlsTemporarily();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isCountdownRunning, countdown, countdownTime]);

  // Update display time based on mode
  useEffect(() => {
    if (mode === 'countdown') {
      if (isCountdownRunning || countdown > 0) {
        const hours = Math.floor(countdown / 3600);
        const minutes = Math.floor((countdown % 3600) / 60);
        const seconds = countdown % 60;
        setTime({ hours, minutes, seconds });
      } else {
        setTime(countdownTime);
      }
    }
  }, [mode, countdown, countdownTime, isCountdownRunning]);

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.type = 'sine';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    
    if (hideTimeout) clearTimeout(hideTimeout);
    
    const timeout = setTimeout(() => {
      setControlsVisible(false);
    }, 5000);
    
    setHideTimeout(timeout);
  }, [hideTimeout]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    showControlsTemporarily();
  };

  const handleCountdownTimeChange = (unit, value) => {
    setCountdownTime(prev => ({
      ...prev,
      [unit]: Math.max(0, value)
    }));
  };

  const handleStartCountdown = () => {
    const totalSeconds = countdownTime.hours * 3600 + countdownTime.minutes * 60 + countdownTime.seconds;
    if (totalSeconds > 0) {
      setCountdown(totalSeconds);
      setIsCountdownRunning(true);
      showControlsTemporarily();
    }
  };

  const handleTagChange = () => {
    const newTag = prompt('Enter goal/tag for this timer:', timerTag);
    if (newTag !== null) {
      setTimerTag(newTag.trim());
    }
  };

  const handleAddEffectiveTime = () => {
    if (pendingTime > 0) {
      setEffectiveTime(prev => prev + pendingTime);
      setPendingTime(0);
    }
  };

  const handleClearPendingTime = () => {
    setPendingTime(0);
  };

  // Event listeners for showing controls
  useEffect(() => {
    const events = ['mousemove', 'click', 'keydown', 'touchstart', 'touchend'];
    
    const handleUserActivity = () => {
      showControlsTemporarily();
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [showControlsTemporarily, hideTimeout]);

  // Initialize with countdown mode
  useEffect(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  return (
    <div className="App">
      <MatrixBackground />
      
      <Controls
        mode={mode}
        onModeChange={handleModeChange}
        countdownTime={countdownTime}
        onCountdownTimeChange={handleCountdownTimeChange}
        onStartCountdown={handleStartCountdown}
        onFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        isHidden={!controlsVisible}
        timerTag={timerTag}
        onTagChange={handleTagChange}
      />
      
      <FlipClock time={time} mode={mode} />
      
      <EffectiveTime
        effectiveTime={effectiveTime}
        pendingTime={pendingTime}
        onAddTime={handleAddEffectiveTime}
        onClearTime={handleClearPendingTime}
        isHidden={!controlsVisible}
        timerTag={timerTag}
        mode={mode}
      />
    </div>
  );
}

export default App;