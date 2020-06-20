import styled from 'styled-components'
import { layout, margin, color } from 'styled-system'

export default styled.div.attrs(props => ({
  maxWidth: props.maxWidth || 13,
  minWidth: props.minWidth || 11,
  ...props
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 2;
  ${layout}
  ${margin}
  ${color}
`
