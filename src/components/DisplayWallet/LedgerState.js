import React from 'react'

import { MessageReview } from '../StyledComponents'
import { LEDGER_STATE_PROPTYPES } from '../ConnectWallet/ledgerStateManagement'

const LedgerState = ({ ledgerState }) => {
  if (ledgerState.userInitiatedImport && ledgerState.userImportFailure) {
    return (
      <MessageReview css={{ marginBottom: '78px', marginTop: '45px' }}>
        There was an issue connecting with your Ledger device. Please make sure
        it is unlocked with the Filecoin Application open.
      </MessageReview>
    )
  }
  return (
    <MessageReview css={{ marginBottom: '78px', marginTop: '45px' }}>
      Confirm the message on your Ledger.
    </MessageReview>
  )
}

LedgerState.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES
}

export default LedgerState
