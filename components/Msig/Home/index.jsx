import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMsig } from '../../../MsigProvider'
import Withdraw from '../Withdraw'
import ChangeOwner from '../ChangeOwner'
import MessageHistory from '../MessageHistory'
import { Box, LoadingScreen } from '../../Shared'
import State from './State'
import useWallet from '../../../WalletProvider/useWallet'

const MSIG_STATE = 'MSIG_STATE'
const WITHDRAW = 'WITHDRAW'
const CHANGE_OWNER = 'CHANGE_OWNER'
const MESSAGE_HISTORY = 'MESSAGE_HISTORY'

export default () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const msig = useMsig(msigActorAddress)
  const { address } = useWallet()
  const [childView, setChildView] = useState(MSIG_STATE)
  return (
    <>
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
            setMessageHistory={() => setChildView(MESSAGE_HISTORY)}
            setChangingOwner={() => setChildView(CHANGE_OWNER)}
            setWithdrawing={() => setChildView(WITHDRAW)}
          />
        )}
        {!msig.loading && childView === CHANGE_OWNER && (
          <ChangeOwner
            close={() => setChildView(MSIG_STATE)}
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
        {!msig.loading && childView === MESSAGE_HISTORY && (
          <MessageHistory
            address={msigActorAddress}
            close={() => setChildView(MSIG_STATE)}
          />
        )}
      </Box>
    </>
  )
}
