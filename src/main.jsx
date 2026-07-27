import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AuraResto OS Render Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#ef4444', backgroundColor: '#090d16', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>⚠️ AuraResto OS Render Error</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>{this.state.error?.toString()}</p>
          <pre style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', color: '#f8fafc', overflow: 'auto', fontSize: '12px' }}>
            {this.state.errorInfo?.componentStack || this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
