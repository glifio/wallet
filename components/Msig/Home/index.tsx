import React from 'react'
import { Box } from '@glif/react-components'

import { useMsig } from '../../../MsigProvider'
import Balances from './Balances'
import { MsigPageWrapper } from '../Shared'

const MsigHome = () => {
  const msig = useMsig()

  return (
    <MsigPageWrapper>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='center'
        width='100%'
        maxWidth={18}
        margin='0 auto'
      >
        <Balances available={msig.AvailableBalance} total={msig.Balance} />
      </Box>
    </MsigPageWrapper>
  )
}

export default MsigHome
