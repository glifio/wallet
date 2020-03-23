import styled from 'styled-components'
import Menu from '../Box'
// import { flex } from 'styled-system'

export default styled(Menu).attrs(props => ({
  mt: 3,
  display: 'flex',
  alignItems: 'center',
  justifyContent: ['center', 'space-between'],
  flexWrap: 'wrap',
  ...props
}))`
  list-style: none;
`
