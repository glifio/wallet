import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectMessage } from '../store/actions'

export default () => {
  const dispatch = useDispatch()
  const setMessage = useCallback(
    async cid => {
      dispatch(selectMessage(cid))
    },
    [dispatch]
  )
  const selectedMessageCID = useSelector(state => state.selectedMessageCID)
  return { selectedMessageCID, setMessage }
}
