import { Component } from 'react'
import { connect } from 'react-redux'
import { oneOfType, node, oneOf } from 'prop-types'
import Router from 'next/router'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE } from '../customPropTypes'

export class RequireWallet extends Component {
  componentDidMount() {
    if (!this.props.wallet.address) {
      const route = Router.query.network
        ? `/onboard?network=${Router.query.network}`
        : `/onboard?network=${this.props.network}`
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
  network: oneOf(['f', 't']).isRequired
}

const noWallet = {
  address: '',
  balance: new FilecoinNumber('0', 'fil'),
  path: []
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
