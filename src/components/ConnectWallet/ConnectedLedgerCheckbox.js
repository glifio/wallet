import React from 'react'
import PropTypes from 'prop-types'

import { EducationalCheckboxItem, ColoredDot } from './styledComponents'
import {
  Checkbox,
  CheckboxInputLabel,
  GREEN,
  SECONDARY_BLUE,
  RED
} from '../StyledComponents'
import {
  USER_VERIFIED_LEDGER_CONNECTED,
  USER_UNVERIFIED_LEDGER_CONNECTED,
  LEDGER_STATE_PROPTYPES
} from '../../utils/ledger'

export const determineDotColorForLedgerConnection = ledgerState => {
  if (ledgerState.connecting) return SECONDARY_BLUE
  else if (ledgerState.connectedFailure) return RED
  else if (ledgerState.connectedSuccess) return GREEN
  return ''
}

const ConnectedLedgerCheckbox = ({ ledgerState, dispatchLocal }) => (
  <EducationalCheckboxItem>
    {!ledgerState.userInitiatedImport ? (
      <Checkbox
        onChange={() =>
          dispatchLocal({
            type: ledgerState.userVerifiedLedgerConnected
              ? USER_UNVERIFIED_LEDGER_CONNECTED
              : USER_VERIFIED_LEDGER_CONNECTED
          })
        }
        type='checkbox'
        name='ledger_connected'
        id='ledger_connected'
        checked={ledgerState.userVerifiedLedgerConnected}
      />
    ) : (
      <ColoredDot color={determineDotColorForLedgerConnection(ledgerState)} />
    )}
    <CheckboxInputLabel htmlFor='ledger_connected'>
      My Ledger is connected to my computer.
    </CheckboxInputLabel>
  </EducationalCheckboxItem>
)

ConnectedLedgerCheckbox.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES,
  dispatchLocal: PropTypes.func.isRequired
}

export default ConnectedLedgerCheckbox
