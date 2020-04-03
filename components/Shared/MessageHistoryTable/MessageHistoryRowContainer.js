import styled from 'styled-components'
import Box from '../Box'

export default styled(Box).attrs(props => ({
  borderRadius: 2,
  border: 1,
  p: 2,
  px: 4,
  my: 2,
  alignItems: 'center',
  ...props
}))`
  border-color: ${props => {
    if (props.status === 'pending') return props.theme.colors.core.silver
    return props.theme.colors.background.messageHistory
  }};
  background-color: ${props => {
    if (props.status === 'pending') return props.theme.colors.core.transparent
    return props.theme.colors.background.messageHistory
  }};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  transition: 0.18s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.background.screen};
  }
`
