import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep a record of render crash in sessionStorage for diagnostics
    try {
      sessionStorage.setItem('sain_last_render_error', JSON.stringify({
        message: error?.message,
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
      }));
    } catch {}
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0c1a24',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#153243',
            border: '1px solid #1e455b',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '28px',
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px', color: '#ffffff' }}>
              SAIN Logistics - Application Notice
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px', lineHeight: '1.6' }}>
              An unexpected display issue occurred while initializing the view. Please click below to refresh and re-initialize.
            </p>
            {this.state.error?.message && (
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#f87171',
                marginBottom: '20px',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                textAlign: 'left',
              }}>
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                sessionStorage.removeItem('sain_admin_auth_status');
                window.location.reload();
              }}
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f172a',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Reload &amp; Re-initialize Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
