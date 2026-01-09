import { Component } from 'react';
import { IoRefresh, IoArrowBack, IoWarning } from 'react-icons/io5';
import { getColorConfig } from '../utils/colorConfig';

/**
 * GameErrorBoundary - Error boundary component for catching game crashes
 *
 * Catches JavaScript errors in child components and displays a friendly
 * error screen instead of crashing the entire application.
 *
 * Features:
 * - Catches render errors, lifecycle errors, and errors in constructors
 * - Provides retry and back-to-menu options
 * - Logs errors for debugging
 * - Customizable fallback UI per game
 */
class GameErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('[GameErrorBoundary] Caught error:', error);
    console.error('[GameErrorBoundary] Error info:', errorInfo);

    // Store error info in state
    this.setState({ errorInfo });

    // Call optional error reporting callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // Reset error state and attempt to re-render children
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional onRetry callback
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleBack = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call the back handler
    if (this.props.onBack) {
      this.props.onBack();
    }
  };

  render() {
    const { hasError, error } = this.state;
    const {
      children,
      gameName = 'Game',
      accentColor = 'cyan',
      showErrorDetails = false,
      customFallback,
    } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (customFallback) {
        return customFallback({
          error,
          errorInfo: this.state.errorInfo,
          onRetry: this.handleRetry,
          onBack: this.handleBack,
        });
      }

      // Get color configuration from shared utility
      const colors = getColorConfig(accentColor);

      // Default fallback UI
      return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-4 z-50">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className={`absolute top-1/4 left-1/4 w-64 h-64 ${colors.bg} rounded-full blur-[100px] animate-pulse`}
              style={{ animationDelay: '0s' }}
            />
            <div
              className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] animate-pulse`}
              style={{ animationDelay: '1s' }}
            />
          </div>

          {/* Error content */}
          <div className="relative z-10 glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 text-center">
            {/* Error icon */}
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full ${colors.bg} ${colors.borderAccent} border flex items-center justify-center`}
            >
              <IoWarning className={`text-3xl ${colors.text}`} />
            </div>

            {/* Title */}
            <h2
              className={`text-2xl sm:text-3xl font-black ${colors.text} mb-2`}
              style={{ fontFamily: '"Raleway", sans-serif' }}
            >
              Oops! Something went wrong
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              {gameName} encountered an unexpected error. Don&apos;t worry, your progress should be
              saved.
            </p>

            {/* Error details (optional, for debugging) */}
            {showErrorDetails && error && (
              <div
                className={`mb-6 p-3 rounded-lg ${colors.bg} ${colors.borderAccent} border text-left`}
              >
                <p className="text-xs text-gray-500 font-mono break-all">{error.toString()}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className={`flex-1 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-semibold hover:brightness-110 active:brightness-90 transition-all shadow-lg ${colors.primaryShadow} flex items-center justify-center gap-2`}
              >
                <IoRefresh className="text-lg" />
                Try Again
              </button>

              {this.props.onBack && (
                <button
                  onClick={this.handleBack}
                  className="flex-1 px-6 py-3 glass-button text-gray-300 rounded-xl font-semibold hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center gap-2"
                >
                  <IoArrowBack className="text-lg" />
                  Back to Menu
                </button>
              )}
            </div>
          </div>

          {/* Footer hint */}
          <p className="relative z-10 text-gray-600 text-xs mt-6 text-center max-w-md">
            If this keeps happening, try refreshing the page or clearing your browser cache.
          </p>
        </div>
      );
    }

    // No error, render children normally
    return children;
  }
}

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

export default GameErrorBoundary;
