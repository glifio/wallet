import React from 'react'
import PropTypes from 'prop-types'
import reportError from '../utils/reportError'
import { ErrorView } from '../components/Shared'

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
          description="We're aware of the outage and will be back up shortly."
          linkDisplay='Follow @glifwallet for updates.'
          linkhref='https://twitter.com/'
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
