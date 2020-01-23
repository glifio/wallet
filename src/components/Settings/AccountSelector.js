import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import 'styled-components/macro'

import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'

import {
  JustifyContentContainer,
  ButtonBase,
  Checkbox,
  CheckboxInputLabel,
  BASE_SIZE_UNIT,
  TEXT_XSM,
  UnderlineOnHover
} from '../StyledComponents'

import { walletList, switchWallet, error } from '../../store/actions'
import sortAndRemoveWalletDups from './sortAndRemoveWalletDups'
import { ACCOUNT_BATCH_SIZE } from '../../constants'
import {
  fetchProvider,
  reducer,
  initialLedgerState,
  RESET_STATE
} from '../../utils/ledger'
import { LEDGER } from '../../constants'

const ButtonContainer = styled(JustifyContentContainer)`
  justify-self: flex-end;
  margin-bottom: ${BASE_SIZE_UNIT * 6}px;
`

const SettingsContainer = styled(JustifyContentContainer)`
  height: ${BASE_SIZE_UNIT * 70}px;
  margin-top: ${BASE_SIZE_UNIT * 6}px;
`

const LineItem = styled(JustifyContentContainer)`
  height: ${BASE_SIZE_UNIT * 10}px;
  background-color: ${props => (props.even ? 'white' : 'aliceblue')};
  padding: 0 ${BASE_SIZE_UNIT * 2}px 0 ${BASE_SIZE_UNIT * 2}px;
  align-items: center;
`

const Text = styled.p`
  font-weight: bold;
  font-size: ${TEXT_XSM}px;
`

const LoadingText = styled(Text)`
  line-height: 20;
`

const AccountSelector = ({
  network,
  loadingAccounts,
  setLoadingAccounts,
  tabOpen
}) => {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const page = Number(params.get('page'))
  const history = useHistory()
  const {
    walletProvider,
    selectedWallet,
    walletsInRdx,
    walletType
  } = useSelector(state => ({
    walletProvider: state.walletProvider,
    selectedWallet: state.wallets[state.selectedWalletIdx],
    walletsInRdx: state.wallets,
    walletType: state.walletType
  }))

  const dispatch = useDispatch()

  const [ledgerState, dispatchLocal] = useReducer(reducer, initialLedgerState)

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoadingAccounts(true)
      try {
        let provider = walletProvider
        if (walletType === LEDGER) {
          provider = await fetchProvider(dispatchLocal, dispatch)
        }
        if (provider) {
          const accounts = await provider.wallet.getAccounts(
            page * ACCOUNT_BATCH_SIZE,
            page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE,
            network
          )

          const wallets = await Promise.all(
            accounts.map(async (address, i) => {
              const balance = await provider.getBalance(address)
              const networkDerivationPath = network === 'f' ? 461 : 1
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
          dispatch(walletList(sortAndRemoveWalletDups(walletsInRdx, wallets)))
        }
      } catch (err) {
        dispatch(error(err))
      }
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

    if (
      tabOpen &&
      !loadingAccounts &&
      !ledgerState.userImportFailure &&
      needToFetch()
    )
      fetchAccounts()
  }, [
    loadingAccounts,
    ledgerState.userImportFailure,
    tabOpen,
    walletsInRdx.length,
    dispatch,
    network,
    page,
    setLoadingAccounts,
    walletProvider,
    walletsInRdx,
    walletType
  ])

  const paginate = page => {
    const params = new URLSearchParams(search)
    params.delete('page')
    params.set('page', page)
    history.push(`/settings/accounts?${params.toString()}`)
  }

  return (
    <SettingsContainer flexDirection='column' justifyContent='space-between'>
      <div>
        {ledgerState.userInitiatedImport && ledgerState.userImportFailure ? (
          <JustifyContentContainer flexDirection='row' justifyContent='center'>
            <JustifyContentContainer
              flexDirection='column'
              justifyContent='center'
              css={{ 'margin-top': '20%' }}
            >
              <Text>
                Is your Ledger plugged in, unlocked, and Filecoin app open?
              </Text>
              <UnderlineOnHover
                role='button'
                rel='noopener noreferrer'
                onClick={() => dispatchLocal({ type: RESET_STATE })}
              >
                Yes.
              </UnderlineOnHover>
            </JustifyContentContainer>
          </JustifyContentContainer>
        ) : loadingAccounts ? (
          <JustifyContentContainer flexDirection='row' justifyContent='center'>
            <LoadingText
              css={`
                line-height: 20;
              `}
            >
              Loading...
            </LoadingText>
          </JustifyContentContainer>
        ) : (
          walletsInRdx
            .filter(
              wallet =>
                wallet.path[4] >= page * ACCOUNT_BATCH_SIZE &&
                wallet.path[4] < page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE
            )
            .map((wallet, arrayIndex) => (
              <LineItem
                flexDirection='row'
                justifyContent='space-between'
                key={wallet.address}
                even={arrayIndex % 2}
              >
                <div>
                  <Checkbox
                    onChange={() =>
                      dispatch(
                        switchWallet(page * ACCOUNT_BATCH_SIZE + arrayIndex)
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

                <div>{wallet.balance.toString()}</div>
              </LineItem>
            ))
        )}
      </div>
      <ButtonContainer flexDirection='row' justifyContent='space-around'>
        <ButtonBase
          disabled={
            ledgerState.userImportFailure || loadingAccounts || page === 0
          }
          onClick={() => paginate(page - 1)}
        >
          Previous
        </ButtonBase>
        <ButtonBase
          disabled={ledgerState.userImportFailure || loadingAccounts}
          onClick={() => paginate(page + 1)}
        >
          Next
        </ButtonBase>
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
