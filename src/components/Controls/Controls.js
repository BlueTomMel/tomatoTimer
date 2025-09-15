import React from 'react';
import './Controls.css';

const Controls = ({
  mode,
  onModeChange,
  countdownTime,
  onCountdownTimeChange,
  onStartCountdown,
  onFullscreen,
  isFullscreen,
  isHidden,
  timerTag,
  onTagChange
}) => {
  return (
    <div className={`controls ${isHidden ? 'hide' : ''}`}>
      <button 
        onClick={() => onModeChange('clock')}
        className={mode === 'clock' ? 'active' : ''}
      >
        Clock
      </button>
      
      <button 
        onClick={() => onModeChange('countdown')}
        className={mode === 'countdown' ? 'active' : ''}
      >
        Countdown
      </button>
      
      {mode === 'countdown' && (
        <>
          <span className="countdown-inputs">
            <input
              type="number"
              min="0"
              max="99"
              value={countdownTime.hours}
              onChange={(e) => onCountdownTimeChange('hours', parseInt(e.target.value) || 0)}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={countdownTime.minutes}
              onChange={(e) => onCountdownTimeChange('minutes', parseInt(e.target.value) || 0)}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={countdownTime.seconds}
              onChange={(e) => onCountdownTimeChange('seconds', parseInt(e.target.value) || 0)}
            />
          </span>
          <button onClick={onStartCountdown}>Start</button>
        </>
      )}
      
      <button onClick={onFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
      
      <button onClick={onTagChange}>
        Goal
      </button>
    </div>
  );
};

export default Controls;