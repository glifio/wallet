import styled from 'styled-components'
import { space, color, layout, border, flexbox, grid } from 'styled-system'

export const Menu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  ${space}
  ${color}
  ${layout}
  ${border}
  ${flexbox}
  ${grid}
`

export const MenuItem = styled.li`
  ${space}
  ${color}
  ${layout}
  ${flexbox}
  ${grid}

`
