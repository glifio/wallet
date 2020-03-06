import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MessageDetail from './Detail'
import { MessageHistoryTable } from '../../Shared'
import useWallet from '../../../WalletProvider/useWallet'

export default () => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
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
          gridColumn='2'
          messages={[...pending, ...confirmed]}
          address={wallet.address}
          selectMessage={setSelectedMessageCid}
          flexGrow='2'
          border='none'
        />
      )}
    </>
  )
}
