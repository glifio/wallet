import React from 'react'
import PropTypes from 'prop-types'

import {
  USER_UNVERIFIED_LEDGER_UNLOCKED,
  USER_VERIFIED_LEDGER_UNLOCKED,
  LEDGER_STATE_PROPTYPES
} from '../../utils/ledger'
import { EducationalCheckboxItem, ColoredDot } from './styledComponents'
import { Checkbox, CheckboxInputLabel } from '../StyledComponents'

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
    <CheckboxInputLabel
      htmlFor='ledger_unlocked'
      disabled={!ledgerState.userVerifiedLedgerConnected}
    >
      My Ledger device is unlocked.
    </CheckboxInputLabel>
  </EducationalCheckboxItem>
)

UnlockedLedgerCheckbox.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES,
  dispatchLocal: PropTypes.func
}

export default UnlockedLedgerCheckbox
