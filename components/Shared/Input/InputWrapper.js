import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'

export default styled.div`
  display: inline-block;
  border-radius: ${props => props.theme.radii[1]};
  ${color} 
  ${space} 
  ${layout}
  ${border}
  ${flexbox};
`
