import React from 'react';
import * as moment from 'moment'
import 'styled-components/macro'
import { TransactionHistory, Transaction, TransactionAmount, TransactionActorAddress, TransactionStatus, TransactionGas, TransactionDate, TransactionMessageHash, SectionHeader, TransactionStatusText, EmptyHistoryText } from './StyledComponents';
import { useTransactions, useWallets } from '../hooks';
import { shortenAddress } from '../utils'

const TransactionComponent = ({ To, From, Nounce, Value, Method, GasPrice, GasLimit, MessageCid, Date }, status, selectedWalletaddress) => {
  const sent = From === selectedWalletaddress
  return (
    <Transaction key={MessageCid}>
      <TransactionAmount>
        {sent && <span>-</span>}{Value.toString()}
      </TransactionAmount>
      <TransactionStatus>
        <TransactionStatusText>{status}</TransactionStatusText>
      </TransactionStatus>
      <TransactionGas><strong>Gas: </strong>{GasPrice} FIL</TransactionGas>
      {
        sent ?
          <TransactionActorAddress><strong>To:</strong> {shortenAddress(To)}</TransactionActorAddress>
          :
          <TransactionActorAddress><strong>From:</strong> {shortenAddress(From)}</TransactionActorAddress>
      }
      <TransactionDate>{moment(Date).format('MMMM Do YYYY, h:mm a')}</TransactionDate>
      <TransactionMessageHash><strong>Message hash:</strong> {shortenAddress(MessageCid)}</TransactionMessageHash>
    </Transaction>
  )
}

const MessageCreator = () => {
  const { pending, confirmed } = useTransactions();
  const { selectedWallet } = useWallets();

  return (
    <React.Fragment>
      <TransactionHistory>
        <SectionHeader css={{ marginBottom: '10px' }}>Transaction History</SectionHeader>
        {pending.length > 0 &&
          pending.map((tx) => {
            return TransactionComponent(tx, 'Pending', selectedWallet.address)
          })
        }

        {confirmed.length > 0 &&
          confirmed.map((tx) => {
            return TransactionComponent(tx, 'Confirmed', selectedWallet.address)
          })
        }

        {confirmed.length === 0 && pending.length === 0 &&
          <EmptyHistoryText>No transactions yet.</EmptyHistoryText>
        }
        {/* <Transaction>
          <TransactionAmount>50.4213 FIL</TransactionAmount>
          <TransactionStatus>
            <TransactionStatusText>Pending</TransactionStatusText>
          </TransactionStatus>
          <TransactionGas><strong>Gas: </strong>0.1 FIL</TransactionGas>
          <TransactionActorAddress><strong>From:</strong> dk122...e2m12</TransactionActorAddress>
          <TransactionDate>December 20, 2019 3:45 PM</TransactionDate>
          <TransactionMessageHash><strong>Message hash:</strong> bc129....2asw</TransactionMessageHash>
        </Transaction> */}
      </TransactionHistory>
    </React.Fragment>
  );
};

export default MessageCreator;
