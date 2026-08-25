import { Component, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-2xl w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Something went wrong</h2>
            <p className="text-stone-500 mb-6">
              An unexpected error occurred in the application. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="text-left bg-stone-100 p-4 rounded-xl overflow-auto text-sm text-stone-700 font-mono mb-6 max-h-[30vh]">
                <strong>{this.state.error.toString()}</strong>
                <br />
                {this.state.errorInfo?.componentStack}
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-8 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-stone-200"
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
