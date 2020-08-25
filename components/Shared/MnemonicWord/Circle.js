import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(props => ({
  height: 4,
  width: 3,
  fontSize: 1,
  borderRadius: 6,
  mx: 2,
  ...props
}))`
  display: flex;
  justify-content: center;
  align-items: center;
`
