import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'

export default styled.input`
  display: flex;
  flex-grow: 1;
  padding-left: ${props => props.theme.space[2]}px;
  padding-right: ${props => props.theme.space[2]}px;
  border: ${props => props.theme.borders[1]}
  border-radius: ${props => props.theme.radii[1]}
  transition: 0.2s ease-in-out;
  text-align: right;
  cursor: text;
  background: ${props =>
    props.disabled
      ? props.theme.colors.status.inactive
      : props.theme.colors.input.background.base};

  &:hover {
    background: ${props =>
      props.disabled
        ? props.theme.colors.status.inactive
        : props.theme.colors.input.background.active};
  }

  &:focus {
    box-shadow: 0;
    outline: 0;
    background: ${props => props.theme.colors.input.background.active};
  }

  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
`
