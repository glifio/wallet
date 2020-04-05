import styled from 'styled-components'
import { Label } from '../Typography'

export default styled(Label).attrs(props => ({
  m: 0,
  color: props.clicked ? 'core.black' : 'core.darkgray',
  onClick: props.onClick
}))`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
