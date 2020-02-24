import React from 'react'
import styled from 'styled-components'
import { bool, string } from 'prop-types'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import { Menu, MenuItem } from '../Menu'
import { Text } from '../Typography'
import { IconSend, IconReceive } from '../Icons'

const MessageHistoryRowContainer = styled(Box)`
  &:nth-child(even) {
    transform: translateY(-1px);
  }
`

const AddressText = ({ sentMsg, to, from }) => {
  if (sentMsg) {
    return (
      <>
        <Text my={0}>To</Text>
        <Text mt={2} mb={0}>
          {to}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text my={0}>From</Text>
      <Text mt={2} mb={0}>
        {from}
      </Text>
    </>
  )
}

AddressText.propTypes = {
  sentMsg: bool.isRequired,
  to: ADDRESS_PROPTYPE,
  from: ADDRESS_PROPTYPE
}

const ActionText = ({ status, sentMsg }) => {
  if (status === 'confirmed' && sentMsg) return <Text my={0}>Sent</Text>
  else if (status === 'confirmed') return <Text my={0}>Received</Text>
  else if (status === 'pending' && sentMsg) return <Text my={0}>Sending</Text>
  // an unconfirmed received  sg
  else if (status === 'pending') return <Text my={0}>Confirming</Text>
}

ActionText.propTypes = {
  sentMsg: bool.isRequired,
  status: string.isRequired
}

const MessageHistoryRow = ({ address, to, from, value, status }) => {
  const sentMsg = address === from
  return (
    <MessageHistoryRowContainer
      display='flex'
      border={1}
      p={2}
      justifyContent='space-between'
    >
      <Menu>
        <MenuItem display='flex' flexDirection='row'>
          <Menu display='flex' flexDirection='column'>
            <MenuItem>
              {sentMsg ? (
                <IconSend status={status} />
              ) : (
                <IconReceive status={status} />
              )}
            </MenuItem>
          </Menu>
          <Menu display='flex' flexDirection='column' ml={3}>
            <MenuItem>
              <ActionText status={status} sentMsg={sentMsg} />
            </MenuItem>
            <MenuItem>
              <Text mt={2} mb={0}>
                Date
              </Text>
            </MenuItem>
          </Menu>
          <Menu display='flex' flex-wrap='wrap' ml={3}>
            <MenuItem overflow='hidden' maxWidth={120}>
              <AddressText sentMsg={sentMsg} to={to} from={from} />
            </MenuItem>
          </Menu>
        </MenuItem>
      </Menu>
      <Menu display='flex' flexDirection='row'>
        <MenuItem>
          <Menu
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            flex-wrap='wrap'
            ml={3}
          >
            <MenuItem display='flex'>
              <Text my={0}>{value}</Text>
            </MenuItem>
            <MenuItem display='flex'>
              <Text mt={2} mb={0}>
                {value}
              </Text>
            </MenuItem>
          </Menu>
        </MenuItem>
        <MenuItem>
          <Menu
            display='flex'
            flexDirection='column'
            alignItems='flex-start'
            flex-wrap='wrap'
            ml={3}
          >
            <MenuItem>
              <Text my={0}>FIL</Text>
              <Text mt={2} mb={0}>
                Fiat
              </Text>
            </MenuItem>
          </Menu>
        </MenuItem>
      </Menu>
    </MessageHistoryRowContainer>
  )
}

MessageHistoryRow.propTypes = MESSAGE_PROPS

export default MessageHistoryRow
