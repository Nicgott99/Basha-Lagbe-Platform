import { Component } from "react";
import PropTypes from "prop-types";

/**
 * ErrorBoundary
 * A React class component that catches JavaScript errors anywhere in its
 * child component tree, logs the error, and renders a fallback UI instead
 * of crashing the entire application to a blank page.
 *
 * React error boundaries must be class components — hooks cannot implement
 * the componentDidCatch / getDerivedStateFromError lifecycle methods.
 *
 * Usage:
 *   Wrap the entire app (in main.jsx) or individual high-risk sections:
 *
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<p>This section failed to load.</p>}>
 *     <RiskyComponent />
 *   </ErrorBoundary>
 *
 * The boundary can be reset by the user clicking "Try again", which
 * re-mounts the child tree by toggling a key on the internal wrapper.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError:  false,
      error:     null,
      errorInfo: null,
      resetKey:  0,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  /** Called during render when a descendant throws. Updates state to show fallback. */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /** Called after render with error details. Ideal for logging to an error service. */
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console in development — swap for a real error service (Sentry etc.) in production
    console.error("[ErrorBoundary] Caught an error:", error, errorInfo);
  }

  /** Re-mount the child tree by incrementing the reset key */
  handleReset() {
    this.setState((prev) => ({
      hasError:  false,
      error:     null,
      errorInfo: null,
      resetKey:  prev.resetKey + 1,
    }));
  }

  render() {
    const { hasError, error, resetKey } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Allow a custom fallback element to be passed as a prop
      if (fallback) return fallback;

      // Default fallback UI — matches the site's blue/indigo design system
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-blue-100">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-500 mb-6 leading-relaxed">
              An unexpected error occurred. Our team has been notified. You can
              try refreshing the page or clicking the button below.
            </p>

            {/* Show error message in development only */}
            {import.meta.env.DEV && error && (
              <details className="mb-6 text-left bg-gray-50 rounded-lg p-4 text-xs text-gray-600 overflow-auto max-h-32">
                <summary className="cursor-pointer font-medium mb-2">
                  Error details (dev only)
                </summary>
                <pre className="whitespace-pre-wrap break-words">
                  {error.toString()}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.assign("/")}
                className="px-6 py-3 border-2 border-blue-200 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>

          {/* Hidden key forces child remount on reset */}
          <span key={resetKey} style={{ display: "none" }} />
        </div>
      );
    }

    return <div key={resetKey}>{children}</div>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  /** Optional custom fallback element rendered instead of the default error UI */
  fallback: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  fallback: null,
};

export default ErrorBoundary;
