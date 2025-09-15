import React from 'react';
import './EffectiveTime.css';

const EffectiveTime = ({ 
  effectiveTime, 
  pendingTime, 
  onAddTime, 
  onClearTime, 
  isHidden, 
  timerTag, 
  mode 
}) => {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Timer Tag Display */}
      {timerTag && mode === 'countdown' && (
        <div className={`timer-tag-display ${isHidden ? 'hide' : ''}`}>
          Goal: {timerTag}
        </div>
      )}

      {/* Effective Time Calculator */}
      <div className={`hideable-calculator ${isHidden ? 'hide' : ''}`}>
        <span className="effective-time-label">Effective time today: </span>
        <span 
          id="effectiveTime" 
          className="effective-time-value"
        >
          {formatTime(effectiveTime)}
        </span>
      </div>

      {/* Add Effective Time Control */}
      <div className={`hideable-add-time ${isHidden ? 'hide' : ''}`}>
        <div className="add-time-content">
          <span className="add-time-label">Add effective time:</span>
          <span className="pending-time-display">
            {formatTime(pendingTime)}
          </span>
          <div className="add-time-buttons">
            <button 
              className={`time-btn ${pendingTime > 0 ? 'flash' : ''}`}
              onClick={onAddTime}
              disabled={pendingTime === 0}
            >
              Add
            </button>
            <button 
              className="time-btn"
              onClick={onClearTime}
              disabled={pendingTime === 0}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EffectiveTime;