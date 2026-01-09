import GameErrorBoundary from './GameErrorBoundary';

/**
 * withGameErrorBoundary - HOC to wrap a game component with error boundary
 * @param {Component} WrappedComponent - The game component to wrap
 * @param {Object} errorBoundaryProps - Props to pass to GameErrorBoundary
 * @returns {Component} - Wrapped component
 */
export const withGameErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundary = (props) => {
    return (
      <GameErrorBoundary {...errorBoundaryProps} onBack={props.onBack}>
        <WrappedComponent {...props} />
      </GameErrorBoundary>
    );
  };

  WithErrorBoundary.displayName = `WithGameErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundary;
};

export default withGameErrorBoundary;
