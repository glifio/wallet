import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'

export default styled.div.attrs(props => {
  return {
    border: 1,
    borderColor: 'input.border',
    borderRadius: 1,
    ...props
  }
})`
  display: inline-block;
  width: 100%;
  ${color} 
  ${space} 
  ${layout}
  ${border}
  ${flexbox};
`
