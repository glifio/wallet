import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(() => ({
  backgroundColor: 'background.app',
  boxShadow: 2,
  border: 1,
  borderColor: 'core.lightgray'
}))`
  position: fixed;
  display: flex;
  align-items: center;
  flex-direction: row;
  bottom: ${props => props.theme.sizes[3]}px;
  justify-content: space-between;
  align-self: center;
  border-radius: ${props => props.theme.radii[2]};
  max-width: ${props => props.theme.sizes[13]}px;
  width: 40%;
`
