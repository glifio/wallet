/**
 * This function basically computes a "connection score": 0 - disconnected, 1 bad node, 2 good to go
 *
 * A "connection" is a general health check - it consists of:
 * - do we have HTTP access to this node URL (is the node online?)
 * - if connected, is the node synced to the canonical chain?
 */

import axios from 'axios'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'

import { FILSCOUT, FILSCAN } from '../../../constants'

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
    const { data } = await axios.get(`${FILSCAN}/BaseInformation`)
    if (data.res.code !== 3) {
      return 0
    }
    return Number(data.data.tipset_height)
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

  for (let i = 0; i < 5; i += 1) {
    calls.push(getHeightFromRPC('https://proxy.openworklabs.com/rpc/v0'))
  }

  calls.push(filscanHeight(), filscoutHeight())

  const heights = await Promise.all(calls)
  return filterOutBadNodes(heights)
}

// simple compute - take the average of the heightsToCompare,
// if the height is greater than +/- 15 away from the average,
// its an unhealthy node
const computeScore = (height, heightsToCompare) => {
  const avg = Math.round(
    heightsToCompare.reduce((sum, h) => sum + h, 0) /
      Number(heightsToCompare.length)
  )

  return Math.abs(height - avg) > 15 ? 1 : 2
}

export default async (apiAddress, token = '') => {
  const client = new LotusRPCEngine({
    apiAddress,
    token
  })

  const heights = await collectHeights()
  // if we cant make any comparisons, were assuming the network is unhealthy
  if (heights.length < 2) return 0

  try {
    const chainHead = await client.request('ChainHead')
    return computeScore(chainHead.Height, heights)
  } catch (err) {
    return 0
  }
}
