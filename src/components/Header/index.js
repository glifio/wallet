import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import 'styled-components/macro'

export const Header = styled.div`
  background-color: white;
  font-size: 13px;
`

export const AppTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 50px;
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
