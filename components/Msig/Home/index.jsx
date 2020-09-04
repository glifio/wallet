import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMsig } from '../../../MsigProvider'
import Withdraw from '../Withdraw'
import ChangeOwner from '../ChangeOwner'
import { Box } from '../../Shared'
import State from './State'
import useWallet from '../../../WalletProvider/useWallet'

const MSIG_STATE = 'MSIG_STATE'
const WITHDRAW = 'WITHDRAW'
const CHANGE_OWNER = 'CHANGE_OWNER'

export default () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const msig = useMsig(msigActorAddress)
  const { address } = useWallet()
  const [childView, setChildView] = useState(MSIG_STATE)
  return (
    <>
      <Box minHeight='100vh' p={3}>
        {childView === MSIG_STATE && (
          <State
            msigAddress={msigActorAddress}
            walletAddress={address}
            available={msig.AvailableBalance}
            total={msig.Balance}
            setChangingOwner={() => setChildView(CHANGE_OWNER)}
            setWithdrawing={() => setChildView(WITHDRAW)}
          />
        )}
        {childView === CHANGE_OWNER && (
          <ChangeOwner
            close={() => setChildView(MSIG_STATE)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
        {childView === WITHDRAW && (
          <Withdraw
            close={() => setChildView(MSIG_STATE)}
            balance={msig.AvailableBalance}
            address={msigActorAddress}
          />
        )}
      </Box>
    </>
  )
}
