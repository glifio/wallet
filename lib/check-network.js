import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { switchNetwork } from '../store/actions'
import { WalletProviderContext } from '../WalletProvider'
import { WALLET_PROP_TYPE } from '../customPropTypes'
import reportError from '../utils/reportError'
import createPath from '../utils/createPath'
import {
  MAINNET,
  TESTNET,
  MAINNET_PATH_CODE,
  TESTNET_PATH_CODE,
  SINGLE_KEY
} from '../constants'

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
        switchNetwork(TESTNET)
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
    const { pathname, query, networkFromRdx } = this.props
    const urlBarDiffFromRdx = query.network !== networkFromRdx
    const hasValidNetworkQueryParams =
      query.network === MAINNET || query.network === TESTNET

    if (
      pathname.includes('vault') &&
      urlBarDiffFromRdx &&
      !hasValidNetworkQueryParams
    ) {
      const params = new URLSearchParams({ ...query, network: MAINNET })
      Router.replace(`${pathname}?${params.toString()}`)
      switchNetwork(MAINNET)
      return
    }
    if (urlBarDiffFromRdx && hasValidNetworkQueryParams) {
      await this.switch(query.network)
    } else if (!query.network) {
      const params = new URLSearchParams({ ...query, network: networkFromRdx })
      Router.replace(`${pathname}?${params.toString()}`)
    }
  }

  // goes through all the wallets in state, switches their network prefix, and refetches their balance
  async switch(network) {
    const { switchNetwork, wallets } = this.props
    const { walletProvider } = this.context.state

    if (wallets.length > 0 && walletProvider) {
      try {
        // this is prone to ledger errors if the device falls asleep or gets disconnected
        const [address] = await walletProvider.wallet.getAccounts(network, 0, 1)
        const balance = await walletProvider.getBalance(address)

        const networkCode =
          network === MAINNET ? MAINNET_PATH_CODE : TESTNET_PATH_CODE

        let path = createPath(networkCode, 0)
        if (walletProvider.wallet.type === SINGLE_KEY) path = SINGLE_KEY

        const wallet = { address, balance, path }
        switchNetwork(network, [wallet])
      } catch (err) {
        reportError('lib/check-network:1', true, err.message, err.stack)
      }
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

const mapDispatch = { switchNetwork }

NetworkCheck.propTypes = {
  query: PropTypes.object,
  switchNetwork: PropTypes.func.isRequired,
  wallets: PropTypes.arrayOf(WALLET_PROP_TYPE),
  networkFromRdx: PropTypes.oneOf([MAINNET, TESTNET]),
  pathname: PropTypes.string.isRequired
}

NetworkCheck.defaultProps = {
  query: {}
}

NetworkCheck.contextType = WalletProviderContext

export default connect(mapState, mapDispatch)(NetworkCheck)
