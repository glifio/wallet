import React from 'react'
import PropTypes from 'prop-types'
import 'styled-components/macro'
import { useSelector } from 'react-redux'

import { useProgress } from '../../hooks'
import { LEDGER_STATE_PROPTYPES } from './ledgerStateManagement'
import { Button } from './styledComponents'
import connectLedger from './connectLedger'

const ImportLedgerBtn = ({ ledgerState, dispatchRdx, dispatchLocal }) => {
  const { setProgress } = useProgress()
  const walletProvider = useSelector(state => state.walletProvider)
  return (
    <Button
      disabled={
        !(
          ledgerState.userVerifiedLedgerConnected &&
          ledgerState.userVerifiedLedgerUnlocked &&
          ledgerState.userVerifiedFilecoinAppOpen
        )
      }
      onClick={async () =>
        await connectLedger(
          walletProvider,
          setProgress,
          dispatchLocal,
          dispatchRdx
        )
      }
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
