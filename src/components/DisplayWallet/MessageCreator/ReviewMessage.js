import React from 'react'
import PropTypes from 'prop-types'
import 'styled-components/macro'
import FilecoinNumber from '@openworklabs/filecoin-number'

import { MessageForm, SendButton, MessageReview } from '../../StyledComponents'
import { LEDGER_STATE_PROPTYPES } from '../../../utils/ledger'
import GasConfig from './GasConfig'

const ReviewMessage = ({
  ledgerState,
  gasPrice,
  gasLimit,
  setGasLimit,
  setGasPrice,
  toAddress,
  value
}) => {
  return (
    <MessageForm>
      {ledgerState.userInitiatedImport && ledgerState.userImportFailure ? (
        <MessageReview>
          Is your Ledger plugged in, unlocked, and Filecoin app open?
        </MessageReview>
      ) : (
        <>
          <MessageReview
            css={`
              margin-top: 0;
            `}
          >
            You're sending <strong>{value.toFil()} FIL</strong> to{' '}
            <strong>{toAddress}</strong>
            <GasConfig
              gasPrice={gasPrice}
              setGasPrice={v => setGasPrice(v)}
              gasLimit={gasLimit}
              setGasLimit={v => setGasLimit(v)}
            />
          </MessageReview>
          <SendButton type='submit'>Send</SendButton>
        </>
      )}
    </MessageForm>
  )
}

ReviewMessage.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES,
  gasPrice: PropTypes.string.isRequired,
  setGasPrice: PropTypes.func.isRequired,
  gasLimit: PropTypes.string.isRequired,
  setGasLimit: PropTypes.func.isRequired,
  toAddress: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.instanceOf(FilecoinNumber)
  ])
}

export default ReviewMessage
