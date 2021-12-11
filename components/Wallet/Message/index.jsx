import React, { useState } from 'react'
import { useWallet } from '@glif/wallet-provider-react'
import MessageDetail from './Detail'
import { MessageHistoryTable } from '../../Shared'
import useTransactionHistory from '../../../lib/useTransactionHistory'

const MessageView = () => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
  const { pending, confirmed, loading, paginating, showMore, refresh, total } =
    useTransactionHistory(wallet.address)

  const messages = [...pending, ...confirmed]
  return (
    <>
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
        />
      )}
    </>
  )
}

export default MessageView
