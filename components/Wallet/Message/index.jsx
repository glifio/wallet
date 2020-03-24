import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MessageDetail from './Detail'
import { MessageHistoryTable } from '../../Shared'
import useWallet from '../../../WalletProvider/useWallet'
import useTransactionHistory from './useTransactionHistory'

export default () => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
  const { pending, confirmed, loading, showMore } = useTransactionHistory(
    wallet.address
  )

  const messages = [...pending, ...confirmed]
  return (
    <>
      {selectedMessageCid ? (
        <MessageDetail
          close={() => setSelectedMessageCid('')}
          message={messages.find(({ cid }) => cid === selectedMessageCid)}
        />
      ) : (
        <MessageHistoryTable
          address={wallet.address}
          messages={[...pending, ...confirmed]}
          loading={loading}
          showMore={showMore}
          selectMessage={setSelectedMessageCid}
        />
      )}
    </>
  )
}
