import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { switchNetwork } from '../store/actions'
import { WalletProviderContext } from '../WalletProvider'
import { WALLET_PROP_TYPE } from '../customPropTypes'
import reportError from '../utils/reportError'

export class NetworkCheck extends Component {
  // here we make sure the network in the URL bar and the network in redux match
  componentDidMount() {
    const { query, pathname, networkFromRdx, switchNetwork } = this.props

    // only let investors use mainnet addresses
    if (pathname.includes('investor')) {
      const params = new URLSearchParams({ ...query, network: 'f' })
      Router.replace(`${pathname}?${params.toString()}`)
      switchNetwork('f')
      return
    }

    if (!pathname.includes('error')) {
      if (!query.network) {
        const params = new URLSearchParams({ ...query, network: 't' })
        Router.replace(`${pathname}?${params.toString()}`)
        switchNetwork('t')
      } else if (
        networkFromRdx !== query.network &&
        (query.network === 'f' || query.network === 't')
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
    if (pathname.includes('investor')) {
      return
    }
    const urlBarDiffFromRdx = query.network !== networkFromRdx
    const hasValidNetworkQueryParams =
      query.network === 'f' || query.network === 't'

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
  networkFromRdx: PropTypes.oneOf(['f', 't']),
  pathname: PropTypes.string.isRequired
}

NetworkCheck.defaultProps = {
  query: {}
}

NetworkCheck.contextType = WalletProviderContext

export default connect(mapState, mapDispatch)(NetworkCheck)
