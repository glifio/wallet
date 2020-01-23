import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'

import { WHITE, TEXT_XSM, BASE_SIZE_UNIT, GRAY } from '../StyledComponents'

export const Header = styled.div`
  background-color: ${WHITE};
  display: grid;
  font-size: ${TEXT_XSM}px;
  grid-template-columns: 1fr ${BASE_SIZE_UNIT * 110}px 1fr;
  margin-bottom: ${BASE_SIZE_UNIT * 6}px;
  grid-template-areas: 'left-gutter app-title right-gutter';
`

export const AppTitle = styled.div`
  grid-area: app-title;
  margin: ${BASE_SIZE_UNIT * 3}px 0px;
`

export const FAQsLink = styled.span`
  float: right;
  color: ${GRAY};
`

export default () => {
  return (
    <Header>
      <AppTitle>
        Filament<FAQsLink>FAQs</FAQsLink>
      </AppTitle>
    </Header>
  )
}
