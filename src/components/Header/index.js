import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import 'styled-components/macro'

import { WHITE, TEXT_XSM } from '../StyledComponents'

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  font-size: 13px;
  height: 50px;
  padding: 14px 200px;
  margin-bottom: 30px;
`

export const HomeLink = styled.span`
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
  font-size: ${TEXT_XSM}px;
`

export const FloatRightLink = styled.span`
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
  font-size: ${TEXT_XSM}px;
  float: right;
  padding-left: 35px;
`

const RightSideGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: none;
`

export default () => {
  const history = useHistory()
  const changeTab = relativeUrl => history.push(relativeUrl)
  return (
    <Header>
      <HomeLink onClick={() => changeTab('/')}>Home</HomeLink>
      <RightSideGroup>
        <FloatRightLink onClick={() => changeTab('/how-to')}>
          Usage
        </FloatRightLink>
        <FloatRightLink onClick={() => changeTab('/contact-us')}>
          Contact
        </FloatRightLink>
        <FloatRightLink onClick={() => changeTab('/faqs')}>FAQs</FloatRightLink>
      </RightSideGroup>
    </Header>
  )
}
