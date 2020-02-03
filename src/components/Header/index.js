import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import 'styled-components/macro'

import { WHITE, TEXT_XSM, BASE_SIZE_UNIT, GRAY } from '../StyledComponents'

export const Header = styled.div`
  background-color: white;
  font-size: 13px;
`

export const StyledNavLink = styled.button`
  border: none;
  cursor: pointer;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  &:focus {
    outline: 0;
  }
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
  const history = useHistory()
  const changeTab = relativeUrl => history.push(relativeUrl)
  return (
    <Header>
      <AppTitle>
        <StyledNavLink onClick={() => changeTab('/')}>Filament</StyledNavLink>
        <StyledNavLink onClick={() => changeTab('/faqs')}>FAQs</StyledNavLink>
      </AppTitle>
    </Header>
  )
}
