import React from 'react'
import * as moment from 'moment'
import 'styled-components/macro'
import {
  TransactionHistory,
  Transaction,
  TransactionAmount,
  TransactionActorAddress,
  TransactionStatus,
  TransactionGas,
  TransactionDate,
  TransactionMessageHash,
  SectionHeader,
  TransactionStatusText,
  EmptyHistoryText
} from '../StyledComponents'
import { useTransactions, useWallets } from '../../hooks'
import { shortenAddress } from '../../utils'

const TransactionComponent = ({
  To,
  From,
  Value,
  GasPrice,
  Cid,
  Date,
  status,
  selectedWalletAddress
}) => {
  const sent = From === selectedWalletAddress
  return (
    <Transaction>
      <TransactionAmount>
        {sent && <span>-</span>}
        {Value.toString()}
      </TransactionAmount>
      <TransactionStatus>
        <TransactionStatusText>{status}</TransactionStatusText>
      </TransactionStatus>
      <TransactionGas>
        <strong>Gas: </strong>
        {GasPrice} FIL
      </TransactionGas>
      {sent ? (
        <TransactionActorAddress>
          <strong>To:</strong> {shortenAddress(To)}
        </TransactionActorAddress>
      ) : (
        <TransactionActorAddress>
          <strong>From:</strong> {shortenAddress(From)}
        </TransactionActorAddress>
      )}
      <TransactionDate>
        {moment(Date).format('MMMM Do YYYY, h:mm a')}
      </TransactionDate>
      <TransactionMessageHash>
        <strong>Message hash:</strong> {shortenAddress(Cid)}
      </TransactionMessageHash>
    </Transaction>
  )
}

const MessageCreator = () => {
  const { pending, confirmed } = useTransactions()
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
                key={tx.Cid}
                {...tx}
                status='Confirmed'
                selectedWalletAddress={selectedWallet.address}
              />
            )
          })}

        {confirmed.length === 0 && pending.length === 0 && (
          <EmptyHistoryText>No transactions yet.</EmptyHistoryText>
        )}
      </TransactionHistory>
    </React.Fragment>
  )
}

export default MessageCreator
