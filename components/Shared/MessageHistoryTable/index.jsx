import React from 'react'
import PropTypes from 'prop-types'

import Box from '../Box'
import Glyph from '../Glyph'
import { Text } from '../Typography'

import { ADDRESS_PROPTYPE, MESSAGE_PROPS } from '../../../customPropTypes'
import MessageHistoryRow from './MessageHistoryRow'
import EmptyHistory from './EmptyHistory'

const MessageHistoryTable = ({
  address,
  messages,
  selectMessage,
  ...props
}) => {
  return (
    <Box {...props} maxWidth={16} width='100%'>
      <Box display='flex' alignItems='center' justifyContent='flex-start'>
        <Glyph mr={3} color='core.primary' acronym='Tx' />
        <Text color='core.primary'>Transaction History</Text>
      </Box>
      {messages.length > 0 ? (
        messages.map(msg => (
          <MessageHistoryRow
            address={address}
            key={msg.cid}
            message={msg}
            selectMessage={selectMessage}
          />
        ))
      ) : (
        <EmptyHistory />
      )}
    </Box>
  )
}

MessageHistoryTable.propTypes = {
  /**
   * The FIL address this message history relates to
   */
  address: ADDRESS_PROPTYPE,
  /**
   * An array of message types
   */
  messages: PropTypes.arrayOf(MESSAGE_PROPS),
  selectMessage: PropTypes.func.isRequired
}

MessageHistoryTable.defaultProps = {
  messages: []
}

export default MessageHistoryTable
