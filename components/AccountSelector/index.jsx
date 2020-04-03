import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import {
  Box,
  Box as Wrapper,
  Card,
  Glyph,
  Button,
  BaseButton as ButtonCard,
  Title,
  Text,
  Label,
  Menu,
  MenuItem,
  AccountError,
  Loading,
  ButtonClose,
  FloatingContainer
} from '../Shared'
import AccountCardAlt from '../Shared/AccountCardAlt'
import { useWalletProvider } from '../../WalletProvider'
import { ACCOUNT_BATCH_SIZE, LEDGER } from '../../constants'
import { walletList, switchWallet } from '../../store/actions'
import sortAndRemoveWalletDups from '../../utils/sortAndRemoveWalletDups'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../utils/ledger/reportLedgerConfigError'
import makeFriendlyBalance from '../../utils/makeFriendlyBalance'
import useWallet from '../../WalletProvider/useWallet'
import createPath from '../../utils/createPath'

const Close = styled(ButtonClose)`
  position: absolute;
  top: ${props => props.theme.sizes[3]}px;
  right: ${props => props.theme.sizes[3]}px;
`

const AccountSelector = () => {
  const wallet = useWallet()
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [uncaughtError, setUncaughtError] = useState(null)
  const dispatch = useDispatch()
  const { walletsInRdx, network } = useSelector(state => ({
    network: state.network,
    walletsInRdx: state.wallets
  }))
  const { ledger, connectLedger, walletProvider } = useWalletProvider()
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
        if (wallet.type === LEDGER) {
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
              const networkCode = network === 'f' ? 461 : 1
              return {
                balance,
                address,
                path: createPath(networkCode, page * ACCOUNT_BATCH_SIZE + i)
              }
            })
          )
          dispatch(walletList(wallets))
        }
      } catch (err) {
        setUncaughtError(err)
      }
      setLoadingAccounts(false)
    }

    // checks to see if the wallets already exists in redux
    const needToFetch = () => {
      const matchCount = walletsInRdx.reduce((matches, w) => {
        const walletDerivationIndex = w.path.split('/')[5]
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
    wallet.type,
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
        <Wrapper display='flex' flexDirection='column' justifyItems='center'>
          <Box
            display='flex'
            flexDirection='column'
            alignSelf='center'
            maxWidth={19}
            p={4}
          >
            {hasLedgerError({
              ...ledger,
              otherError: uncaughtError
            }) && (
              <AccountError
                onTryAgain={() => {}}
                errorMsg={reportLedgerConfigError({
                  ...ledger,
                  otherError: uncaughtError
                })}
              />
            )}

            <Menu m={2}>
              <MenuItem display='flex' alignItems='center' color='core.primary'>
                <Glyph
                  acronym='Sw'
                  bg='core.primary'
                  borderColor='core.primary'
                  color='core.white'
                />
                <Title ml={2}>Change & Create Accounts</Title>
              </MenuItem>
              <MenuItem>
                <Text>Switch to a different account, or create a new one.</Text>
              </MenuItem>
            </Menu>
            <Menu>
              <MenuItem display='flex' flexWrap='wrap'>
                {walletsInRdx
                  .filter(
                    w =>
                      w.path.split('/')[5] >= page * ACCOUNT_BATCH_SIZE &&
                      w.path.split('/')[5] <
                        page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE
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
                <ButtonCard
                  display='flex'
                  flexWrap='wrap'
                  alignContent='flex-start'
                  width={11}
                  height={11}
                  m={2}
                  bg='core.transparent'
                  borderColor='core.primary'
                  color='core.primary'
                  opacity='1'
                  cursor='pointer'
                >
                  <Menu>
                    <MenuItem display='flex' alignItems='center'>
                      <Glyph
                        acronym='Cr'
                        bg='core.transparent'
                        borderColor='core.primary'
                        color='core.primary'
                      />
                      <Title ml={2}>Create</Title>
                    </MenuItem>
                    <MenuItem>
                      <Text textAlign='left'>
                        Click here to create a new account.
                      </Text>
                    </MenuItem>
                  </Menu>
                </ButtonCard>
              </MenuItem>
            </Menu>
            <FloatingContainer>
              <Button
                border={0}
                borderRight={1}
                borderRadius={0}
                borderColor='core.lightgray'
                onClick={() => paginate(page - 1)}
                disabled={page === 0 || loadingAccounts}
                variant='secondary'
                role='button'
                title='Prev'
              />
              <Text m={0}>Page {page + 1}</Text>
              <Button
                border={0}
                borderRadius={0}
                title='Next'
                onClick={() => paginate(page + 1)}
                role='button'
                variant='primary'
                disabled={loadingAccounts}
              />
            </FloatingContainer>
          </Box>
        </Wrapper>
      )}
    </>
  )
}

export default AccountSelector
