import React, { forwardRef } from 'react'
import { useSelector } from 'react-redux'
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

const MessageDetailCard = styled(Card)`
  background-color: ${props => props.theme.colors.background.screen};
`

const MessageDetail = forwardRef(({ setMessage }, ref) => {
  const { message } = useSelector(state => {
    // const currentMessage = state.messages.find(item => {
    //   item
    // })
    return {
      message: state.messages[0] ? state.messages[0] : {}
    }
  })

  return (
    <>
      <Box position='relative'>
        <MessageDetailCard
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          border='none'
          width='auto'
          my={2}
          mx={4}
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' alignItems='center'>
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
            <Box>
              <ButtonClose
                ml={2}
                type='button'
                onClick={() => {
                  console.log('yo')
                  setMessage(null)
                }}
              />

              <Box
                css={`
                  position: relative;
                  right: 80px;
                `}
              >
                <IconMessageStatus status='confirmed' />
                <Label
                  css={`
                    display: inline-block;
                  `}
                  status='confirmed'
                >
                  SENT
                </Label>
                {/* <Text color='core.primary'>Transaction Details</Text> */}
              </Box>
            </Box>
          </Box>
          <Box mt={3}>
            {/* <Input.Funds name='amount' label='Amount' disabled /> */}
            <Input.Address
              name='recipient'
              value={message.toAddress}
              label='Recipient'
              disabled
            />
            <Input.Address
              name='sender'
              value={message.toAddress}
              label='Sender'
              disabled
            />

            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='space-between'
              mt={3}
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
      </Box>
    </>
  )
})

MessageDetail.propTypes = { setMessage: func }

export default MessageDetail
