import React from 'react'
import { func } from 'prop-types'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import MessageHistoryRowContainer from './MessageHistoryRowContainer'
import SendRow from './SendRow'

const MessageHistoryRow = ({
  address,
  message: { to, from, value, status, cid, timestamp, method },
  selectMessage
}) => {
  console.log(method)
  const sentMsg = address === from
  return (
    <MessageHistoryRowContainer
      status={status}
      onClick={() => selectMessage(cid)}
    >
      <SendRow
        sentMsg={sentMsg}
        to={to}
        from={from}
        value={value}
        status={status}
        timestamp={timestamp}
      />
    </MessageHistoryRowContainer>
  )
}

MessageHistoryRow.propTypes = {
  address: ADDRESS_PROPTYPE,
  message: MESSAGE_PROPS.isRequired,
  selectMessage: func.isRequired
}

export default MessageHistoryRow
