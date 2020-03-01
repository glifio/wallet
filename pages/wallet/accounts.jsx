import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { AccountSelector } from '../../components'
import { NO_WALLET_PROP_TYPE, WALLET_PROP_TYPE } from '../../customPropTypes'

class Accounts extends Component {
  componentDidMount() {
    if (Router.query.network)
      if (!this.props.wallet.address) {
        const route = Router.query.network
          ? `/onboard?network=${Router.query.network}`
          : '/onboard'
        Router.replace(route)
      }
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
