import React, { forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import styled from 'styled-components'
import theme from '../../Shared/theme'

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

const MessageDetailCard = styled(Card).attrs(props => ({
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

const MessageDetail = forwardRef(({ setMessage }, ref) => {
  // const { message } = useSelector(state => {
  //   // const currentMessage = state.messages.find(item => {
  //   //   item
  //   // })
  //   return {
  //     message: state.messages[0] ? state.messages[0] : {}
  //   }
  // })

  const message = {
    to: 't1quexo6nwc27rtbo5jqutywo3dfxbbrqut6pat3y',
    from: 't1hn7twanih6djfrg7s3phaek3ayge72c6vhndrhq',
    nonce: 25,
    value: '1000000000000000',
    gasprice: '1',
    gas_used: '1000',
    cid: 'bafy2bzacecf2gancqs5xqffznydzixqco6rjerm337b5tjl2zqjy7qs32bnv2',
    status: 'confirmed'
  }

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
            onClick={() => {
              setMessage(null)
            }}
            css={`
              align-self: flex-end;
            `}
          />
          <Box m='0' display='flex' flexDirection='row' alignItems='center'>
            <IconMessageStatus status='confirmed' />
            <Label status='confirmed'>SENT</Label>
          </Box>
          <Box display='flex' flexDirection='row' mr={2}>
            <Text my='0' mr={1} color='gray'>
              Jan 24,
            </Text>
            <Text my='0'>11:48PM</Text>
          </Box>
        </Box>
      </Box>
      <Box mt={1}>
        <Input.Address value='t123' label='Sender' disabled />
        <Input.Address
          name='recipient'
          value='t123'
          label='Recipient'
          disabled
        />
        <Input.Funds
          balance={new FilecoinNumber('0.1', 'fil')}
          label='Amount'
          disabled
          valid
          viewOnly
        />
        <Input.Text
          onChange={() => {}}
          label='Transfer Fee'
          value='< 0.1FIL'
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
            <BigTitle color='core.primary'>2 FIL</BigTitle>
            <Title color='core.darkgray'>10 USD</Title>
            {/* <BigTitle color='core.primary'>{value.fil.toFil()} FIL</BigTitle>
                <Title color='core.darkgray'>{value.fiat.toString()} USD</Title> */}
          </Box>
        </Box>
      </Box>
    </MessageDetailCard>
  )
})

MessageDetail.propTypes = { setMessage: func }

export default MessageDetail
