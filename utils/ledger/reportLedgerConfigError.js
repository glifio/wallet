/* eslint-disable consistent-return */
export const reportLedgerConfigError = (
  ledgerLocked,
  filecoinAppNotOpen,
  replug,
  busy,
  otherError
) => {
  if (busy) return 'Is your Ledger device busy?'
  if (ledgerLocked) return 'Is your Ledger device unlocked?'
  if (filecoinAppNotOpen) return 'Is the Filecoin App open on your device?'
  if (replug) return 'Please unplug and replug your device, and try again.'
  if (otherError) return `Unhandled error event: ${otherError.message}`
}

export const hasLedgerError = (
  ledgerLocked,
  filecoinAppNotOpen,
  replug,
  ledgerBusy,
  otherError
) => ledgerLocked || filecoinAppNotOpen || replug || ledgerBusy || otherError
