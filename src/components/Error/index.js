import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import { useDispatch, useSelector } from 'react-redux'

import { clearError } from '../../store/actions'
import { BASE_SIZE_UNIT, TEXT_XSM, RED } from '../StyledComponents'

export const Error = styled.div`
  background-color: ${RED};
  display: grid;
  font-size: ${TEXT_XSM}px;
  grid-template-columns: 1fr ${BASE_SIZE_UNIT * 110}px 1fr;
  grid-template-areas: 'left-gutter message right-gutter';
  position: fixed;
  width: 100%;
  z-index: 100;
`

export const Message = styled.div`
  grid-area: message;
  margin: ${BASE_SIZE_UNIT * 3}px 0px;
`

export const CloseButton = styled.button`
  float: right;
`

export default () => {
  const error = useSelector(state => state.error)
  const dispatch = useDispatch()
  const clear = () => dispatch(clearError())

  return (
    <React.Fragment>
      {error ? (
        <Error>
          <Message>
            {error.message}
            <CloseButton onClick={clear}>Close</CloseButton>
          </Message>
        </Error>
      ) : null}
    </React.Fragment>
  )
}
