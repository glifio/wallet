import React from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import styled from 'styled-components'
import dayjs from 'dayjs'

import {
  Box,
  BigTitle,
  Card,
  Input,
  Glyph,
  Text,
  Label,
  Title,
  IconMessageStatus
} from '../../Shared'
import { ButtonClose } from '../../Shared/IconButtons'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { useConverter } from '../../../lib/Converter'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import noop from '../../../utils/noop'

const MessageDetailCard = styled(Card).attrs(() => ({
  my: 2,
  mx: 2,
  maxWidth: 13,
  border: 1,
  borderColor: 'core.silver'
}))`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: auto;
  background-color: ${props => props.theme.colors.background.screen};
`

const MessageDetail = ({ address, close, message }) => {
  const { converter, converterError } = useConverter()
  return (
    <MessageDetailCard>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box display='flex' flexDirection='row' alignItems='center'>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            width={6}
            height={6}
            backgroundColor='core.primary'
          >
            <Glyph
              acronym='Td'
              color='background.screen'
              borderColor='core.primary'
              backgroundColor='core.primary'
            />
          </Box>
          <Text color='core.primary' ml={2}>
            Transaction Details
          </Text>
        </Box>
        <Box display='flex' flexDirection='column'>
          <ButtonClose
            ml={2}
            type='button'
            onClick={close}
            css={`
              align-self: flex-end;
            `}
          />
          <Box m='0' display='flex' flexDirection='row' alignItems='flex-end'>
            <IconMessageStatus status='confirmed' />
            <Label
              color={
                message.status === 'confirmed'
                  ? 'status.success.background'
                  : 'status.pending.foreground'
              }
            >
              {address === message.from ? 'SENT' : 'RECEIVED'}
            </Label>
          </Box>
          <Box display='flex' flexDirection='row' mr={2}>
            <Text my='0' mr={1} color='core.darkgray'>
              {dayjs.unix(message.timestamp).format('MMM DD')}
            </Text>
            <Text my='0'>{dayjs.unix(message.timestamp).format('hh:mmA')}</Text>
          </Box>
        </Box>
      </Box>
      <Box mt={1}>
        <Input.Address value={message.from} label='From' disabled />
        <Input.Address value={message.to} label='To' disabled />
        <Input.Funds
          balance={new FilecoinNumber('0.1', 'fil')}
          label='Amount'
          disabled
          amount={new FilecoinNumber(message.value, 'fil').toAttoFil()}
        />
        <Input.Text
          onChange={noop}
          label='Transfer Fee'
          value={message.gas_used}
          backgroundColor='background.screen'
          disabled
        />
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
          mt={6}
          mx={1}
        >
          <Label>Total</Label>
          <Box display='flex' flexDirection='column'>
            <BigTitle color='core.primary'>
              {makeFriendlyBalance(
                new FilecoinNumber(message.value, 'fil').plus(
                  new FilecoinNumber(message.gas_used, 'attofil')
                ),
                18
              ).toString()}{' '}
              FIL
            </BigTitle>
            <Title color='core.darkgray'>
              {!converterError &&
                `${makeFriendlyBalance(
                  converter.fromFIL(
                    new FilecoinNumber(message.value, 'fil').plus(
                      new FilecoinNumber(message.gas_used, 'attofil')
                    )
                  ),
                  18
                ).toString()}
              USD`}
            </Title>
          </Box>
        </Box>
      </Box>
    </MessageDetailCard>
  )
}

MessageDetail.propTypes = {
  address: ADDRESS_PROPTYPE,
  close: func,
  message: MESSAGE_PROPS
}

export default MessageDetail
