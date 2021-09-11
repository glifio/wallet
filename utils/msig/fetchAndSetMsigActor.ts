import { Dispatch } from 'react'
import LotusRpcEngine from '@glif/filecoin-rpc-client'
import type { MessageReceipt } from '@glif/filecoin-wallet-provider' // eslint-disable-line prettier/prettier
import getAddressFromReceipt from '../getAddrFromReceipt'

export default async function fetchAndSetMsigActor(
  msgCid: string,
  setMsigActor: Dispatch<string>,
  setMsigError: Dispatch<string>
): Promise<void> {
  const lCli = new LotusRpcEngine({
    apiAddress: process.env.LOTUS_NODE_JSONRPC
  })
  try {
    const receipt = await lCli.request<MessageReceipt>('StateGetReceipt', { '/': msgCid }, null)
    if (!receipt.Return) {
      // this error message is currently not being used anywhere in the UI - its being used moreso as a boolean that an error occured...
      setMsigError(
        'There was an error when creating, confirming, or fetching your multisig actor.'
      )
    } else if (receipt.ExitCode === 0) {
      setMsigActor(getAddressFromReceipt(receipt.Return))
    } else {
      // this error message is currently not being used anywhere in the UI - its being used moreso as a boolean that an error occured...
      setMsigError(
        'There was an error when creating, confirming, or fetching your multisig actor.'
      )
    }
  } catch (err) {
    // this error message is currently not being used anywhere in the UI - its being used moreso as a boolean that an error occured...
    setMsigError(err?.message || err)
  }
}
