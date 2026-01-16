import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Check if this is the known React DOM reconciliation error
    if (error.message.includes('insertBefore') ||
        error.message.includes('removeChild') ||
        error.message.includes('not a child of this node')) {
      // This is likely caused by browser extensions modifying the DOM
      // Attempt to recover by resetting error state
      console.warn('DOM reconciliation error detected. This is often caused by browser extensions.');

      // Auto-recover after a brief delay
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      // Show fallback UI or default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-md text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Algo deu errado
            </h2>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Recarregar Página
            </button>
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 text-left text-xs text-gray-500 bg-gray-100 p-3 rounded overflow-auto">
                <p className="font-mono">{this.state.error.message}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
