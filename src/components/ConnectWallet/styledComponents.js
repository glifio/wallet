import styled from 'styled-components'

import { JustifyContentCenter, BASE_SIZE_UNIT } from '../StyledComponents'

export const ConnectWalletContainer = styled(JustifyContentCenter)`
  flex-direction: column;
  align-items: center;
`

export const CheckboxContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  align-items: center;
`

export const EducationalCheckboxItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 80%;
`

export const ColoredDot = styled.span`
  height: ${BASE_SIZE_UNIT * 2}px;
  width: ${BASE_SIZE_UNIT * 2}px;
  background-color: ${props => props.color};
  border-radius: 50%;
  display: inline-block;
  margin: ${BASE_SIZE_UNIT}px ${BASE_SIZE_UNIT * 2}px ${BASE_SIZE_UNIT}px
    ${BASE_SIZE_UNIT}px;
`
