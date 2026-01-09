const LoadingScreen = ({ isVisible }) => {
  return (
    <div className={`loading-screen ${!isVisible ? 'hidden' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-title">Arcade Games</h1>
        <p className="loading-subtitle">Get ready to play!</p>
        <div className="loading-spinner"></div>
        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
