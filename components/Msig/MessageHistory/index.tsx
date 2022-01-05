import React, { useState } from 'react'
import { Box } from '@glif/react-components'
import { useWallet } from '@glif/wallet-provider-react'

import { MsigPageWrapper } from '../Shared'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { useMsig } from '../../../MsigProvider'

const MessageHistory = () => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
  const { Address } = useMsig()
  return (
    <MsigPageWrapper>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='center'
        width='100%'
        maxWidth={18}
        margin='0 auto'
      ></Box>
    </MsigPageWrapper>
  )
}

MessageHistory.propTypes = {
  address: ADDRESS_PROPTYPE
}

export default MessageHistory
