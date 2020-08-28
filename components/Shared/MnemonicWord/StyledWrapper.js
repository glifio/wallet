import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(props => ({
  height: 6,
  my: 2,
  mr: 2,
  borderRadius: 6,
  width: 9,
  maxWidth: 12,
  alignItems: 'center',
  ...props
}))`
  display: flex;
  justify-content: center;
`
