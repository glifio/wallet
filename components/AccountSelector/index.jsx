import React, { useState } from 'react'
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
  StyledATag
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
  const { errorInRdx, walletsInRdx, network } = useSelector(state => ({
    network: state.network,
    walletsInRdx: state.wallets,
    errorInRdx: state.error
  }))
  const { ledger, connectLedger, walletProvider } = useWalletProvider()
  const router = useRouter()
  const params = new URLSearchParams(router.query)
  const page = Number(params.get('page'))

  const onClose = () => {
    const newSearchParams = new URLSearchParams(router.query)
    newSearchParams.delete('page')
    router.push(`/wallet?${newSearchParams.toString()}`)
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
          walletsInRdx.length,
          walletsInRdx.length + 1,
          network
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
      setUncaughtError(err)
    }
    setLoadingAccounts(false)
  }

  return (
    <>
      <Close onClick={onClose} />
      <Wrapper display='flex' flexDirection='column' justifyItems='center'>
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
              <Title ml={2}>Switch Accounts</Title>
            </MenuItem>
            <MenuItem>
              <Text>
                Your single seed phrase creates hundreds of individual
                &quot;accounts&quot;.
                <br />
                <StyledATag rel='noopener' target='_blank' href='/faqs'>
                  Don&rsquo;t see an account you were previously using?
                </StyledATag>
              </Text>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem display='flex' flexWrap='wrap'>
              {walletsInRdx.map((w, i) => (
                <AccountCardAlt
                  alignItems='center'
                  onClick={() => dispatch(switchWallet(i))}
                  key={w.address}
                  address={w.address}
                  index={i}
                  selected={w.address === wallet.address}
                  balance={makeFriendlyBalance(w.balance)}
                />
              ))}
              <Create
                errorMsg={errorMsg}
                nextAccountIndex={walletsInRdx.length}
                onClick={fetchNextAccount}
                loading={loadingAccounts}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Wrapper>
    </>
  )
}

export default AccountSelector
