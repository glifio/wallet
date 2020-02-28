import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { switchNetwork } from '../store/actions'

class NetworkChecker extends Component {
  componentDidMount() {
    const { query, pathname, networkFromRdx, switchNetwork } = this.props
    if (!query.network) {
      const params = new URLSearchParams({ ...query, network: 'f' })
      Router.replace(`${pathname}?${params.toString()}`)
      switchNetwork('f')
    } else if (networkFromRdx !== query.network) {
      const params = new URLSearchParams(query)
      Router.replace(`${pathname}?${params.toString()}`)
      switchNetwork(query.network)
    }
  }

  render() {
    return null
  }
}

const mapState = state => ({
  networkFromRdx: state.network
})

const mapDispatch = { switchNetwork }

NetworkChecker.propTypes = {
  query: PropTypes.object,
  switchNetwork: PropTypes.func.isRequired,
  networkFromRdx: PropTypes.oneOf(['f', 't']),
  pathname: PropTypes.string.isRequired
}

NetworkChecker.defaultProps = {
  query: {}
}

export default connect(mapState, mapDispatch)(NetworkChecker)
