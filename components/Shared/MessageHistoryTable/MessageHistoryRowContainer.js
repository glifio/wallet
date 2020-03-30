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
  background-color: ${props => props.theme.colors.input.background.base}00;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  transition: 0.18s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.input.background.base};
  }
`
