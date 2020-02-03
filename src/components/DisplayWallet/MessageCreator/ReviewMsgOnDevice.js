import React from 'react'
import PropTypes from 'prop-types'

import { MessageForm, SendButton, MessageReview } from '../../StyledComponents'

import { RESET_STATE, LEDGER_STATE_PROPTYPES } from '../../../utils/ledger'

const ReviewMsgOnDevice = ({
  ledgerState,
  errorFromRdx,
  setConfirmStage,
  dispatchLocal
}) => {
  return (
    <MessageForm>
      <MessageReview>
        {ledgerState.userInitiatedImport && ledgerState.userImportFailure
          ? `Is your Ledger plugged in, unlocked, and Filecoin app open?`
          : `Sign the message on your Ledger.`}
      </MessageReview>

      {ledgerState.userInitiatedImport &&
        (ledgerState.userImportFailure || errorFromRdx) && (
          <SendButton
            onClick={() => {
              setConfirmStage('')
              dispatchLocal({ type: RESET_STATE })
            }}
          >
            Try again
          </SendButton>
        )}
    </MessageForm>
  )
}

ReviewMsgOnDevice.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES,
  errorFromRdx: PropTypes.instanceOf(Error),
  setConfirmStage: PropTypes.func.isRequired,
  dispatchLocal: PropTypes.func.isRequired
}

export default ReviewMsgOnDevice
