import React, { useEffect, useState } from 'react'
import { bool } from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import {
  Box,
  Box as Wrapper,
  Glyph,
  Title,
  Text,
  Menu,
  MenuItem,
  ButtonClose,
  StyledATag,
  LoadingScreen
} from '../Shared'
import Create from './Create'
import AccountCardAlt from '../Shared/AccountCardAlt'
import { useWalletProvider } from '../../WalletProvider'
import { LEDGER } from '../../constants'
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

const AccountSelector = ({ investor, msig }) => {
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

  // automatically generate the first 5 wallets for the user to select from to avoid confusion for non tech folks
  useEffect(() => {
    const loadFirstFiveWallets = async () => {
      if (walletsInRdx.length < 1) {
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
              addresses.map(async address => {
                const balance = await provider.getBalance(address)
                const networkCode = network === 'f' ? 461 : 1
                const wallet = {
                  balance,
                  address,
                  path: createPath(networkCode, walletsInRdx.length)
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
    if (investor) route = `/investor/home?${searchParams.toString()}`
    else if (msig) route = `/msig/choose?${searchParams.toString()}`
    else route = `/home?${searchParams.toString()}`
    router.push(route)
  }

  let errorMsg = ''

  if (hasLedgerError({ ...ledger, otherError: uncaughtError })) {
    errorMsg = reportLedgerConfigError({ ...ledger, otherError: uncaughtError })
  } else if (errorInRdx) {
    errorMsg = errorInRdx
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

        const balance = await provider.getBalance(address)
        const networkCode = network === 'f' ? 461 : 1
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
      {!investor && <Close onClick={onClose} />}
      <Wrapper display='flex' flexDirection='column' justifyItems='center'>
        {loadingPage ? (
          <LoadingScreen height='100vh' />
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            alignSelf='center'
            maxWidth={19}
            p={4}
          >
            <Menu m={2}>
              <MenuItem display='flex' alignItems='center' color='core.primary'>
                <Glyph
                  acronym='Sw'
                  bg='core.primary'
                  borderColor='core.primary'
                  color='core.white'
                />
                <Title ml={2}>
                  {investor ? 'Select Account' : 'Switch Accounts'}
                </Title>
              </MenuItem>
              <MenuItem>
                {investor ? (
                  <Text>
                    Please select the Ledger account you wish to own and sign
                    for your multisig investor wallet.
                  </Text>
                ) : (
                  <Text>
                    Your single{' '}
                    {wallet.type === LEDGER ? 'Ledger Device ' : 'seed phrase'}{' '}
                    creates hundreds of individual &quot;accounts&quot;.
                    <br />
                    <StyledATag rel='noopener' target='_blank' href='/faqs'>
                      Don&rsquo;t see an account you were previously using?
                    </StyledATag>
                  </Text>
                )}
              </MenuItem>
            </Menu>
            <Menu>
              <MenuItem display='flex' flexWrap='wrap'>
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
  investor: bool,
  msig: bool
}

AccountSelector.defaultProps = {
  investor: false,
  msig: false
}

export default AccountSelector
