import React, { useState } from 'react'
import MessageDetail from '../../Wallet/Message/Detail'
import { MessageHistoryTable } from '../../Shared'
import useWallet from '../../../WalletProvider/useWallet'
import useTransactionHistory from '../../../lib/useTransactionHistory'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

const MessageHistory = ({ address }) => {
  const [selectedMessageCid, setSelectedMessageCid] = useState('')
  const wallet = useWallet()
  const {
    pending,
    confirmed,
    loading,
    paginating,
    showMore,
    refresh,
    total
  } = useTransactionHistory(address)

  const messages = [...pending, ...confirmed]
  return (
    <>
      {selectedMessageCid ? (
        <MessageDetail
          address={wallet.address}
          close={() => setSelectedMessageCid('')}
          message={messages.find(({ cid }) => cid === selectedMessageCid)}
        />
      ) : (
        <MessageHistoryTable
          address={wallet.address}
          messages={[...pending, ...confirmed]}
          loading={loading}
          selectMessage={setSelectedMessageCid}
          paginating={paginating}
          showMore={showMore}
          refresh={refresh}
          total={total}
        />
      )}
    </>
  )
}

MessageHistory.propTypes = {
  address: ADDRESS_PROPTYPE
}

export default MessageHistory
