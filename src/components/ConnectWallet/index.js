import React from 'react';
import styled from 'styled-components';
import 'styled-components/macro';

import { useProgress } from '../../hooks';

const Button = styled.button`
  cursor: pointer;
  background: #61d6d9;
  color: white;
  border: 0;
  border-radius: 4px;
`;

export default () => {
  const { setProgress } = useProgress();
  return (
    <div
      css={{
        display: 'flex',
        'justify-content': 'center',
        'background-color': '#f7f7f7',
        height: '100vh',
      }}
    >
      <div
        css={{
          'background-color': 'white',
          border: '1px black',
          'margin-top': '78px',
          display: 'flex',
          'flex-direction': 'column',
        }}
      >
        <div>Continue</div>
        <Button onClick={() => setProgress(2)}>Next</Button>
      </div>
    </div>
  );
};
