import React, { useState } from 'react'
import { Box } from '@glif/react-components'

import MessageDetail from '../../Wallet/Message/Detail'
import { MessageHistoryTable } from '../../Shared'
import { MsigPageWrapper } from '../Shared'
import useWallet from '../../../WalletProvider/useWallet'
import useTransactionHistory from '../../../lib/useTransactionHistory'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { useMsig } from '../../../MsigProvider'

const MessageHistory = () => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
  const { Address } = useMsig()
  const { pending, confirmed, loading, paginating, showMore, refresh, total } =
    useTransactionHistory(Address)

  const messages = [...pending, ...confirmed]
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
        {selectedMessageCid ? (
          <MessageDetail
            address={wallet.address}
            onClose={() => setSelectedMessageCid('')}
            message={messages.find(({ cid }) => cid === selectedMessageCid)}
          />
        ) : (
          <MessageHistoryTable
            address={wallet.address}
            messages={[...pending, ...confirmed]}
            loading={loading}
            selectMessage={setSelectedMessageCid}
            paginating={paginating}
            showMore={showMore}
            refresh={refresh}
            total={total}
            displayTitle={false}
          />
        )}
      </Box>
    </MsigPageWrapper>
  )
}

MessageHistory.propTypes = {
  address: ADDRESS_PROPTYPE
}

export default MessageHistory
