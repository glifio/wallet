import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(props => ({
  border: 1,
  borderColor: 'core.silver',
  borderRadius: 1,
  p: 2,
  my: 1,
  ...props
}))`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`
