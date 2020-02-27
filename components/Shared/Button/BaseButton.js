import styled from 'styled-components'
import { space, layout, borderRadius, flexbox, variant } from 'styled-system'

export default styled.button`
  variant {
    scale: 'buttons';
  }
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${props =>
    props.disabled
      ? props.theme.colors.status.inactive
      : props.theme.colors.buttons[props.variant].background};
  border-color: ${props =>
    props.disabled
      ? props.theme.colors.status.inactive
      : props.theme.colors.buttons[props.variant].borderColor};
  color: ${props => props.theme.colors.buttons[props.variant].color};
  font-size: ${props => props.theme.fontSizes[2]}; 
  ${borderRadius} 
  ${space}
    ${layout} 
    ${flexbox};
`
