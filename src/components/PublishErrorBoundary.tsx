
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class PublishErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log in development or when console is available
    if (typeof window !== 'undefined' && window.console) {
      console.error('Publish Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Build-safe error fallback
      if (typeof window === 'undefined') {
        return null; // Return nothing during SSR/build
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-ice-white p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold text-slate-gray mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading the application. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-electric-indigo text-ice-white px-4 py-2 rounded hover:bg-electric-indigo/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PublishErrorBoundary;
