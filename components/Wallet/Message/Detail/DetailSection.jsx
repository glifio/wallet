import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FilecoinNumber } from '@glif/filecoin-number'
import { Box, Input, Text, CopyAddress } from '@glif/react-components'

import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import { EXEC, PROPOSE, SEND } from '../../../../constants'
import getAddrFromReceipt from '../../../../utils/getAddrFromReceipt'
import noop from '../../../../utils/noop'

const WithdrawDetails = ({ from, multisigAddr, recipient, value }) => {
  return (
    <>
      <Box mt={3}>
        <Input.Address value={multisigAddr} label='Multisig actor' disabled />
        <Box height={3} />
        <Input.Address value={recipient} label='Recipient' disabled />
        <Box height={3} />
        <Input.Address value={from} label='From' disabled />
      </Box>
      <Input.Funds
        my={3}
        balance={new FilecoinNumber('0.1', 'fil')}
        label='Amount'
        disabled
        amount={new FilecoinNumber(value, 'attofil').toAttoFil()}
      />
    </>
  )
}

WithdrawDetails.propTypes = {
  from: ADDRESS_PROPTYPE,
  multisigAddr: ADDRESS_PROPTYPE,
  recipient: ADDRESS_PROPTYPE,
  value: PropTypes.string.isRequired
}

const ChangeOwnerDetails = ({ from, multisigAddr, to }) => {
  return (
    <Box mt={3}>
      <Input.Address value={multisigAddr} label='Multisig actor' disabled />
      <Box height={3} />
      <Input.Address value={to} label='New owner' disabled />
      <Box height={3} />
      <Input.Address value={from} label='Old owner' disabled />
    </Box>
  )
}

ChangeOwnerDetails.propTypes = {
  from: ADDRESS_PROPTYPE,
  multisigAddr: ADDRESS_PROPTYPE,
  to: ADDRESS_PROPTYPE
}

const RemoveSignerDetails = ({ multisigAddr, signer }) => {
  return (
    <Box mt={3}>
      <Input.Address value={multisigAddr} label='Multisig actor' disabled />
      <Box height={3} />
      <Text>{`Removed ${signer} from this Multisig actor.`}</Text>
    </Box>
  )
}

RemoveSignerDetails.propTypes = {
  multisigAddr: ADDRESS_PROPTYPE,
  signer: ADDRESS_PROPTYPE
}

const AddSignerDetails = ({ multisigAddr, signer }) => {
  return (
    <Box mt={3}>
      <Input.Address value={multisigAddr} label='Multisig actor' disabled />
      <Box height={3} />
      <Text>{`Added ${signer} to this Multisig actor.`}</Text>
    </Box>
  )
}

AddSignerDetails.propTypes = {
  multisigAddr: ADDRESS_PROPTYPE,
  signer: ADDRESS_PROPTYPE
}

const ProposeDetails = ({ message }) => {
  if (message.params.method === 0) {
    return (
      <WithdrawDetails
        from={message.from}
        multisigAddr={message.to}
        recipient={message.params.to}
        value={message.params.value}
      />
    )
  }

  if (message.params.method === 5) {
    return (
      <AddSignerDetails
        multisigAddr={message.to}
        signer={message.params.params.signer}
      />
    )
  }

  if (message.params.method === 6) {
    return (
      <RemoveSignerDetails
        multisigAddr={message.to}
        signer={message.params.params.signer}
      />
    )
  }

  if (message.params.method === 7) {
    return (
      <ChangeOwnerDetails
        multisigAddr={message.to}
        from={message.params.params.from}
        to={message.params.params.to}
      />
    )
  }

  return <UnknownDetails message={message} />
}

ProposeDetails.propTypes = {
  message: MESSAGE_PROPS
}

const SendDetails = ({ from, to, value }) => (
  <>
    <Box mt={3}>
      <Input.Address value={from} label='From' disabled />
      <Box height={3} />
      <Input.Address value={to} label='To' disabled />
    </Box>
    <Input.Funds
      my={3}
      balance={new FilecoinNumber('0.1', 'fil')}
      label='Amount'
      disabled
      amount={new FilecoinNumber(value, 'attofil').toAttoFil()}
    />
  </>
)

SendDetails.propTypes = {
  from: ADDRESS_PROPTYPE,
  to: ADDRESS_PROPTYPE,
  value: PropTypes.string.isRequired
}

const NumSignerDisplay = styled(Input.Text)`
  &:hover {
    background: transparent;
  }
`

const ExecDetails = ({ message }) => {
  const isMultisig =
    Array.isArray(message.params.signers) && message.params.signers.length > 0
  return (
    <>
      <Box display='flex' justifyContent='space-between' mt={3}>
        <Text>Action</Text>
        {isMultisig ? (
          <CopyAddress
            address={getAddrFromReceipt(message.receipt.return)}
            color='core.primary'
          />
        ) : (
          <Text>Created new actor</Text>
        )}
      </Box>
      <Input.Funds
        my={3}
        balance={new FilecoinNumber('0.1', 'fil')}
        label='Amount'
        disabled
        amount={new FilecoinNumber(message.value, 'attofil').toAttoFil()}
      />
      <Box display='flex'>
        <NumSignerDisplay
          textAlign='right'
          onChange={noop}
          label='Signatures required'
          value={message.params.num_approvals_threshold.toString()}
          backgroundColor='background.screen'
          disabled
        />
      </Box>
    </>
  )
}

ExecDetails.propTypes = {
  message: MESSAGE_PROPS.isRequired
}

const UnknownDetails = ({ message }) => {
  return (
    <>
      <Box mt={3}>
        <Text>
          {message.params.method
            ? `We don't support this type of transaction yet. In case
          you're wondering, it's a method ${message.params.method}
          multisig transaction!`
            : 'Something went wrong when trying to get more information about this transaction. This might happen if your message was sent in the last 24 hours.'}
        </Text>
      </Box>
    </>
  )
}

UnknownDetails.propTypes = {
  message: MESSAGE_PROPS.isRequired
}

const DetailSection = ({ message }) => {
  switch (message.method) {
    case SEND:
      return (
        <SendDetails
          from={message.from}
          to={message.to}
          value={message.value}
        />
      )
    case PROPOSE:
      return <ProposeDetails message={message} />
    case EXEC:
      return <ExecDetails message={message} />
    default:
      return <UnknownDetails message={message} />
  }
}

DetailSection.propTypes = {
  message: MESSAGE_PROPS.isRequired
}

export default DetailSection
