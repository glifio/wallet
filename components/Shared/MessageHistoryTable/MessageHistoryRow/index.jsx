import React from 'react'
import { func } from 'prop-types'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import MessageHistoryRowContainer from './MessageHistoryRowContainer'
import SendRow from './SendRow'
import MsigProposeRow from './MsigProposeRow'
import ExecRow from './ExecRow'
import UnknownRow from './UnknownRow'

const SEND = 'SEND'
const PROPOSE = 'PROPOSE'
const EXEC = 'EXEC'

const MessageHistoryRow = ({
  address,
  message: { to, from, value, status, cid, timestamp, method, params },
  selectMessage
}) => {
  const sentMsg = address === from
  let InnerComponent = () => <></>
  switch (method.toUpperCase()) {
    case SEND: {
      InnerComponent = () => (
        <SendRow
          sentMsg={sentMsg}
          to={to}
          from={from}
          value={value}
          status={status}
          timestamp={timestamp}
        />
      )
      break
    }

    case PROPOSE: {
      InnerComponent = () => (
        <MsigProposeRow
          params={params}
          msigActorAddr={to}
          status={status}
          timestamp={timestamp}
        />
      )
      break
    }

    case EXEC: {
      InnerComponent = () => <ExecRow value={value} timestamp={timestamp} />
      break
    }

    default:
      InnerComponent = () => (
        <UnknownRow
          sentMsg={sentMsg}
          to={to}
          from={from}
          value={value}
          status={status}
          timestamp={timestamp}
        />
      )
  }
  return (
    <MessageHistoryRowContainer
      status={status}
      onClick={() => selectMessage(cid)}
    >
      <InnerComponent />
    </MessageHistoryRowContainer>
  )
}

MessageHistoryRow.propTypes = {
  address: ADDRESS_PROPTYPE,
  message: MESSAGE_PROPS.isRequired,
  selectMessage: func.isRequired
}

export default MessageHistoryRow
