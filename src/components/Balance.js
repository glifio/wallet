import React from 'react';
import { useBalance } from '../hooks';

const Balance = ({ selectedWallet }) => {
  const balance = useBalance();
  return <div>Balance: {balance.toString()}</div>;
};

export default Balance;
