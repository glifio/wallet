import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import { useDispatch } from 'react-redux'

import { useError } from '../../hooks'
import { clearError } from '../../store/actions'

export const Error = styled.div`
  background-color: red;
  display: grid;
  font-size: 13px;
  grid-template-columns: 1fr 550px 1fr;
  grid-template-areas: 'left-gutter message right-gutter';
  position: fixed;
  width: 100%;
  z-index: 100;
`

export const Message = styled.div`
  grid-area: message;
  margin: 15px 0px;
`

export const CloseButton = styled.button`
  float: right;
`

export default () => {
  const { error } = useError()
  const dispatch = useDispatch()
  const clear = () => {
    dispatch(clearError())
  }

  return (
    <div>
      {error && (
        <Error>
          <Message>
            {error.message}
            <CloseButton onClick={clear}>Close</CloseButton>
          </Message>
        </Error>
      )}
    </div>
  )
}
