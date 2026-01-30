import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1a1a',
            color: '#fff',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div>
            <h1 style={{ marginBottom: '1rem', color: '#FFB703' }}>Terjadi kesalahan</h1>
            <p style={{ marginBottom: '1.5rem' }}>Halaman tidak dapat dimuat. Silakan refresh.</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              style={{
                padding: '0.5rem 1.5rem',
                background: '#006783',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Coba lagi
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
