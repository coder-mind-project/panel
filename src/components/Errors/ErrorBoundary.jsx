import React, { Component } from 'react';

import Error from './Error';

class ErrorBoundary extends Component {
  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    const { children } = { ...this.props };
    const { error } = { ...this.state };

    return error ? <Error /> : children;
  }
}
export default ErrorBoundary;
