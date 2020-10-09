import { useCallback, useEffect, useState, useRef } from 'react'
import { FilecoinNumber } from '@glif/filecoin-number'
import { useRouter } from 'next/router'
import { useWalletProvider } from '../WalletProvider'
import useWallet from '../WalletProvider/useWallet'
import reportError from '../utils/reportError'
import { fetchMsigState, stateDiff } from '../utils/msig'

const emptyActorState = {
  Address: '',
  Balance: new FilecoinNumber('0', 'fil'),
  AvailableBalance: new FilecoinNumber('0', 'fil'),
  loading: true,
  Signers: [],
  PendingTxns: {}
}

// This hook should only be called once per msig
export const useMsig = msigActorID => {
  const wallet = useWallet()
  const { walletProvider } = useWalletProvider()
  const [actorState, setActorState] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const actorNotMsigCb = useCallback(
    () => router.push('/error/not-a-multisig'),
    [router]
  )
  const walletAddressNotSignerCb = useCallback(() => {
    const params = new URLSearchParams(router.query)
    params.set('walletAddress', wallet.address)
    params.set('msigAddress', msigActorID)
    router.push(`/error/not-a-signer?${params.toString()}`)
  }, [router, wallet.address, msigActorID])

  const timeout = useRef()

  const pollMsigState = useCallback(
    (msigAddress, state) => {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(async () => {
        try {
          const newState = await fetchMsigState(
            msigAddress,
            wallet.address,
            actorNotMsigCb,
            walletAddressNotSignerCb
          )
          if (stateDiff(state, newState)) {
            setActorState(newState)
          }
          return pollMsigState(msigAddress, newState)
        } catch (err) {
          reportError(22, true, err.message, err.stack)
        }
      }, 10000)

      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current)
        }
      }
    },
    [wallet.address, actorNotMsigCb, walletAddressNotSignerCb]
  )

  useEffect(() => {
    const loadMsigActorState = async () => {
      try {
        const state = await fetchMsigState(
          msigActorID,
          wallet.address,
          actorNotMsigCb,
          walletAddressNotSignerCb
        )
        setActorState(state)
        return pollMsigState(msigActorID, state)
      } catch (err) {
        reportError(22, true, err.message, err.stack)
      } finally {
        setLoading(false)
      }
    }
    if (!actorState && msigActorID) {
      setLoading(true)
      loadMsigActorState()
    }
  }, [
    actorState,
    msigActorID,
    setActorState,
    walletProvider,
    router,
    wallet.address,
    actorNotMsigCb,
    walletAddressNotSignerCb,
    pollMsigState
  ])

  if (!actorState) return emptyActorState
  return { Address: msigActorID, ...actorState, loading }
}
