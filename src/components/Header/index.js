import React from 'react';
import styled from 'styled-components';
import 'styled-components/macro';

export const Header = styled.div`
  background-color: white;
  display: grid;
  font-size: 13px;
  grid-template-columns: 1fr 550px 1fr;
  margin-bottom: 30px;
  grid-template-areas: 'left-gutter app-title right-gutter';
`;

export const AppTitle = styled.div`
  grid-area: app-title;
  margin: 15px 0px;
`;

export const FAQsLink = styled.span`
  float: right;
  color: #bababa;
`;

export default () => {
  return (
    <Header>
      <AppTitle>
        Filament<FAQsLink>FAQs</FAQsLink>
      </AppTitle>
    </Header>
  );
};
