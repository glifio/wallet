import React from 'react';
import Container from 'react-bootstrap/Container';
import AccountPicker from './components/AccountPicker'

function App() {
  return (
    <Container>
      <h1>Welcome to the first Filecoin web wallet</h1>
      <h3>Right now this app requires a local Lotus node running on your machine</h3>
      <AccountPicker />
    </Container>
  );
}

export default App;
