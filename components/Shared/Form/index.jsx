import { layout, space, flexbox, position } from 'styled-system'
import styled from 'styled-components'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  ${position}
  ${space}
  ${layout}
  ${flexbox}
`

export default Form
