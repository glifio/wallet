import React, { forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { func } from 'prop-types'

import { MessageHistoryTable } from '../../Shared'
import { useWallet } from '../hooks'

const MessageHistory = forwardRef(({ setMessage }) => {
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
      setMessage={setMessage}
      flexGrow='2'
      border='none'
      my={3}
      mx={4}
    />
  )
})

MessageHistory.propTypes = {
  setMessage: func
}

export default MessageHistory
