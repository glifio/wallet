import React, { useState } from 'react';
import styled from 'styled-components';
import 'styled-components/macro';

import { useProgress } from '../../hooks';

const Button = styled.button`
  background: ${props => (props.disabled ? 'grey' : '#61d6d9')};
  color: white;
  border: 0;
  border-radius: 4px;
  margin-bottom: 30px;
  width: 50%;
  align-self: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const WalletOptionsContainer = styled.div`
  background-color: white;
  border: 1px black;
  margin-top 78px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 360px;
  width: 30vw;
`;

const LedgerWallet = styled.img`
  width: 30%;
  align-self: center;
  margin-top: 30px;
  margin-bottom: 30px;
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: #61d6d9;
  }
  &:active {
    transform: scale(1.05);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  }
  background-color: ${props => (props.clicked ? '#61d6d9' : 'white')};
`;

export default () => {
  const { setProgress } = useProgress();
  const [selectedWallet, setSelectedWallet] = useState(false);
  return (
    <FlexContainer>
      <WalletOptionsContainer>
        <LedgerWallet
          onClick={() => setSelectedWallet(!selectedWallet)}
          src="/ledger.png"
          clicked={selectedWallet}
          alt=""
        />
        <Button disabled={!selectedWallet} onClick={() => setProgress(1)}>
          Access wallet
        </Button>
      </WalletOptionsContainer>
    </FlexContainer>
  );
};
