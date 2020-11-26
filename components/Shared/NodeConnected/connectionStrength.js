/**
 * This function basically computes a "connection score": 0 - disconnected, 1 bad node, 2 good to go
 *
 * A "connection" is a general health check - it consists of:
 * - do we have HTTP access to this node URL (is the node online?)
 * - does the node report back a height for chain head?
 */

import LotusRPCEngine from '@glif/filecoin-rpc-client'

import reportError from '../../../utils/reportError'

const connectionStrength = async (apiAddress, token = '') => {
  const client = new LotusRPCEngine({
    apiAddress,
    token
  })

  try {
    const chainHead = await client.request('ChainHead')
    if (chainHead.Height) return 2
    return 0
  } catch (err) {
    reportError(
      'components/Shared/NodeConnected/connectionStrength.js:1',
      false,
      err.message,
      err.stack
    )
    return 0
  }
}

export default connectionStrength
