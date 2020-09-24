import React, { useEffect, useState } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import styled from 'styled-components'
import dayjs from 'dayjs'

import {
  Box,
  Card,
  Input,
  Glyph,
  Text,
  Label,
  Title as Total,
  Num,
  StyledATag
} from '../../../Shared'
import { ButtonClose } from '../../../Shared/IconButtons'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import noop from '../../../../utils/noop'
import { useWalletProvider } from '../../../../WalletProvider'
import { SEND, PROPOSE, EXEC } from '../../../../constants'
import MsgTypeAndStatus from './MsgTypeAndStatus'
import DetailSection from './DetailSection'

const MessageDetailCard = styled(Card).attrs(() => ({
  maxWidth: 13,
  border: 1,
  borderColor: 'core.silver'
}))`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: auto;
  background-color: ${props => props.theme.colors.background.screen};
`
const TransactionFeeDisplay = styled(Input.Text)`
  &:hover {
    background: transparent;
  }
`

const MessageDetail = ({ address, close, message }) => {
  const { walletProvider } = useWalletProvider()
  const [fee, setFee] = useState(
    new FilecoinNumber(
      message.status === 'pending' ? message.maxFee : message.paidFee,
      'attofil'
    )
  )
  const [fetchedTransactionFee, setFetchedTransactionFee] = useState(false)

  const loadingFee = fee.toAttoFil() === '0' && !fetchedTransactionFee
  // if this is a SENT transaction, add the fee to the total
  const shouldAddFeeToTotal = address === message.from

  useEffect(() => {
    const fetchGasUsed = async msgCid => {
      const transactionFee = await walletProvider.gasLookupTxFee(msgCid)
      setFee(transactionFee)
      setFetchedTransactionFee(true)
    }

    if (!fetchedTransactionFee) {
      fetchGasUsed(message.cid)
    }
  }, [
    message.cid,
    fetchedTransactionFee,
    setFetchedTransactionFee,
    setFee,
    walletProvider
  ])

  return (
    <MessageDetailCard>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box display='flex' flexDirection='row' alignItems='center'>
          <Glyph
            acronym='Td'
            color='background.screen'
            borderColor='core.primary'
            backgroundColor='core.primary'
          />

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
            <MsgTypeAndStatus address={address} message={message} />
          </Box>
          <Box display='flex' flexDirection='row' mr={2}>
            <Text my='0' mr={3} color='core.darkgray'>
              {dayjs.unix(message.timestamp).format('YYYY-MM-DD')}
            </Text>
            <Text my='0'>
              {dayjs.unix(message.timestamp).format('HH:mm:ss')}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box display='flex' flexDirection='column' flexGrow='1' mt={1}>
        <DetailSection message={message} />
        <TransactionFeeDisplay
          textAlign='right'
          onChange={noop}
          label='Transfer Fee'
          value={loadingFee ? 'Loading...' : `${fee.toAttoFil()} aFIL`}
          backgroundColor='background.screen'
          disabled
        />
        <Box
          display='flex'
          flexDirection='row'
          alignItems='flex-start'
          justifyContent='space-between'
          mt={5}
          mx={1}
        >
          <Total mt={1} fontSize={4} alignSelf='flex-start'>
            Total
          </Total>
          <Box display='flex' flexDirection='column' textAlign='right' pl={4}>
            <Num
              size='l'
              css={`
                word-wrap: break-word;
              `}
              color='core.primary'
            >
              {new FilecoinNumber(message.value, 'attofil')
                .plus(shouldAddFeeToTotal ? fee : 0)
                .toString()}{' '}
              FIL
            </Num>
          </Box>
        </Box>
        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent='space-between'
          alignItems='flex-end'
          flexGrow='1'
          mt={6}
        >
          <Label color='core.silver' textAlign='left' m={1}>
            Message Hash
          </Label>
          <Label
            color='core.silver'
            textAlign='left'
            m={1}
            maxWidth={9}
            css={`
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: no-wrap;
            `}
          >
            {message.cid}
          </Label>
          <StyledATag
            rel='noopener noreferrer'
            target='_blank'
            href={`https://filfox.info/en/message/${message.cid}`}
          >
            <Label color='core.primary' textAlign='left' m={1}>
              View on Filfox
            </Label>
          </StyledATag>
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
