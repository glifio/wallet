import React from 'react'

import {
  USER_UNVERIFIED_LEDGER_UNLOCKED,
  USER_VERIFIED_LEDGER_UNLOCKED
} from './ledgerStateManagement'
import {
  EducationalCheckboxItem,
  Checkbox,
  ColoredDot,
  InputLabel
} from './styledComponents'

export const determineDotColorForLedgerUnlocked = ledgerState => {
  if (ledgerState.ledgerLocked) return 'red'
  else if (ledgerState.ledgerUnlocked) return 'green'
  else if (ledgerState.establishingConnectionWFilecoinApp) return 'blue'
  return 'blue'
}

const UnlockedLedgerCheckbox = ({ ledgerState, dispatchLocal }) => (
  <EducationalCheckboxItem>
    {!ledgerState.ledgerUnlocked && !ledgerState.ledgerLocked ? (
      <Checkbox
        onChange={() =>
          dispatchLocal({
            type: ledgerState.userVerifiedLedgerUnlocked
              ? USER_UNVERIFIED_LEDGER_UNLOCKED
              : USER_VERIFIED_LEDGER_UNLOCKED
          })
        }
        type='checkbox'
        name='ledger_unlocked'
        id='ledger_unlocked'
        checked={ledgerState.userVerifiedLedgerUnlocked}
        disabled={!ledgerState.userVerifiedLedgerConnected}
      />
    ) : (
      <ColoredDot color={determineDotColorForLedgerUnlocked(ledgerState)} />
    )}
    <InputLabel
      htmlFor='ledger_unlocked'
      disabled={!ledgerState.userVerifiedLedgerConnected}
    >
      My Ledger device is unlocked.
    </InputLabel>
  </EducationalCheckboxItem>
)

export default UnlockedLedgerCheckbox
