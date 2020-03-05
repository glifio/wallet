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

const MessageDetailCard = styled(Card)`
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
              <Box>
                <ButtonClose
                  ml={2}
                  type='button'
                  onClick={() => {
                    setMessage(null)
                  }}
                  css={`
                    float: right;
                    margin-bottom: -10px;
                    position: relative;
                    left: 10px;
                  `}
                />
              </Box>

              <Box
                css={`
                  float: right;
                `}
              >
                <Box
                  css={`
                    margin-bottom: 6px;
                  `}
                >
                  <IconMessageStatus
                    status='confirmed'
                    css={`
                      position: relative;
                      top: 4px;
                      right: 4px;
                    `}
                  />
                  {/* <Text color='core.primary'>Transaction Details</Text> */}
                  <Label
                    status='confirmed'
                    css={`
                      display: inline-block;
                      font-size: 1rem;
                      font-weight: bold;
                      position: relative;
                      right: 6px;
                    `}
                  >
                    SENT
                  </Label>
                </Box>
                <Box
                  css={`
                    font-size: 1.125rem;
                  `}
                >
                  Jan 24,{' '}
                  <span
                    css={`
                      color: ${theme.textStyles.label.fontColor};
                    `}
                  >
                    11:48PM
                  </span>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={3}>
            <Input.Address
              css={`
                color: ${theme.colors.core.primary};
              `}
              name='sender'
              value='t123'
              label='Sender'
              disabled
            />
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
      </Box>
    </>
  )
})

MessageDetail.propTypes = { setMessage: func }

export default MessageDetail
