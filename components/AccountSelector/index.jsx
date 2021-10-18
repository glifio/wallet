import React, { useEffect, useState } from 'react'
import { bool } from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import {
  AccountCardAlt,
  Box,
  Card,
  Glyph,
  Title,
  Menu,
  MenuItem,
  LoadingScreen
} from '@glif/react-components'
import HelperText from './HelperText'
import Create from './Create'
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
import useWallet from '../../WalletProvider/useWallet'
import createPath from '../../utils/createPath'
import reportError from '../../utils/reportError'
import converAddrToFPrefix from '../../utils/convertAddrToFPrefix'

const AccountSelector = ({ msig, test }) => {
  const wallet = useWallet()
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)
  const [uncaughtError, setUncaughtError] = useState('')
  const dispatch = useDispatch()
  const { errorInRdx, walletsInRdx, network } = useSelector((state) => ({
    network: state.network,
    walletsInRdx: state.wallets,
    errorInRdx: state.error
  }))
  const { ledger, connectLedger, walletProvider } = useWalletProvider()
  const router = useRouter()

  const [loadedFirstFiveWallets, setLoadedFirstFiveWallets] = useState(false)

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
                const balance = await provider.getBalance(address)
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
    loadedFirstFiveWallets
  ])

  const onClose = () => {
    const searchParams = new URLSearchParams(router.query)
    let route = ''
    if (msig) route = `/vault/choose?${searchParams.toString()}`
    else route = `/home?${searchParams.toString()}`
    router.push(route)
  }

  let errorMsg = ''

  if (hasLedgerError({ ...ledger, otherError: uncaughtError })) {
    errorMsg = reportLedgerConfigError({ ...ledger, otherError: uncaughtError })
  } else if (errorInRdx) {
    errorMsg = errorInRdx.message || errorInRdx
  }

  const fetchNextAccount = async (index, network) => {
    setLoadingAccounts(true)
    try {
      let provider = walletProvider
      if (wallet.type === LEDGER) {
        provider = await connectLedger()
      }

      if (provider) {
        const [address] = await provider.wallet.getAccounts(
          network,
          index,
          index + 1
        )

        const balance = await provider.getBalance(address)
        const networkCode =
          network === MAINNET ? MAINNET_PATH_CODE : TESTNET_PATH_CODE
        const wallet = {
          balance,
          address: converAddrToFPrefix(address),
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
    <Box display='flex' flexDirection='column' justifyItems='center'>
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
          <Card
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            border='none'
            width='100%'
            my={2}
            maxWidth={16}
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
                {msig ? 'Select Account' : 'Switch Accounts'}
              </Title>
            </Box>
            <Box mt={3}>
              <HelperText
                color='core.nearblack'
                msig={msig}
                isLedger={wallet.type === LEDGER}
              />
            </Box>
          </Card>
          <Menu>
            <Box display='flex' flexWrap='wrap' justifyContent='center'>
              {walletsInRdx.map((w, i) => (
                <MenuItem key={w.address}>
                  <AccountCardAlt
                    alignItems='center'
                    onClick={() => dispatch(switchWallet(i), onClose())}
                    address={w.address}
                    index={i}
                    selected={false}
                    // This is a hack to make testing the UI easier
                    // its hard to mock SWR + balance fetcher in the AccountCardAlt
                    // so we pass a manual balance to not rely on SWR for testing
                    balance={test ? '1' : null}
                  />
                </MenuItem>
              ))}
              <MenuItem>
                <Create
                  errorMsg={errorMsg}
                  nextAccountIndex={walletsInRdx.length}
                  onClick={fetchNextAccount}
                  loading={loadingAccounts}
                  mb={2}
                />
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      )}
    </Box>
  )
}

AccountSelector.propTypes = {
  msig: bool
}

AccountSelector.defaultProps = {
  msig: false
}

export default AccountSelector
