import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMsig } from '../../../MsigProvider'
import Withdraw from '../Withdraw'
import ChangeOwner from '../ChangeOwner'
import { AddSigner, RemoveSigner } from '../AddRmSigners'
import { Box, LoadingScreen } from '../../Shared'
import State from './State'
import useWallet from '../../../WalletProvider/useWallet'
import MsgConfirmer from '../../../lib/confirm-message'

const MSIG_STATE = 'MSIG_STATE'
const WITHDRAW = 'WITHDRAW'
const CHANGE_OWNER = 'CHANGE_OWNER'
const REMOVE_SIGNER = 'REMOVE_SIGNER'
const ADD_SIGNER = 'ADD_SIGNER'

const MsigHome = () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const msig = useMsig(msigActorAddress)
  const { address } = useWallet()
  const [childView, setChildView] = useState(MSIG_STATE)
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
        {!msig.loading && childView === MSIG_STATE && (
          <State
            msigAddress={msigActorAddress}
            walletAddress={address}
            available={msig.AvailableBalance}
            total={msig.Balance}
            setChangingOwner={() => setChildView(CHANGE_OWNER)}
            setWithdrawing={() => setChildView(WITHDRAW)}
            setRmSigner={() => setChildView(REMOVE_SIGNER)}
            setAddSigner={() => setChildView(ADD_SIGNER)}
            showRmSignerOption={msig.Signers.length > 1}
            showChangeOwnerOption={msig.Signers.length === 1}
          />
        )}
        {!msig.loading && childView === CHANGE_OWNER && (
          <ChangeOwner
            close={() => setChildView(MSIG_STATE)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
        {!msig.loading && childView === REMOVE_SIGNER && (
          <RemoveSigner
            close={() => setChildView(MSIG_STATE)}
            signers={msig.Signers}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
        {!msig.loading && childView === WITHDRAW && (
          <Withdraw
            close={() => setChildView(MSIG_STATE)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
        {!msig.loading && childView === ADD_SIGNER && (
          <AddSigner
            close={() => setChildView(MSIG_STATE)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
      </Box>
    </>
  )
}

export default MsigHome
