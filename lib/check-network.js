import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { switchNetwork } from '../store/actions'
import { MAINNET, TESTNET } from '../constants'

export class NetworkCheck extends Component {
  // here we make sure the network in the URL bar and the network in redux match
  componentDidMount() {
    const { query, pathname, networkFromRdx, switchNetwork } = this.props

    // only let investors use mainnet addresses
    if (pathname.includes('vault')) {
      const params = new URLSearchParams({ ...query, network: MAINNET })
      Router.replace(`${pathname}?${params.toString()}`)
      switchNetwork(MAINNET)
      return
    }

    if (!pathname.includes('error')) {
      if (!query.network) {
        const params = new URLSearchParams({ ...query, network: TESTNET })
        Router.replace(`${pathname}?${params.toString()}`)
        switchNetwork(MAINNET)
      } else if (
        networkFromRdx !== query.network &&
        (query.network === MAINNET || query.network === TESTNET)
      ) {
        const params = new URLSearchParams(query)
        Router.replace(`${pathname}?${params.toString()}`)
        switchNetwork(query.network)
      }
    }
  }

  // keep the network in redux and the network in the URL bar in sync
  async componentDidUpdate() {
    const { pathname, query, networkFromRdx, switchNetwork } = this.props
    const urlBarDiffFromRdx = query.network !== networkFromRdx
    const hasValidNetworkQueryParams =
      query.network === MAINNET || query.network === TESTNET
    if (urlBarDiffFromRdx && hasValidNetworkQueryParams) {
      switchNetwork(query.network)
    } else if (!query.network) {
      const params = new URLSearchParams({ ...query, network: networkFromRdx })
      Router.replace(`${pathname}?${params.toString()}`)
    }
  }

  render() {
    return null
  }
}

const mapState = state => ({
  networkFromRdx: state.network,
  wallets: state.wallets
})

NetworkCheck.propTypes = {
  query: PropTypes.object,
  switchNetwork: PropTypes.func.isRequired,
  networkFromRdx: PropTypes.oneOf([MAINNET, TESTNET]),
  pathname: PropTypes.string.isRequired
}

NetworkCheck.defaultProps = {
  query: {}
}

export default connect(mapState, { switchNetwork })(NetworkCheck)
