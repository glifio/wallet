/**
 * This function basically computes a "connection score": 0 - disconnected, 1 bad node, 2 good to go
 *
 * A "connection" is a general health check - it consists of:
 * - do we have HTTP access to this node URL (is the node online?)
 * - if connected, is the node synced to the canonical chain?
 */

import axios from 'axios'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'

import { FILSCOUT, FILSCAN_JSONRPC } from '../../../constants'
import reportError from '../../../utils/reportError'

const TIPSET_PADDING = 15

const filscoutHeight = async () => {
  try {
    const { data } = await axios.get(`${FILSCOUT}/network/overview`)
    if (data.code !== 200) {
      return 0
    }

    return Number(data.data.statistic.tipset_height)
  } catch (err) {
    return 0
  }
}

const filscanHeight = async () => {
  try {
    const { data } = await axios.post(FILSCAN_JSONRPC, {
      id: 1,
      params: [],
      method: 'filscan.StatChainInfo'
    })
    if (!data.result || !data.result.data) {
      return 0
    }
    return data.result.data.latest_height
  } catch (err) {
    return 0
  }
}

const getHeightFromRPC = async (apiAddress, token) => {
  try {
    const client = new LotusRPCEngine({
      apiAddress,
      token
    })
    const chainHead = await client.request('ChainHead')
    return Number(chainHead.Height)
  } catch (err) {
    return 0
  }
}

const filterOutBadNodes = heights => heights.filter(height => height > 0)

const collectHeights = async () => {
  const calls = []

  for (let i = 1; i <= 5; i += 1) {
    calls.push(getHeightFromRPC(`https://node.glif.io/space0${i}/lotus/rpc/v0`))
  }

  calls.push(filscanHeight(), filscoutHeight())

  const heights = await Promise.all(calls)
  return filterOutBadNodes(heights)
}

// simple compute - sort the array,
// see if the node is TIPSET_PADDING blocks + than the highest height, or
// TIPSET_PADDING blocks - the lowest height
const computeScore = (height, heightsToCompare) => {
  heightsToCompare.sort((a, b) => a - b)
  const nodeFarAhead =
    height > heightsToCompare[heightsToCompare.length - 1] + TIPSET_PADDING
  const nodeFarBehind = height < heightsToCompare[0] - TIPSET_PADDING
  return nodeFarAhead || nodeFarBehind ? 1 : 2
}

export default async (apiAddress, token = '') => {
  const client = new LotusRPCEngine({
    apiAddress,
    token
  })

  const heights = await collectHeights()
  // if we cant make any comparisons, were assuming the network is unhealthy
  if (heights.length < 2) return 1

  try {
    const chainHead = await client.request('ChainHead')
    return computeScore(chainHead.Height, heights)
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
