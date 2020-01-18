import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'

import { Checkbox, CheckboxInputLabel } from '../StyledComponents'
import { JustifyContentContainer, Button } from '../StyledComponents'

import { walletList, switchWallet } from '../../store/actions'

const ACCOUNT_BATCH_SIZE = 3

const ButtonContainer = styled(JustifyContentContainer)`
  justify-self: flex-end;
  margin-bottom: 30px;
`

const SettingsContainer = styled(JustifyContentContainer)`
  height: 350px;
`

const AccountSelector = ({
  network,
  loadingAccounts,
  setLoadingAccounts,
  tabOpen
}) => {
  const params = new URLSearchParams(useLocation().search)
  const page = Number(params.get('page'))
  const history = useHistory()
  const { walletProvider, selectedWallet, walletsInRdx } = useSelector(
    state => ({
      walletProvider: state.walletProvider,
      selectedWallet: state.wallets[state.selectedWalletIdx],
      walletsInRdx: state.wallets
    })
  )

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoadingAccounts(true)
      const accounts = await walletProvider.wallet.getAccounts(
        page * ACCOUNT_BATCH_SIZE,
        page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE,
        network
      )

      const wallets = await Promise.all(
        accounts.map(async (address, i) => {
          const balance = await walletProvider.getBalance(address)
          const networkDerivationPath = network === 'f' ? 1 : 461
          return {
            balance,
            address,
            path: [
              44,
              networkDerivationPath,
              5,
              0,
              page * ACCOUNT_BATCH_SIZE + i
            ]
          }
        })
      )
      // if this is the first pagination of accounts, don't duplicate any wallets in redux
      if (page === 0) dispatch(walletList(wallets))
      else dispatch(walletList([...walletsInRdx, ...wallets]))
      setLoadingAccounts(false)
    }

    // checks to see if the wallets already exists in redux
    const needToFetch = () => {
      const matchCount = walletsInRdx.reduce((matches, wallet) => {
        const walletDerivationIndex = wallet.path[4]
        const derivationIndexRange = [
          page * ACCOUNT_BATCH_SIZE,
          page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE
        ]
        const match =
          walletDerivationIndex >= derivationIndexRange[0] &&
          walletDerivationIndex <= derivationIndexRange[1]
        if (match) return matches + 1
        return matches
      }, 0)
      return matchCount < ACCOUNT_BATCH_SIZE
    }

    if (tabOpen && !loadingAccounts && needToFetch()) fetchAccounts()
  }, [
    loadingAccounts,
    tabOpen,
    walletsInRdx.length,
    dispatch,
    network,
    page,
    setLoadingAccounts,
    walletProvider,
    walletsInRdx
  ])

  return (
    <SettingsContainer flexDirection='column' justifyContent='space-between'>
      <div>
        {loadingAccounts
          ? 'loading'
          : walletsInRdx
              .slice(
                page * ACCOUNT_BATCH_SIZE,
                page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE
              )
              .map((wallet, arrayIndex) => {
                return (
                  <div key={wallet.address}>
                    <Checkbox
                      onChange={() =>
                        dispatch(
                          switchWallet(
                            walletsInRdx.length -
                              ACCOUNT_BATCH_SIZE +
                              arrayIndex
                          )
                        )
                      }
                      type='checkbox'
                      name={`account-${wallet.address}`}
                      id={`account-${wallet.address}`}
                      checked={selectedWallet.address === wallet.address}
                    />
                    <CheckboxInputLabel htmlFor={`account-${wallet.address}`}>
                      {wallet.address}
                    </CheckboxInputLabel>
                  </div>
                )
              })}
      </div>
      <ButtonContainer flexDirection='row' justifyContent='space-around'>
        <Button
          disabled={loadingAccounts || page === 0}
          onClick={() => history.push(`/settings/accounts?page=${page - 1}`)}
        >
          Back
        </Button>
        <Button
          disabled={loadingAccounts}
          onClick={() => history.push(`/settings/accounts?page=${page + 1}`)}
        >
          Next
        </Button>
      </ButtonContainer>
    </SettingsContainer>
  )
}

AccountSelector.propTypes = {
  network: PropTypes.string.isRequired,
  loadingAccounts: PropTypes.bool.isRequired,
  setLoadingAccounts: PropTypes.func.isRequired,
  tabOpen: PropTypes.bool.isRequired
}

export default AccountSelector
