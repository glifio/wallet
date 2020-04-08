export const reportLedgerConfigError = ({
  connectedFailure,
  ledgerLocked,
  filecoinAppNotOpen,
  replug,
  busy,
  inUseByAnotherApp,
  otherError
}) => {
  if (connectedFailure) return 'Is your Ledger device plugged in?'
  if (busy) return 'Is your Ledger device busy?'
  if (ledgerLocked) return 'Is your Ledger device unlocked?'
  if (filecoinAppNotOpen)
    return 'Is the Filecoin App open on your Ledger device?'
  if (replug)
    return 'Please unplug and replug your Ledger device, and try again.'
  if (inUseByAnotherApp)
    return 'Please quit any other App using your Ledger device.'
  if (otherError) return otherError && otherError.message
}

export const hasLedgerError = ({
  connectedFailure,
  ledgerLocked,
  filecoinAppNotOpen,
  replug,
  ledgerBusy,
  inUseByAnotherApp,
  otherError
}) =>
  connectedFailure ||
  ledgerLocked ||
  filecoinAppNotOpen ||
  replug ||
  ledgerBusy ||
  inUseByAnotherApp ||
  otherError
