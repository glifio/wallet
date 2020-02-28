import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { WALLET_PROP_TYPE } from '../../customPropTypes'

class AccountSelector extends Component {
  static getInitialProps({ query }) {
    return { query }
  }

  componentDidMount() {
    if (!this.props.wallet.address) Router.replace('/onboard')
  }

  render() {
    return <>{this.props.wallet.address && <div>Yo</div>}</>
  }
}

AccountSelector.propTypes = {
  wallet: PropTypes.oneOfType([WALLET_PROP_TYPE])
}

const noWallet = {
  address: '',
  balance: new FilecoinNumber('0', 'fil'),
  path: []
}

AccountSelector.defaultProps = {
  wallet: noWallet
}

const mapStateToProps = state => {
  if (state.wallets.length === 0) return { wallet: noWallet }
  if (!state.wallets[state.selectedWalletIdx]) return { wallet: noWallet }
  return { wallet: state.wallets[state.selectedWalletIdx] }
}

export default connect(mapStateToProps)(AccountSelector)
