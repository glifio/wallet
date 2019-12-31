import React from 'react';
import 'styled-components/macro';

import { useFilecoin, useProgress } from './hooks';
import DisplayWallet from './components/DisplayWallet';
import ConnectWallet from './components/ConnectWallet';
import AccessWallet from './components/AccessWallet';

function App() {
  const { progress } = useProgress();
  useFilecoin();
  return (
    <div css={{ 'min-height': '100vh', 'background-color': '#f7f7f7' }}>
      {progress === 0 && <AccessWallet />}
      {progress === 1 && <ConnectWallet />}
      {/* {progress === 2 && <SyncingWallet />} */}
      {progress === 3 && <DisplayWallet />}
    </div>
  );
}

export default App;
