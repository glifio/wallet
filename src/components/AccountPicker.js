import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import { useWallets } from '../hooks';
import { DisplayFlexCol } from './StyledComponents';

export default () => {
  const { wallets, selectedWallet, selectWallet } = useWallets();
  return (
    <React.Fragment>
      <DisplayFlexCol>
        <h5>Select an account</h5>
        <ListGroup>
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
        </ListGroup>
      </DisplayFlexCol>
    </React.Fragment>
  );
};
