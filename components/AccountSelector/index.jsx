import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Box, Card, Text, Title } from '../Shared'
import AccountCardAlt from '../Shared/AccountCardAlt'
import { WALLET_PROP_TYPE } from '../../customPropTypes'
import { useWalletProvider } from '../../WalletProvider'
import { ACCOUNT_BATCH_SIZE, LEDGER } from '../../constants'
import { error, walletList } from '../../store/actions'
import sortAndRemoveWalletDups from '../../utils/sortAndRemoveWalletDups'

const AccountSelector = ({ wallet }) => {
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const dispatch = useDispatch()
  const { walletsInRdx, network } = useSelector(state => ({
    network: state.network,
    walletsInRdx: state.wallets
  }))
  const { connectLedger, walletProvider, walletType } = useWalletProvider()
  const router = useRouter()
  const params = new URLSearchParams(router.query)
  const page = Number(params.get('page'))

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
        dispatchEvent(error(err))
      }
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
    if (needToFetch() && !loadingAccounts) fetchAccounts()
  }, [
    connectLedger,
    dispatch,
    walletType,
    walletsInRdx,
    walletProvider,
    network,
    page,
    loadingAccounts
  ])

  return (
    <Box display='flex' flexDirection='row'>
      <Box>
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
      </Box>
      <Box>
        {walletsInRdx
          .filter(
            w =>
              w.path[4] >= page * ACCOUNT_BATCH_SIZE &&
              w.path[4] < page * ACCOUNT_BATCH_SIZE + ACCOUNT_BATCH_SIZE
          )
          .map((w, arrayIndex) => (
            <AccountCardAlt address={w.address} index={arrayIndex} />
          ))}
      </Box>
    </Box>
  )
}

AccountSelector.propTypes = {
  wallet: WALLET_PROP_TYPE
}

export default AccountSelector
