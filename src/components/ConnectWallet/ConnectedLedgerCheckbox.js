import React from 'react'

import {
  EducationalCheckboxItem,
  Checkbox,
  ColoredDot,
  InputLabel
} from './styledComponents'
import {
  USER_VERIFIED_LEDGER_CONNECTED,
  USER_UNVERIFIED_LEDGER_CONNECTED
} from './ledgerStateManagement'

export const determineDotColorForLedgerConnection = ledgerState => {
  if (ledgerState.connecting) return 'blue'
  else if (ledgerState.connectedFailure) return 'red'
  else if (ledgerState.connectedSuccess) return 'green'
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
    <InputLabel htmlFor='ledger_connected'>
      My Ledger is connected to my computer.
    </InputLabel>
  </EducationalCheckboxItem>
)

export default ConnectedLedgerCheckbox
