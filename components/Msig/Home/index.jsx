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

import { PAGE } from '../../../constants'
import State from './State'
import NavMenu from '../NavMenu'
import useWallet from '../../../WalletProvider/useWallet'
import MsgConfirmer from '../../../lib/confirm-message'
import { navigate, detectPage, resetWallet } from '../../../utils/urlParams'

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
          (pageId === PAGE.MSIG_HOME ||
            pageId === PAGE.MSIG_HISTORY ||
            pageId === PAGE.MSIG_OWNERS) && (
            <Box display='flex' flexDirection='column' width='100%'>
              <NavMenu msigAddress={msig.Address} />
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
        {!msig.loading && pageId === PAGE.MSIG_WITHDRAW && (
          <Withdraw
            onClose={() => {
              navigate(router, PAGE.MSIG_HOME)
            }}
            onComplete={() => {
              navigate(router, PAGE.MSIG_HISTORY)
            }}
            balance={msig.AvailableBalance}
            address={msig.Address}
          />
        )}
        {!msig.loading && pageId === PAGE.MSIG_ADD_SIGNER && (
          <AddSigner
            onClose={() => {
              navigate(router, PAGE.MSIG_OWNERS)
            }}
            onComplete={() => {
              navigate(router, PAGE.MSIG_HISTORY)
            }}
            balance={msig.AvailableBalance}
            address={msig.Address}
          />
        )}
        {!msig.loading &&
          (pageId === PAGE.MSIG_REMOVE_SIGNER ||
            pageId === PAGE.MSIG_REMOVE_SIGNER_WITH_CID) && (
            <RemoveSigner
              onClose={() => {
                navigate(router, PAGE.MSIG_OWNERS)
              }}
              onComplete={() => {
                navigate(router, PAGE.MSIG_HISTORY)
              }}
              signers={msig.Signers}
              balance={msig.AvailableBalance}
              address={msig.Address}
              cid={router.query.cid || null}
            />
          )}
        {!msig.loading &&
          !messagesPending &&
          pageId === PAGE.MSIG_CHANGE_OWNER && (
            <ChangeOwner
              onClose={() => {
                navigate(router, PAGE.MSIG_OWNERS)
              }}
              onComplete={() => {
                navigate(router, PAGE.MSIG_HISTORY)
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
