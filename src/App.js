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
    <React.Fragment>
      {progress === 0 && <AccessWallet />}
      {progress === 1 && <ConnectWallet />}
      {/* {progress === 2 && <SyncingWallet />} */}
      {progress === 3 && <DisplayWallet />}
    </React.Fragment>
  );
}

export default App;
