import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useProgress } from '../../hooks'
import { ButtonBase } from '../StyledComponents'
import { connectLedger, LEDGER_STATE_PROPTYPES } from '../../utils/ledger'

const Button = styled(ButtonBase)`
  align-self: center;
  margin-bottom: 30px;
`

const ImportLedgerBtn = ({
  ledgerState,
  dispatchRdx,
  dispatchLocal,
  network
}) => {
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
          dispatchRdx,
          network
        )
        if (successfulConnection) setProgress(2)
      }}
    >
      {ledgerState.userImportFailure ? 'Try again' : 'Access Device'}
    </Button>
  )
}

ImportLedgerBtn.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES,
  dispatchLocal: PropTypes.func.isRequired,
  dispatchRdx: PropTypes.func.isRequired,
  network: PropTypes.string.isRequired
}

export default ImportLedgerBtn
