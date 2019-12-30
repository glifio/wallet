import React from 'react';
import 'styled-components/macro'

import { useFilecoin, useBalance } from './hooks';
import AccountPicker from './components/AccountPicker';
import MessageCreator from './components/MessageCreator';
import TransactionHistory from './components/TransactionHistory';
import { Wrapper, Header, AppTitle, BalanceBanner, FilecoinLogo, BalanceInBanner } from './components/StyledComponents';

function App() {
  const balance = useBalance();
  useFilecoin();
  return (
    <Wrapper>
      <Header>
        <AppTitle>Filament</AppTitle>
      </Header>
      <AccountPicker />
      <BalanceBanner>
        <FilecoinLogo src="/filecoin.png" alt="" />
        <BalanceInBanner>{balance.toString()} FIL</BalanceInBanner>
      </BalanceBanner>
      <MessageCreator />
      <TransactionHistory></TransactionHistory>
    </Wrapper >
  );
}

export default App;
