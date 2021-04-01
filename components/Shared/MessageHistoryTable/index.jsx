import React from 'react'
import PropTypes from 'prop-types'

import Box from '../Box'
import { Text } from '../Typography'
import Button from '../Button'

import { ADDRESS_PROPTYPE, MESSAGE_PROPS } from '../../../customPropTypes'
import MessageHistoryRow from './MessageHistoryRow'
import EmptyHistory from './EmptyHistory'
import LoadingScreen from '../LoadingScreen'
import ShowMore from './ShowMore'
import { StyledATag } from '../Link'

const MessageHistoryTable = ({
  address,
  messages,
  selectMessage,
  loading,
  paginating,
  showMore,
  refresh,
  total
}) => {
  return (
    <Box width='100%' border='none'>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' flexDirection='column' justifyContent='flex-start'>
          <Text m={0} p={0} color='core.primary'>
            Transaction History
          </Text>
          {messages.length > 0 && (
            <Box display='flex' alignItems='center'>
              <Text fontSize='12' m={0} p={0} color='core.darkgray'>
                We&apos;re experiencing delays getting pending transaction
                history.
              </Text>
              <StyledATag
                href={`https://filfox.info/en/address/${address}`}
                ml={3}
                borderBottom='none'
                fontSize='12'
              >
                See your account on Filfox.
              </StyledATag>
            </Box>
          )}
        </Box>
        <Button variant='secondary' onClick={refresh} title='Refresh' />
      </Box>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          {messages.length > 0 ? (
            <>
              {messages.map(msg => (
                <MessageHistoryRow
                  address={address}
                  key={msg.cid}
                  message={msg}
                  selectMessage={selectMessage}
                />
              ))}
              <ShowMore
                paginating={paginating}
                showMore={showMore}
                confirmed={messages.filter(
                  ({ status }) => status === 'confirmed'
                )}
                total={total}
              />
            </>
          ) : (
            <EmptyHistory />
          )}
        </>
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
  selectMessage: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  paginating: PropTypes.bool.isRequired,
  showMore: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  refresh: PropTypes.func.isRequired
}

MessageHistoryTable.defaultProps = {
  messages: [],
  loading: false
}

export default MessageHistoryTable
