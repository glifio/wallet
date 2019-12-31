import React from 'react';

import { useWallets } from '../../hooks';
import {
  AccountLabel,
  AccountBalance,
  SwitchAccountButton,
  AccountHeader,
  AccountDetail,
  AccountAddress,
} from '../StyledComponents';

export default () => {
  const { selectedWallet } = useWallets();

  return (
    <React.Fragment>
      <AccountHeader>
        <AccountLabel>Account</AccountLabel>
        <AccountDetail>
          <AccountAddress>{selectedWallet.address}</AccountAddress>
          <AccountBalance>
            {selectedWallet.balance.toString()} FIL
          </AccountBalance>
        </AccountDetail>
        <SwitchAccountButton>Switch account</SwitchAccountButton>
      </AccountHeader>
    </React.Fragment>
  );
};
