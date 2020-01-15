import React from 'react'
import PropTypes from 'prop-types'
import 'styled-components/macro'

import { useProgress } from '../../hooks'
import { LEDGER_STATE_PROPTYPES } from './ledgerStateManagement'
import { Button } from './styledComponents'
import connectLedger from './connectLedger'

const ImportLedgerBtn = ({ ledgerState, dispatchRdx, dispatchLocal }) => {
  const { setProgress } = useProgress()
  return (
    <Button
      disabled={
        !(
          ledgerState.userVerifiedLedgerConnected &&
          ledgerState.userVerifiedLedgerUnlocked &&
          ledgerState.userVerifiedFilecoinAppOpen
        )
      }
      onClick={async () => {
        const successfulConnection = await connectLedger(
          dispatchLocal,
          dispatchRdx
        )
        if (successfulConnection) setProgress(2)
      }}
    >
      {ledgerState.userImportFailure ? 'Try again' : 'Import Ledger Wallet'}
    </Button>
  )
}

ImportLedgerBtn.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES,
  dispatchLocal: PropTypes.func.isRequired,
  dispatchRdx: PropTypes.func.isRequired
}

export default ImportLedgerBtn
