import { Component } from 'react'
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import { switchNetwork } from '../store/actions'

class NetworkChecker extends Component {
  componentDidMount() {
    const { query, pathname, networkFromRdx, switchNetworkInRdx } = this.props
    if (!query.network) {
      const params = new URLSearchParams({ ...query, network: 't' })
      Router.replace(`${pathname}?${params.toString()}`)
      switchNetworkInRdx('t')
    } else if (networkFromRdx !== query.network) {
      const params = new URLSearchParams(query)
      Router.replace(`${pathname}?${params.toString()}`)
      switchNetworkInRdx(query.network)
    }
  }

  componentDidUpdate() {
    if (this.props.router.query.network !== this.props.networkFromRdx) {
      this.props.switchNetworkInRdx(this.props.router.query.network)
    }
  }

  render() {
    return null
  }
}

const mapState = state => ({
  networkFromRdx: state.network
})

const mapDispatch = { switchNetworkInRdx: switchNetwork }

NetworkChecker.propTypes = {
  query: PropTypes.object,
  switchNetworkInRdx: PropTypes.func.isRequired,
  networkFromRdx: PropTypes.oneOf(['f', 't']),
  pathname: PropTypes.string.isRequired,
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired
  })
}

NetworkChecker.defaultProps = {
  query: {}
}

export default withRouter(connect(mapState, mapDispatch)(NetworkChecker))
