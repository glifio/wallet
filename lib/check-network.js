import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { switchNetwork } from '../store/actions'
import { WalletProviderContext } from '../WalletProvider'
import { WALLET_PROP_TYPE } from '../customPropTypes'
import reportError from '../utils/reportError'
import { MAINNET, TESTNET } from '../constants'

export class NetworkCheck extends Component {
  // here we make sure the network in the URL bar and the network in redux match
  componentDidMount() {
    const { query, pathname, networkFromRdx, switchNetwork } = this.props

    // only let investors use mainnet addresses
    if (pathname.includes('saft')) {
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
      pathname.includes('saft') &&
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

    let adjustedWallets = []
    if (wallets.length > 0 && this.context.state.walletProvider) {
      adjustedWallets = await Promise.all(
        wallets.map(async w => {
          const address = `${network}${w.address.slice(1)}`
          try {
            const balance = await this.context.state.walletProvider.getBalance(
              address
            )
            return {
              ...w,
              address,
              balance
            }
          } catch (err) {
            reportError(1, true, err.message, err.stack)
            return { ...w, address, balance: new FilecoinNumber('0', 'fil') }
          }
        })
      )
    }
    switchNetwork(network, adjustedWallets)
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
