import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useMsig } from '../../../MsigProvider'
import Withdraw from '../Withdraw'
import ChangeOwner from '../ChangeOwner'
import { AddSigner, RemoveSigner } from '../AddRmSigners'
import { Box, LoadingScreen } from '../../Shared'
import {
  PAGE_MSIG_HOME,
  PAGE_MSIG_HISTORY,
  PAGE_MSIG_OWNERS,
  PAGE_MSIG_WITHDRAW,
  PAGE_MSIG_CHANGE_OWNER,
  PAGE_MSIG_REMOVE_SIGNER_WITH_CID,
  PAGE_MSIG_REMOVE_SIGNER,
  PAGE_MSIG_ADD_SIGNER
} from '../../../constants'
import State from './State'
import useWallet from '../../../WalletProvider/useWallet'
import MsgConfirmer from '../../../lib/confirm-message'
import { gotoRouteWithKeyUrlParams, detectPage } from '../../../utils/urlParams'

const MsigHome = () => {
  const messagesPending = useSelector(
    state => state.messages.pending.length > 0
  )

  const msig = useMsig()
  const { address } = useWallet()

  const router = useRouter()
  const pageId = detectPage(router)

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
        {!msig.loading &&
          (pageId === PAGE_MSIG_HOME ||
            pageId === PAGE_MSIG_HISTORY ||
            pageId === PAGE_MSIG_OWNERS) && (
            <State
              msigAddress={msig.Address}
              walletAddress={address}
              available={msig.AvailableBalance}
              total={msig.Balance}
              signers={msig.Signers}
            />
          )}
        {!msig.loading && pageId === PAGE_MSIG_WITHDRAW && (
          <Withdraw
            onClose={() => {
              gotoRouteWithKeyUrlParams(router, PAGE_MSIG_HOME)
            }}
            onComplete={() => {
              gotoRouteWithKeyUrlParams(router, PAGE_MSIG_HISTORY)
            }}
            balance={msig.AvailableBalance}
            address={msig.Address}
          />
        )}
        {!msig.loading && pageId === PAGE_MSIG_ADD_SIGNER && (
          <AddSigner
            onClose={() => {
              gotoRouteWithKeyUrlParams(router, PAGE_MSIG_OWNERS)
            }}
            onComplete={() => {
              gotoRouteWithKeyUrlParams(router, PAGE_MSIG_HISTORY)
            }}
            balance={msig.AvailableBalance}
            address={msig.Address}
          />
        )}
        {!msig.loading &&
          (pageId === PAGE_MSIG_REMOVE_SIGNER ||
            pageId === PAGE_MSIG_REMOVE_SIGNER_WITH_CID) && (
            <RemoveSigner
              onClose={() => {
                gotoRouteWithKeyUrlParams(router, PAGE_MSIG_OWNERS)
              }}
              onComplete={() => {
                gotoRouteWithKeyUrlParams(router, PAGE_MSIG_HISTORY)
              }}
              signers={msig.Signers}
              balance={msig.AvailableBalance}
              address={msig.Address}
              cid={router.query.cid || null}
            />
          )}
        {!msig.loading &&
          !messagesPending &&
          pageId === PAGE_MSIG_CHANGE_OWNER && (
            <ChangeOwner
              onClose={() => {
                gotoRouteWithKeyUrlParams(router, PAGE_MSIG_OWNERS)
              }}
              onComplete={() => {
                gotoRouteWithKeyUrlParams(router, PAGE_MSIG_HISTORY)
              }}
              balance={msig.AvailableBalance}
              address={msig.Address}
            />
          )}
      </Box>
    </>
  )
}

export default MsigHome
