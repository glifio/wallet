import React from 'react';
import { useBalance } from '../../hooks';

const Balance = () => {
  const balance = useBalance();
  return <div>Balance: {balance.toString()}</div>;
};

export default Balance;
