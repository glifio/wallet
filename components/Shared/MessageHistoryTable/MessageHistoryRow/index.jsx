import React from 'react'
import { func } from 'prop-types'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import MessageHistoryRowContainer from './MessageHistoryRowContainer'
import SendRow from './SendRow'
import MsigProposeRow from './MsigProposeRow'

const SEND = 'SEND'
const PROPOSE = 'PROPOSE'

const MessageHistoryRow = ({
  address,
  message: { to, from, value, status, cid, timestamp, method, params },
  selectMessage
}) => {
  const sentMsg = address === from
  return (
    <MessageHistoryRowContainer
      status={status}
      onClick={() => selectMessage(cid)}
    >
      {method.toUpperCase() === SEND && (
        <SendRow
          sentMsg={sentMsg}
          to={to}
          from={from}
          value={value}
          status={status}
          timestamp={timestamp}
        />
      )}
      {method.toUpperCase() === PROPOSE && (
        <MsigProposeRow
          params={params}
          msigActorAddr={to}
          status={status}
          timestamp={timestamp}
        />
      )}
    </MessageHistoryRowContainer>
  )
}

MessageHistoryRow.propTypes = {
  address: ADDRESS_PROPTYPE,
  message: MESSAGE_PROPS.isRequired,
  selectMessage: func.isRequired
}

export default MessageHistoryRow
