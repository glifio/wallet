import { Component } from 'react'
import { connect } from 'react-redux'
import { oneOfType } from 'prop-types'
import Router from 'next/router'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import WalletView from '../components/Wallet'
import { NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE } from '../customPropTypes'

class Wallet extends Component {
  componentDidMount() {
    if (!this.props.wallet.address) Router.replace('/onboard')
  }

  render() {
    return (
      <>
        {this.props.wallet.address && <WalletView wallet={this.props.wallet} />}
      </>
    )
  }
}

Wallet.propTypes = {
  wallet: oneOfType([NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE])
}

const noWallet = {
  address: '',
  balance: new FilecoinNumber('0', 'fil'),
  path: []
}

Wallet.defaultProps = {
  wallet: noWallet
}

const mapStateToProps = state => {
  if (state.wallets.length === 0) return { wallet: noWallet }
  if (!state.wallets[state.selectedWalletIdx]) return { wallet: noWallet }
  return { wallet: state.wallets[state.selectedWalletIdx] }
}

export default connect(mapStateToProps)(Wallet)
