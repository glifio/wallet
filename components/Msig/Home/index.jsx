import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  Box,
  LoadingScreen,
  Tooltip,
  BaseButton as ButtonLogout
} from '@glif/react-components'
import { useMsig } from '../../../MsigProvider'
import Withdraw from '../Withdraw'
import ChangeOwner from '../ChangeOwner'
import { AddSigner, RemoveSigner } from '../AddRmSigners'

import {
  PAGE_MSIG_HOME,
  PAGE_MSIG_HISTORY,
  PAGE_MSIG_OWNERS,
  PAGE_MSIG_WITHDRAW,
  PAGE_MSIG_CHANGE_OWNER,
  PAGE_MSIG_REMOVE_SIGNER_WITH_CID,
  PAGE_MSIG_REMOVE_SIGNER,
  PAGE_MSIG_ADD_SIGNER,
  RESPONSIVE_BREAKPOINT
} from '../../../constants'
import State from './State'
import NavMenu from './NavMenu'
import useWallet from '../../../WalletProvider/useWallet'
import MsgConfirmer from '../../../lib/confirm-message'
import {
  gotoRouteWithKeyUrlParams,
  detectPage,
  resetWallet
} from '../../../utils/urlParams'

const MsigHome = () => {
  const messagesPending = useSelector(
    state => state.messages.pending.length > 0
  )

  const msig = useMsig()
  const { address } = useWallet()

  const router = useRouter()
  const pageId = detectPage(router)

  return (
    <Box
      display='flex'
      justifyContent='center'
      width='100%'
      minHeight='100vh'
      p={3}
    >
      <MsgConfirmer />
      <Box
        position='relative'
        display='flex'
        justifyContent='center'
        width='100%'
        p={3}
        // padding for logout button to ensure it never sits on top of the content
        paddingBottom={8}
      >
        {msig.loading && <LoadingScreen width='100%' />}
        {!msig.loading &&
          (pageId === PAGE_MSIG_HOME ||
            pageId === PAGE_MSIG_HISTORY ||
            pageId === PAGE_MSIG_OWNERS) && (
            <Box display='flex' flexDirection='column' width='100%'>
              <NavMenu pageId={pageId} msigAddress={msig.Address} />
              <State
                msigAddress={msig.Address}
                walletAddress={address}
                available={msig.AvailableBalance}
                total={msig.Balance}
                signers={msig.Signers}
                pageId={pageId}
              />
            </Box>
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
        <ButtonLogout
          position='absolute'
          variant='secondary'
          bottom='0'
          left='0'
          m={5}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          css={`
            background-color: ${({ theme }) => theme.colors.core.secondary}00;
            &:hover {
              background-color: ${({ theme }) => theme.colors.core.secondary};
            }
            /* todo #responsiveDesign: decide how to do responsive design */
            @media only screen and (max-width: ${RESPONSIVE_BREAKPOINT}px) {
              margin: 0;
            }
          `}
          onClick={resetWallet}
        >
          Logout
          <Tooltip content='Logging out clears all your sensitive information from the browser and sends you back to the home page' />
        </ButtonLogout>
      </Box>
    </Box>
  )
}

export default MsigHome
