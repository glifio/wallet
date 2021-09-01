import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FilecoinNumber } from '@glif/filecoin-number'
import { func } from 'prop-types'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { speedUpTransaction } from '../../../../utils/modifyTransaction'
import { useRouter } from 'next/router'
import {
  BaseButton,
  Box,
  Card,
  Input,
  Glyph,
  Text,
  Label,
  StyledATag
} from '../../../Shared'
import { ButtonClose } from '../../../Shared/IconButtons'
import { MESSAGE_PROPS, ADDRESS_PROPTYPE } from '../../../../customPropTypes'
import noop from '../../../../utils/noop'
import { useWalletProvider } from '../../../../WalletProvider'
import MsgTypeAndStatus from './MsgTypeAndStatus'
import DetailSection from './DetailSection'
import { FILFOX } from '../../../../constants'
import TotalSection from './TotalSection'

const MessageDetailCard = styled(Card).attrs(() => ({
  maxWidth: 13,
  border: 0
}))`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: auto;
  height: max-content;
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
  const [errFetchingTxFee, setErrFetchingTxFee] = useState('')

  const loadingFee = fee.toAttoFil() === '0' && !fetchedTransactionFee

  const router = useRouter()

  useEffect(() => {
    const fetchGasUsed = async message => {
      try {
        const res = await axios.get(`${FILFOX}/v1/message/${message.cid}`)
        if (res.status === 200) {
          const { baseFee, gasLimit, gasFeeCap, gasPremium, receipt } = res.data
          const transactionFee = await walletProvider.gasCalcTxFee(
            baseFee,
            gasLimit,
            gasFeeCap,
            gasPremium,
            receipt.gasUsed
          )
          setFee(transactionFee)
          setFetchedTransactionFee(true)
        } else {
          setErrFetchingTxFee(
            'There was an error fetching transaction fee information from Filfox.'
          )
        }
      } catch (err) {
        setErrFetchingTxFee(err.message)
      }
    }

    if (!fetchedTransactionFee && message.status !== 'pending') {
      fetchGasUsed(message)
    }
  }, [
    message,
    fetchedTransactionFee,
    setFetchedTransactionFee,
    setFee,
    walletProvider
  ])

  const txFeeValue = () => {
    if (loadingFee) return 'Loading...'
    if (message.status === 'pending') return 'Waiting for message to confirm.'
    if (errFetchingTxFee) return '0'
    return `${fee.toPicoFil()} pFIL`
  }

  return (
    <MessageDetailCard boxShadow={1}>
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
          error={errFetchingTxFee}
          value={txFeeValue()}
          backgroundColor='background.screen'
          disabled
        />
        {message.status === 'pending' && (
          <Box textAlign='right'>
            <BaseButton onClick={() => {
                speedUpTransaction(message.cid, router)
              }}>Speed Up Transaction</BaseButton>
          </Box>
        )}
        <TotalSection message={message} fee={fee} />
        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent='space-between'
          alignItems='flex-end'
          flexGrow='1'
          mt={7}
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
