import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import { useAccounts } from '../hooks';
import { DisplayFlexCol } from './StyledComponents';

export default () => {
  const {
    accounts,
    selectedAccount,
    selectAccount,
    addAccount,
  } = useAccounts();
  return (
    <React.Fragment>
      <DisplayFlexCol>
        <h5>Select an account</h5>
        <ListGroup>
          {accounts.map((account, index) => {
            return (
              <ListGroup.Item
                action
                onClick={selectAccount.bind(this, index)}
                key={account.address}
                active={accounts[selectedAccount] && (accounts[selectedAccount].address === account.address)}
              >
                {account.address}
              </ListGroup.Item>
            );
          })}
          <ListGroup.Item action onClick={addAccount}>
            + New account
          </ListGroup.Item>
        </ListGroup>
      </DisplayFlexCol>
    </React.Fragment>
  );
};
