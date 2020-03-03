import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(() => ({
  maxWidth: 13,
  backgroundColor: 'core.white',
  boxShadow: 2,
  border: 1,
  borderColor: 'core.silver',
  p: 1
}))`
  position: fixed;
  display: flex;
  flex-direction: row;
  bottom: ${props => props.theme.sizes[3]}px;
  justify-content: space-between;
  width: calc(58% - 1rem);
  border-radius: ${props => props.theme.radii[2]};
`
