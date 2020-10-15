import React, { useCallback, useEffect, useState } from 'react'
import { bool } from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { FilecoinNumber } from '@glif/filecoin-number'
import {
  Box,
  Box as Wrapper,
  Card,
  Glyph,
  Title,
  Menu,
  MenuItem,
  ButtonClose,
  LoadingScreen
} from '../Shared'
import HelperText from './HelperText'
import Create from './Create'
import AccountCardAlt from '../Shared/AccountCardAlt'
import { useWalletProvider } from '../../WalletProvider'
import {
  LEDGER,
  MAINNET,
  MAINNET_PATH_CODE,
  TESTNET_PATH_CODE
} from '../../constants'
import { walletList, switchWallet } from '../../store/actions'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../utils/ledger/reportLedgerConfigError'
import makeFriendlyBalance from '../../utils/makeFriendlyBalance'
import useWallet from '../../WalletProvider/useWallet'
import createPath from '../../utils/createPath'
import reportError from '../../utils/reportError'

const Close = styled(ButtonClose)`
  position: absolute;
  top: ${props => props.theme.sizes[3]}px;
  right: ${props => props.theme.sizes[3]}px;
`

const AccountSelector = ({ premainnetInvestor, msig }) => {
  const wallet = useWallet()
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)
  const [uncaughtError, setUncaughtError] = useState('')
  const dispatch = useDispatch()
  const { errorInRdx, walletsInRdx, network } = useSelector(state => ({
    network: state.network,
    walletsInRdx: state.wallets,
    errorInRdx: state.error
  }))
  const { ledger, connectLedger, walletProvider } = useWalletProvider()
  const router = useRouter()

  const [loadedFirstFiveWallets, setLoadedFirstFiveWallets] = useState(false)

  const fetchBalance = useCallback(
    (address, provider) => {
      if (premainnetInvestor) return new FilecoinNumber(0, 'fil')
      return provider.getBalance(address)
    },
    [premainnetInvestor]
  )

  // automatically generate the first 5 wallets for the user to select from to avoid confusion for non tech folks
  useEffect(() => {
    const loadFirstFiveWallets = async () => {
      if (walletsInRdx.length < 5) {
        try {
          let provider = walletProvider
          if (wallet.type === LEDGER) {
            provider = await connectLedger()
          }

          if (provider) {
            const addresses = await provider.wallet.getAccounts(
              network,
              walletsInRdx.length,
              5
            )

            await Promise.all(
              addresses.map(async (address, i) => {
                const balance = await fetchBalance(address, provider)
                const networkCode =
                  network === MAINNET ? MAINNET_PATH_CODE : TESTNET_PATH_CODE
                const wallet = {
                  balance,
                  address,
                  path: createPath(
                    networkCode,
                    Number(i) + Number(walletsInRdx.length)
                  )
                }

                dispatch(walletList([wallet]))
              })
            )
            setLoadingPage(false)
          }
        } catch (err) {
          reportError(14, false, err.message, err.stack)
          setUncaughtError(err.message)
          setLoadingPage(false)
        }
      } else {
        setLoadedFirstFiveWallets(true)
        setLoadingPage(false)
      }
    }

    if (!loadedFirstFiveWallets) {
      setLoadedFirstFiveWallets(true)
      loadFirstFiveWallets()
    }
  }, [
    connectLedger,
    dispatch,
    network,
    wallet.type,
    walletProvider,
    walletsInRdx.length,
    loadedFirstFiveWallets,
    fetchBalance
  ])

  const onClose = () => {
    const searchParams = new URLSearchParams(router.query)
    let route = ''
    if (premainnetInvestor) route = `/vault/home?${searchParams.toString()}`
    else if (msig) route = `/msig/choose?${searchParams.toString()}`
    else route = `/home?${searchParams.toString()}`
    router.push(route)
  }

  let errorMsg = ''

  if (hasLedgerError({ ...ledger, otherError: uncaughtError })) {
    errorMsg = reportLedgerConfigError({ ...ledger, otherError: uncaughtError })
  } else if (errorInRdx) {
    errorMsg = errorInRdx.message || errorInRdx
  }

  const fetchNextAccount = async () => {
    setLoadingAccounts(true)
    try {
      let provider = walletProvider
      if (wallet.type === LEDGER) {
        provider = await connectLedger()
      }

      if (provider) {
        const [address] = await provider.wallet.getAccounts(
          network,
          walletsInRdx.length,
          walletsInRdx.length + 1
        )

        const balance = await fetchBalance(address, provider)
        const networkCode =
          network === MAINNET ? MAINNET_PATH_CODE : TESTNET_PATH_CODE
        const wallet = {
          balance,
          address,
          path: createPath(networkCode, walletsInRdx.length)
        }

        dispatch(walletList([wallet]))
      }
    } catch (err) {
      reportError(15, false, err.message, err.stack)
      setUncaughtError(err.message)
    }
    setLoadingAccounts(false)
  }

  return (
    <>
      {!premainnetInvestor && <Close onClick={onClose} />}
      <Wrapper display='flex' flexDirection='column' justifyItems='center'>
        {loadingPage ? (
          <LoadingScreen height='100vh' />
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            alignSelf='center'
            maxWidth={19}
            p={4}
          >
            <Menu
              display='flex'
              flexDirection='column'
              alignItems='center'
              textAlign='center'
              m={2}
              maxWidth={16}
            >
              <MenuItem
                display='flex'
                alignItems='center'
                color='core.nearblack'
              >
                <Card
                  display='flex'
                  flexDirection='column'
                  justifyContent='space-between'
                  border='none'
                  width='100%'
                  my={2}
                  backgroundColor='blue.muted700'
                >
                  <Box display='flex' alignItems='center'>
                    <Glyph
                      acronym='Ac'
                      bg='core.primary'
                      borderColor='core.primary'
                      color='core.white'
                    />
                    <Title ml={2} color='core.primary'>
                      {premainnetInvestor || msig
                        ? 'Select Account'
                        : 'Switch Accounts'}
                    </Title>
                  </Box>
                  <Box mt={3}>
                    <HelperText
                      color='core.nearblack'
                      premainnetInvestor={premainnetInvestor}
                      msig={msig}
                      isLedger={wallet.type === LEDGER}
                    />
                  </Box>
                </Card>
              </MenuItem>
            </Menu>
            <Menu>
              <MenuItem display='flex' flexWrap='wrap' justifyContent='center'>
                {walletsInRdx.map((w, i) => (
                  <AccountCardAlt
                    alignItems='center'
                    onClick={() => dispatch(switchWallet(i), onClose())}
                    key={w.address}
                    address={w.address}
                    index={i}
                    selected={false}
                    balance={makeFriendlyBalance(w.balance, 6)}
                  />
                ))}
                <Create
                  errorMsg={errorMsg}
                  nextAccountIndex={walletsInRdx.length}
                  onClick={fetchNextAccount}
                  loading={loadingAccounts}
                  mb={2}
                />
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Wrapper>
    </>
  )
}

AccountSelector.propTypes = {
  premainnetInvestor: bool,
  msig: bool
}

AccountSelector.defaultProps = {
  premainnetInvestor: false,
  msig: false
}

export default AccountSelector
