import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <div className="error-pizza">🍕</div>
                        <h1 className="error-title">Oops! Something went wrong</h1>
                        <p className="error-message">
                            Looks like our pizza oven is having some trouble.
                            Don't worry, we're working on fixing it!
                        </p>
                        <div className="error-actions">
                            <button
                                className="error-button primary"
                                onClick={() => window.location.reload()}
                            >
                                🔄 Try Again
                            </button>
                            <button
                                className="error-button secondary"
                                onClick={() => window.location.href = '/'}
                            >
                                🏠 Go Home
                            </button>
                        </div>
                        {import.meta.env.DEV && (
                            <details className="error-details">
                                <summary>🔧 Technical Details (Dev Mode)</summary>
                                <div className="error-stack">
                                    <div className="error-section">
                                        <h4>Error:</h4>
                                        <pre>{this.state.error?.toString()}</pre>
                                    </div>
                                    <div className="error-section">
                                        <h4>Component Stack:</h4>
                                        <pre>{this.state.errorInfo?.componentStack}</pre>
                                    </div>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;