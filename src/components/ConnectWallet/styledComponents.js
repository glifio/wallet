import styled from 'styled-components'

import { JustifyContentCenter } from '../StyledComponents'

export const Button = styled.button`
  background: ${props => (props.disabled ? 'grey' : '#61d6d9')};
  color: white;
  border: 0;
  border-radius: 4px;
  margin-bottom: 30px;
  width: 50%;
  align-self: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`

export const ConnectWalletContainer = styled(JustifyContentCenter)`
  flex-direction: column;
  align-items: center;
`

export const EducationalCheckboxContainer = styled.ul`
  margin-top: 15px;
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
  margin: 15px;
  width: 80%;
`

export const InputLabel = styled.label`
  color: ${props => (props.disabled ? '#bababa' : 'black')};
  font-size: 15px;
`

export const Checkbox = styled.input`
  margin: 5px 10px 5px 5px;
`

export const ColoredDot = styled.span`
  height: 10px;
  width: 10px;
  background-color: ${props => props.color};
  border-radius: 50%;
  display: inline-block;
  margin: 5px 10px 5px 5px;
`
