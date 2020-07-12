export const reportLedgerConfigError = ({
  connectedFailure,
  locked,
  filecoinAppNotOpen,
  replug,
  busy,
  inUseByAnotherApp,
  otherError
}) => {
  if (connectedFailure) return 'Is your Ledger device plugged in?'
  if (busy) return 'Is your Ledger device locked or busy?'
  if (locked) return 'Is your Ledger device unlocked?'
  if (filecoinAppNotOpen)
    return 'Is the Filecoin App open on your Ledger device?'
  if (replug)
    return 'Please unplug and replug your Ledger device, and try again.'
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
  otherError
}) =>
  connectedFailure ||
  locked ||
  filecoinAppNotOpen ||
  replug ||
  busy ||
  inUseByAnotherApp ||
  otherError
