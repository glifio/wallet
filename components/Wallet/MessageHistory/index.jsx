import React from 'react'
import { useSelector } from 'react-redux'

import { MessageHistoryTable } from '../../Shared'
import { useWallet } from '../hooks'

export default () => {
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

  return (
    <MessageHistoryTable
      messages={[...pending, ...confirmed]}
      address={wallet.address}
    />
  )
}
