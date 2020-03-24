import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MessageDetail from './Detail'
import { MessageHistoryTable } from '../../Shared'
import useWallet from '../../../WalletProvider/useWallet'
import useTransactionHistory from './useTransactionHistory'

export default () => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
  useTransactionHistory(wallet.address)
  const { pending, confirmed } = useSelector(state => {
    return {
      confirmed: state.messages.confirmed.map(msg => ({
        ...msg,
        status: 'confirmed'
      })),
      pending: state.messages.pending.map(msg => ({
        ...msg,
        status: 'pending'
      }))
    }
  })

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
          messages={[...pending, ...confirmed]}
          address={wallet.address}
          selectMessage={setSelectedMessageCid}
          border='none'
        />
      )}
    </>
  )
}
