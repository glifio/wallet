import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

import { useAccounts } from '../hooks'

export default () => {
  const { accounts, selectedAccount, selectAccount, addAccount } = useAccounts();
  return (
    <React.Fragment>
      <h5>Select an account</h5>
      <ListGroup>
        {accounts.map(account => {
          return (
            <ListGroup.Item
              action
              onClick={selectAccount.bind(this, account)}
              key={account}
              active={selectedAccount === account}
            >
              {account}
            </ListGroup.Item>
          );
        })}
        <ListGroup.Item
          action
          onClick={addAccount}
        >
          + New account
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
}