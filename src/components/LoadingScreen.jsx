import React from 'react';

const LoadingScreen = ({ isVisible }) => {
  return (
    <div className={`loading-screen ${!isVisible ? 'hidden' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-title">Brickrush</h1>
        <p className="loading-subtitle">Get ready to break some bricks!</p>
        <div className="loading-spinner"></div>
        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
