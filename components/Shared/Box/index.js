import {
  color,
  typography,
  border,
  layout,
  space,
  flexbox,
  position
} from 'styled-system'
import styled from 'styled-components'

export default styled.div`
  min-width: 0;
  box-sizing: border-box;
  ${position}
  ${border}
  ${space}
  ${color}
  ${layout}
  ${flexbox}
  ${typography}
`
