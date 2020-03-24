import styled from 'styled-components'
import Menu from '../Box'

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
