import React from 'react';

import { useWallets, useBalance } from '../hooks';
import { AccountLabel, AccountBalance, SwitchAccountButton, AccountHeader, AccountDetailWrapper, AccountDetail, AccountAddress } from './StyledComponents';
import ListGroup from 'react-bootstrap/ListGroup';
// import AccountDetail from './AccountDetail';

export default () => {
  const { wallets, selectedWallet, selectWallet } = useWallets();
  const balance = useBalance();

  return (
    <React.Fragment>
      <AccountHeader>
        <AccountLabel>Account</AccountLabel>
        <AccountDetail>
          <AccountAddress>{selectedWallet.address}</AccountAddress>
          <AccountBalance>{balance.toString()} FIL</AccountBalance>
          {/* <ListGroup>
            {wallets.map((account, index) => {
              return (
                <ListGroup.Item
                  action
                  onClick={selectWallet.bind(this, index)}
                  key={account.address}
                  active={selectedWallet.address === account.address}
                >
                  {account.address}
                </ListGroup.Item>
              );
            })}
          </ListGroup> */}
        </AccountDetail>
        <SwitchAccountButton>Switch account</SwitchAccountButton>
      </AccountHeader>
    </React.Fragment>
  );
};
