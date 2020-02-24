import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

import { ADDRESS_PROPTYPE, MESSAGE_PROPS } from '../customPropTypes'
import MessageHistoryRow from './MessageHistoryRow'

const MessageHistoryTable = forwardRef(
  ({ address, messages, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {messages.map(msg => (
          <MessageHistoryRow address={address} key={msg.cid} {...msg} />
        ))}
      </div>
    )
  }
)

MessageHistoryTable.propTypes = {
  /**
   * The FIL address this message history relates to
   */
  address: ADDRESS_PROPTYPE,
  /**
   * An array of message types
   */
  messages: PropTypes.arrayOf(MESSAGE_PROPS)
}

MessageHistoryTable.propTypes = {
  messages: []
}

export default MessageHistoryTable
