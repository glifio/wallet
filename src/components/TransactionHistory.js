import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { TransactionHistory, Transaction, TransactionAmount, TransactionActorAddress, TransactionStatus, TransactionGas, TransactionDate, TransactionMessageHash, SectionHeader, TransactionStatusText } from './StyledComponents';
// import { MessageCreator, SectionHeader, MessageForm, ToInput, InputLabel, AvailableBalance, AvailableBalanceLabel, AmountInput, CancelButton, SendButton } from './StyledComponents'
// import filecoin from '../wallet';

const MsgCreator = () => {
  // const { selectedWallet } = useWallets();

  return (
    <React.Fragment>
      <TransactionHistory>
        <SectionHeader css={{ marginBottom: '10px' }}>Transaction History</SectionHeader>
        <Transaction>
          <TransactionAmount>-10.4213 FIL</TransactionAmount>
          <TransactionStatus>
            <TransactionStatusText>Pending</TransactionStatusText>
          </TransactionStatus>
          <TransactionGas><strong>Gas: </strong>0.1 FIL</TransactionGas>
          <TransactionActorAddress><strong>To:</strong> dk122...e2m12</TransactionActorAddress>
          <TransactionDate>December 20, 2019 3:45 PM</TransactionDate>
          <TransactionMessageHash><strong>Message hash:</strong> bc129....2asw</TransactionMessageHash>
        </Transaction>
        <Transaction>
          <TransactionAmount>50.4213 FIL</TransactionAmount>
          <TransactionStatus>
            <TransactionStatusText>Pending</TransactionStatusText>
          </TransactionStatus>
          <TransactionGas><strong>Gas: </strong>0.1 FIL</TransactionGas>
          <TransactionActorAddress><strong>From:</strong> dk122...e2m12</TransactionActorAddress>
          <TransactionDate>December 20, 2019 3:45 PM</TransactionDate>
          <TransactionMessageHash><strong>Message hash:</strong> bc129....2asw</TransactionMessageHash>
        </Transaction>
      </TransactionHistory>
    </React.Fragment>
  );
};

export default MsgCreator;
