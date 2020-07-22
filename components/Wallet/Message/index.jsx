import React, { useState } from 'react'
import MessageDetail from './Detail'
import { MessageHistoryTable } from '../../Shared'
import useWallet from '../../../WalletProvider/useWallet'
import useTransactionHistory from './useTransactionHistory'

export default () => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
  const {
    pending,
    confirmed,
    loading,
    paginating,
    showMore,
    refresh,
    total
  } = useTransactionHistory()

  const messages = [...pending, ...confirmed]
  return (
    <>
      {selectedMessageCid ? (
        <MessageDetail
          address={wallet.address}
          close={() => setSelectedMessageCid('')}
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
