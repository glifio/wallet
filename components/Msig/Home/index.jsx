import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useMsig } from '../../../MsigProvider'
import Withdraw from '../Withdraw'
import ChangeOwner from '../ChangeOwner'
import { AddSigner, RemoveSigner } from '../AddRmSigners'
import { Box, LoadingScreen } from '../../Shared'
import { PAGE_MSIG_HOME, PAGE_MSIG_HISTORY, PAGE_MSIG_OWNERS } from '../../../constants'
import State from './State'
import useWallet from '../../../WalletProvider/useWallet'
import MsgConfirmer from '../../../lib/confirm-message'

const WITHDRAW = 'WITHDRAW'
const CHANGE_OWNER = 'CHANGE_OWNER'
const REMOVE_SIGNER = 'REMOVE_SIGNER'
const ADD_SIGNER = 'ADD_SIGNER'

const MsigHome = () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const messagesPending = useSelector(
    state => state.messages.pending.length > 0
  )
  const msig = useMsig(msigActorAddress)
  const { address } = useWallet()

  // todo temp hack to demonstrate urls.. fix later
  const router = useRouter()
  const defaultView = router.pathname;

  const [childView, setChildView] = useState(defaultView)

  return (
    <>
      <MsgConfirmer />
      <Box
        display='flex'
        justifyContent='center'
        width='100%'
        minHeight='100vh'
        p={3}
      >
        {msig.loading && <LoadingScreen width='100%' />}
        {!msig.loading && (
            // todo: refactor this
            childView === PAGE_MSIG_HOME ||
            childView === PAGE_MSIG_HISTORY ||
            childView === PAGE_MSIG_OWNERS
          ) && (
          <State
            msigAddress={msigActorAddress}
            walletAddress={address}
            available={msig.AvailableBalance}
            total={msig.Balance}
            setChangingOwner={() => setChildView(CHANGE_OWNER)}
            setWithdrawing={() => setChildView(WITHDRAW)}
            setRmSigner={() => setChildView(REMOVE_SIGNER)}
            setAddSigner={() => setChildView(ADD_SIGNER)}
            signers={msig.Signers}
            showRmSignerOption={msig.Signers.length > 1}
            showChangeOwnerOption={msig.Signers.length === 1}
            childView={childView}
            setChildView={setChildView}
          />
        )}
        {!msig.loading && !messagesPending && childView === CHANGE_OWNER && (
          <ChangeOwner
            close={() => setChildView(PAGE_MSIG_HOME)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
        {!msig.loading && childView === REMOVE_SIGNER && (
          <RemoveSigner
            close={() => setChildView(PAGE_MSIG_HOME)}
            signers={msig.Signers}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
        {!msig.loading && childView === WITHDRAW && (
          <Withdraw
            close={() => setChildView(PAGE_MSIG_HOME)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
        {!msig.loading && childView === ADD_SIGNER && (
          <AddSigner
            close={() => setChildView(PAGE_MSIG_HOME)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
      </Box>
    </>
  )
}

export default MsigHome
