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

    if (!pathname.includes('error')) {
      if (!query.network) {
        const network = process.env.IS_PROD ? MAINNET : TESTNET
        const params = new URLSearchParams({ ...query, network })
        Router.replace(`${pathname}?${params.toString()}`)
        switchNetwork(network)
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

  render() {
    return null
  }
}

function mapState(state) {
  return {
    networkFromRdx: state.network,
    wallets: state.wallets
  }
}

NetworkCheck.propTypes = {
  query: PropTypes.object,
  switchNetwork: PropTypes.func.isRequired,
  networkFromRdx: PropTypes.oneOf([MAINNET, TESTNET]),
  pathname: PropTypes.string.isRequired
}

NetworkCheck.defaultProps = {
  query: {}
}

export const NetworkChecker = connect(mapState, { switchNetwork })(NetworkCheck)
