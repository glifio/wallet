import {
  LEDGER_VERSION_MAJOR,
  LEDGER_VERSION_MINOR,
  LEDGER_VERSION_PATCH
} from '../../../constants'

export const reportLedgerConfigError = ({
  connectedFailure,
  locked,
  filecoinAppNotOpen,
  replug,
  busy,
  inUseByAnotherApp,
  badVersion,
  webUSBSupported,
  otherError
}) => {
  if (!webUSBSupported)
    return "We're sorry, but we can't connect to your device because your machine does not support WebUSB."
  if (connectedFailure) return 'Is your Ledger device plugged in?'
  if (busy) return 'Is your Ledger device locked or busy?'
  if (locked) return 'Is your Ledger device unlocked?'
  if (badVersion)
    return `Please update your Filecoin Ledger app to v${LEDGER_VERSION_MAJOR}.${LEDGER_VERSION_MINOR}.${LEDGER_VERSION_PATCH}, and try again.`
  if (filecoinAppNotOpen)
    return 'Is the Filecoin App open on your Ledger device?'
  if (replug)
    return 'Please quit the Filecoin app, and unplug/replug your Ledger device, and try again.'
  if (inUseByAnotherApp)
    return 'Please quit any other App using your Ledger device.'
  if (otherError) return otherError
}

export const hasLedgerError = ({
  connectedFailure,
  locked,
  filecoinAppNotOpen,
  replug,
  busy,
  inUseByAnotherApp,
  badVersion,
  webUSBSupported,
  otherError
}) =>
  !webUSBSupported ||
  connectedFailure ||
  locked ||
  filecoinAppNotOpen ||
  replug ||
  busy ||
  inUseByAnotherApp ||
  badVersion ||
  otherError
