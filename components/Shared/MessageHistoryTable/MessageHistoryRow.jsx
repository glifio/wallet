import React from 'react'
import dayjs from 'dayjs'
import { BigNumber } from '@openworklabs/filecoin-number'
import { bool, string, func } from 'prop-types'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { Menu, MenuItem } from '../Menu'
import { Text } from '../Typography'
import { IconSend, IconReceive } from '../Icons'
import truncate from '../../../utils/truncateAddress'
import { useConverter } from '../../../lib/Converter'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import MessageHistoryRowContainer from './MessageHistoryRowContainer'

const AddressText = ({ sentMsg, to, from }) => {
  if (sentMsg) {
    return (
      <>
        <Text color='core.nearblack' my={0}>
          To
        </Text>
        <Text color='core.nearblack' m={0}>
          {truncate(to)}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text color='core.nearblack' my={0}>
        From
      </Text>
      <Text color='core.nearblack' m={0}>
        {truncate(from)}
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
  if (status === 'confirmed' && sentMsg)
    return (
      <Text color='core.nearblack' my={0}>
        Sent
      </Text>
    )
  if (status === 'confirmed')
    return (
      <Text color='core.nearblack' my={0}>
        Received
      </Text>
    )
  if (status === 'pending' && sentMsg) return <Text my={0}>Pending</Text>
  if (status === 'pending')
    return (
      <Text color='core.nearblack' my={0}>
        Confirming
      </Text>
    )
  return <Text my={0}>Unknown?</Text>
}

ActionText.propTypes = {
  sentMsg: bool.isRequired,
  status: string.isRequired
}

const MessageHistoryRow = ({
  address,
  message: { to, from, value, status, cid, timestamp },
  selectMessage
}) => {
  const { converter, converterError } = useConverter()
  const sentMsg = address === from
  return (
    <MessageHistoryRowContainer onClick={() => selectMessage(cid)}>
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
          <Menu display='flex' flexDirection='column' ml={[2, 4]}>
            <MenuItem width={8}>
              <ActionText status={status} sentMsg={sentMsg} />
            </MenuItem>
            <MenuItem>
              <Text color='core.silver' m={0}>
                {dayjs.unix(timestamp).format('MMM DD, YYYY')}
              </Text>
            </MenuItem>
          </Menu>
          <Menu display='flex' flex-wrap='wrap' ml={[2, 4, 5]}>
            <MenuItem overflow='hidden' maxWidth={9}>
              <AddressText sentMsg={sentMsg} to={to} from={from} m={0} />
            </MenuItem>
          </Menu>
        </MenuItem>
      </Menu>
      <Menu
        display='flex'
        flexDirection='row'
        justifyContent='flex-end'
        flexGrow='999'
      >
        <MenuItem>
          <Menu
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            flex-wrap='wrap'
            ml={3}
          >
            <MenuItem display='flex'>
              <Text color='core.nearblack' m={0}>
                {makeFriendlyBalance(new BigNumber(value), 7)}
              </Text>
            </MenuItem>
            <MenuItem display='flex'>
              <Text color='core.silver' m={0} mb={0}>
                {converter &&
                  !converterError &&
                  makeFriendlyBalance(
                    converter.fromFIL(new BigNumber(value)),
                    7
                  )}{' '}
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
              <Text color='core.nearblack' m={0}>
                FIL
              </Text>
              <Text color='core.silver' m={0} mb={0}>
                USD
              </Text>
            </MenuItem>
          </Menu>
        </MenuItem>
      </Menu>
    </MessageHistoryRowContainer>
  )
}

MessageHistoryRow.propTypes = {
  address: ADDRESS_PROPTYPE,
  message: MESSAGE_PROPS.isRequired,
  selectMessage: func.isRequired
}

export default MessageHistoryRow
