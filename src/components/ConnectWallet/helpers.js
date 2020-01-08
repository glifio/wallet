export const determineDotColorForLedgerConnection = ledgerState => {
  if (ledgerState.connecting) return 'blue'
  else if (ledgerState.connectedFailure) return 'red'
  else if (ledgerState.connectedSuccess) return 'green'
  return ''
}

export const determineDotColorForLedgerUnlocked = ledgerState => {
  if (ledgerState.ledgerLocked) return 'red'
  else if (ledgerState.ledgerUnlocked) return 'green'
  else if (ledgerState.establishingConnectionWFilecoinApp) return 'blue'
  return 'blue'
}

export const determineDotColorForFilecoinAppOpen = ledgerState => {
  if (ledgerState.filecoinAppNotOpen) return 'red'
  else if (ledgerState.filecoinAppOpen) return 'green'
  else if (ledgerState.establishingConnectionWFilecoinApp) return 'blue'
  return 'blue'
}
