import {
  color,
  typography,
  border,
  layout,
  space,
  shadow,
  flexbox,
  grid,
  position
} from 'styled-system'
import styled from 'styled-components'

export default styled.span`
    min-width: 0;
    box-sizing: border-box;
    ${position}
    ${border}
    ${space}
    ${color}
    ${layout}
    ${flexbox}
    ${typography}
    ${grid}
    ${shadow}
  `
