import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(props => ({
  py: 2,
  my: 2,
  mr: 2,
  border: 1,
  borderRadius: 6,
  width: 9,
  maxWidth: 12,
  alignItems: 'center',
  ...props
}))`
  display: flex;
  justify-content: center;
`
