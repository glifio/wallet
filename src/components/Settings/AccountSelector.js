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
  const { walletProvider, selectedWallet, walletsInRdx } = useSelector(
    state => ({
      walletProvider: state.walletProvider,
      selectedWallet: state.wallets[state.selectedWalletIdx],
      walletsInRdx: state.wallets
    })
  )

  const dispatch = useDispatch()

  const [accounts, setAccounts] = useState([selectedWallet.address])

  const latestDerivationPathIdx = walletsInRdx[walletsInRdx.length - 1].path[4]

  const fetchAccounts = useCallback(async () => {
    setLoadingAccounts(true)
    // we have to handle pagination differently when its the first (0th) page vs all others
    const startDerivationPathIndex =
      latestDerivationPathIdx === 0 ? 0 : latestDerivationPathIdx + 1
    const endDerivationPathIndex =
      latestDerivationPathIdx === 0
        ? ACCOUNT_BATCH_SIZE
        : latestDerivationPathIdx + ACCOUNT_BATCH_SIZE + 1
    const accounts = await walletProvider.wallet.getAccounts(
      startDerivationPathIndex,
      endDerivationPathIndex,
      network
    )

    const wallets = await Promise.all(
      accounts.map(async (address, i) => {
        const balance = await walletProvider.getBalance(address)
        const networkDerivationPath = network === 'f' ? 1 : 461
        return {
          balance,
          address,
          path: [44, networkDerivationPath, 5, 0, startDerivationPathIndex + i]
        }
      })
    )
    // if this is the first pagination of accounts, don't duplicate any wallets in redux
    if (walletsInRdx.length === 1) dispatch(walletList(wallets))
    else dispatch(walletList([...walletsInRdx, ...wallets]))
    setAccounts(accounts)
    setLoadingAccounts(false)
  }, [
    walletProvider,
    setLoadingAccounts,
    setAccounts,
    network,
    dispatch,
    walletsInRdx,
    latestDerivationPathIdx
  ])

  const goBack = useCallback(() => {
    if (walletsInRdx.length === ACCOUNT_BATCH_SIZE) return
    const newWalletsInRdx = [...walletsInRdx].slice(
      0,
      walletsInRdx.length - ACCOUNT_BATCH_SIZE
    )
    const newAccountsInView = newWalletsInRdx
      .slice(
        newWalletsInRdx.length - ACCOUNT_BATCH_SIZE,
        newWalletsInRdx.length
      )
      .map(wallet => wallet.address)
    dispatch(walletList(newWalletsInRdx))
    setAccounts(newAccountsInView)
  }, [walletsInRdx, dispatch])

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
                  onChange={() =>
                    dispatch(
                      switchWallet(
                        walletsInRdx.length - ACCOUNT_BATCH_SIZE + arrayIndex
                      )
                    )
                  }
                  type='checkbox'
                  name={`account-${account}`}
                  id={`account-${account}`}
                  checked={selectedWallet.address === account}
                />
                <CheckboxInputLabel htmlFor={`account-${account}`}>
                  {account}
                </CheckboxInputLabel>
              </div>
            )
          })}
      <button
        disabled={walletsInRdx.length === ACCOUNT_BATCH_SIZE}
        onClick={goBack}
      >
        Back
      </button>
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
