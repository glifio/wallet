import React from 'react';

import { useAccounts } from '../hooks';
import Balance from './Balance';

export default () => {
  const { selectedAccount } = useAccounts();

  return (
    <React.Fragment>
      <h5>Account details</h5>
      <Balance />
    </React.Fragment>
  );
};
