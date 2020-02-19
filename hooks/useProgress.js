import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateProgress } from '../store/actions'

export default () => {
  const dispatch = useDispatch()
  const setProgress = useCallback(
    async progress => {
      dispatch(updateProgress(progress))
    },
    [dispatch]
  )
  const progress = useSelector(state => state.progress)
  return { progress, setProgress }
}
