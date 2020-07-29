import styled from 'styled-components'
import {
  space,
  color,
  layout,
  border,
  flexbox,
  typography
} from 'styled-system'

import {
  inputBackgroundColor,
  inputBackgroundColorHover
} from './inputBackgroundColors'

export default styled.input.attrs(props => ({
  display: 'inline-block',
  height: props.height || 6,
  width: props.width || '100%',
  border: 0,
  borderColor: 'input.border',
  ...props
}))`
  min-width: 0;
  flex-grow: 1;
  padding-left: ${props => props.theme.space[2]}px;
  padding-right: ${props => props.theme.space[2]}px;
  border-radius: ${props => props.theme.radii[1]};
  transition: 0.2s ease-in-out;
  font-size: ${props => props.theme.fontSizes[2]};
  text-align: right;
  cursor: text;
  background: ${props => inputBackgroundColor(props)};

  &:hover {
    background: ${props => inputBackgroundColorHover(props)};
    cursor: ${props => (props.disabled ? 'initial' : 'text')};
  }

  &:focus {
    box-shadow: 0;
    outline: 0;
    background: ${props => {
      if (props.valid) return props.theme.colors.input.background.valid
      if (props.error) return props.theme.colors.input.background.invalid
      return props.theme.colors.input.background.active
    }};
  }
  ${typography}
  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
`
