import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(props => ({
  height: 5,
  width: 6,
  fontSize: 3,
  borderRadius: 6,
  mx: 2,
  ...props
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 2;
`
