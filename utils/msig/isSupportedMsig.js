/**
 * state looks like
 * {{"Balance":"0","State":{"Signers":["f020484","f023667"],"NumApprovalsThreshold":1,"NextTxnID":0,"InitialBalance":"0","StartEpoch":0,"UnlockDuration":0,"PendingTxns":{"/":"bafy2bzaceamp42wmmgr2g2ymg46euououzfyck7szknvfacqscohrvaikwfay"}}},"id":1}
 */

export default state => {
  return state.NumApprovalsThreshold === 1
}
