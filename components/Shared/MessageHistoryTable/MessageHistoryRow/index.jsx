import React from 'react'
import { func } from 'prop-types'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import MessageHistoryRowContainer from './MessageHistoryRowContainer'
import SendRow from './SendRow'
import MsigProposeRow from './MsigProposeRow'
import ExecRow from './ExecRow'
import UnknownRow from './UnknownRow'
import { SEND, PROPOSE, EXEC } from '../../../../constants'
import convertAddrToFPrefix from '../../../../utils/convertAddrToFPrefix'

const MessageHistoryRow = ({
  address,
  message: { to, from, value, status, cid, timestamp, method, params, receipt },
  selectMessage
}) => {
  const sentMsg = convertAddrToFPrefix(address) === convertAddrToFPrefix(from)
  let InnerComponent = () => <></>
  switch (method) {
    case SEND: {
      InnerComponent = () => (
        <SendRow
          sentMsg={sentMsg}
          to={to}
          from={from}
          value={value}
          status={status}
          timestamp={timestamp}
          transactionCid={cid}
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
      InnerComponent = () => (
        <ExecRow
          receipt={receipt}
          status={status}
          value={value}
          timestamp={timestamp}
          params={params}
        />
      )
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
