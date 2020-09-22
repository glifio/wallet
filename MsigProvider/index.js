import { useEffect, useState } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'
import { useRouter } from 'next/router'
import { useWalletProvider } from '../WalletProvider'
import useWallet from '../WalletProvider/useWallet'
import reportError from '../utils/reportError'
import isAddressSigner from './isAddressSigner'
import isActorMsig from './isActorMsig'

const emptyActorState = {
  Address: '',
  Balance: new FilecoinNumber('0', 'fil'),
  AvailableBalance: new FilecoinNumber('0', 'fil'),
  loading: true,
  failed: false
}

// Taking a small shortcut here for now, this hook should only be called once per msig
export const useMsig = msigActorID => {
  const wallet = useWallet()
  const { walletProvider } = useWalletProvider()
  const [actorState, setActorState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchActorState = async () => {
      const lotus = new LotusRPCEngine({
        apiAddress: process.env.LOTUS_NODE_JSONRPC
      })
      try {
        const { Balance, State } = await lotus.request(
          'StateReadState',
          msigActorID,
          null
        )

        if (!isActorMsig(State)) {
          router.push('/error/not-a-multisig')
        }

        if (!(await isAddressSigner(lotus, wallet.address, State?.Signers))) {
          const params = new URLSearchParams(router.query)
          params.set('walletAddress', wallet.address)
          params.set('msigAddress', msigActorID)
          router.push(`/error/not-a-signer?${params.toString()}`)
        }

        const availableBalance = await lotus.request(
          'MsigGetAvailableBalance',
          msigActorID,
          null
        )
        const balance = new FilecoinNumber(Balance, 'attofil')

        const nextState = {
          Balance: balance,
          AvailableBalance: new FilecoinNumber(availableBalance, 'attofil'),
          ...State
        }
        setActorState(nextState)
      } catch (err) {
        reportError(22, true, err.message, err.stack)
      } finally {
        setLoading(false)
      }
    }
    if (!actorState && msigActorID) {
      setLoading(true)
      fetchActorState()
    }
  }, [
    actorState,
    msigActorID,
    setActorState,
    walletProvider,
    router,
    wallet.address
  ])
  if (!actorState) return emptyActorState
  return { Address: msigActorID, ...actorState, loading, failed }
}
