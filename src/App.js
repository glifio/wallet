import React from 'react';
import 'styled-components/macro'

import { useFilecoin } from './hooks';
import AccountPicker from './components/AccountPicker';
import AccountDetail from './components/AccountDetail';
import MessageCreator from './components/MessageCreator';
import TransactionHistory from './components/TransactionHistory';
import { Wrapper, Header, AppTitle, BalanceBanner, FilecoinLogo, BalanceInBanner } from './components/StyledComponents';
import { MsgConfirm } from './services/MsgConfirm';

function App() {
  // hydrates the redux store with data from the filecoin-wallet-provider
  useFilecoin();
  return (
    <Wrapper>
      <MsgConfirm />
      <Header>
        <AppTitle>Filament</AppTitle>
      </Header>
      <AccountPicker />
      <BalanceBanner>
        <FilecoinLogo src="/filecoin.png" alt="" />
        <BalanceInBanner>5,400.84 FIL</BalanceInBanner>
      </BalanceBanner>
      <MessageCreator />
      <TransactionHistory></TransactionHistory>
    </Wrapper >
  );
}

export default App;
