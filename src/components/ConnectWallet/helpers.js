export const determineDotColorForLedgerConnection = ledgerState => {
  if (ledgerState.connecting) return 'blue'
  else if (ledgerState.connectedFailure) return 'red'
  else if (ledgerState.connectedSuccess) return 'green'
  return ''
}
