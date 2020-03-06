import React from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import styled from 'styled-components'

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
import { MESSAGE_PROPS } from '../../../customPropTypes'

const MessageDetailCard = styled(Card).attrs(() => ({
  my: 2,
  mx: 2
}))`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: none;
  width: auto;
  background-color: ${props => props.theme.colors.background.screen};
`

const MessageDetail = ({ close, message }) => {
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
          <Box m='0' display='flex' flexDirection='row' alignItems='center'>
            <IconMessageStatus status='confirmed' />
            <Label
              color={
                message.status === 'confirmed'
                  ? 'status.success.background'
                  : 'status.pending.foreground'
              }
            >
              SENT
            </Label>
          </Box>
          <Box display='flex' flexDirection='row' mr={2}>
            <Text my='0' mr={1} color='core.lightgray'>
              Jan 24,
            </Text>
            <Text my='0'>11:48PM</Text>
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
          amount={message.value}
        />
        <Input.Text
          onChange={() => {}}
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
              {new FilecoinNumber(message.value, 'attofil').toFil()}
            </BigTitle>
            <Title color='core.darkgray'>
              {new FilecoinNumber(message.value, 'attofil').toFil()}
            </Title>
          </Box>
        </Box>
      </Box>
    </MessageDetailCard>
  )
}

MessageDetail.propTypes = { close: func, message: MESSAGE_PROPS }

export default MessageDetail
