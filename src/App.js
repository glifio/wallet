import React from 'react';
import Container from 'react-bootstrap/Container';

import { useFilecoin } from './hooks'
import AccountPicker from './components/AccountPicker'
import AccountDetail from './components/AccountDetail';
import { DisplayFlexCol } from './components/StyledComponents'

function App() {
  // hydrates the redux store with data from the filecoin-wallet-provider
  useFilecoin()
  return (
    <Container>
      <h1>Welcome to the first Filecoin web wallet</h1>
      <h3>Right now this app requires a local Lotus node running on your machine</h3>
      <DisplayFlexCol>
        <AccountPicker />
        <AccountDetail />
      </DisplayFlexCol>
    </Container>
  );
}

export default App;
