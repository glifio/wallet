import React from 'react'
import PropTypes from 'prop-types'
import { ErrorView } from '@glif/react-components'
import reportError from '../utils/reportError'

// This component catches all uncaught react and syncronous JS errors
// and forwards the user to an error page + sends us the error report
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    reportError(19, false, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorView
          title='Glif is currently down'
          description="We're aware of the outage and will be back up shortly. Please email squad@infinitescroll.org with any questions or concerns."
        />
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default ErrorBoundary
