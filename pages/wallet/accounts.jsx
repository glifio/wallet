import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { AccountSelector } from '../../components'
import { NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE } from '../../customPropTypes'

class Accounts extends Component {
  componentDidMount() {
    if (!this.props.wallet.address) Router.replace('/onboard')
  }

  render() {
    return (
      <>
        {this.props.wallet.address && (
          <AccountSelector wallet={this.props.wallet} />
        )}
      </>
    )
  }
}

Accounts.propTypes = {
  wallet: PropTypes.oneOfType([NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE])
}

const noWallet = {
  address: '',
  balance: new FilecoinNumber('0', 'fil'),
  path: []
}

Accounts.defaultProps = {
  wallet: noWallet
}

const mapStateToProps = state => {
  if (state.wallets.length === 0) return { wallet: noWallet }
  if (!state.wallets[state.selectedWalletIdx]) return { wallet: noWallet }
  return { wallet: state.wallets[state.selectedWalletIdx] }
}

export default connect(mapStateToProps)(Accounts)
