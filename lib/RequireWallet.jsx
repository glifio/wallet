import { Component } from 'react'
import { connect } from 'react-redux'
import { oneOfType, node, oneOf } from 'prop-types'
import Router from 'next/router'
import { noWallet } from '../store/states'

import { NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE } from '../customPropTypes'
import { MAINNET, TESTNET } from '../constants'

// Gatekeep pages that require a wallet (like the home screen)
export class RequireWallet extends Component {
  componentDidMount() {
    if (!this.props.wallet.address) {
      const route = Router.query.network
        ? `/?network=${Router.query.network}`
        : `/?network=${this.props.network}`
      Router.replace(route)
    }
  }

  componentDidUpdate() {
    if (!this.props.wallet.address) {
      const route = Router.query.network
        ? `/?network=${Router.query.network}`
        : `/?network=${this.props.network}`
      Router.replace(route)
    }
  }

  render() {
    return <>{this.props.wallet.address && this.props.children}</>
  }
}

RequireWallet.propTypes = {
  wallet: oneOfType([NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE]),
  children: node.isRequired,
  network: oneOf([MAINNET, TESTNET]).isRequired
}

RequireWallet.defaultProps = {
  wallet: noWallet
}

const mapStateToProps = state => {
  if (state.wallets.length === 0)
    return { wallet: noWallet, network: state.network }
  if (!state.wallets[state.selectedWalletIdx])
    return { wallet: noWallet, network: state.network }
  return {
    wallet: state.wallets[state.selectedWalletIdx],
    network: state.network
  }
}

export default connect(mapStateToProps)(RequireWallet)
