import React from 'react'
import PropTypes from 'prop-types'
import reportError from '../utils/reportError'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    reportError(19, true, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default ErrorBoundary
