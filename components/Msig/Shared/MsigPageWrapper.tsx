import React, { ReactNode } from 'react'
import { node } from 'prop-types'
import {
  Box,
  LoadingScreen,
  Tooltip,
  BaseButton as ButtonLogout
} from '@glif/react-components'

import NavMenu from './NavMenu'
import { useMsig } from '../../../MsigProvider'
import MsgConfirmer from '../../../lib/confirm-message'
import { resetWallet } from '../../../utils/urlParams'

const MsigPageWrapper = ({ children }: { children: ReactNode }) => {
  const msig = useMsig()

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
        {!msig.loading && (
          <Box display='flex' flexDirection='column' width='100%'>
            <NavMenu msigAddress={msig.Address} />
            {children}
          </Box>
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

MsigPageWrapper.propTypes = {
  children: node.isRequired
}

export default MsigPageWrapper
