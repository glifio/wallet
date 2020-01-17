import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { Checkbox, CheckboxInputLabel } from '../StyledComponents'

import { walletList, switchWallet } from '../../store/actions'

const ACCOUNT_BATCH_SIZE = 3

const AccountSelector = ({
  network,
  loadingAccounts,
  setLoadingAccounts,
  tabOpen
}) => {
  const {
    walletProvider,
    selectedWallet,
    selectedWalletIdx,
    selectedWalletDerivationIndex
  } = useSelector(state => ({
    walletProvider: state.walletProvider,
    selectedWallet: state.wallets[state.selectedWalletIdx],
    selectedWalletIdx: state.selectedWalletIdx,
    selectedWalletDerivationIndex:
      state.wallets[state.selectedWalletIdx].path[4]
  }))

  const dispatch = useDispatch()

  const [accounts, setAccounts] = useState([selectedWallet.address])

  const fetchAccounts = useCallback(async () => {
    setLoadingAccounts(true)
    const accounts = await walletProvider.wallet.getAccounts(
      selectedWalletDerivationIndex,
      selectedWalletDerivationIndex + ACCOUNT_BATCH_SIZE,
      network
    )
    const wallets = await Promise.all(
      accounts.map(async (address, i) => {
        const balance = await walletProvider.getBalance(address)
        const networkDerivationPath = network === 'f' ? 1 : 461
        return {
          balance,
          address,
          path: [44, networkDerivationPath, 5, 0, i]
        }
      })
    )
    dispatch(walletList(wallets))
    setAccounts(accounts)
    setLoadingAccounts(false)
  }, [
    walletProvider,
    setLoadingAccounts,
    setAccounts,
    network,
    dispatch,
    selectedWalletDerivationIndex
  ])

  useEffect(() => {
    if (tabOpen && !loadingAccounts && accounts.length < ACCOUNT_BATCH_SIZE)
      fetchAccounts()
  }, [loadingAccounts, tabOpen, accounts.length, fetchAccounts])

  return (
    <div>
      {loadingAccounts
        ? 'loading'
        : accounts.map((account, arrayIndex) => {
            return (
              <div key={account}>
                <Checkbox
                  onChange={() => dispatch(switchWallet(arrayIndex))}
                  type='checkbox'
                  name='account'
                  id='account'
                  checked={selectedWalletIdx === arrayIndex}
                />
                <CheckboxInputLabel htmlFor='account'>
                  {account}
                </CheckboxInputLabel>
              </div>
            )
          })}
      <button
        onClick={async () => {
          await fetchAccounts()
        }}
      >
        Next
      </button>
    </div>
  )
}

AccountSelector.propTypes = {
  network: PropTypes.string.isRequired,
  loadingAccounts: PropTypes.bool.isRequired,
  setLoadingAccounts: PropTypes.func.isRequired,
  tabOpen: PropTypes.bool.isRequired
}

export default AccountSelector
