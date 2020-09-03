import React, { useEffect, useState } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func, oneOf } from 'prop-types'
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
  StyledATag,
  IconMessageStatus,
  IconPending
} from '../../Shared'
import { ButtonClose } from '../../Shared/IconButtons'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { useConverter } from '../../../lib/Converter'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import noop from '../../../utils/noop'
import { useWalletProvider } from '../../../WalletProvider'

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

const TxStatusText = ({ address, from, status }) => {
  if (status === 'pending') return 'PENDING'
  if (address === from) return 'SENT'
  return 'RECEIVED'
}

TxStatusText.propTypes = {
  address: ADDRESS_PROPTYPE,
  from: ADDRESS_PROPTYPE,
  status: oneOf(['pending', 'confirmed'])
}

const MessageDetail = ({ address, close, message }) => {
  const { walletProvider } = useWalletProvider()
  const { converter, converterError } = useConverter()
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
            {message.status === 'confirmed' ? (
              <IconMessageStatus status='confirmed' />
            ) : (
              <IconPending height={4} />
            )}
            <Label
              color={
                message.status === 'confirmed'
                  ? 'status.success.background'
                  : 'status.pending.foreground'
              }
            >
              <TxStatusText
                address={address}
                from={message.from}
                status={message.status}
              />
            </Label>
          </Box>
          <Box display='flex' flexDirection='row' mr={2}>
            <Text my='0' mr={3} color='core.darkgray'>
              {dayjs.unix(message.timestamp).format('MMM DD')}
            </Text>
            <Text my='0'>{dayjs.unix(message.timestamp).format('hh:mmA')}</Text>
          </Box>
        </Box>
      </Box>
      <Box mt={1}>
        <Box mt={3}>
          <Input.Address value={message.from} label='From' disabled />
          <Input.Address value={message.to} label='To' disabled />
        </Box>
        <Input.Funds
          my={3}
          balance={new FilecoinNumber('0.1', 'fil')}
          label='Amount'
          disabled
          amount={new FilecoinNumber(message.value, 'fil').toAttoFil()}
        />
        <Input.Text
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
              {new FilecoinNumber(message.value, 'fil')
                .plus(shouldAddFeeToTotal ? fee : 0)
                .toString()}{' '}
              FIL
            </Num>
            <Num size='m' color='core.darkgray'>
              {!converterError &&
                (converter
                  ? `${makeFriendlyBalance(
                      converter.fromFIL(
                        new FilecoinNumber(message.value, 'fil').plus(
                          shouldAddFeeToTotal ? fee : 0
                        )
                      ),
                      2
                    )} USD`
                  : 'Loading USD...')}
            </Num>
          </Box>
        </Box>
        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent='space-between'
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
            href={`https://filscout.io/en/pc/message/${message.cid}`}
          >
            <Label color='core.primary' textAlign='left' m={1}>
              View on Filscout
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
