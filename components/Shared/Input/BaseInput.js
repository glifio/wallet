import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'

export default styled.input`
  display: flex;
  flex-grow: 1;
  padding-left: ${props => props.theme.space[2]}px;
  padding-right: ${props => props.theme.space[2]}px;
  border: ${props => props.theme.borders[1]};
  border-radius: ${props => props.theme.radii[1]};
  transition: 0.2s ease-in-out;
  font-size: ${props => props.theme.fontSizes[2]};
  text-align: right;
  cursor: text;
  background: ${props => props.theme.colors.input.background.base};
  /* @jon - The below background change needs to be tied to a validation check on the user-submitted content. If valid, it will display a light green color, otherwise it will display red.
  /* background: ${props =>
    props.valid
      ? props.theme.colors.input.background.valid
      : props.theme.colors.input.background.invalid}; */

  &:hover {
    cursor: ${props => (props.disabled ? 'not-allowed' : 'text')};
  }

  &:focus {
    box-shadow: 0;
    outline: 0;
    background: ${props => props.theme.colors.input.background.active};
  }
}

  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
`
