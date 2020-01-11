import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import {
  TransactionHistory,
  Transaction,
  TransactionAmount,
  TransactionActorAddress,
  TransactionStatus,
  TransactionGas,
  TransactionMessageHash,
  SectionHeader,
  TransactionStatusText,
  EmptyHistoryText,
  MessageReviewSubText
} from '../StyledComponents'
import { useTransactions, useWallets } from '../../hooks'
import { shortenAddress } from '../../utils'

const MethodText = styled(MessageReviewSubText)`
  font-weight: bold;
  margin-right: 5px;
`

const TransactionComponent = ({
  to,
  from,
  value,
  gasprice,
  cid,
  status,
  selectedWalletAddress
}) => {
  const sent = from === selectedWalletAddress
  return (
    <Transaction>
      <TransactionAmount>
        <div
          css={{
            display: 'flex',
            'flex-direction': 'row',
            'align-items': 'center'
          }}
        >
          <MethodText>
            <strong>{sent ? 'SENT: ' : 'RECEIVED: '}</strong>
          </MethodText>
          {value.toString()}
        </div>
      </TransactionAmount>
      <TransactionStatus>
        <TransactionStatusText>{status}</TransactionStatusText>
      </TransactionStatus>
      <TransactionGas>
        <strong>Gas: </strong>
        {gasprice} FIL
      </TransactionGas>
      {sent ? (
        <TransactionActorAddress>
          <strong>To:</strong> {shortenAddress(to)}
        </TransactionActorAddress>
      ) : (
        <TransactionActorAddress>
          <strong>From:</strong> {shortenAddress(from)}
        </TransactionActorAddress>
      )}
      <TransactionMessageHash>
        <strong>Message hash:</strong> {shortenAddress(cid)}
      </TransactionMessageHash>
    </Transaction>
  )
}

const MessageCreator = () => {
  const {
    pending,
    links,
    confirmed,
    loadedSuccess,
    loading
  } = useTransactions()
  const { selectedWallet } = useWallets()

  return (
    <React.Fragment>
      <TransactionHistory>
        <SectionHeader css={{ marginBottom: '10px', marginTop: '30px' }}>
          Transaction History
        </SectionHeader>
        {pending.length > 0 &&
          pending.map(tx => {
            return (
              <TransactionComponent
                key={tx.Cid}
                {...tx}
                status='Pending'
                selectedWalletAddress={selectedWallet.address}
              />
            )
          })}

        {confirmed.length > 0 &&
          confirmed.map(tx => {
            return (
              <TransactionComponent
                key={tx.cid}
                {...tx}
                status='Confirmed'
                selectedWalletAddress={selectedWallet.address}
              />
            )
          })}

        {links.next && (
          <SectionHeader css={{ marginBottom: '10px', marginTop: '30px' }}>
            More
          </SectionHeader>
        )}

        {loadedSuccess && pending.length === 0 && confirmed.length === 0 && (
          <EmptyHistoryText>No transactions yet.</EmptyHistoryText>
        )}

        {loading && <EmptyHistoryText>Loading transactions.</EmptyHistoryText>}
      </TransactionHistory>
    </React.Fragment>
  )
}

export default MessageCreator
