import styled from 'styled-components'
import {
  space,
  layout,
  borderRadius,
  flexbox,
  color,
  border
} from 'styled-system'

const applyStyles = (styleProperty, props, disabledColor) => {
  if (props.disabled) return disabledColor
  if (props[styleProperty]) return props[styleProperty]
  if (props.variant)
    return props.theme.colors.buttons[props.variant][styleProperty]
  return props.theme.colors.buttons.primary[styleProperty]
}

export default styled.button.attrs(props => ({
  height: 6,
  py: 2,
  px: 3,
  fontSize: 3,
  borderWidth: 1,
  borderRadius: 2,
  ...props
}))`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  /* We are applying both the explicit and shorthand border properties to resolve multiple, conflicting cross-browser rendering issues */
  border: 1px solid ${props =>
    applyStyles('borderColor', props, props.theme.colors.status.inactive)};
  background-color: ${props =>
    applyStyles('background', props, props.theme.colors.status.inactive)};
  border-color: ${props =>
    applyStyles('borderColor', props, props.theme.colors.status.inactive)};
  color: ${props => applyStyles('color', props, '')};
  font-size: ${props => props.theme.fontSizes[2]};
  transition: 0.18s ease-in-out;
  &:hover {
    opacity: ${props => (props.disabled ? '1' : '0.8')};
  }
  ${borderRadius}
  ${space}
  ${layout}
  ${flexbox}
  ${border}
  ${color}
`
