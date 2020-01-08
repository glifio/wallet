import React from 'react'

import {
  USER_VERIFIED_FILECOIN_APP_OPEN,
  USER_UNVERIFIED_FILECOIN_APP_OPEN
} from './ledgerStateManagement'
import {
  EducationalCheckboxItem,
  Checkbox,
  ColoredDot,
  InputLabel
} from './styledComponents'

export const determineDotColorForFilecoinAppOpen = ledgerState => {
  if (ledgerState.filecoinAppNotOpen) return 'red'
  else if (ledgerState.filecoinAppOpen) return 'green'
  else if (ledgerState.establishingConnectionWFilecoinApp) return 'blue'
  return 'blue'
}

const FilecoinAppOpenCheckbox = ({ ledgerState, dispatchLocal }) => (
  <EducationalCheckboxItem>
    {!ledgerState.filecoinAppOpen && !ledgerState.filecoinAppNotOpen ? (
      <Checkbox
        onChange={() =>
          dispatchLocal({
            type: ledgerState.userVerifiedFilecoinAppOpen
              ? USER_UNVERIFIED_FILECOIN_APP_OPEN
              : USER_VERIFIED_FILECOIN_APP_OPEN
          })
        }
        type='checkbox'
        name='filecoin_app_open'
        id='filecoin_app_open'
        checked={ledgerState.userVerifiedFilecoinAppOpen}
        disabled={
          !ledgerState.userVerifiedLedgerConnected ||
          !ledgerState.userVerifiedLedgerUnlocked
        }
      />
    ) : (
      <ColoredDot color={determineDotColorForFilecoinAppOpen(ledgerState)} />
    )}
    <InputLabel
      htmlFor='filecoin_app_open'
      disabled={
        !ledgerState.userVerifiedLedgerConnected ||
        !ledgerState.userVerifiedLedgerUnlocked
      }
    >
      The Filecoin App is open on my Ledger.
    </InputLabel>
  </EducationalCheckboxItem>
)

export default FilecoinAppOpenCheckbox
