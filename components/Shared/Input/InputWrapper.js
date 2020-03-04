import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'

export default styled.div.attrs(() => ({
  mt: 3,
  border: 1,
  borderColor: 'input.border',
  borderRadius: 1
}))`
  display: inline-block;
  border-radius: ${props => props.theme.radii[1]};
  width: 100%;
  ${color} 
  ${space} 
  ${layout}
  ${border}
  ${flexbox};
`
