import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'

const fetchParams = async cid => {
  const rpc = new LotusRPCEngine({ apiAddress: process.env.LOTUS_NODE_JSONRPC })
  const msg = await rpc.request('ChainGetMessage', { '/': cid })
  return msg.Params
}

export default messages => {
  return Promise.all(
    messages.map(async m => {
      if (m.method === 'Send') return m
      if (m.method === 'Propose') {
        const p = await fetchParams(m.cid)
        return { ...m, params: p }
      }
      console.log('Unrecognized Method')
      return m
    })
  )
}
