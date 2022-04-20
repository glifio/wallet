import React, { ReactNode } from 'react'
import { ErrorView, OneColumnCentered } from '@glif/react-components'
import { logger } from '../logger'
import WalletPage from './WalletPage'

interface ErrorState {
  hasError: boolean
}

// This component catches all uncaught react and syncronous JS errors
// and forwards the user to an error page + sends us the error report
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false } as ErrorState
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    logger.error(
      'ErrorBoundary',
      error instanceof Error ? error.message : JSON.stringify(error),
      errorInfo
    )
  }

  render() {
    if ((this.state as ErrorState).hasError) {
      return (
        <WalletPage>
          <OneColumnCentered>
            <ErrorView
              title='Glif is currently down'
              description="We've been notified of the outage and expect to be back up and running again shortly."
            />
          </OneColumnCentered>
        </WalletPage>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
