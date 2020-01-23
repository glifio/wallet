import React from 'react'
import PropTypes from 'prop-types'

import {
  USER_VERIFIED_FILECOIN_APP_OPEN,
  USER_UNVERIFIED_FILECOIN_APP_OPEN,
  LEDGER_STATE_PROPTYPES
} from '../../utils/ledger'

import { EducationalCheckboxItem, ColoredDot } from './styledComponents'
import {
  Checkbox,
  CheckboxInputLabel,
  SECONDARY_BLUE,
  GREEN,
  RED
} from '../StyledComponents'

export const determineDotColorForFilecoinAppOpen = ledgerState => {
  if (ledgerState.filecoinAppNotOpen) return RED
  else if (ledgerState.filecoinAppOpen) return GREEN
  else if (ledgerState.establishingConnectionWFilecoinApp) return SECONDARY_BLUE
  return SECONDARY_BLUE
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
    <CheckboxInputLabel
      htmlFor='filecoin_app_open'
      disabled={
        !ledgerState.userVerifiedLedgerConnected ||
        !ledgerState.userVerifiedLedgerUnlocked
      }
    >
      The Filecoin App is open on my Ledger.
    </CheckboxInputLabel>
  </EducationalCheckboxItem>
)

FilecoinAppOpenCheckbox.propTypes = {
  ledgerState: LEDGER_STATE_PROPTYPES,
  dispatchLocal: PropTypes.func.isRequired
}

export default FilecoinAppOpenCheckbox
