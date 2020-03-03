import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import {
  Box,
  Card,
  Button,
  Title,
  Text,
  Label,
  AccountError,
  Loading,
  ButtonClose
} from '../Shared'
import AccountCardAlt from '../Shared/AccountCardAlt'
import { WALLET_PROP_TYPE } from '../../customPropTypes'
import { useWalletProvider } from '../../WalletProvider'
import { ACCOUNT_BATCH_SIZE, LEDGER } from '../../constants'
import { walletList, switchWallet } from '../../store/actions'
import sortAndRemoveWalletDups from '../../utils/sortAndRemoveWalletDups'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../utils/ledger/reportLedgerConfigError'
import makeFriendlyBalance from '../../utils/makeFriendlyBalance'

const FloatingContainer = styled(Box)`
  position: fixed;
  display: flex;
  flex-grow: 1;
  bottom: ${props => props.theme.sizes[3]}px;
  width: 100%;
  max-width: 560px;
`

const Close = styled(ButtonClose)`
  position: absolute;
  top: ${props => props.theme.sizes[3]}px;
  right: ${props => props.theme.sizes[3]}px;
`

const AccountSelector = ({ wallet }) => {
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [uncaughtError, setUncaughtError] = useState(null)
  const dispatch = useDispatch()
  const { walletsInRdx, network } = useSelector(state => ({
    network: state.network,
    walletsInRdx: state.wallets
  }))
  const {
    ledger,
    connectLedger,
    walletProvider,
    walletType
  } = useWalletProvider()
  const router = useRouter()
  const params = new URLSearchParams(router.query)
  const page = Number(params.get('page'))

  const paginate = nextPage => {
    const newSearchParams = new URLSearchParams(router.query)
    newSearchParams.delete('page')
    newSearchParams.set('page', nextPage)
    router.push(`/wallet/accounts?${newSearchParams.toString()}`)
  }

  const onClose = () => {
    const newSearchParams = new URLSearchParams(router.query)
    newSearchParams.delete('page')
    const hasParams = Array.from(newSearchParams).length > 0
    const query = hasParams
      ? `/wallet?${newSearchParams.toString()}`
      : '/wallet'
    router.push(query)
    router.push(`/wallet?${newSearchParams.toString()}`)
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoadingAccounts(true)
      try {
        let provider = walletProvider
        if (walletType === LEDGER) {
          provider = await connectLedger()
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
        setUncaughtError(err)
      }
      setLoadingAccounts(false)
    }

    // checks to see if the wallets already exists in redux
    const needToFetch = () => {
      const matchCount = walletsInRdx.reduce((matches, w) => {
        const walletDerivationIndex = w.path[4]
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
    if (needToFetch() && !loadingAccounts && !ledger.userImportFailure) {
      fetchAccounts()
    }
  }, [
    connectLedger,
    dispatch,
    walletType,
    walletsInRdx,
    walletProvider,
    network,
    page,
    loadingAccounts,
    ledger.userImportFailure
  ])

  return (
    <>
      <Close onClick={onClose} />
      {loadingAccounts ? (
        <Box
          width='100%'
          display='flex'
          flexDirection='column'
          alignItems='center'
          mt={9}
        >
          <Loading width={3} height={3} />
          <Label mt={3}>Loading Accounts</Label>
        </Box>
      ) : (
        <Box display='flex' flexDirection='row'>
          <Box>
            {hasLedgerError(
              ledger.connectedFailure,
              ledger.locked,
              ledger.filecoinAppNotOpen,
              ledger.replug,
              ledger.busy,
              uncaughtError
            ) ? (
              <AccountError
                onTryAgain={() => {}}
                errorMsg={reportLedgerConfigError(
                  ledger.connectedFailure,
                  ledger.locked,
                  ledger.filecoinAppNotOpen,
                  ledger.replug,
                  ledger.busy,
                  uncaughtError
                )}
              />
            ) : (
              <Card
                display='flex'
                flexDirection='column'
                justifyContent='space-between'
                width={11}
                height={11}
                borderRadius={2}
                p={3}
              >
                <Title>Choose an account</Title>
              </Card>
            )}
          </Box>

          <Box flexGrow='2' justifyContent='center'>
            {walletsInRdx
              .filter(
                w =>
                  w.path[4] >= page * ACCOUNT_BATCH_SIZE &&
                  w.path[4] < page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE
              )
              .map((w, i) => (
                <AccountCardAlt
                  alignItems='center'
                  onClick={() => {
                    dispatch(switchWallet(page * ACCOUNT_BATCH_SIZE + i))
                    const newParams = new URLSearchParams(router.query)
                    const hasParams = Array.from(newParams).length > 0
                    const query = hasParams
                      ? `/wallet?${newParams.toString()}`
                      : '/wallet'
                    router.push(query)
                  }}
                  key={w.address}
                  address={w.address}
                  index={page * ACCOUNT_BATCH_SIZE + i}
                  selected={w.address === wallet.address}
                  balance={makeFriendlyBalance(w.balance)}
                />
              ))}
            <FloatingContainer
              bottom='8px'
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
              boxShadow={1}
              backgroundColor='core.white'
              border={1}
              borderColor='core.silver'
              borderRadius={2}
              p={3}
            >
              <Button
                onClick={() => paginate(page - 1)}
                disabled={page === 0 || loadingAccounts}
                variant='secondary'
                role='button'
                title='Prev'
              />
              <Text>Page {page + 1}</Text>
              <Button
                title='Next'
                onClick={() => paginate(page + 1)}
                role='button'
                variant='primary'
                disabled={loadingAccounts}
              />
            </FloatingContainer>
          </Box>
        </Box>
      )}
    </>
  )
}

AccountSelector.propTypes = {
  wallet: WALLET_PROP_TYPE
}

export default AccountSelector
