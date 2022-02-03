import React from 'react'
import { ErrorView } from '@glif/react-components'
import { errorLogger } from '../logger'

interface ErrorState {
  hasError: boolean
}

// This component catches all uncaught react and syncronous JS errors
// and forwards the user to an error page + sends us the error report
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false } as ErrorState
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    errorLogger.error(
      error instanceof Error ? error.message : JSON.stringify(error),
      errorInfo,
      'ErrorBoundary'
    )
  }

  render() {
    if ((this.state as ErrorState).hasError) {
      return (
        <ErrorView
          title='Glif is currently down'
          description="We've been notified of the outage and expect to be back up and running again shortly."
        />
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
