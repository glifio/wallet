import React from 'react'
import { ADDRESS_PROPTYPE, MESSAGE_PROPS } from '../../../../customPropTypes'
import { SEND, PROPOSE, EXEC } from '../../../../constants'
import { Label, IconMessageStatus, IconPending } from '../../../Shared'

const TxStatusText = ({ address, message }) => {
  let text = ''

  if (message.status === 'pending') return 'PENDING'

  switch (message.method) {
    case SEND: {
      if (address === message.from) text = 'SENT'
      else text = 'RECEIVED'
      break
    }
    case PROPOSE: {
      if (message.params.method === 0) text = 'MSIG WITHDRAW'
      else if (message.params.method === 7) text = 'MSIG OWNER SWAP'
      else text = 'MSIG PROPOSE'
      break
    }
    case EXEC: {
      text = 'ACTOR CREATE'
      break
    }
    default:
      text = 'UNRECOGNIZED METHOD'
  }
  return text
}

TxStatusText.propTypes = {
  address: ADDRESS_PROPTYPE,
  message: MESSAGE_PROPS.isRequired
}

const MsgTypeAndStatus = ({ address, message }) => {
  return (
    <>
      {message.status === 'confirmed' ? (
        <IconMessageStatus status='confirmed' />
      ) : (
        <IconPending height={4} />
      )}
      <Label
        color={
          message.status === 'confirmed'
            ? 'status.success.background'
            : 'status.pending.foreground'
        }
      >
        <TxStatusText address={address} message={message} />
      </Label>
    </>
  )
}

MsgTypeAndStatus.propTypes = {
  address: ADDRESS_PROPTYPE,
  message: MESSAGE_PROPS.isRequired
}

export default MsgTypeAndStatus
